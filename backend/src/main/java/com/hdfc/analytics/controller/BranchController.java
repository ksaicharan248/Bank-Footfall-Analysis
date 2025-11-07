package com.hdfc.analytics.controller;

import com.hdfc.analytics.entity.Branch;
import com.hdfc.analytics.repository.BranchRepository;
import com.hdfc.analytics.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/branches")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Tag(name = "Branch Management", description = "APIs for managing HDFC bank branches")
public class BranchController {
    
    private final BranchRepository branchRepository;
    
    @GetMapping
    @Operation(summary = "Get all branches", description = "Retrieve a list of all HDFC bank branches")
    public ResponseEntity<List<Branch>> getAllBranches() {
        return ResponseEntity.ok(branchRepository.findAll());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Branch>> getActiveBranches() {
        return ResponseEntity.ok(branchRepository.findAllActiveBranches());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get branch by ID", description = "Retrieve a specific branch by its ID")
    public ResponseEntity<Branch> getBranchById(
            @Parameter(description = "Branch ID", required = true) @PathVariable Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", id));
        return ResponseEntity.ok(branch);
    }
    
    @GetMapping("/code/{branchCode}")
    @Operation(summary = "Get branch by code", description = "Retrieve a specific branch by its branch code")
    public ResponseEntity<Branch> getBranchByCode(
            @Parameter(description = "Branch Code", required = true) @PathVariable String branchCode) {
        Branch branch = branchRepository.findByBranchCode(branchCode)
                .orElseThrow(() -> new ResourceNotFoundException("Branch with code", branchCode));
        return ResponseEntity.ok(branch);
    }
    
    @PostMapping
    public ResponseEntity<Branch> createBranch(@Valid @RequestBody Branch branch) {
        try {
            branch.setBranchId(null);
            Branch savedBranch = branchRepository.save(branch);
            return ResponseEntity.ok(savedBranch);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update branch", description = "Update an existing branch")
    public ResponseEntity<Branch> updateBranch(
            @Parameter(description = "Branch ID", required = true) @PathVariable Long id, 
            @Valid @RequestBody Branch branch) {
        branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", id));
        branch.setBranchId(id);
        Branch updatedBranch = branchRepository.save(branch);
        return ResponseEntity.ok(updatedBranch);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete branch", description = "Delete a branch by ID")
    public ResponseEntity<Void> deleteBranch(
            @Parameter(description = "Branch ID", required = true) @PathVariable Long id) {
        branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", id));
        branchRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getActiveBranchCount() {
        return ResponseEntity.ok(branchRepository.countActiveBranches());
    }
}