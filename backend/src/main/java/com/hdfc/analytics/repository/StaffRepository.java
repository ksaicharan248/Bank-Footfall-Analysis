package com.hdfc.analytics.repository;

import com.hdfc.analytics.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    
    Optional<Staff> findByEmployeeCode(String employeeCode);
    
    List<Staff> findByBranchBranchId(Long branchId);
    
    List<Staff> findByStatus(Staff.StaffStatus status);
    
    List<Staff> findByRole(String role);
    
    @Query("SELECT s FROM Staff s WHERE s.branch.branchId = :branchId AND s.status = 'ACTIVE'")
    List<Staff> findActiveStaffByBranch(@Param("branchId") Long branchId);
    
    @Query("SELECT COUNT(s) FROM Staff s WHERE s.branch.branchId = :branchId AND s.status = 'ACTIVE'")
    Long countActiveStaffByBranch(@Param("branchId") Long branchId);
}