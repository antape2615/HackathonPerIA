package com.testia.infraestructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

@Configuration
public class PasswordEncoderConfig {

    @Bean
    public Argon2PasswordEncoder passwordEncoder() {
        return new Argon2PasswordEncoder(
                16, // salt length
                32, // hash length
                1,  // parallelism
                65536, // memory (64MB)
                3   // iterations
        );
    }
}