package com.hdfc.branchanalytics.controller;

import com.hdfc.branchanalytics.dto.CustomerSatisfactionDTO;
import com.hdfc.branchanalytics.dto.ServiceEfficiencyDTO;
import com.hdfc.branchanalytics.dto.PerformanceTrendsDTO;
import com.hdfc.branchanalytics.service.AdvancedAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Advanced Analytics REST Controller
 * Provides dedicated APIs for Customer Satisfaction, Service Efficiency, and Performance Trends
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AnalyticsController {

    @Autowired
    private AdvancedAnalyticsService analyticsService;

    /**
     * Get Customer Satisfaction Analytics
     * Calculates satisfaction scores, review counts, and trends
     */
    @GetMapping("/customer-satisfaction")
    public ResponseEntity<CustomerSatisfactionDTO> getCustomerSatisfaction(
            @RequestParam(required = false) String branchId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        
        CustomerSatisfactionDTO satisfaction = analyticsService.calculateCustomerSatisfaction(branchId, startDate, endDate);
        return ResponseEntity.ok(satisfaction);
    }

    /**
     * Get Service Efficiency Metrics
     * Calculates wait times, transaction speeds, and staff utilization
     */
    @GetMapping("/service-efficiency")
    public ResponseEntity<ServiceEfficiencyDTO> getServiceEfficiency(
            @RequestParam(required = false) String branchId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        
        ServiceEfficiencyDTO efficiency = analyticsService.calculateServiceEfficiency(branchId, startDate, endDate);
        return ResponseEntity.ok(efficiency);
    }

    /**
     * Get Performance Trends Data
     * Calculates revenue trends, transaction patterns, and growth metrics
     */
    @GetMapping("/performance-trends")
    public ResponseEntity<PerformanceTrendsDTO> getPerformanceTrends(
            @RequestParam(required = false) String branchId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        
        PerformanceTrendsDTO trends = analyticsService.calculatePerformanceTrends(branchId, startDate, endDate);
        return ResponseEntity.ok(trends);
    }

    /**
     * Get All Analytics Data (Combined endpoint for efficiency)
     */
    @GetMapping("/all")
    public ResponseEntity<Object> getAllAnalytics(
            @RequestParam(required = false) String branchId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        
        var allAnalytics = analyticsService.getAllAnalytics(branchId, startDate, endDate);
        return ResponseEntity.ok(allAnalytics);
    }
}
