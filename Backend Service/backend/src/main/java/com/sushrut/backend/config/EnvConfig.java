package com.sushrut.backend.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:.env")
public class EnvConfig {

}
