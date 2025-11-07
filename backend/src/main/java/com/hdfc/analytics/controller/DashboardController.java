package com.hdfc.analytics.controller;

import com.hdfc.analytics.dto.DashboardMetricsDTO;
import com.hdfc.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Tag(name = "Dashboard", description = "Dashboard-specific APIs for real-time metrics")
public class DashboardController {
    
    private final AnalyticsService analyticsService;
    
    @GetMapping("/real-time-stats")
    @Operation(summary = "Get real-time dashboard stats", description = "Retrieve live dashboard statistics")
    public ResponseEntity<Map<String, Object>> getRealTimeStats() {
        Map<String, Object> stats = analyticsService.getRealTimeStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/alerts")
    @Operation(summary = "Get dashboard alerts", description = "Retrieve active alerts for dashboard")
    public ResponseEntity<List<Map<String, Object>>> getDashboardAlerts() {
        List<Map<String, Object>> alerts = analyticsService.getDashboardAlerts();
        return ResponseEntity.ok(alerts);
    }
    
    @GetMapping("/summary/{branchId}")
    @Operation(summary = "Get branch summary", description = "Quick summary for specific branch")
    public ResponseEntity<DashboardMetricsDTO> getBranchSummary(
            @Parameter(description = "Branch ID") @PathVariable Long branchId) {
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        
        DashboardMetricsDTO summary = analyticsService.getDashboardMetrics(branchId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}