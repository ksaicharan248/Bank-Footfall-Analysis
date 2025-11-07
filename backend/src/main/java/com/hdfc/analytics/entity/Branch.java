package com.hdfc.analytics.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "branch_id")
    private Long branchId;
    
    @NotBlank
    @Column(name = "branch_code", unique = true, nullable = false)
    private String branchCode;
    
    @NotBlank
    @Column(name = "branch_name", nullable = false)
    private String branchName;
    
    @NotBlank
    @Column(name = "address_line1", nullable = false)
    private String addressLine1;
    
    @NotBlank
    @Column(name = "city", nullable = false)
    private String city;
    
    @NotBlank
    @Column(name = "state", nullable = false)
    private String state;
    
    @NotBlank
    @Column(name = "pincode", nullable = false)
    private String pincode;
    
    @Column(name = "phone")
    private String phone;
    
    @Email
    @Column(name = "email")
    private String email;
    
    @Column(name = "manager_name")
    private String managerName;
    
    @NotNull
    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime;
    
    @NotNull
    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime;
    
    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity = 50;
    
    @Column(name = "current_staff_count")
    private Integer currentStaffCount = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BranchStatus status = BranchStatus.ACTIVE;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum BranchStatus {
        ACTIVE, INACTIVE, MAINTENANCE
    }
}