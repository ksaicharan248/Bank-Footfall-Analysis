# HDFC Branch Analytics Database Schema & Data Model
## Complete Database Structure for AI-Powered Analytics Dashboard

### Project Overview
- **Client**: HDFC Bank
- **Project**: Branch Operations Visual Analytics Dashboard
- **Database**: MySQL 8.0+
- **Purpose**: Generate customized fake data for showcasing AI-powered analytics

---

## 1. CORE DATABASE SCHEMA

### 1.1 BRANCHES (Master Table)
```sql
CREATE TABLE branches (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_code VARCHAR(10) UNIQUE NOT NULL,
    branch_name VARCHAR(100) NOT NULL,
    address_line1 VARCHAR(200) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    manager_name VARCHAR(100),
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '18:00:00',
    max_capacity INT NOT NULL DEFAULT 50,
    current_staff_count INT DEFAULT 0,
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**AI Data Generation Strategy**:
- Generate 3-5 branches with distinct characteristics
- **Siruseri**: IT Hub (high weekday traffic, tech-savvy customers)
- **T Nagar**: Commercial Hub (highest footfall, premium customers)
- **Navalur**: Residential Area (moderate traffic, family banking)

### 1.2 CUSTOMER_ENTRIES (Analytics Core)
```sql
CREATE TABLE customer_entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    entry_date DATE NOT NULL,
    entry_time TIME NOT NULL,
    exit_time TIME,
    customer_type ENUM('PREMIUM', 'REGULAR', 'NEW') DEFAULT 'REGULAR',
    visit_purpose VARCHAR(100),
    queue_number VARCHAR(20),
    wait_time_minutes INT,
    service_time_minutes INT,
    satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);
```

**AI Data Generation Strategy**:
- **Volume**: 1000+ entries over 30-90 days
- **Patterns**: Peak hours (12-2 PM), lunch rush patterns
- **Customer Types**: 70% Regular, 20% Premium, 10% New
- **Satisfaction**: Weighted towards 4-5 stars (85% positive)
- **Visit Purposes**: Cash operations (40%), Loans (15%), Investment (25%), Others (20%)

### 1.3 TRANSACTIONS (Revenue Analytics)
```sql
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT,
    branch_id INT NOT NULL,
    staff_id INT,
    counter_id INT,
    transaction_date DATE NOT NULL,
    transaction_time TIME NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    transaction_amount DECIMAL(15,2),
    transaction_status ENUM('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED') DEFAULT 'COMPLETED',
    processing_time_minutes INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES customer_entries(entry_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (counter_id) REFERENCES service_counters(counter_id)
);
```

**AI Data Generation Strategy**:
- **Volume**: 2000+ transactions
- **Revenue Patterns**: 
  - Morning: Investment-heavy (₹50K-₹5L)
  - Afternoon: Mixed transactions (₹1K-₹50K)
  - Evening: Quick cash operations (₹500-₹10K)
- **Service Types**: Deposits, Withdrawals, Fund Transfers, Loans, Investments

### 1.4 STAFF (Employee Analytics)
```sql
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    branch_id INT NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    status ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);
```

**AI Data Generation Strategy**:
- **Roles**: Teller, Relationship Manager, Branch Manager, Security, Cashier
- **Performance Correlation**: Link staff efficiency to transaction processing times

---

## 2. ANALYTICS VIEWS FOR AI INSIGHTS

### 2.1 Daily Footfall Summary
```sql
CREATE VIEW daily_footfall_summary AS
SELECT 
    b.branch_name,
    ce.entry_date,
    COUNT(*) as total_visitors,
    AVG(ce.wait_time_minutes) as avg_wait_time,
    AVG(ce.service_time_minutes) as avg_service_time,
    AVG(ce.satisfaction_rating) as avg_satisfaction
FROM customer_entries ce
JOIN branches b ON ce.branch_id = b.branch_id
GROUP BY b.branch_name, ce.entry_date
ORDER BY ce.entry_date DESC, b.branch_name;
```

### 2.2 Peak Hours Analysis
```sql
CREATE VIEW peak_hours_analysis AS
SELECT 
    b.branch_name,
    HOUR(ce.entry_time) as hour_of_day,
    COUNT(*) as visitor_count,
    AVG(ce.wait_time_minutes) as avg_wait_time
FROM customer_entries ce
JOIN branches b ON ce.branch_id = b.branch_id
GROUP BY b.branch_name, HOUR(ce.entry_time)
ORDER BY b.branch_name, hour_of_day;
```

### 2.3 Service Utilization
```sql
CREATE VIEW service_utilization AS
SELECT 
    b.branch_name,
    t.service_type,
    COUNT(*) as transaction_count,
    AVG(t.processing_time_minutes) as avg_processing_time,
    SUM(t.transaction_amount) as total_amount
FROM transactions t
JOIN branches b ON t.branch_id = b.branch_id
GROUP BY b.branch_name, t.service_type
ORDER BY b.branch_name, transaction_count DESC;
```

---

## 3. AI DATA GENERATION PATTERNS

### 3.1 Realistic Footfall Patterns
```sql
-- Peak Hours Distribution
09:00-11:00: Light traffic (20% of daily footfall)
11:00-13:00: Peak hours (40% of daily footfall)
13:00-15:00: Moderate traffic (25% of daily footfall)
15:00-18:00: Evening traffic (15% of daily footfall)

-- Weekly Patterns
Monday: Heavy (120% of average)
Tuesday-Thursday: Normal (100% of average)
Friday: Heavy (110% of average)
Saturday: Light (60% of average)
Sunday: Closed
```

### 3.2 Customer Behavior Patterns
```sql
-- Premium Customers (20%)
- Higher transaction amounts (₹50K+)
- Lower wait times (VIP service)
- Investment-focused visits
- Satisfaction: 4.5-5.0 stars

-- Regular Customers (70%)
- Mixed transaction amounts (₹1K-₹50K)
- Standard wait times (5-20 minutes)
- Banking operations
- Satisfaction: 3.5-4.5 stars

-- New Customers (10%)
- Account opening focus
- Longer service times (educational)
- Lower transaction amounts
- Satisfaction: 3.0-4.0 stars
```

### 3.3 Transaction Amount Patterns
```sql
-- Service Type Distribution
Cash Deposit: ₹5K-₹2L (Average: ₹35K)
Cash Withdrawal: ₹500-₹50K (Average: ₹8K)
Fund Transfer: ₹1K-₹5L (Average: ₹25K)
Investment: ₹50K-₹10L (Average: ₹2.5L)
Loan Processing: ₹2L-₹50L (Average: ₹15L)
Foreign Exchange: ₹10K-₹2L (Average: ₹45K)
```

---

## 4. PERFORMANCE INDEXES FOR AI QUERIES

```sql
-- Critical Analytics Indexes
CREATE INDEX idx_customer_entries_branch_date ON customer_entries(branch_id, entry_date);
CREATE INDEX idx_customer_entries_time_analysis ON customer_entries(entry_time, entry_date);
CREATE INDEX idx_transactions_revenue_analysis ON transactions(transaction_date, transaction_amount);
CREATE INDEX idx_transactions_service_analysis ON transactions(service_type, processing_time_minutes);
CREATE INDEX idx_staff_performance ON staff(branch_id, role, status);
```

---

## 5. AI ANALYTICS REQUIREMENTS

### 5.1 Machine Learning Data Points
```sql
-- Predictive Analytics Features
- Historical footfall trends (time series)
- Customer satisfaction correlations
- Peak hour predictions
- Revenue forecasting patterns
- Staff efficiency metrics
- Service utilization patterns
```

### 5.2 Real-time Analytics
```sql
-- Live Dashboard Requirements
- Current visitor count by branch
- Real-time wait times
- Service counter utilization
- System health metrics
- Alert generation triggers
```

---

## 6. DATA QUALITY STANDARDS

### 6.1 Data Integrity Rules
```sql
-- Business Logic Constraints
- entry_time < exit_time (logical time flow)
- wait_time_minutes >= 0 (non-negative values)
- satisfaction_rating BETWEEN 1 AND 5
- transaction_amount > 0 for completed transactions
- branch operating hours: 09:00-18:00
```

### 6.2 AI Training Data Quality
```sql
-- Clean Data Requirements
- No NULL values in critical analytics fields
- Consistent date ranges (last 90 days minimum)
- Balanced distribution across all branches
- Realistic business hour constraints
- Proper foreign key relationships
```

---

## 7. BULK DATA GENERATION STRATEGY

### 7.1 Volume Requirements
- **Customer Entries**: 1000+ records (30-90 days)
- **Transactions**: 2000+ records (linked to entries)
- **Staff Records**: 15-20 employees across branches
- **Service Counters**: 3-4 per branch

### 7.2 Realistic Distribution
```sql
-- Branch-wise Distribution
Siruseri (IT Hub): 25% of total footfall
T Nagar (Commercial): 45% of total footfall  
Navalur (Residential): 30% of total footfall

-- Time Distribution
Business Hours: 09:00-18:00 (Mon-Sat)
Peak Hours: 12:00-14:00 (Lunch rush)
Low Hours: 09:00-11:00, 15:00-18:00
```

---

## 8. GENAI INTEGRATION POINTS

### 8.1 Conversation Data Sources
```sql
-- Customer Interaction History
- Visit purposes and outcomes
- Satisfaction ratings and feedback
- Service time analysis
- Peak hour patterns

-- Operational Intelligence
- Staff performance metrics
- Branch efficiency comparisons  
- Revenue trend analysis
- Predictive insights
```

### 8.2 AI Query Optimization
```sql
-- Optimized for AI Queries
- Pre-aggregated metrics views
- Time-based partitioning
- Indexed analytical columns
- Cached frequent calculations
```

---

This schema provides a robust foundation for generating realistic banking data that will showcase the full capabilities of your AI-powered analytics dashboard while maintaining data integrity and enabling sophisticated machine learning insights.
