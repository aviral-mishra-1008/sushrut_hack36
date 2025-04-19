package com.sushrut.backend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LLMRequest {
    @NotBlank(message = "The request must not be blank")
    @Size(min=3,max=10000, message = "Size must be between 3 to 10000 characters")
    private String query;
}
