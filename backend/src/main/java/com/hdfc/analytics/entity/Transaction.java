package com.hdfc.analytics.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;
    
    @NotNull
    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;
    
    @NotNull
    @Column(name = "transaction_time", nullable = false)
    private LocalTime transactionTime;
    
    @NotBlank
    @Column(name = "service_type", nullable = false)
    private String serviceType;
    
    @Column(name = "transaction_amount", precision = 15, scale = 2)
    private BigDecimal transactionAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status")
    private TransactionStatus transactionStatus = TransactionStatus.COMPLETED;
    
    @Column(name = "processing_time_minutes")
    private Integer processingTimeMinutes;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CustomerEntry customerEntry;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Branch branch;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Staff staff;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum TransactionStatus {
        PENDING, COMPLETED, CANCELLED, FAILED
    }
}