package com.hdfc.analytics.controller;

import com.hdfc.analytics.entity.Staff;
import com.hdfc.analytics.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.hdfc.analytics.dto.StaffDTO;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StaffController {
    
    private final StaffRepository staffRepository;
    
    @GetMapping
    public ResponseEntity<List<StaffDTO>> getAllStaff() {
        List<Staff> staff = staffRepository.findAll();
        List<StaffDTO> dtos = staff.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<StaffDTO>> getStaffByBranch(@PathVariable Long branchId) {
        List<Staff> staff = staffRepository.findByBranchBranchId(branchId);
        List<StaffDTO> dtos = staff.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/branch/{branchId}/active")
    public ResponseEntity<List<StaffDTO>> getActiveStaffByBranch(@PathVariable Long branchId) {
        List<Staff> staff = staffRepository.findActiveStaffByBranch(branchId);
        List<StaffDTO> dtos = staff.stream().map(this::convertToDTO).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<List<Staff>> getStaffByRole(@PathVariable String role) {
        return ResponseEntity.ok(staffRepository.findByRole(role));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return staffRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/employee/{employeeCode}")
    public ResponseEntity<Staff> getStaffByEmployeeCode(@PathVariable String employeeCode) {
        return staffRepository.findByEmployeeCode(employeeCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<StaffDTO> createStaff(@Valid @RequestBody Staff staff) {
        try {
            staff.setStaffId(null);
            Staff savedStaff = staffRepository.save(staff);
            return ResponseEntity.ok(convertToDTO(savedStaff));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @Valid @RequestBody Staff staff) {
        return staffRepository.findById(id)
                .map(existingStaff -> {
                    staff.setStaffId(id);
                    return ResponseEntity.ok(staffRepository.save(staff));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/analytics/count/{branchId}")
    public ResponseEntity<Long> getActiveStaffCount(@PathVariable Long branchId) {
        return ResponseEntity.ok(staffRepository.countActiveStaffByBranch(branchId));
    }
    
    private StaffDTO convertToDTO(Staff staff) {
        return StaffDTO.builder()
            .staffId(staff.getStaffId())
            .employeeCode(staff.getEmployeeCode())
            .fullName(staff.getFullName())
            .email(staff.getEmail())
            .phone(staff.getPhone())
            .role(staff.getRole())
            .department(staff.getDepartment())
            .hireDate(staff.getHireDate())
            .salary(staff.getSalary())
            .status(staff.getStatus() != null ? staff.getStatus().toString() : null)
            .branchName(staff.getBranch() != null ? staff.getBranch().getBranchName() : null)
            .branchCode(staff.getBranch() != null ? staff.getBranch().getBranchCode() : null)
            .build();
    }
    

}