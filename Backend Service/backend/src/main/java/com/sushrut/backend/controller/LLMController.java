package com.sushrut.backend.controller;

import com.sushrut.backend.dto.LLMRequest;
import com.sushrut.backend.dto.LLMResponse;
import com.sushrut.backend.dto.LLMResponseToFrontend;
import com.sushrut.backend.service.LLMQueryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/llm")
@CrossOrigin //FOR CORS IN REACT FRONTEND
public class LLMController{

    @Autowired
    private LLMQueryServiceImpl llmService;

    @Validated
    @PostMapping("/query")
    public ResponseEntity<LLMResponseToFrontend> queryLLM(@RequestBody LLMRequest request){
        LLMResponseToFrontend llmResponse = llmService.queryLLM(request);
        return ResponseEntity.ok(llmResponse);
    }


}
