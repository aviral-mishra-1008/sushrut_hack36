package com.sushrut.backend.service;

import com.sushrut.backend.dto.LLMRequest;
import com.sushrut.backend.dto.LLMResponseToFrontend;

public interface LLMQueryService {
    LLMResponseToFrontend queryLLM(LLMRequest request);
}
