package com.sushrut.backend.service;

import com.sushrut.backend.dto.TestBookingRequestDTO;
import com.sushrut.backend.entity.Test;
import com.sushrut.backend.entity.User;
import com.sushrut.backend.enums.SummaryStatus;
import com.sushrut.backend.enums.TestBookedStatus;
import com.sushrut.backend.enums.TestType;
import com.sushrut.backend.repository.TestRepository;
import com.sushrut.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    // Encryption key - in real application, this should be in a secure configuration
    private static final String ENCRYPTION_KEY = "YourSecretKey123YourSecretKey123"; // 32 chars for AES-256
    private static final String ALGORITHM = "AES";

    private String encryptPdf(byte[] pdfData) {
        try {
            SecretKey secretKey = new SecretKeySpec(ENCRYPTION_KEY.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(pdfData);
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt PDF", e);
        }
    }



    private byte[] loadSamplePdf() {
        try {
            ClassPathResource resource = new ClassPathResource("samples/SampleReport.pdf");
            return FileCopyUtils.copyToByteArray(resource.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException("Failed to load sample PDF", e);
        }
    }

    @Transactional
    public Test bookTest(TestBookingRequestDTO request) {
        // Find the patient
        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        // Load and encrypt sample PDF
        byte[] samplePdf = loadSamplePdf();
        String encryptedPdfString = encryptPdf(samplePdf);
        //send a request to localhost:8000/register_user with report_type and file_content fields containing testType and
        //encryptedpdfstring respectively , it will return summary string in response , just save that summary in test below
        String pythonBackendUrl = "http://localhost:8000/summarize";
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("file_content", encryptedPdfString);
        requestBody.put("report_type", request.getTestType() == TestType.RADIOLOGY ? 0 : 1);

        ResponseEntity<Map> response;

        try {

            response = restTemplate.postForEntity(
                    pythonBackendUrl,
                    requestBody,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to get summary from Python backend");
            }

            // Extract summary from response
            Map<String, String> responseBody = response.getBody();
            String summary = responseBody != null ? responseBody.get("summary") : null;
            String explanation = responseBody != null ? responseBody.get("explanation") : null;

            // Create new test booking with summary
            Test test = Test.builder()
                    .patient(patient)
                    .name(request.getName())
                    .testType(request.getTestType())
                    .bookedStatus(TestBookedStatus.PENDING)
                    .summaryStatus(SummaryStatus.PENDING)
                    .encryptedPdf(encryptedPdfString)
                    .summary(summary)
                    .build();

            return testRepository.save(test);
        } catch (Exception e) {
            Test test = Test.builder()
                    .patient(patient)
                    .name(request.getName())
                    .testType(request.getTestType())
                    .bookedStatus(TestBookedStatus.PENDING)
                    .summaryStatus(SummaryStatus.FAILED)
                    .encryptedPdf(encryptedPdfString)
                    .build();

            return testRepository.save(test);
        }
    }

    public List<Test> getPatientTests(String patientId) {
        return testRepository.findByPatient_UserId(patientId);
    }

    public Test getTestById(String testId) {
        return testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found"));
    }


    @Transactional
    public Test updateTestStatus(String testId, TestBookedStatus status) {
        Test test = getTestById(testId);
        test.setBookedStatus(status);
        return testRepository.save(test);
    }

    @Transactional
    public Test addTestSummary(String testId, String summary) {
        Test test = getTestById(testId);
        test.setSummary(summary);
        test.setSummaryStatus(SummaryStatus.VERIFIED);
        return testRepository.save(test);
    }

    public List<Test> getPendingSummaryTests() {
        return testRepository.findBySummaryStatus(SummaryStatus.PENDING);
    }

    @Transactional
    public Test editAndVerifyTestSummary(String testId, String newSummary) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found"));
        test.setSummary(newSummary);
        test.setSummaryStatus(SummaryStatus.VERIFIED);


        return testRepository.save(test);
    }
}