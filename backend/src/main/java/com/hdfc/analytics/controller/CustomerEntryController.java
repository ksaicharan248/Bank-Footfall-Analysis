package com.hdfc.analytics.controller;

import com.hdfc.analytics.entity.CustomerEntry;
import com.hdfc.analytics.repository.CustomerEntryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.ArrayList;
import com.hdfc.analytics.dto.CustomerEntryDTO;

@RestController
@RequestMapping("/entries")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Tag(name = "Customer Entries", description = "APIs for managing customer branch entries and analytics")
public class CustomerEntryController {
    
    private final CustomerEntryRepository customerEntryRepository;
    
    @GetMapping
    @Operation(summary = "Get all customer entries", description = "Retrieve all customer branch entries")
    public ResponseEntity<List<CustomerEntryDTO>> getAllEntries() {
        List<CustomerEntry> entries = customerEntryRepository.findAll();
        List<CustomerEntryDTO> dtos = entries.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<CustomerEntryDTO>> getEntriesByBranch(@PathVariable Long branchId) {
        List<CustomerEntry> entries = customerEntryRepository.findByBranchBranchId(branchId);
        List<CustomerEntryDTO> dtos = entries.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<List<CustomerEntryDTO>> getEntriesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<CustomerEntry> entries = customerEntryRepository.findByEntryDate(date);
        List<CustomerEntryDTO> dtos = entries.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<CustomerEntryDTO>> getEntriesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<CustomerEntry> entries = customerEntryRepository.findByEntryDateBetween(startDate, endDate);
        List<CustomerEntryDTO> dtos = entries.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/branch/{branchId}/date-range")
    public ResponseEntity<List<CustomerEntryDTO>> getEntriesByBranchAndDateRange(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<CustomerEntry> entries = customerEntryRepository.findByBranchAndDateRange(branchId, startDate, endDate);
        List<CustomerEntryDTO> dtos = entries.stream()
            .map(this::convertToDTO)
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PostMapping
    public ResponseEntity<CustomerEntryDTO> createEntry(@Valid @RequestBody CustomerEntry entry) {
        try {
            entry.setEntryId(null);
            CustomerEntry savedEntry = customerEntryRepository.save(entry);
            return ResponseEntity.ok(convertToDTO(savedEntry));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/analytics/satisfaction/{branchId}")
    public ResponseEntity<Double> getAverageSatisfaction(@PathVariable Long branchId) {
        Double avgSatisfaction = customerEntryRepository.getAverageSatisfactionByBranch(branchId);
        return ResponseEntity.ok(avgSatisfaction != null ? avgSatisfaction : 0.0);
    }
    
    @GetMapping("/analytics/count/{branchId}")
    public ResponseEntity<Long> getDailyCount(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(customerEntryRepository.countByBranchAndDate(branchId, date));
    }
    
    @GetMapping("/analytics/footfall")
    @Operation(summary = "Get footfall analytics", description = "Get customer footfall data for analytics dashboard")
    public ResponseEntity<Long> getFootfallAnalytics(
            @Parameter(description = "Branch ID for filtering") @RequestParam(required = false) Long branchId,
            @Parameter(description = "Start date for filtering") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for filtering") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Long count;
        if (branchId != null) {
            count = (long) customerEntryRepository.findByBranchAndDateRange(branchId, startDate, endDate).size();
        } else {
            count = (long) customerEntryRepository.findByEntryDateBetween(startDate, endDate).size();
        }
        return ResponseEntity.ok(count);
    }
    
    private CustomerEntryDTO convertToDTO(CustomerEntry entry) {
        return CustomerEntryDTO.builder()
            .entryId(entry.getEntryId())
            .entryDate(entry.getEntryDate())
            .entryTime(entry.getEntryTime())
            .exitTime(entry.getExitTime())
            .customerType(entry.getCustomerType() != null ? entry.getCustomerType().toString() : null)
            .visitPurpose(entry.getVisitPurpose())
            .queueNumber(entry.getQueueNumber())
            .waitTimeMinutes(entry.getWaitTimeMinutes())
            .serviceTimeMinutes(entry.getServiceTimeMinutes())
            .satisfactionRating(entry.getSatisfactionRating())
            .branchName(entry.getBranch() != null ? entry.getBranch().getBranchName() : null)
            .branchCode(entry.getBranch() != null ? entry.getBranch().getBranchCode() : null)
            .build();
    }
    

}