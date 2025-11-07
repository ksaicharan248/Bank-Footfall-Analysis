package com.hdfc.analytics.service;

import com.hdfc.analytics.entity.*;
import com.hdfc.analytics.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Random;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class LargeDataGeneratorService {
    
    private final CustomerEntryRepository customerEntryRepository;
    private final TransactionRepository transactionRepository;
    private final BranchRepository branchRepository;
    
    private final Random random = new Random();
    
    private final List<String> visitPurposes = Arrays.asList(
        "Cash Deposit", "Cash Withdrawal", "Account Opening", "Loan Inquiry", 
        "Fixed Deposit", "Investment Planning", "Cheque Deposit", "Balance Inquiry",
        "Statement Request", "Debit Card Issue", "Credit Card Application", 
        "Loan Payment", "Tax Planning", "Wealth Management", "Insurance Services"
    );
    
    private final List<String> serviceTypes = Arrays.asList(
        "Cash Deposit", "Cash Withdrawal", "Loan Processing", "Investment Services",
        "Account Services", "Card Services", "Insurance Services", "Tax Services"
    );
    
    @Transactional
    public void generateLargeDataset() {
        log.info("Starting large dataset generation...");
        
        // Clear existing data
        customerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        
        List<Branch> branches = branchRepository.findAll();
        if (branches.isEmpty()) {
            log.error("No branches found. Please ensure branches are created first.");
            return;
        }
        
        // Generate data for last 3 months from today (September 5, 2025)
        LocalDate today = LocalDate.of(2025, 9, 5);
        LocalDate startDate = today.minusMonths(3); // June 5, 2025
        LocalDate endDate = today; // September 5, 2025
        
        int totalEntries = 0;
        int totalTransactions = 0;
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            // Generate entries for each day based on realistic patterns
            int dailyEntries = getDailyEntryCount(currentDate);
            
            for (int i = 0; i < dailyEntries; i++) {
                Branch branch = branches.get(random.nextInt(branches.size()));
                CustomerEntry entry = generateCustomerEntry(currentDate, branch, i);
                customerEntryRepository.save(entry);
                totalEntries++;
                
                // Generate corresponding transaction (80% probability)
                if (random.nextDouble() < 0.8) {
                    Transaction transaction = generateTransaction(currentDate, branch, entry);
                    transactionRepository.save(transaction);
                    totalTransactions++;
                }
            }
            
            currentDate = currentDate.plusDays(1);
        }
        
        log.info("Large dataset generation completed. Generated {} entries and {} transactions", 
                totalEntries, totalTransactions);
    }
    
    private int getDailyEntryCount(LocalDate date) {
        int baseCount = 25; // Increased base entries per day for better visibility
        
        // Seasonal variations
        int month = date.getMonthValue();
        double seasonalMultiplier = getSeasonalMultiplier(month);
        
        // Day of week variations
        int dayOfWeek = date.getDayOfWeek().getValue();
        double weekdayMultiplier = getWeekdayMultiplier(dayOfWeek);
        
        // Special occasions (festivals, year-end, etc.)
        double specialMultiplier = getSpecialOccasionMultiplier(date);
        
        int dailyCount = (int) (baseCount * seasonalMultiplier * weekdayMultiplier * specialMultiplier);
        
        // Add some randomness
        dailyCount += random.nextInt(15) - 7;
        
        return Math.max(10, Math.min(80, dailyCount)); // Between 10-80 entries per day for better visibility
    }
    
    private double getSeasonalMultiplier(int month) {
        switch (month) {
            case 10: return 1.4; // October - Festival season
            case 11: return 1.2; // November - Post-festival
            case 12: return 1.5; // December - Year-end rush
            case 1: return 1.3; // January - New year
            case 2: return 1.1; // February - Tax prep
            case 3: return 1.6; // March - Financial year end (highest)
            case 4: return 1.2; // April - New financial year
            case 5: return 0.9; // May - Summer lull
            case 6: return 1.0; // June - Normal
            case 7: return 0.8; // July - Monsoon
            case 8: return 1.1; // August - Back to school
            case 9: return 1.0; // September - Normal
            default: return 1.0;
        }
    }
    
    private double getWeekdayMultiplier(int dayOfWeek) {
        switch (dayOfWeek) {
            case 1: return 1.3; // Monday - High
            case 2: return 1.2; // Tuesday - High
            case 3: return 1.1; // Wednesday - Medium-High
            case 4: return 1.1; // Thursday - Medium-High
            case 5: return 1.2; // Friday - High
            case 6: return 0.8; // Saturday - Lower
            case 7: return 0.3; // Sunday - Very low
            default: return 1.0;
        }
    }
    
    private double getSpecialOccasionMultiplier(LocalDate date) {
        // Special occasions for 2025
        if (isNearDate(date, LocalDate.of(2025, 8, 15), 2)) return 1.6; // Independence Day
        if (isNearDate(date, LocalDate.of(2025, 8, 19), 2)) return 1.4; // Raksha Bandhan
        if (isNearDate(date, LocalDate.of(2025, 9, 5), 2)) return 1.3; // Teachers Day
        if (isNearDate(date, LocalDate.of(2025, 6, 21), 2)) return 1.2; // International Yoga Day
        if (isNearDate(date, LocalDate.of(2025, 7, 4), 2)) return 1.2; // Mid-year financial activities
        
        return 1.0;
    }
    
    private boolean isNearDate(LocalDate date, LocalDate targetDate, int days) {
        return Math.abs(date.toEpochDay() - targetDate.toEpochDay()) <= days;
    }
    
    private CustomerEntry generateCustomerEntry(LocalDate date, Branch branch, int sequence) {
        // Generate realistic entry time (9 AM to 6 PM)
        LocalTime entryTime = LocalTime.of(9 + random.nextInt(9), random.nextInt(60));
        
        // Generate exit time (15-60 minutes later)
        int serviceDuration = 15 + random.nextInt(45);
        LocalTime exitTime = entryTime.plusMinutes(serviceDuration);
        
        // Customer type distribution: 60% Regular, 25% Premium, 15% New
        CustomerEntry.CustomerType customerType;
        double typeRand = random.nextDouble();
        if (typeRand < 0.6) customerType = CustomerEntry.CustomerType.REGULAR;
        else if (typeRand < 0.85) customerType = CustomerEntry.CustomerType.PREMIUM;
        else customerType = CustomerEntry.CustomerType.NEW;
        
        String visitPurpose = visitPurposes.get(random.nextInt(visitPurposes.size()));
        String queueNumber = generateQueueNumber(branch, sequence);
        
        int waitTime = 3 + random.nextInt(25); // 3-28 minutes
        int serviceTime = 10 + random.nextInt(35); // 10-45 minutes
        int satisfaction = 3 + random.nextInt(3); // 3-5 rating
        
        return CustomerEntry.builder()
            .entryDate(date)
            .entryTime(entryTime)
            .exitTime(exitTime)
            .customerType(customerType)
            .visitPurpose(visitPurpose)
            .queueNumber(queueNumber)
            .waitTimeMinutes(waitTime)
            .serviceTimeMinutes(serviceTime)
            .satisfactionRating(satisfaction)
            .branch(branch)
            .build();
    }
    
    private Transaction generateTransaction(LocalDate date, Branch branch, CustomerEntry entry) {
        // Generate service type based on time of day and realistic patterns
        String serviceType = generateRealisticServiceType(entry.getEntryTime());
        
        // Generate realistic transaction amounts based on service type
        BigDecimal amount = generateTransactionAmount(serviceType);
        
        int processingTime = entry.getServiceTimeMinutes() + random.nextInt(10);
        
        return Transaction.builder()
            .transactionDate(date)
            .transactionTime(entry.getEntryTime().plusMinutes(entry.getWaitTimeMinutes()))
            .serviceType(serviceType)
            .transactionAmount(amount)
            .transactionStatus(Transaction.TransactionStatus.COMPLETED)
            .processingTimeMinutes(processingTime)
            .notes("Generated transaction for " + serviceType)
            .customerEntry(entry)
            .branch(branch)
            .build();
    }
    
    private String generateRealisticServiceType(LocalTime entryTime) {
        int hour = entryTime.getHour();
        double rand = random.nextDouble();
        
        // Different service patterns throughout the day
        if (hour >= 9 && hour <= 11) {
            // Morning: More cash deposits, account services
            if (rand < 0.4) return "Cash Deposit";
            else if (rand < 0.7) return "Account Services";
            else if (rand < 0.85) return "Investment Services";
            else return "Card Services";
        } else if (hour >= 12 && hour <= 14) {
            // Lunch time: Quick services, cash withdrawals
            if (rand < 0.5) return "Cash Withdrawal";
            else if (rand < 0.8) return "Account Services";
            else return "Card Services";
        } else if (hour >= 15 && hour <= 17) {
            // Afternoon: Loan processing, investment services
            if (rand < 0.3) return "Loan Processing";
            else if (rand < 0.6) return "Investment Services";
            else if (rand < 0.8) return "Cash Withdrawal";
            else return "Insurance Services";
        } else {
            // Evening: Quick transactions
            if (rand < 0.6) return "Cash Withdrawal";
            else if (rand < 0.85) return "Account Services";
            else return "Card Services";
        }
    }
    
    private BigDecimal generateTransactionAmount(String serviceType) {
        switch (serviceType.toLowerCase()) {
            case "loan processing":
                return BigDecimal.valueOf(200000 + random.nextInt(1800000)); // 2L to 20L
            case "investment services":
                return BigDecimal.valueOf(50000 + random.nextInt(950000)); // 50K to 10L
            case "cash deposit":
                return BigDecimal.valueOf(1000 + random.nextInt(99000)); // 1K to 100K
            case "cash withdrawal":
                return BigDecimal.valueOf(500 + random.nextInt(49500)); // 500 to 50K
            default:
                return BigDecimal.valueOf(random.nextInt(10000)); // 0 to 10K
        }
    }
    
    private String generateQueueNumber(Branch branch, int sequence) {
        String prefix = branch.getBranchCode().substring(4); // Last 3 digits
        return prefix + String.format("%04d", sequence + 1);
    }
    
    @Transactional
    public void regenerateTransactionData() {
        log.info("Regenerating transaction data with better service distribution...");
        
        // Delete existing transactions but keep customer entries
        transactionRepository.deleteAll();
        
        List<CustomerEntry> entries = customerEntryRepository.findAll();
        List<Branch> branches = branchRepository.findAll();
        
        log.info("Found {} customer entries to process", entries.size());
        
        int transactionCount = 0;
        List<Transaction> transactionBatch = new ArrayList<>();
        
        for (CustomerEntry entry : entries) {
            // Generate 1-3 transactions per customer entry based on service time
            int numTransactions = (entry.getServiceTimeMinutes() > 30) ? 2 + random.nextInt(2) : 1;
            
            for (int i = 0; i < numTransactions; i++) {
                Transaction transaction = generateTransaction(entry.getEntryDate(), entry.getBranch(), entry);
                transactionBatch.add(transaction);
                transactionCount++;
                
                if (transactionBatch.size() >= 500) {
                    transactionRepository.saveAll(transactionBatch);
                    transactionBatch.clear();
                    log.info("Saved {} transactions...", transactionCount);
                }
            }
        }
        
        if (!transactionBatch.isEmpty()) {
            transactionRepository.saveAll(transactionBatch);
        }
        
        log.info("Successfully regenerated {} transactions with varied service patterns", transactionCount);
    }
}