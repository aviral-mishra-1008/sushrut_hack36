package com.sushrut.backend.controller;

import com.sushrut.backend.dto.SummaryUpdateRequest;
import com.sushrut.backend.entity.Test;
import com.sushrut.backend.service.ModeratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moderator")
@RequiredArgsConstructor
public class ModeratorController {

    private final ModeratorService moderatorService;

    @GetMapping("/tests")
    public ResponseEntity<List<Test>> getAllTestsWithSummary() {
        List<Test> tests = moderatorService.getAllTestsWithSummary();
        return ResponseEntity.ok(tests);
    }

    @GetMapping("/tests/{testId}")
    public ResponseEntity<Test> getTest(@PathVariable String testId) {
        Test test = moderatorService.getTestById(testId);
        return ResponseEntity.ok(test);
    }

    @PutMapping("/tests/{testId}/verify")
    public ResponseEntity<Test> verifySummary(@PathVariable String testId) {
        Test verifiedTest = moderatorService.verifySummary(testId);
        return ResponseEntity.ok(verifiedTest);
    }

    @PutMapping("/tests/{testId}/summary")
    public ResponseEntity<Test> updateAndVerifySummary(
            @PathVariable String testId,
            @RequestBody SummaryUpdateRequest request) {
        Test updatedTest = moderatorService.updateAndVerifySummary(testId, request.getSummary());
        return ResponseEntity.ok(updatedTest);
    }
}