package com.hdfc.analytics.repository;

import com.hdfc.analytics.entity.CustomerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerEntryRepository extends JpaRepository<CustomerEntry, Long> {
    
    List<CustomerEntry> findByBranchBranchId(Long branchId);
    
    List<CustomerEntry> findByEntryDate(LocalDate entryDate);
    
    List<CustomerEntry> findByEntryDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT ce FROM CustomerEntry ce WHERE ce.branch.branchId = :branchId AND ce.entryDate BETWEEN :startDate AND :endDate")
    List<CustomerEntry> findByBranchAndDateRange(@Param("branchId") Long branchId, 
                                                @Param("startDate") LocalDate startDate, 
                                                @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(ce) FROM CustomerEntry ce WHERE ce.branch.branchId = :branchId AND ce.entryDate = :date")
    Long countByBranchAndDate(@Param("branchId") Long branchId, @Param("date") LocalDate date);
    
    @Query("SELECT AVG(ce.satisfactionRating) FROM CustomerEntry ce WHERE ce.branch.branchId = :branchId")
    Double getAverageSatisfactionByBranch(@Param("branchId") Long branchId);
    
    @Query("SELECT ce FROM CustomerEntry ce WHERE ce.entryTime BETWEEN :startTime AND :endTime AND ce.entryDate BETWEEN :startDate AND :endDate")
    List<CustomerEntry> findByTimeRangeAndDateRange(@Param("startTime") java.time.LocalTime startTime, 
                                                   @Param("endTime") java.time.LocalTime endTime,
                                                   @Param("startDate") LocalDate startDate, 
                                                   @Param("endDate") LocalDate endDate);
    
    @Query("SELECT AVG(ce.waitTimeMinutes) FROM CustomerEntry ce WHERE ce.branch.branchId = :branchId AND ce.entryDate BETWEEN :startDate AND :endDate")
    Double getAverageWaitTimeByBranch(@Param("branchId") Long branchId, 
                                     @Param("startDate") LocalDate startDate, 
                                     @Param("endDate") LocalDate endDate);
    
    @Query("SELECT AVG(ce.serviceTimeMinutes) FROM CustomerEntry ce WHERE ce.branch.branchId = :branchId AND ce.entryDate BETWEEN :startDate AND :endDate")
    Double getAverageServiceTimeByBranch(@Param("branchId") Long branchId, 
                                        @Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(ce) FROM CustomerEntry ce WHERE ce.entryTime BETWEEN :startTime AND :endTime AND ce.entryDate BETWEEN :startDate AND :endDate AND (:branchId IS NULL OR ce.branch.branchId = :branchId)")
    Long countByHourAndDateRange(@Param("startTime") java.time.LocalTime startTime,
                                @Param("endTime") java.time.LocalTime endTime,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate,
                                @Param("branchId") Long branchId);

    // Additional methods for advanced analytics
    
    @Query("SELECT ce FROM CustomerEntry ce WHERE ce.branch.branchId = :branchId AND ce.entryTime BETWEEN :startDateTime AND :endDateTime")
    List<CustomerEntry> findByBranchIdAndEntryTimeBetween(@Param("branchId") Long branchId,
                                                         @Param("startDateTime") java.time.LocalDateTime startDateTime,
                                                         @Param("endDateTime") java.time.LocalDateTime endDateTime);
    
    @Query("SELECT ce FROM CustomerEntry ce WHERE ce.entryTime BETWEEN :startDateTime AND :endDateTime")
    List<CustomerEntry> findByEntryTimeBetween(@Param("startDateTime") java.time.LocalDateTime startDateTime,
                                              @Param("endDateTime") java.time.LocalDateTime endDateTime);
}