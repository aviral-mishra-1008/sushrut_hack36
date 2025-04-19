package com.sushrut.backend.service;

import com.sushrut.backend.entity.Moderator;
import com.sushrut.backend.entity.Test;
import com.sushrut.backend.enums.SummaryStatus;
import com.sushrut.backend.repository.ModeratorRepository;
import com.sushrut.backend.repository.TestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModeratorService {

    private final ModeratorRepository moderatorRepository;
    private final TestRepository testRepository;

    public List<Test> getAllTestsWithSummary() {
        return testRepository.findAll().stream()
                .filter(test -> test.getSummary() != null && !test.getSummary().isEmpty())
                .toList();
    }

    @Transactional
    public Test verifySummary(String testId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found"));

        if (test.getSummary() == null || test.getSummary().isEmpty()) {
            throw new IllegalStateException("Cannot verify test without summary");
        }

        test.setSummaryStatus(SummaryStatus.VERIFIED);
        return testRepository.save(test);
    }

    @Transactional
    public Test updateAndVerifySummary(String testId, String newSummary) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found"));

        if (newSummary == null || newSummary.trim().isEmpty()) {
            throw new IllegalArgumentException("Summary cannot be empty");
        }

        test.setSummary(newSummary);
        test.setSummaryStatus(SummaryStatus.VERIFIED);
        return testRepository.save(test);
    }

    public Test getTestById(String testId) {
        return testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found"));
    }

    public boolean authenticateModerator(String username, String password) {
        return moderatorRepository.findByUsername(username)
                .map(moderator -> moderator.getPassword().equals(password))
                .orElse(false);
    }
}