package com.hdfc.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeakHourDTO {
    private String hour;
    private Long visitors;
    private Integer capacity;
    private Double utilization;
    private String status;
}