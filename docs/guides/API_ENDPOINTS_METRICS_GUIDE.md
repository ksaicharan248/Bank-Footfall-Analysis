# HDFC Branch Analytics API Endpoints & Metrics Calculation Guide
## Complete API Documentation for AI-Powered Dashboard

### Project Overview
- **Backend**: Spring Boot 3.1.5 with Java 21
- **Database**: MySQL 8.0+ with JPA/Hibernate
- **Purpose**: Real-time analytics calculations for AI insights

---

## 1. CORE DASHBOARD ENDPOINTS

### 1.1 Main Dashboard Metrics
**Endpoint**: `GET /api/analytics/dashboard/metrics`

**Parameters**:
- `branchId` (optional): Specific branch or null for all branches
- `startDate`: Start date for metrics calculation (ISO format)
- `endDate`: End date for metrics calculation (ISO format)

**Response Structure**:
```json
{
  "totalFootfall": 145,
  "peakHourTraffic": 23,
  "avgVisitDuration": 25.5,
  "customerSatisfaction": 4.2,
  "activeBranches": 3,
  "serviceEfficiency": 78.5,
  "totalRevenue": 2547500.00,
  "branchName": "All Branches",
  "dateRange": "2025-08-01 to 2025-09-01"
}
```

**Calculation Logic**:
```java
// Total Footfall Calculation
public Long getTotalFootfall(Long branchId, LocalDate startDate, LocalDate endDate) {
    if (branchId != null) {
        return customerEntryRepository.findByBranchAndDateRange(branchId, startDate, endDate).size();
    } else {
        return customerEntryRepository.findByEntryDateBetween(startDate, endDate).size();
    }
}

// Service Efficiency Calculation
private Double calculateServiceEfficiency(Long branchId, LocalDate startDate, LocalDate endDate) {
    Double avgWaitTime = getAverageWaitTime(branchId, startDate, endDate);
    Double avgProcessingTime = getAverageProcessingTime(branchId, startDate, endDate);
    
    // Efficiency = (Processing Time / (Processing Time + Wait Time)) * 100
    double efficiency = (avgProcessingTime / (avgProcessingTime + avgWaitTime)) * 100;
    return Math.min(99.0, Math.max(50.0, efficiency)); // Cap between 50-99%
}
```

---

## 2. FOOTFALL ANALYTICS ENDPOINTS

### 2.1 Daily Footfall Trends
**Endpoint**: `GET /api/analytics/footfall-trends`

**Parameters**:
- `startDate`: Start date for trend analysis
- `endDate`: End date for trend analysis

**Response Structure**:
```json
[
  {
    "date": "2025-09-01",
    "siruseri": 18,
    "tnagar": 32,
    "navalur": 15,
    "total": 65,
    "predicted": null
  },
  {
    "date": "2025-09-02",
    "siruseri": 22,
    "tnagar": 28,
    "navalur": 19,
    "total": 69,
    "predicted": null
  }
]
```

**Calculation Logic**:
```java
public List<FootfallTrendDTO> getFootfallTrends(LocalDate startDate, LocalDate endDate) {
    List<FootfallTrendDTO> trends = new ArrayList<>();
    
    LocalDate current = startDate;
    while (!current.isAfter(endDate)) {
        Long siruseri = customerEntryRepository.countByBranchAndDate(1L, current);
        Long tnagar = customerEntryRepository.countByBranchAndDate(2L, current);
        Long navalur = customerEntryRepository.countByBranchAndDate(3L, current);
        
        trends.add(FootfallTrendDTO.builder()
            .date(current)
            .siruseri(siruseri)
            .tnagar(tnagar)
            .navalur(navalur)
            .total(siruseri + tnagar + navalur)
            .build());
            
        current = current.plusDays(1);
    }
    return trends;
}
```

### 2.2 Peak Hour Analysis
**Endpoint**: `GET /api/analytics/peak-hours/{branchId}`

**Parameters**:
- `branchId`: Specific branch ID
- `startDate`: Start date for analysis
- `endDate`: End date for analysis

**Response Structure**:
```json
[
  {
    "hour": "09:00",
    "visitors": 8,
    "capacity": 50,
    "utilization": 16.0,
    "status": "low"
  },
  {
    "hour": "12:00",
    "visitors": 23,
    "capacity": 50,
    "utilization": 46.0,
    "status": "medium"
  },
  {
    "hour": "14:00",
    "visitors": 41,
    "capacity": 50,
    "utilization": 82.0,
    "status": "high"
  }
]
```

**Calculation Logic**:
```java
public List<PeakHourDTO> getPeakHourAnalysis(Long branchId, LocalDate startDate, LocalDate endDate) {
    List<PeakHourDTO> peakHours = new ArrayList<>();
    
    // Generate hourly analysis from 9 AM to 6 PM
    for (int hour = 9; hour <= 18; hour++) {
        Long visitorsForHour = getVisitorsByHour(branchId, hour, startDate, endDate);
        Integer capacity = 50; // Default capacity
        Double utilization = (visitorsForHour.doubleValue() / capacity) * 100;
        String status = getUtilizationStatus(utilization);
        
        peakHours.add(PeakHourDTO.builder()
            .hour(String.format("%02d:00", hour))
            .visitors(visitorsForHour)
            .capacity(capacity)
            .utilization(utilization)
            .status(status)
            .build());
    }
    return peakHours;
}

private String getUtilizationStatus(Double utilization) {
    if (utilization >= 70) return "high";
    else if (utilization >= 30) return "medium";
    else return "low";
}
```

---

## 3. SERVICE UTILIZATION ANALYTICS

### 3.1 Service Utilization Heatmap
**Endpoint**: `GET /api/analytics/service-utilization/{branchId}`

**Parameters**:
- `branchId`: Specific branch ID
- `startDate`: Start date for analysis
- `endDate`: End date for analysis

**Response Structure**:
```json
{
  "serviceData": [
    ["Teller", "45", "67", "89", "72", "56", "43", "38", "29"],
    ["Loans", "23", "34", "45", "78", "100", "67", "45", "32"],
    ["Investment", "67", "78", "56", "45", "43", "89", "76", "54"],
    ["Customer Service", "34", "45", "67", "56", "67", "45", "34", "28"]
  ],
  "hourData": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
}
```

**Calculation Logic**:
```java
public Object getServiceUtilization(Long branchId, LocalDate startDate, LocalDate endDate) {
    // Get real transaction data from database
    List<Transaction> transactions = branchId != null ? 
        transactionRepository.findByBranchAndDateRange(branchId, startDate, endDate) :
        transactionRepository.findByTransactionDateBetween(startDate, endDate);
        
    Map<String, Map<Integer, Long>> serviceHourCounts = new HashMap<>();
    
    // Process transactions to get actual service utilization by hour
    for (Transaction t : transactions) {
        String service = mapServiceType(t.getServiceType());
        int hour = t.getTransactionTime().getHour();
        
        serviceHourCounts.computeIfAbsent(service, k -> new HashMap<>())
            .merge(hour, 1L, Long::sum);
    }
    
    // Calculate utilization percentages
    String[][] services = new String[4][9];
    String[] serviceNames = {"Teller", "Loans", "Investment", "Customer Service"};
    
    for (int i = 0; i < serviceNames.length; i++) {
        services[i][0] = serviceNames[i];
        for (int j = 0; j < 8; j++) { // 8 hours (9 AM to 4 PM)
            Long count = serviceHourCounts.getOrDefault(serviceNames[i], new HashMap<>())
                .getOrDefault(j + 9, 0L);
            
            int utilization = calculateServiceUtilizationFromRealData(serviceNames[i], j + 9, count);
            services[i][j + 1] = String.valueOf(utilization);
        }
    }
    
    return new ServiceUtilizationResponse(services, hours);
}

private int calculateServiceUtilizationFromRealData(String serviceName, int hour, Long transactionCount) {
    int maxTransactionsPerHour = getMaxTransactionsPerService(serviceName);
    double utilizationPercentage = (transactionCount.doubleValue() / maxTransactionsPerHour) * 100;
    
    return Math.min(100, Math.max(7, (int) Math.round(utilizationPercentage)));
}

private int getMaxTransactionsPerService(String serviceName) {
    switch (serviceName) {
        case "Teller": return 8; // 8 transactions per hour at 100%
        case "Loans": return 4; // 4 transactions per hour at 100%
        case "Investment": return 5; // 5 transactions per hour at 100%
        case "Customer Service": return 6; // 6 transactions per hour at 100%
        default: return 5;
    }
}
```

---

## 4. REAL-TIME DASHBOARD ENDPOINTS

### 4.1 Real-Time Statistics
**Endpoint**: `GET /api/dashboard/real-time-stats`

**Response Structure**:
```json
{
  "timestamp": 1725622505550,
  "systemStatus": "online",
  "activeConnections": 12,
  "serverHealth": "98.5%",
  "lastUpdate": "2025-09-06"
}
```

**Calculation Logic**:
```java
public Map<String, Object> getRealTimeStats() {
    Map<String, Object> stats = new HashMap<>();
    stats.put("timestamp", System.currentTimeMillis());
    stats.put("systemStatus", "online");
    stats.put("activeConnections", customerEntryRepository.findByEntryDate(LocalDate.now()).size());
    stats.put("serverHealth", calculateSystemHealth() + "%");
    stats.put("lastUpdate", LocalDate.now().toString());
    return stats;
}

private double calculateSystemHealth() {
    long totalEntries = customerEntryRepository.findByEntryDate(LocalDate.now()).size();
    long activeBranches = branchRepository.countActiveBranches();
    return Math.min(99.9, 85.0 + (totalEntries * 0.5) + (activeBranches * 2.0));
}
```

### 4.2 Dashboard Alerts
**Endpoint**: `GET /api/dashboard/alerts`

**Response Structure**:
```json
[
  {
    "id": 2,
    "type": "warning",
    "message": "T Nagar approaching capacity (47 visitors)",
    "time": "Live"
  },
  {
    "id": 0,
    "type": "info", 
    "message": "All branches operating normally",
    "time": "Live"
  }
]
```

**Calculation Logic**:
```java
public List<Map<String, Object>> getDashboardAlerts() {
    List<Map<String, Object>> alerts = new ArrayList<>();
    
    for (Long branchId : List.of(1L, 2L, 3L)) {
        Long todayCount = customerEntryRepository.countByBranchAndDate(branchId, LocalDate.now());
        String branchName = branchRepository.findById(branchId)
            .map(b -> b.getBranchName()).orElse("Branch");
        
        if (todayCount > 40) { // Capacity threshold
            Map<String, Object> alert = new HashMap<>();
            alert.put("id", branchId);
            alert.put("type", "warning");
            alert.put("message", branchName + " approaching capacity (" + todayCount + " visitors)");
            alert.put("time", "Live");
            alerts.add(alert);
        }
    }
    
    if (alerts.isEmpty()) {
        // Add default "all normal" alert
        alerts.add(createNormalOperationAlert());
    }
    
    return alerts;
}
```

---

## 5. BRANCH COMPARISON ANALYTICS

### 5.1 Branch Performance Comparison
**Endpoint**: `GET /api/analytics/branch-comparison`

**Parameters**:
- `startDate`: Start date for comparison
- `endDate`: End date for comparison

**Response Structure**:
```json
[
  {
    "totalFootfall": 145,
    "peakHourTraffic": 23,
    "avgVisitDuration": 25.5,
    "customerSatisfaction": 4.2,
    "activeBranches": 1,
    "serviceEfficiency": 78.5,
    "totalRevenue": 847500.00,
    "branchName": "Siruseri",
    "dateRange": "2025-08-01 to 2025-09-01"
  },
  {
    "totalFootfall": 210,
    "peakHourTraffic": 35,
    "avgVisitDuration": 28.2,
    "customerSatisfaction": 4.3,
    "activeBranches": 1,
    "serviceEfficiency": 82.1,
    "totalRevenue": 1250000.00,
    "branchName": "T Nagar",
    "dateRange": "2025-08-01 to 2025-09-01"
  },
  {
    "totalFootfall": 118,
    "peakHourTraffic": 19,
    "avgVisitDuration": 22.8,
    "customerSatisfaction": 4.1,
    "activeBranches": 1,
    "serviceEfficiency": 75.3,
    "totalRevenue": 450000.00,
    "branchName": "Navalur",
    "dateRange": "2025-08-01 to 2025-09-01"
  }
]
```

---

## 6. KEY METRICS CALCULATION FORMULAS

### 6.1 Service Efficiency
```java
// Formula: (Processing Time / (Processing Time + Wait Time)) * 100
Double avgWaitTime = getAverageWaitTime(branchId, startDate, endDate);
Double avgProcessingTime = getAverageProcessingTime(branchId, startDate, endDate);

double efficiency = (avgProcessingTime / (avgProcessingTime + avgWaitTime)) * 100;
return Math.min(99.0, Math.max(50.0, efficiency));
```

### 6.2 Customer Satisfaction
```java
// Formula: Average of all satisfaction ratings (1-5 scale)
return entries.stream()
    .filter(entry -> entry.getSatisfactionRating() != null)
    .mapToInt(CustomerEntry::getSatisfactionRating)
    .average()
    .orElse(4.0); // Default to 4.0 if no ratings
```

### 6.3 Peak Hour Traffic
```java
// Formula: Maximum hourly visitors across all hours in date range
Long maxHourlyTraffic = 0L;
for (int hour = 9; hour <= 18; hour++) {
    Long hourlyTraffic = getVisitorsByHour(branchId, hour, startDate, endDate);
    if (hourlyTraffic > maxHourlyTraffic) {
        maxHourlyTraffic = hourlyTraffic;
    }
}
return maxHourlyTraffic;
```

### 6.4 Average Visit Duration
```java
// Formula: Average of (exit_time - entry_time) for all completed visits
return entries.stream()
    .filter(entry -> entry.getServiceTimeMinutes() != null)
    .mapToInt(CustomerEntry::getServiceTimeMinutes)
    .average()
    .orElse(25.0); // Default 25 minutes
```

---

## 7. DATABASE QUERY OPTIMIZATIONS

### 7.1 Critical Repository Methods
```java
// Optimized for analytics queries
@Query("SELECT COUNT(c) FROM CustomerEntry c WHERE c.branch.branchId = :branchId AND c.entryDate = :date")
Long countByBranchAndDate(@Param("branchId") Long branchId, @Param("date") LocalDate date);

@Query("SELECT AVG(c.waitTimeMinutes) FROM CustomerEntry c WHERE c.branch.branchId = :branchId")
Double getAverageWaitTimeByBranch(@Param("branchId") Long branchId);

@Query("SELECT COUNT(c) FROM CustomerEntry c WHERE c.entryTime BETWEEN :startTime AND :endTime AND c.entryDate BETWEEN :startDate AND :endDate AND (:branchId IS NULL OR c.branch.branchId = :branchId)")
Long countByHourAndDateRange(@Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("branchId") Long branchId);
```

### 7.2 Performance Indexes
```sql
-- Critical for API performance
CREATE INDEX idx_customer_entries_branch_date ON customer_entries(branch_id, entry_date);
CREATE INDEX idx_customer_entries_time_analysis ON customer_entries(entry_time, entry_date);
CREATE INDEX idx_transactions_revenue_analysis ON transactions(transaction_date, transaction_amount);
```

---

## 8. AI/GENAI INTEGRATION POINTS

### 8.1 Data for AI Training
```java
// Structured data for machine learning
public class AITrainingDataDTO {
    private List<FootfallTrendDTO> historicalFootfall;
    private List<PeakHourDTO> peakHourPatterns;
    private List<TransactionDTO> transactionHistory;
    private List<SatisfactionMetric> customerFeedback;
    private List<ServiceUtilizationMetric> servicePatterns;
}
```

### 8.2 Prediction Endpoints (Future Enhancement)
```java
// Endpoints for AI-powered predictions
GET /api/analytics/predict/footfall/{branchId}?days=7
GET /api/analytics/predict/revenue/{branchId}?period=monthly
GET /api/analytics/recommend/staffing/{branchId}?date=2025-09-10
```

---

## 9. DATA GENERATION RECOMMENDATIONS

### 9.1 Realistic Patterns for AI Showcase
```java
// Generate data with these characteristics:
- 30-90 days of historical data
- Clear peak/off-peak patterns
- Seasonal variations (month-end spikes)
- Realistic transaction amounts by service type
- Correlated satisfaction ratings with wait times
- Staff performance variations
```

### 9.2 AI-Friendly Data Distribution
```java
// Ensure data supports AI insights:
- 70% normal operations, 20% peak periods, 10% exceptional cases
- Clear cause-effect relationships (long wait = lower satisfaction)
- Predictable patterns with some randomness
- Complete data (minimal nulls in key fields)
- Balanced distribution across all branches
```

---

This comprehensive API guide provides all the calculation logic and endpoint details needed to understand how your dashboard generates metrics and how to create data that will showcase the full capabilities of your AI-powered analytics system.
