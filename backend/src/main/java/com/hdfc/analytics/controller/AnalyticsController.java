package com.hdfc.analytics.controller;

import com.hdfc.analytics.dto.DashboardMetricsDTO;
import com.hdfc.analytics.dto.FootfallTrendDTO;
import com.hdfc.analytics.dto.PeakHourDTO;
import com.hdfc.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
@Tag(name = "Analytics", description = "Advanced analytics APIs for dashboard visualizations")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    
    @GetMapping("/dashboard/metrics")
    @Operation(summary = "Get dashboard metrics", description = "Retrieve key performance indicators for dashboard")
    public ResponseEntity<DashboardMetricsDTO> getDashboardMetrics(
            @Parameter(description = "Branch ID (optional, null for all branches)") 
            @RequestParam(required = false) Long branchId,
            @Parameter(description = "Start date for metrics calculation") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for metrics calculation") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        DashboardMetricsDTO metrics = analyticsService.getDashboardMetrics(branchId, startDate, endDate);
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/footfall-trends")
    @Operation(summary = "Get footfall trends", description = "Get historical footfall data across all branches for specified date range")
    public ResponseEntity<List<FootfallTrendDTO>> getFootfallTrends(
            @Parameter(description = "Start date for trends") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for trends") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<FootfallTrendDTO> trends = analyticsService.getFootfallTrends(startDate, endDate);
        return ResponseEntity.ok(trends);
    }
    
    @GetMapping("/footfall-trends-with-prediction")
    @Operation(summary = "Get footfall trends with 7-day prediction", description = "Get historical footfall data plus 7-day AI predictions")
    public ResponseEntity<List<FootfallTrendDTO>> getFootfallTrendsWithPrediction(
            @Parameter(description = "Start date for trends") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for trends") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<FootfallTrendDTO> trends = analyticsService.getFootfallTrendsWithPrediction(startDate, endDate);
        return ResponseEntity.ok(trends);
    }
    
    @GetMapping("/peak-hours")
    @Operation(summary = "Get peak hour analysis", description = "Retrieve hourly utilization patterns for specific branch or all branches")
    public ResponseEntity<List<PeakHourDTO>> getPeakHourAnalysis(
            @Parameter(description = "Branch ID for peak hour analysis (optional, null for all branches)") 
            @RequestParam(required = false) Long branchId,
            @Parameter(description = "Start date for analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<PeakHourDTO> peakHours = analyticsService.getPeakHourAnalysis(branchId, startDate, endDate);
        return ResponseEntity.ok(peakHours);
    }
    
    @GetMapping("/branch-comparison")
    @Operation(summary = "Get branch comparison data", description = "Compare performance metrics across all branches")
    public ResponseEntity<List<DashboardMetricsDTO>> getBranchComparison(
            @Parameter(description = "Start date for comparison") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for comparison") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<DashboardMetricsDTO> comparison = List.of(
            analyticsService.getDashboardMetrics(1L, startDate, endDate), // Siruseri
            analyticsService.getDashboardMetrics(2L, startDate, endDate), // T Nagar  
            analyticsService.getDashboardMetrics(3L, startDate, endDate)  // Navalur
        );
        
        return ResponseEntity.ok(comparison);
    }
    
    @GetMapping("/service-utilization")
    @Operation(summary = "Get service utilization heatmap", description = "Service demand intensity by hour and service type")
    public ResponseEntity<Object> getServiceUtilization(
            @Parameter(description = "Branch ID for service utilization (optional, null for all branches)") 
            @RequestParam(required = false) Long branchId,
            @Parameter(description = "Start date for analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Object heatmapData = analyticsService.getServiceUtilization(branchId, startDate, endDate);
        return ResponseEntity.ok(heatmapData);
    }

    // New Advanced Analytics Endpoints
    
    @GetMapping("/customer-satisfaction")
    @Operation(summary = "Get customer satisfaction analytics", description = "Calculate satisfaction scores, review counts, and trends from actual database")
    public ResponseEntity<Object> getCustomerSatisfaction(
            @Parameter(description = "Branch ID (optional, null for all branches)") 
            @RequestParam(required = false) Long branchId,
            @Parameter(description = "Start date for satisfaction analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for satisfaction analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Object satisfaction = analyticsService.calculateCustomerSatisfaction(branchId, startDate, endDate);
        return ResponseEntity.ok(satisfaction);
    }

    @GetMapping("/service-efficiency")
    @Operation(summary = "Get service efficiency metrics", description = "Calculate wait times, transaction speeds, and staff utilization from real data")
    public ResponseEntity<Object> getServiceEfficiency(
            @Parameter(description = "Branch ID (optional, null for all branches)") 
            @RequestParam(required = false) Long branchId,
            @Parameter(description = "Start date for efficiency analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for efficiency analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Object efficiency = analyticsService.calculateServiceEfficiency(branchId, startDate, endDate);
        return ResponseEntity.ok(efficiency);
    }

    @GetMapping("/performance-trends")
    @Operation(summary = "Get performance trends data", description = "Calculate revenue trends, transaction patterns, and growth metrics from database")
    public ResponseEntity<Object> getPerformanceTrends(
            @Parameter(description = "Branch ID (optional, null for all branches)") 
            @RequestParam(required = false) Long branchId,
            @Parameter(description = "Start date for trend analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for trend analysis") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Object trends = analyticsService.calculatePerformanceTrends(branchId, startDate, endDate);
        return ResponseEntity.ok(trends);
    }
}