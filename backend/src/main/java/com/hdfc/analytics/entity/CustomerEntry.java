package com.hdfc.analytics.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entry_id")
    private Long entryId;
    
    @NotNull
    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;
    
    @NotNull
    @Column(name = "entry_time", nullable = false)
    private LocalTime entryTime;
    
    @Column(name = "exit_time")
    private LocalTime exitTime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "customer_type")
    private CustomerType customerType = CustomerType.REGULAR;
    
    @Column(name = "visit_purpose")
    private String visitPurpose;
    
    @Column(name = "queue_number")
    private String queueNumber;
    
    @Column(name = "wait_time_minutes")
    private Integer waitTimeMinutes;
    
    @Column(name = "service_time_minutes")
    private Integer serviceTimeMinutes;
    
    @Min(1) @Max(5)
    @Column(name = "satisfaction_rating")
    private Integer satisfactionRating;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Branch branch;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum CustomerType {
        PREMIUM, REGULAR, NEW
    }
}