package com.hdfc.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffDTO {
    private Long staffId;
    private String employeeCode;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String department;
    private LocalDate hireDate;
    private BigDecimal salary;
    private String status;
    private String branchName;
    private String branchCode;
}