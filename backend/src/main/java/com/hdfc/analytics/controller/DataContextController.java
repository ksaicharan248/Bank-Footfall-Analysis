package com.hdfc.analytics.controller;

import com.hdfc.analytics.service.DataContextService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/apis/data-context")
@Slf4j
public class DataContextController {

    @Autowired
    private DataContextService dataContextService;

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshDataContext() {
        try {
            log.info("🔄 Manual data context refresh requested");
            
            dataContextService.manualRefresh();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Data context refresh initiated successfully using AnalyticsService");
            response.put("timestamp", LocalDateTime.now());
            response.put("context_loaded", dataContextService.isContextLoaded());
            
            log.info("✅ Data context refresh completed");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Failed to refresh data context: {}", e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to refresh data context: " + e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getContextStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("context_loaded", dataContextService.isContextLoaded());
        status.put("last_update", dataContextService.getLastUpdateTime());
        status.put("timestamp", LocalDateTime.now());
        status.put("service_status", "active");
        status.put("using_analytics_service", true);
        
        return ResponseEntity.ok(status);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "healthy");
        health.put("service", "DataContextService with AnalyticsService integration");
        health.put("timestamp", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(health);
    }
}
