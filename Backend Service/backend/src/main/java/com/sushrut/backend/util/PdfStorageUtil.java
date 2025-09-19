package com.sushrut.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class PdfStorageUtil {

    @Value("${pdf.storage.location}")
    private String storageLocation;

    private static final String SAMPLE_PDF_PATH = "samples/SampleReport.pdf";

    public byte[] loadSamplePdf() {
        try {
            Resource resource = new ClassPathResource(SAMPLE_PDF_PATH);
            return FileCopyUtils.copyToByteArray(resource.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException("Failed to load sample PDF", e);
        }
    }

    public String storePdf(byte[] pdfData) {
        try {
            // Create storage directory if it doesn't exist
            Files.createDirectories(Paths.get(storageLocation));

            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + ".pdf";
            Path filePath = Paths.get(storageLocation, fileName);

            // Save file
            Files.write(filePath, pdfData);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store PDF: " + e.getMessage(), e);
        }
    }

    public byte[] retrievePdf(String fileName) {
        try {
            Path filePath = Paths.get(storageLocation, fileName);
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to retrieve PDF: " + e.getMessage(), e);
        }
    }
}