package com.hdfc.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

/**
 * HDFC Branch Analytics Application with Enhanced LLM Integration
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableScheduling
public class BranchAnalyticsApplication {

	public static void main(String[] args) {
		SpringApplication.run(BranchAnalyticsApplication.class, args);
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}