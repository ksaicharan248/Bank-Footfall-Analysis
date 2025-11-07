package com.hdfc.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerEntryDTO {
    private Long entryId;
    private LocalDate entryDate;
    private LocalTime entryTime;
    private LocalTime exitTime;
    private String customerType;
    private String visitPurpose;
    private String queueNumber;
    private Integer waitTimeMinutes;
    private Integer serviceTimeMinutes;
    private Integer satisfactionRating;
    private String branchName;
    private String branchCode;
}