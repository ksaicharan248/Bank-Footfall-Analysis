package com.hdfc.analytics.repository;

import com.hdfc.analytics.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    
    Optional<Branch> findByBranchCode(String branchCode);
    
    List<Branch> findByStatus(Branch.BranchStatus status);
    
    @Query("SELECT b FROM Branch b WHERE b.status = 'ACTIVE' ORDER BY b.branchName")
    List<Branch> findAllActiveBranches();
    
    @Query("SELECT COUNT(b) FROM Branch b WHERE b.status = 'ACTIVE'")
    Long countActiveBranches();
}