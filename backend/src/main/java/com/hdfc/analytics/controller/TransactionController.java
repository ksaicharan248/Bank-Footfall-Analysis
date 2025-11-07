package com.hdfc.analytics.controller;

import com.hdfc.analytics.entity.Transaction;
import com.hdfc.analytics.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;
import com.hdfc.analytics.dto.TransactionDTO;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TransactionController {
    
    private final TransactionRepository transactionRepository;
    
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<TransactionDTO> dtos = transactions.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByBranch(@PathVariable Long branchId) {
        List<Transaction> transactions = transactionRepository.findByBranchBranchId(branchId);
        List<TransactionDTO> dtos = transactions.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/service/{serviceType}")
    public ResponseEntity<List<Transaction>> getTransactionsByService(@PathVariable String serviceType) {
        return ResponseEntity.ok(transactionRepository.findByServiceType(serviceType));
    }
    
    @GetMapping("/branch/{branchId}/date-range")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByBranchAndDateRange(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findByBranchAndDateRange(branchId, startDate, endDate);
        List<TransactionDTO> dtos = transactions.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@Valid @RequestBody Transaction transaction) {
        try {
            transaction.setTransactionId(null);
            Transaction savedTransaction = transactionRepository.save(transaction);
            return ResponseEntity.ok(convertToDTO(savedTransaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/analytics/count/{branchId}")
    public ResponseEntity<Long> getCompletedTransactionCount(@PathVariable Long branchId) {
        return ResponseEntity.ok(transactionRepository.countCompletedTransactionsByBranch(branchId));
    }
    
    @GetMapping("/analytics/amount/{branchId}")
    public ResponseEntity<Double> getTotalTransactionAmount(@PathVariable Long branchId) {
        Double totalAmount = transactionRepository.getTotalAmountByBranch(branchId);
        return ResponseEntity.ok(totalAmount != null ? totalAmount : 0.0);
    }
    
    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
            .transactionId(transaction.getTransactionId())
            .transactionDate(transaction.getTransactionDate())
            .transactionTime(transaction.getTransactionTime())
            .serviceType(transaction.getServiceType())
            .transactionAmount(transaction.getTransactionAmount())
            .transactionStatus(transaction.getTransactionStatus() != null ? transaction.getTransactionStatus().toString() : null)
            .processingTimeMinutes(transaction.getProcessingTimeMinutes())
            .notes(transaction.getNotes())
            .branchName(transaction.getBranch() != null ? transaction.getBranch().getBranchName() : null)
            .branchCode(transaction.getBranch() != null ? transaction.getBranch().getBranchCode() : null)
            .build();
    }
    

}