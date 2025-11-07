package com.hdfc.analytics.service;

import com.hdfc.analytics.entity.*;
import com.hdfc.analytics.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class DataInitService implements CommandLineRunner {
    
    private final BranchRepository branchRepository;
    private final CustomerEntryRepository customerEntryRepository;
    private final StaffRepository staffRepository;
    private final TransactionRepository transactionRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (customerEntryRepository.count() == 0) {
            initializeData();
        }
    }
    
    private void initializeData() {
        // Get branches
        var branches = branchRepository.findAll();
        if (branches.isEmpty()) return;
        
        var siruseri = branches.get(0);
        var tnagar = branches.size() > 1 ? branches.get(1) : siruseri;
        var navalur = branches.size() > 2 ? branches.get(2) : siruseri;
        
        // Create staff
        staffRepository.save(Staff.builder()
            .employeeCode("EMP001")
            .fullName("Rajesh Kumar")
            .email("rajesh@hdfc.com")
            .role("Manager")
            .department("Operations")
            .hireDate(LocalDate.of(2020, 1, 15))
            .salary(new BigDecimal("75000"))
            .status(Staff.StaffStatus.ACTIVE)
            .branch(siruseri)
            .build());
            
        staffRepository.save(Staff.builder()
            .employeeCode("EMP002")
            .fullName("Priya Sharma")
            .email("priya@hdfc.com")
            .role("Analyst")
            .department("Analytics")
            .hireDate(LocalDate.of(2021, 3, 10))
            .salary(new BigDecimal("55000"))
            .status(Staff.StaffStatus.ACTIVE)
            .branch(tnagar)
            .build());
        
        // Create customer entries
        customerEntryRepository.save(CustomerEntry.builder()
            .entryDate(LocalDate.now())
            .entryTime(LocalTime.of(9, 15))
            .exitTime(LocalTime.of(9, 35))
            .customerType(CustomerEntry.CustomerType.REGULAR)
            .visitPurpose("Cash Deposit")
            .queueNumber("Q001")
            .waitTimeMinutes(5)
            .serviceTimeMinutes(15)
            .satisfactionRating(4)
            .branch(siruseri)
            .build());
            
        customerEntryRepository.save(CustomerEntry.builder()
            .entryDate(LocalDate.now())
            .entryTime(LocalTime.of(10, 30))
            .exitTime(LocalTime.of(11, 15))
            .customerType(CustomerEntry.CustomerType.PREMIUM)
            .visitPurpose("Loan Inquiry")
            .queueNumber("Q002")
            .waitTimeMinutes(8)
            .serviceTimeMinutes(37)
            .satisfactionRating(5)
            .branch(tnagar)
            .build());
        
        // Create transactions
        transactionRepository.save(Transaction.builder()
            .transactionDate(LocalDate.now())
            .transactionTime(LocalTime.of(9, 20))
            .serviceType("Cash Deposit")
            .transactionAmount(new BigDecimal("25000"))
            .transactionStatus(Transaction.TransactionStatus.COMPLETED)
            .processingTimeMinutes(15)
            .notes("Regular deposit")
            .branch(siruseri)
            .build());
            
        transactionRepository.save(Transaction.builder()
            .transactionDate(LocalDate.now())
            .transactionTime(LocalTime.of(10, 45))
            .serviceType("Loan Processing")
            .transactionAmount(new BigDecimal("500000"))
            .transactionStatus(Transaction.TransactionStatus.COMPLETED)
            .processingTimeMinutes(37)
            .notes("Business loan")
            .branch(tnagar)
            .build());
    }
}