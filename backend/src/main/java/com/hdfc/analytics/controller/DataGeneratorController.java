package com.hdfc.analytics.controller;

import com.hdfc.analytics.service.LargeDataGeneratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/data-generator")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Tag(name = "Data Generator", description = "APIs for generating large-scale test data")
public class DataGeneratorController {
    
    private final LargeDataGeneratorService dataGeneratorService;
    
        @PostMapping("/regenerate-transactions")
    @Operation(summary = "Regenerate transaction data", description = "Regenerate transaction data with better service distribution patterns")
    public ResponseEntity<Map<String, Object>> regenerateTransactions() {
        try {
            dataGeneratorService.regenerateTransactionData();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Transaction data regenerated successfully",
                "timestamp", java.time.LocalDateTime.now()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to regenerate transaction data: " + e.getMessage(),
                "timestamp", java.time.LocalDateTime.now()
            );
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate large dataset", description = "Generate customer entries and transactions for last 3 months (June 5, 2025 to September 5, 2025)")
    public ResponseEntity<Map<String, Object>> generateLargeDataset() {
        try {
            dataGeneratorService.generateLargeDataset();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Large dataset generation completed successfully");
            response.put("period", "June 5, 2025 to September 5, 2025 (Last 3 months)");
            response.put("expectedEntries", "2000+");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error generating dataset: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/status")
    @Operation(summary = "Get generation status", description = "Check the status of data generation")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Data Generator");
        response.put("status", "Ready");
        response.put("description", "Large-scale data generator for HDFC Branch Analytics");
        
        return ResponseEntity.ok(response);
    }
}