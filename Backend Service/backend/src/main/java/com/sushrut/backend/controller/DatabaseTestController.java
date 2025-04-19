package com.sushrut.backend.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@CrossOrigin
public class DatabaseTestController {


    @GetMapping("/connection")
    public ResponseEntity<String> testConnection() {
        try {
            return ResponseEntity.ok("Connection Successful!");
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Connection Failed: " + e.getMessage());
        }
    }
}
