package com.hdfc.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDTO {
    private Long totalFootfall;
    private Long peakHourTraffic;
    private Double avgVisitDuration;
    private Double customerSatisfaction;
    private Long activeBranches;
    private Double serviceEfficiency;
    private Double totalRevenue;
    private String branchName;
    private String dateRange;
}