package com.sushrut.backend.util;

import org.springframework.stereotype.Component;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;

@Component
public class PdfEncryptionUtil {

    @Value("${pdf.encryption.key}")
    private String encryptionKey;  // Should be 32 characters for AES-256

    private static final String ALGORITHM = "AES";

    public byte[] encryptPdf(byte[] pdfData) {
        try {
            SecretKey secretKey = new SecretKeySpec(encryptionKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            return cipher.doFinal(pdfData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt PDF: " + e.getMessage(), e);
        }
    }

    public String encryptToBase64(byte[] pdfData) {
        byte[] encryptedData = encryptPdf(pdfData);
        return Base64.getEncoder().encodeToString(encryptedData);
    }

    public byte[] decryptPdf(byte[] encryptedData) {
        try {
            SecretKey secretKey = new SecretKeySpec(encryptionKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            return cipher.doFinal(encryptedData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt PDF: " + e.getMessage(), e);
        }
    }

    public byte[] decryptFromBase64(String base64EncryptedData) {
        byte[] encryptedData = Base64.getDecoder().decode(base64EncryptedData);
        return decryptPdf(encryptedData);
    }
}