package com.hdfc.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FootfallTrendDTO {
    private LocalDate date;
    private Long siruseri;
    private Long tnagar;
    private Long navalur;
    private Long total;
    private Boolean predicted; // Changed from Long to Boolean to indicate if this is a prediction
}