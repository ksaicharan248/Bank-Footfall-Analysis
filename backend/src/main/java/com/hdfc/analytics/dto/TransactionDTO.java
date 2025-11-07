package com.hdfc.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long transactionId;
    private LocalDate transactionDate;
    private LocalTime transactionTime;
    private String serviceType;
    private BigDecimal transactionAmount;
    private String transactionStatus;
    private Integer processingTimeMinutes;
    private String notes;
    private String branchName;
    private String branchCode;
}