package com.hdfc.analytics.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {
    
    private final JdbcTemplate jdbcTemplate;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            log.info("Checking for existing data...");
            
            // Check if large dataset already exists
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM customer_entries", 
                Integer.class);
                
            if (count != null && count > 100) {
                log.info("Large dataset already exists ({} entries). Skipping initialization.", count);
                return;
            }
            
            log.info("No large dataset found. Use the /api/data-generator/generate-large-dataset endpoint to generate 1000+ entries.");
            log.info("Or access the admin panel to trigger data generation.");
            
        } catch (Exception e) {
            log.error("Error during data initialization check: {}", e.getMessage());
        }
    }
}