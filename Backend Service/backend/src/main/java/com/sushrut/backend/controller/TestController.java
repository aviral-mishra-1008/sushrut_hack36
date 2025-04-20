package com.sushrut.backend.controller;

import com.sushrut.backend.dto.TestBookingRequestDTO;
import com.sushrut.backend.dto.VerifySummaryRequest;
import com.sushrut.backend.entity.Test;
import com.sushrut.backend.enums.TestBookedStatus;
import com.sushrut.backend.service.TestService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @PostMapping("/book")
    public ResponseEntity<Test> bookTest(@RequestBody TestBookingRequestDTO request) {
        Test bookedTest = testService.bookTest(request);
        return ResponseEntity.ok(bookedTest);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Test>> getPatientTests(@PathVariable String patientId) {
        List<Test> tests = testService.getPatientTests(patientId);
        return ResponseEntity.ok(tests);
    }

    @GetMapping("/{testId}")
    public ResponseEntity<Test> getTest(@PathVariable String testId) {
        Test test = testService.getTestById(testId);
        return ResponseEntity.ok(test);
    }

    @PutMapping("/{testId}/status")
    public ResponseEntity<Test> updateStatus(
            @PathVariable String testId,
            @RequestParam TestBookedStatus status) {
        Test updatedTest = testService.updateTestStatus(testId, status);
        return ResponseEntity.ok(updatedTest);
    }

    @PutMapping("/{testId}/summary")
    public ResponseEntity<Test> addSummary(
            @PathVariable String testId,
            @RequestBody String summary) {
        Test updatedTest = testService.addTestSummary(testId, summary);
        return ResponseEntity.ok(updatedTest);
    }

    @GetMapping("/pending-summaries")
    public ResponseEntity<List<Test>> getPendingSummaryTests() {
        List<Test> pendingTests = testService.getPendingSummaryTests();
        return ResponseEntity.ok(pendingTests);
    }

    @PutMapping("/{testId}/verify-summary")
    public ResponseEntity<Test> verifyTestSummary(
            @PathVariable String testId,
            @RequestBody VerifySummaryRequest request
    ) {
        Test updatedTest = testService.editAndVerifyTestSummary(testId, request.getSummary());
        return ResponseEntity.ok(updatedTest);
    }
}

