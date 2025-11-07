package com.hdfc.analytics.repository;

import com.hdfc.analytics.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByBranchBranchId(Long branchId);
    
    List<Transaction> findByTransactionDate(LocalDate transactionDate);
    
    List<Transaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByServiceType(String serviceType);
    
    @Query("SELECT t FROM Transaction t WHERE t.branch.branchId = :branchId AND t.transactionDate BETWEEN :startDate AND :endDate")
    List<Transaction> findByBranchAndDateRange(@Param("branchId") Long branchId, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.branch.branchId = :branchId AND t.transactionStatus = 'COMPLETED'")
    Long countCompletedTransactionsByBranch(@Param("branchId") Long branchId);
    
    @Query("SELECT SUM(t.transactionAmount) FROM Transaction t WHERE t.branch.branchId = :branchId AND t.transactionStatus = 'COMPLETED'")
    Double getTotalAmountByBranch(@Param("branchId") Long branchId);
    
    @Query("SELECT SUM(t.transactionAmount) FROM Transaction t WHERE t.transactionDate BETWEEN :startDate AND :endDate AND t.transactionStatus = 'COMPLETED' AND (:branchId IS NULL OR t.branch.branchId = :branchId)")
    Double getTotalAmountByBranchAndDateRange(@Param("branchId") Long branchId,
                                             @Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate);
    
    @Query("SELECT AVG(t.processingTimeMinutes) FROM Transaction t WHERE t.transactionDate BETWEEN :startDate AND :endDate AND (:branchId IS NULL OR t.branch.branchId = :branchId)")
    Double getAverageProcessingTimeByBranch(@Param("branchId") Long branchId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    // Additional methods for advanced analytics
    
    @Query("SELECT t FROM Transaction t WHERE t.branch.branchId = :branchId AND t.transactionDate BETWEEN :startDate AND :endDate")
    List<Transaction> findByBranchIdAndTransactionDateBetween(@Param("branchId") Long branchId,
                                                             @Param("startDate") LocalDate startDate,
                                                             @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.transactionDate BETWEEN :startDate AND :endDate AND (:branchId IS NULL OR t.branch.branchId = :branchId)")
    Long countByBranchAndDateRange(@Param("branchId") Long branchId,
                                  @Param("startDate") LocalDate startDate,
                                  @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(t.transactionAmount) FROM Transaction t WHERE t.transactionDate = :date AND (:branchId IS NULL OR t.branch.branchId = :branchId)")
    Double getTotalAmountByBranchAndDate(@Param("branchId") Long branchId,
                                        @Param("date") LocalDate date);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.transactionDate = :date AND (:branchId IS NULL OR t.branch.branchId = :branchId)")
    Long countByBranchAndDate(@Param("branchId") Long branchId,
                             @Param("date") LocalDate date);
}