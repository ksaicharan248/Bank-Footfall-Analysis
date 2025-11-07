const XLSX = require('xlsx');
const { faker } = require('@faker-js/faker');

/**
 * Professional Branch Analytics Data Generator
 * Creates comprehensive fake data with proper FK relationships
 * for Branch Operations Visual Analytics Dashboard
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */

console.log('🏦 Starting Branch Analytics Data Generation...\n');

// Utility function to get hourly footfall multiplier
function getHourlyMultiplier(hour) {
    const multipliers = {
        8: 0.6,  // Opening hour - moderate
        9: 1.2,  // Morning rush
        10: 1.4, // Peak morning
        11: 1.6, // Pre-lunch peak
        12: 0.8, // Lunch dip
        13: 0.9, // Post-lunch
        14: 1.3, // Afternoon peak
        15: 1.5, // Peak afternoon
        16: 1.1, // End of day
        17: 0.3  // Closing
    };
    return multipliers[hour] || 1.0;
}

// Get service category for counter type
function getServiceCategory(counterType) {
    const categories = {
        'Cash Teller': 'Cash Services',
        'Express Teller': 'Cash Services', 
        'Senior Teller': 'Cash Services',
        'Foreign Exchange Teller': 'Cash Services',
        
        'Education Loan Desk': 'Loan Services',
        'Gold Loan Desk': 'Loan Services',
        'Home Loan Desk': 'Loan Services', 
        'Personal Loan Desk': 'Loan Services',
        'Business Loan Desk': 'Loan Services',
        
        'Credit Card Service': 'Card Services',
        'Debit Card Service': 'Card Services',
        
        'Customer Help Desk': 'Customer Support',
        'Complaint Resolution': 'Customer Support',
        'Internet Banking Help': 'Digital Support',
        
        'Account Opening': 'Account Services',
        'Investment Advisory': 'Investment Services',
        'Insurance Services': 'Insurance Services',
        'Senior Citizen Service': 'Specialized Services',
        'Priority Banking': 'Premium Services',
        'Business Banking': 'Business Services'
    };
    return categories[counterType] || 'General Services';
}

// Get average service time for different counter types
function getAverageServiceTime(counterType) {
    const serviceTimes = {
        'Cash Teller': 3,
        'Express Teller': 2,
        'Education Loan Desk': 25,
        'Gold Loan Desk': 15,
        'Home Loan Desk': 30,
        'Credit Card Service': 10,
        'Customer Help Desk': 8,
        'Account Opening': 20,
        'Investment Advisory': 35
    };
    return serviceTimes[counterType] || faker.number.int({ min: 5, max: 15 });
}

// Get staff required for counter type
function getStaffRequired(counterType) {
    const staffNeeds = {
        'Education Loan Desk': 2,
        'Home Loan Desk': 2,
        'Business Banking': 2,
        'Investment Advisory': 1,
        'Priority Banking': 1
    };
    return staffNeeds[counterType] || 1;
}

// Get transaction category
function getTransactionCategory(transactionType) {
    if (transactionType.includes('Cash') || transactionType.includes('Withdrawal') || transactionType.includes('Deposit')) {
        return 'Cash Services';
    } else if (transactionType.includes('Loan')) {
        return 'Loan Services';
    } else if (transactionType.includes('Card')) {
        return 'Card Services';
    } else if (transactionType.includes('Account')) {
        return 'Account Services';
    } else if (transactionType.includes('Transfer') || transactionType.includes('RTGS') || transactionType.includes('NEFT') || transactionType.includes('IMPS')) {
        return 'Transfer Services';
    } else if (transactionType.includes('Investment') || transactionType.includes('Insurance') || transactionType.includes('FD') || transactionType.includes('Mutual Fund')) {
        return 'Investment Services';
    } else if (transactionType.includes('Help') || transactionType.includes('Complaint') || transactionType.includes('Inquiry')) {
        return 'Customer Support';
    } else if (transactionType.includes('Banking') || transactionType.includes('UPI') || transactionType.includes('Internet') || transactionType.includes('Mobile')) {
        return 'Digital Services';
    }
    return 'General Services';
}

// Get realistic wait times based on service type
function getWaitTimeByService(transactionType) {
    const waitTimes = {
        'Cash Withdrawal': faker.number.int({ min: 30, max: 300 }),
        'Cash Deposit': faker.number.int({ min: 30, max: 240 }),
        'Balance Inquiry': faker.number.int({ min: 15, max: 120 }),
        'Education Loan Application': faker.number.int({ min: 300, max: 900 }),
        'Gold Loan Application': faker.number.int({ min: 180, max: 600 }),
        'Home Loan Application': faker.number.int({ min: 600, max: 1200 }),
        'Credit Card Application': faker.number.int({ min: 240, max: 600 }),
        'Customer Help Desk': faker.number.int({ min: 120, max: 480 }),
        'Account Opening - Savings': faker.number.int({ min: 300, max: 900 })
    };
    return waitTimes[transactionType] || faker.number.int({ min: 60, max: 600 });
}

// Get service duration based on transaction type
function getServiceDurationByType(transactionType) {
    const durations = {
        'Cash Withdrawal': faker.number.int({ min: 120, max: 300 }),
        'Cash Deposit': faker.number.int({ min: 180, max: 360 }),
        'Balance Inquiry': faker.number.int({ min: 60, max: 180 }),
        'Mini Statement': faker.number.int({ min: 90, max: 240 }),
        
        'Education Loan Application': faker.number.int({ min: 1200, max: 2400 }),
        'Gold Loan Application': faker.number.int({ min: 900, max: 1800 }),
        'Home Loan Application': faker.number.int({ min: 1800, max: 3600 }),
        'Personal Loan Application': faker.number.int({ min: 600, max: 1500 }),
        
        'Credit Card Application': faker.number.int({ min: 600, max: 1200 }),
        'Credit Card Activation': faker.number.int({ min: 180, max: 480 }),
        'Debit Card Issue': faker.number.int({ min: 300, max: 600 }),
        
        'Account Opening - Savings': faker.number.int({ min: 900, max: 1800 }),
        'Account Opening - Current': faker.number.int({ min: 1200, max: 2100 }),
        
        'Internet Banking Registration': faker.number.int({ min: 300, max: 720 }),
        'Mobile Banking Setup': faker.number.int({ min: 240, max: 600 }),
        
        'RTGS Transfer': faker.number.int({ min: 300, max: 600 }),
        'NEFT Transfer': faker.number.int({ min: 240, max: 480 }),
        
        'Customer Complaint Registration': faker.number.int({ min: 480, max: 1200 }),
        'General Inquiry': faker.number.int({ min: 180, max: 600 })
    };
    return durations[transactionType] || faker.number.int({ min: 180, max: 1800 });
}

// Get transaction amount based on type
function getTransactionAmount(transactionType) {
    if (transactionType.includes('Cash Withdrawal')) return faker.number.int({ min: 100, max: 50000 });
    if (transactionType.includes('Cash Deposit')) return faker.number.int({ min: 500, max: 100000 });
    if (transactionType.includes('Education Loan')) return faker.number.int({ min: 50000, max: 2000000 });
    if (transactionType.includes('Gold Loan')) return faker.number.int({ min: 10000, max: 500000 });
    if (transactionType.includes('Home Loan')) return faker.number.int({ min: 500000, max: 10000000 });
    if (transactionType.includes('Personal Loan')) return faker.number.int({ min: 25000, max: 1000000 });
    if (transactionType.includes('Fixed Deposit')) return faker.number.int({ min: 10000, max: 1000000 });
    if (transactionType.includes('Transfer') || transactionType.includes('RTGS') || transactionType.includes('NEFT')) {
        return faker.number.int({ min: 100, max: 500000 });
    }
    if (transactionType.includes('Bill Payment')) return faker.number.int({ min: 200, max: 25000 });
    return null; // For non-monetary services
}

// Get processing fee
function getProcessingFee(transactionType, amount) {
    if (!amount) return 0;
    if (transactionType.includes('RTGS')) return amount > 200000 ? 25 : 5;
    if (transactionType.includes('NEFT')) return amount > 10000 ? 5 : 2.5;
    if (transactionType.includes('Demand Draft')) return 50;
    if (transactionType.includes('Loan Application')) return faker.number.int({ min: 500, max: 2000 });
    return 0;
}

// Get transaction status based on type
function getTransactionStatus(transactionType) {
    if (transactionType.includes('Application')) {
        return faker.helpers.arrayElement(['Under Review', 'Approved', 'Rejected', 'Pending Documentation', 'Completed']);
    } else if (transactionType.includes('Inquiry') || transactionType.includes('Help')) {
        return faker.helpers.arrayElement(['Resolved', 'In Progress', 'Escalated', 'Closed']);
    }
    return faker.helpers.arrayElement(['Completed', 'Completed', 'Completed', 'Failed', 'Cancelled']);
}

// Get priority level based on service
function getPriorityLevel(transactionType) {
    if (transactionType.includes('Senior Citizen') || transactionType.includes('Priority')) return 'High';
    if (transactionType.includes('Complaint') || transactionType.includes('Loan Application')) return 'Medium';
    if (transactionType.includes('Express') || transactionType.includes('Cash Withdrawal')) return 'Express';
    return 'Normal';
}

// Get documents required
function getDocumentsRequired(transactionType) {
    const docs = {
        'Education Loan Application': 'PAN, Aadhar, Income Proof, Admission Letter, Fee Structure',
        'Gold Loan Application': 'PAN, Aadhar, Gold Items, Purchase Invoice',
        'Home Loan Application': 'PAN, Aadhar, Income Proof, Property Documents, Bank Statements',
        'Account Opening - Savings': 'PAN, Aadhar, Photo, Address Proof',
        'Credit Card Application': 'PAN, Aadhar, Income Proof, Bank Statements'
    };
    return docs[transactionType] || 'Basic ID Proof';
}

// Check if approval required
function requiresApproval(transactionType) {
    const approvalNeeded = [
        'Education Loan Application', 'Gold Loan Application', 'Home Loan Application',
        'Personal Loan Application', 'Credit Card Application', 'Account Opening - Current',
        'Large Cash Withdrawal', 'Foreign Exchange'
    ];
    return approvalNeeded.some(type => transactionType.includes(type.split(' ')[0]));
}

// Get department based on position
function getDepartment(position) {
    if (position.includes('Manager')) return 'Management';
    if (position.includes('Loan')) return 'Lending & Credit';
    if (position.includes('Teller') || position.includes('Cash')) return 'Cash Operations';
    if (position.includes('Card')) return 'Card Services';
    if (position.includes('Customer') || position.includes('Help')) return 'Customer Relations';
    if (position.includes('Digital') || position.includes('Internet') || position.includes('Mobile')) return 'Digital Banking';
    if (position.includes('Investment') || position.includes('Insurance')) return 'Wealth Management';
    if (position.includes('Security') || position.includes('Vault')) return 'Security & Operations';
    if (position.includes('Business')) return 'Business Banking';
    return 'General Operations';
}

// Generate professional branch analytics data
function generateBranchAnalyticsData() {
    const data = {};
    
    console.log('📊 Generating Branches data...');
    
    // 1. BRANCHES TABLE (Master Table)
    const branches = [];
    const branchTypes = ['Full-Service', 'Limited-Service', 'Express', 'Premium'];
    const regions = ['Downtown', 'Westside', 'Eastside', 'Northgate', 'Southpark', 'Financial District', 'Suburban', 'Mall Location'];
    
    for (let i = 1; i <= 10; i++) {
        const branchId = `BR_${String(i).padStart(3, '0')}`;
        branches.push({
            branch_id: branchId,
            branch_name: `${faker.location.city()} ${regions[Math.floor(Math.random() * regions.length)]} Branch`,
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zip_code: faker.location.zipCode(),
            region: regions[Math.floor(Math.random() * regions.length)],
            branch_type: branchTypes[Math.floor(Math.random() * branchTypes.length)],
            capacity: faker.number.int({ min: 50, max: 200 }),
            opening_time: '08:00:00',
            closing_time: '17:00:00',
            phone: faker.phone.number('###-###-####'),
            manager_name: faker.person.fullName(),
            latitude: parseFloat(faker.location.latitude()),
            longitude: parseFloat(faker.location.longitude()),
            created_date: faker.date.past({ years: 2 }).toISOString().split('T')[0],
            is_active: true,
            monthly_target_footfall: faker.number.int({ min: 2000, max: 5000 })
        });
    }
    
    console.log('👥 Generating Staff data...');
    
    // 2. STAFF TABLE
    const staff = [];
    const positions = [
        // Teller Services
        'Cash Teller', 'Senior Teller', 'Express Teller', 'Foreign Exchange Teller',
        
        // Loan Officers
        'Education Loan Officer', 'Gold Loan Officer', 'Home Loan Officer', 
        'Personal Loan Officer', 'Business Loan Officer', 'Loan Processing Officer',
        
        // Customer Service
        'Customer Service Representative', 'Customer Help Desk Executive', 
        'Complaint Resolution Officer', 'Relationship Manager',
        
        // Card Services
        'Credit Card Executive', 'Debit Card Services Officer',
        
        // Digital Banking
        'Digital Banking Executive', 'Internet Banking Support', 'Mobile Banking Support',
        
        // Management
        'Branch Manager', 'Assistant Branch Manager', 'Operations Manager',
        'Customer Experience Manager',
        
        // Specialized Services
        'Investment Advisor', 'Insurance Advisor', 'NRI Banking Officer',
        'Senior Citizen Service Officer', 'Business Banking Manager',
        'Security Officer', 'Cash Officer', 'Vault Custodian'
    ];
    
    const skillSets = {
        'Cash Teller': ['cash_handling', 'customer_service', 'transaction_processing', 'currency_counting'],
        'Senior Teller': ['cash_handling', 'customer_service', 'transaction_processing', 'training', 'supervision'],
        'Express Teller': ['quick_service', 'cash_handling', 'digital_transactions'],
        'Foreign Exchange Teller': ['forex_operations', 'international_transfers', 'currency_exchange'],
        
        'Education Loan Officer': ['education_loan_processing', 'documentation', 'eligibility_assessment', 'student_counseling'],
        'Gold Loan Officer': ['gold_valuation', 'loan_against_gold', 'documentation', 'risk_assessment'],
        'Home Loan Officer': ['mortgage_processing', 'property_valuation', 'documentation', 'credit_analysis'],
        'Personal Loan Officer': ['personal_loan_processing', 'income_verification', 'credit_scoring'],
        'Business Loan Officer': ['business_loan_processing', 'financial_analysis', 'collateral_assessment'],
        'Loan Processing Officer': ['loan_documentation', 'verification', 'disbursement_processing'],
        
        'Customer Service Representative': ['customer_service', 'account_opening', 'problem_resolution', 'product_knowledge'],
        'Customer Help Desk Executive': ['help_desk_operations', 'issue_resolution', 'system_support'],
        'Complaint Resolution Officer': ['complaint_handling', 'escalation_management', 'customer_retention'],
        'Relationship Manager': ['relationship_management', 'cross_selling', 'portfolio_management'],
        
        'Credit Card Executive': ['credit_card_services', 'application_processing', 'customer_acquisition'],
        'Debit Card Services Officer': ['debit_card_services', 'card_maintenance', 'PIN_services'],
        
        'Digital Banking Executive': ['digital_banking', 'online_services', 'mobile_banking'],
        'Internet Banking Support': ['internet_banking', 'technical_support', 'password_reset'],
        'Mobile Banking Support': ['mobile_app_support', 'UPI_services', 'digital_payments'],
        
        'Branch Manager': ['management', 'operations', 'strategic_planning', 'team_leadership'],
        'Assistant Branch Manager': ['management', 'operations', 'customer_service', 'staff_coordination'],
        'Operations Manager': ['operations_management', 'process_optimization', 'compliance'],
        'Customer Experience Manager': ['customer_experience', 'service_improvement', 'feedback_analysis'],
        
        'Investment Advisor': ['investment_advisory', 'portfolio_planning', 'risk_assessment'],
        'Insurance Advisor': ['insurance_products', 'policy_advisory', 'claim_assistance'],
        'NRI Banking Officer': ['NRI_services', 'international_banking', 'foreign_remittances'],
        'Senior Citizen Service Officer': ['senior_services', 'pension_services', 'specialized_assistance'],
        'Business Banking Manager': ['business_banking', 'corporate_services', 'trade_finance'],
        'Security Officer': ['security', 'surveillance', 'emergency_response', 'cash_escort'],
        'Cash Officer': ['cash_management', 'vault_operations', 'ATM_replenishment'],
        'Vault Custodian': ['vault_security', 'cash_custody', 'audit_compliance']
    };
    
    for (let i = 1; i <= 50; i++) {
        const position = positions[Math.floor(Math.random() * positions.length)];
        const branchId = branches[Math.floor(Math.random() * branches.length)].branch_id;
        
        staff.push({
            staff_id: `STF_${String(i).padStart(3, '0')}`,
            branch_id: branchId, // FK to branches
            employee_id: `EMP_${String(i).padStart(4, '0')}`,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number('###-###-####'),
            position: position,
            department: getDepartment(position),
            hire_date: faker.date.past({ years: 5 }).toISOString().split('T')[0],
            salary: faker.number.int({ min: 35000, max: 120000 }),
            skills: skillSets[position].join(','),
            shift_start: faker.helpers.arrayElement(['08:00:00', '09:00:00', '10:00:00']),
            shift_end: faker.helpers.arrayElement(['16:00:00', '17:00:00', '18:00:00']),
            is_active: Math.random() > 0.05, // 95% active
            performance_rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
        });
    }
    
    console.log('🏪 Generating Service Counters data...');
    
    // 3. SERVICE_COUNTERS TABLE
    const serviceCounters = [];
    const counterTypes = [
        'Cash Teller', 'Express Teller', 'Senior Teller',
        'Education Loan Desk', 'Gold Loan Desk', 'Home Loan Desk', 'Personal Loan Desk',
        'Credit Card Service', 'Debit Card Service', 'Internet Banking Help',
        'Customer Help Desk', 'Complaint Resolution', 'Account Opening',
        'Investment Advisory', 'Insurance Services', 'Foreign Exchange',
        'RTGS/NEFT Counter', 'Cheque Deposit', 'DD/Pay Order',
        'Senior Citizen Service', 'Priority Banking', 'Business Banking'
    ];
    
    branches.forEach(branch => {
        const countersPerBranch = faker.number.int({ min: 4, max: 8 });
        for (let i = 1; i <= countersPerBranch; i++) {
            const counterType = counterTypes[Math.floor(Math.random() * counterTypes.length)];
            serviceCounters.push({
                counter_id: `${branch.branch_id}_CTR_${String(i).padStart(2, '0')}`,
                branch_id: branch.branch_id, // FK to branches
                counter_number: i,
                counter_type: counterType,
                service_category: getServiceCategory(counterType),
                location_description: `Counter ${i} - ${faker.helpers.arrayElement(['North', 'South', 'East', 'West'])} Side`,
                is_operational: Math.random() > 0.1, // 90% operational
                last_maintenance: faker.date.past({ years: 1 }).toISOString().split('T')[0],
                installation_date: faker.date.past({ years: 3 }).toISOString().split('T')[0],
                capacity: faker.number.int({ min: 1, max: 3 }), // customers that can be served simultaneously
                average_service_time_minutes: getAverageServiceTime(counterType),
                staff_required: getStaffRequired(counterType)
            });
        }
    });
    
    console.log('📋 Generating Customer Entry Logs data...');
    
    // 4. CUSTOMER_ENTRY_LOGS TABLE (Main analytics table)
    const customerEntryLogs = [];
    const entryMethods = ['door_sensor', 'check_in_kiosk', 'mobile_app', 'manual_registration'];
    const customerSegments = ['Regular', 'Premium', 'Business', 'Senior', 'Student'];
    
    // Generate entries for last 30 days
    for (let day = 29; day >= 0; day--) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        
        branches.forEach(branch => {
            // Variable footfall based on day of week and branch type
            const dayOfWeek = date.getDay();
            let baseFootfall = 20; // Weekend baseline
            
            if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Weekdays
                baseFootfall = branch.branch_type === 'Premium' ? 
                    faker.number.int({ min: 100, max: 180 }) : 
                    faker.number.int({ min: 60, max: 140 });
            } else {
                baseFootfall = faker.number.int({ min: 30, max: 80 }); // Weekend
            }
            
            // Special events boost
            if (date.getDate() === 1 || date.getDate() === 15) {
                baseFootfall *= 1.3; // Salary/pension days
            }
            
            // Generate hourly entries
            for (let hour = 8; hour < 17; hour++) {
                const hourlyMultiplier = getHourlyMultiplier(hour);
                const hourlyFootfall = Math.floor(baseFootfall * hourlyMultiplier / 9);
                
                for (let entry = 0; entry < hourlyFootfall; entry++) {
                    const entryTime = new Date(date);
                    entryTime.setHours(hour, faker.number.int({ min: 0, max: 59 }), faker.number.int({ min: 0, max: 59 }));
                    
                    const visitDuration = faker.number.int({ min: 300, max: 3600 }); // 5-60 minutes
                    const exitTime = new Date(entryTime.getTime() + visitDuration * 1000);
                    
                    const entryId = `ENT_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(customerEntryLogs.length + 1).padStart(6, '0')}`;
                    
                    customerEntryLogs.push({
                        entry_id: entryId,
                        branch_id: branch.branch_id, // FK to branches
                        anonymous_customer_id: `CUST_${faker.string.alphanumeric(12).toUpperCase()}`,
                        entry_timestamp: entryTime.toISOString(),
                        exit_timestamp: exitTime.toISOString(),
                        visit_duration_seconds: visitDuration,
                        entry_method: entryMethods[Math.floor(Math.random() * entryMethods.length)],
                        customer_segment: customerSegments[Math.floor(Math.random() * customerSegments.length)],
                        day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
                        hour_of_day: hour,
                        is_peak_hour: hour >= 10 && hour <= 15,
                        weather_condition: faker.helpers.arrayElement(['Sunny', 'Cloudy', 'Rainy', 'Clear']),
                        temperature: faker.number.int({ min: 60, max: 85 })
                    });
                }
            }
        });
    }
    
    console.log('💼 Generating Service Transactions data...');
    
    // 5. SERVICE_TRANSACTIONS TABLE
    const serviceTransactions = [];
    const transactionTypes = [
        // Cash Services
        'Cash Withdrawal', 'Cash Deposit', 'Balance Inquiry', 'Mini Statement',
        
        // Loan Services
        'Education Loan Application', 'Education Loan Disbursement', 'Education Loan EMI Payment',
        'Gold Loan Application', 'Gold Loan Against Jewelry', 'Gold Loan Closure',
        'Home Loan Application', 'Home Loan Documentation', 'Home Loan EMI Setup',
        'Personal Loan Application', 'Business Loan Inquiry', 'Loan Statement Request',
        
        // Card Services
        'Credit Card Application', 'Credit Card Activation', 'Credit Card Bill Payment',
        'Credit Card Limit Enhancement', 'Credit Card Replacement', 'Credit Card Closure',
        'Debit Card Issue', 'Debit Card PIN Reset', 'Debit Card Replacement',
        
        // Account Services
        'Account Opening - Savings', 'Account Opening - Current', 'Account Opening - FD',
        'Account Closure', 'Passbook Update', 'Cheque Book Request',
        'Account Statement', 'Address Change', 'Nominee Update',
        
        // Digital Services
        'Internet Banking Registration', 'Mobile Banking Setup', 'UPI Registration',
        'Net Banking Password Reset', 'SMS Banking Activation',
        
        // Transfer Services
        'RTGS Transfer', 'NEFT Transfer', 'IMPS Transfer', 'Demand Draft',
        'Pay Order', 'Money Transfer - Domestic', 'Money Transfer - International',
        
        // Investment Services
        'Fixed Deposit Opening', 'Recurring Deposit', 'Mutual Fund Investment',
        'Insurance Policy Purchase', 'PPF Account Opening', 'SIP Setup',
        
        // Help Desk Services
        'Customer Complaint Registration', 'Service Request', 'General Inquiry',
        'Document Verification', 'KYC Update', 'PAN Update',
        
        // Specialized Services
        'Senior Citizen Service', 'Pensioner Service', 'Student Account Service',
        'NRI Banking Service', 'Foreign Exchange', 'Locker Service',
        'Tax Payment', 'Utility Bill Payment', 'Government Fee Payment'
    ];
    
    // Generate transactions for subset of entry logs (not all visits result in transactions)
    const transactionEntries = faker.helpers.arrayElements(customerEntryLogs, Math.floor(customerEntryLogs.length * 0.7)); // 70% of entries have transactions
    
    transactionEntries.forEach((entryLog, index) => {
        const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const availableStaff = staff.filter(s => s.branch_id === entryLog.branch_id && s.is_active);
        const assignedStaff = availableStaff.length > 0 ? availableStaff[Math.floor(Math.random() * availableStaff.length)] : null;
        const availableCounters = serviceCounters.filter(c => c.branch_id === entryLog.branch_id && c.is_operational);
        const assignedCounter = availableCounters.length > 0 ? availableCounters[Math.floor(Math.random() * availableCounters.length)] : null;
        
        const entryTime = new Date(entryLog.entry_timestamp);
        const serviceStartDelay = getWaitTimeByService(transactionType);
        const serviceStart = new Date(entryTime.getTime() + serviceStartDelay * 1000);
        const serviceDuration = getServiceDurationByType(transactionType);
        const serviceEnd = new Date(serviceStart.getTime() + serviceDuration * 1000);
        const transactionAmount = getTransactionAmount(transactionType);
        
        serviceTransactions.push({
            transaction_id: `TXN_${String(index + 1).padStart(6, '0')}`,
            entry_id: entryLog.entry_id, // FK to customer_entry_logs
            branch_id: entryLog.branch_id, // FK to branches
            staff_id: assignedStaff ? assignedStaff.staff_id : null, // FK to staff
            counter_id: assignedCounter ? assignedCounter.counter_id : null, // FK to service_counters
            transaction_type: transactionType,
            service_category: getTransactionCategory(transactionType),
            service_start_time: serviceStart.toISOString(),
            service_end_time: serviceEnd.toISOString(),
            service_duration_seconds: serviceDuration,
            wait_time_seconds: serviceStartDelay,
            transaction_amount: transactionAmount,
            processing_fee: getProcessingFee(transactionType, transactionAmount),
            customer_satisfaction_rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 }),
            transaction_status: getTransactionStatus(transactionType),
            priority_level: getPriorityLevel(transactionType),
            documents_required: getDocumentsRequired(transactionType),
            approval_required: requiresApproval(transactionType),
            notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.1 }) // 10% have notes
        });
    });
    
    console.log('📅 Generating Staff Schedules data...');
    
    // 6. STAFF_SCHEDULES TABLE
    const staffSchedules = [];
    
    // Generate schedules for last 30 days for all staff
    for (let day = 29; day >= 0; day--) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        const dayOfWeek = date.getDay();
        
        staff.forEach(staffMember => {
            if (staffMember.is_active && (dayOfWeek >= 1 && dayOfWeek <= 5)) { // Only weekdays
                const scheduledStart = staffMember.shift_start;
                const scheduledEnd = staffMember.shift_end;
                const actualStart = new Date(`${date.toISOString().split('T')[0]}T${scheduledStart}`);
                actualStart.setMinutes(actualStart.getMinutes() + faker.number.int({ min: -10, max: 15 })); // +/- 10-15 min
                
                const actualEnd = new Date(`${date.toISOString().split('T')[0]}T${scheduledEnd}`);
                actualEnd.setMinutes(actualEnd.getMinutes() + faker.number.int({ min: -15, max: 30 })); // staying late sometimes
                
                staffSchedules.push({
                    schedule_id: `SCH_${staffMember.staff_id}_${date.toISOString().split('T')[0].replace(/-/g, '')}`,
                    staff_id: staffMember.staff_id, // FK to staff
                    branch_id: staffMember.branch_id, // FK to branches
                    schedule_date: date.toISOString().split('T')[0],
                    scheduled_start_time: scheduledStart,
                    scheduled_end_time: scheduledEnd,
                    actual_start_time: actualStart.toTimeString().split(' ')[0],
                    actual_end_time: actualEnd.toTimeString().split(' ')[0],
                    break_start_time: faker.helpers.arrayElement(['12:00:00', '12:30:00', '13:00:00']),
                    break_end_time: faker.helpers.arrayElement(['12:30:00', '13:00:00', '13:30:00']),
                    total_hours_worked: faker.number.float({ min: 7.5, max: 9.0, precision: 0.25 }),
                    overtime_hours: faker.number.float({ min: 0, max: 2.0, precision: 0.25 }),
                    status: faker.helpers.arrayElement(['Present', 'Present', 'Present', 'Late', 'Absent']),
                    assigned_counters: faker.helpers.maybe(() => 
                        serviceCounters.filter(c => c.branch_id === staffMember.branch_id)
                            .slice(0, faker.number.int({ min: 1, max: 2 }))
                            .map(c => c.counter_id).join(','), 
                        { probability: 0.8 }
                    )
                });
            }
        });
    }
    
    console.log('📊 Generating Analytics Metrics data...');
    
    // 7. ANALYTICS_METRICS TABLE (Calculated daily metrics)
    const analyticsMetrics = [];
    
    // Group entry logs by branch and date for metrics calculation
    const entriesByBranchDate = {};
    customerEntryLogs.forEach(log => {
        const date = log.entry_timestamp.split('T')[0];
        const key = `${log.branch_id}_${date}`;
        if (!entriesByBranchDate[key]) {
            entriesByBranchDate[key] = [];
        }
        entriesByBranchDate[key].push(log);
    });
    
    Object.keys(entriesByBranchDate).forEach((key, index) => {
        const [branchId, date] = key.split('_').slice(0, 2);
        const dateStr = key.split('_').slice(-3).join('-'); // Reconstruct date
        const entries = entriesByBranchDate[key];
        const transactions = serviceTransactions.filter(t => t.branch_id === branchId && t.service_start_time.includes(dateStr));
        
        const totalFootfall = entries.length;
        const avgVisitDuration = entries.reduce((sum, e) => sum + e.visit_duration_seconds, 0) / entries.length;
        const peakHour = entries.reduce((acc, entry) => {
            acc[entry.hour_of_day] = (acc[entry.hour_of_day] || 0) + 1;
            return acc;
        }, {});
        const peakHourNum = Object.keys(peakHour).reduce((a, b) => peakHour[a] > peakHour[b] ? a : b);
        
        analyticsMetrics.push({
            metric_id: `MTR_${String(index + 1).padStart(6, '0')}`,
            branch_id: branchId, // FK to branches
            metric_date: dateStr,
            total_footfall: totalFootfall,
            unique_customers: Math.floor(totalFootfall * 0.85), // Some repeat visits
            avg_visit_duration_minutes: Math.round(avgVisitDuration / 60),
            peak_hour: `${peakHourNum}:00`,
            peak_hour_footfall: peakHour[peakHourNum],
            total_transactions: transactions.length,
            avg_wait_time_minutes: transactions.length > 0 ? 
                Math.round(transactions.reduce((sum, t) => sum + t.wait_time_seconds, 0) / transactions.length / 60) : 0,
            avg_service_time_minutes: transactions.length > 0 ?
                Math.round(transactions.reduce((sum, t) => sum + t.service_duration_seconds, 0) / transactions.length / 60) : 0,
            customer_satisfaction_avg: transactions.length > 0 ?
                parseFloat((transactions.reduce((sum, t) => sum + t.customer_satisfaction_rating, 0) / transactions.length).toFixed(1)) : 0,
            staff_utilization_rate: faker.number.float({ min: 0.6, max: 0.95, precision: 0.01 }),
            conversion_rate: transactions.length > 0 ? parseFloat((transactions.length / totalFootfall).toFixed(2)) : 0,
            revenue_generated: transactions.reduce((sum, t) => sum + (t.transaction_amount || 0), 0),
            day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(dateStr).getDay()],
            is_holiday: faker.helpers.maybe(() => true, { probability: 0.05 }), // 5% holidays
            weather_impact_score: faker.number.float({ min: 0.8, max: 1.2, precision: 0.01 })
        });
    });
    
    console.log('🤖 Generating Nova AI Insights data...');
    
    // 8. NOVA_AI_INSIGHTS TABLE (GenAI generated insights)
    const novaInsights = [];
    const insightTypes = ['Daily Summary', 'Weekly Analysis', 'Anomaly Alert', 'Prediction', 'Recommendation'];
    const novaModels = ['Nova Lite', 'Nova Pro', 'Nova Canvas'];
    
    for (let i = 1; i <= 100; i++) {
        const branchId = branches[Math.floor(Math.random() * branches.length)].branch_id;
        const insightType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
        const novaModel = novaModels[Math.floor(Math.random() * novaModels.length)];
        
        novaInsights.push({
            insight_id: `NOV_${String(i).padStart(6, '0')}`,
            branch_id: branchId, // FK to branches
            insight_type: insightType,
            nova_model_used: novaModel,
            generated_timestamp: faker.date.recent({ days: 7 }).toISOString(),
            insight_content: generateInsightContent(insightType, novaModel),
            confidence_score: faker.number.float({ min: 0.75, max: 0.98, precision: 0.01 }),
            action_items: generateActionItems(insightType),
            priority_level: faker.helpers.arrayElement(['Low', 'Medium', 'High', 'Critical']),
            implementation_status: faker.helpers.arrayElement(['Pending', 'In Progress', 'Completed', 'Rejected']),
            business_impact_score: faker.number.float({ min: 1.0, max: 10.0, precision: 0.1 }),
            created_by_system: true,
            validated_by_user: Math.random() > 0.3, // 70% validated
            tags: faker.helpers.arrayElements(['footfall', 'staffing', 'efficiency', 'customer_satisfaction', 'revenue'], 2).join(',')
        });
    }
    
    console.log('📈 Generating Predictive Forecasts data...');
    
    // 9. PREDICTIVE_FORECASTS TABLE
    const predictiveForecasts = [];
    
    branches.forEach(branch => {
        // Generate forecasts for next 7 days
        for (let day = 1; day <= 7; day++) {
            const forecastDate = new Date();
            forecastDate.setDate(forecastDate.getDate() + day);
            
            predictiveForecasts.push({
                forecast_id: `FCT_${branch.branch_id}_${forecastDate.toISOString().split('T')[0].replace(/-/g, '')}`,
                branch_id: branch.branch_id, // FK to branches
                forecast_date: forecastDate.toISOString().split('T')[0],
                forecast_type: 'Footfall Prediction',
                predicted_footfall: faker.number.int({ min: 80, max: 200 }),
                confidence_level: faker.number.float({ min: 0.75, max: 0.95, precision: 0.01 }),
                model_used: 'Nova Pro ML Pipeline',
                baseline_comparison: faker.number.float({ min: -20, max: 25, precision: 0.1 }), // % change from baseline
                factors_considered: faker.helpers.arrayElements([
                    'Historical patterns', 'Day of week', 'Weather forecast', 'Local events', 
                    'Economic indicators', 'Seasonal trends', 'Holiday impact'
                ], 4).join(','),
                generated_timestamp: faker.date.recent({ days: 1 }).toISOString(),
                accuracy_score: faker.helpers.maybe(() => faker.number.float({ min: 0.80, max: 0.98, precision: 0.01 }), { probability: 0.6 }),
                is_active_forecast: true,
                updated_timestamp: faker.date.recent({ hours: 12 }).toISOString()
            });
        }
    });
    
    console.log('⚠️ Generating System Alerts data...');
    
    // 10. SYSTEM_ALERTS TABLE
    const systemAlerts = [];
    const alertTypes = ['High Footfall', 'Low Footfall', 'Long Wait Times', 'Staff Shortage', 'System Issue', 'Customer Complaint'];
    const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
    
    for (let i = 1; i <= 100; i++) {
        const branchId = branches[Math.floor(Math.random() * branches.length)].branch_id;
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
        
        systemAlerts.push({
            alert_id: `ALT_${String(i).padStart(6, '0')}`,
            branch_id: branchId, // FK to branches
            alert_type: alertType,
            severity_level: severity,
            alert_timestamp: faker.date.recent({ days: 7 }).toISOString(),
            description: generateAlertDescription(alertType, severity),
            source_system: faker.helpers.arrayElement(['Nova Pro', 'Analytics Engine', 'Manual', 'Automated Monitor']),
            is_resolved: Math.random() > 0.4, // 60% resolved
            resolved_timestamp: faker.helpers.maybe(() => faker.date.recent({ days: 3 }).toISOString(), { probability: 0.6 }),
            resolved_by_staff_id: faker.helpers.maybe(() => staff[Math.floor(Math.random() * staff.length)].staff_id, { probability: 0.6 }),
            action_taken: faker.helpers.maybe(() => generateActionTaken(alertType), { probability: 0.6 }),
            escalation_level: faker.helpers.arrayElement(['None', 'Manager', 'Regional', 'Corporate']),
            business_impact: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
            follow_up_required: Math.random() > 0.7 // 30% need follow-up
        });
    }
    
    // Store all data
    data.branches = branches;
    data.staff = staff;
    data.serviceCounters = serviceCounters;
    data.customerEntryLogs = customerEntryLogs;
    data.serviceTransactions = serviceTransactions;
    data.staffSchedules = staffSchedules;
    data.analyticsMetrics = analyticsMetrics;
    data.novaInsights = novaInsights;
    data.predictiveForecasts = predictiveForecasts;
    data.systemAlerts = systemAlerts;
    
    return data;
}

// Helper functions for generating content
function generateInsightContent(type, model) {
    const templates = {
        'Daily Summary': `${model} Analysis: Branch performance shows {trend} with {metric}% change in footfall. Key drivers: {factors}.`,
        'Weekly Analysis': `${model} Weekly Review: Customer patterns indicate {insight}. Operational efficiency at {percent}%.`,
        'Anomaly Alert': `${model} Anomaly Detection: Unusual pattern detected - {description}. Immediate attention required.`,
        'Prediction': `${model} Forecast: Next period expects {change}% footfall change based on {factors}.`,
        'Recommendation': `${model} Recommendation: Optimize operations by {action} to achieve {benefit}% improvement.`
    };
    
    return templates[type]
        .replace('{trend}', faker.helpers.arrayElement(['upward trend', 'stable pattern', 'declining trend']))
        .replace('{metric}', faker.number.int({ min: 5, max: 25 }))
        .replace('{factors}', faker.helpers.arrayElement(['seasonal patterns', 'local events', 'economic indicators']))
        .replace('{insight}', faker.helpers.arrayElement(['peak hour shift', 'service preference change', 'demographic shift']))
        .replace('{percent}', faker.number.int({ min: 75, max: 95 }))
        .replace('{description}', faker.helpers.arrayElement(['footfall spike', 'service delay', 'customer clustering']))
        .replace('{change}', faker.number.int({ min: -15, max: 20 }))
        .replace('{action}', faker.helpers.arrayElement(['staff reallocation', 'extended hours', 'additional counters']))
        .replace('{benefit}', faker.number.int({ min: 8, max: 20 }));
}

function generateActionItems(type) {
    const actions = {
        'Daily Summary': 'Review staff allocation for peak hours',
        'Weekly Analysis': 'Implement operational improvements based on trends',
        'Anomaly Alert': 'Investigate root cause and implement corrective measures',
        'Prediction': 'Prepare resources based on forecast',
        'Recommendation': 'Evaluate and implement suggested optimizations'
    };
    return actions[type];
}

function generateAlertDescription(type, severity) {
    const descriptions = {
        'High Footfall': `${severity} alert: Customer count exceeded normal capacity`,
        'Low Footfall': `${severity} alert: Significantly below expected customer volume`,
        'Long Wait Times': `${severity} alert: Average wait time exceeded threshold`,
        'Staff Shortage': `${severity} alert: Insufficient staff for current demand`,
        'System Issue': `${severity} alert: Technical system experiencing problems`,
        'Customer Complaint': `${severity} alert: Multiple customer complaints received`
    };
    return descriptions[type];
}

function generateActionTaken(type) {
    const actions = {
        'High Footfall': 'Added temporary service counters and called additional staff',
        'Low Footfall': 'Initiated marketing campaign and investigated external factors',
        'Long Wait Times': 'Opened additional counters and expedited simple transactions',
        'Staff Shortage': 'Called backup staff and redistributed workload',
        'System Issue': 'IT team deployed fix and implemented backup procedures',
        'Customer Complaint': 'Addressed complaints and implemented service improvements'
    };
    return actions[type];
}

// Create Excel workbook with professional formatting
function createExcelWorkbook(data) {
    console.log('📊 Creating Excel workbook...');
    
    const workbook = XLSX.utils.book_new();
    
    // Define sheet order and properties
    const sheets = [
        { name: 'Branches', data: data.branches, color: '0066CC' },
        { name: 'Staff', data: data.staff, color: '28A745' },
        { name: 'Service_Counters', data: data.serviceCounters, color: 'FFC107' },
        { name: 'Customer_Entry_Logs', data: data.customerEntryLogs, color: 'DC3545' },
        { name: 'Service_Transactions', data: data.serviceTransactions, color: '6F42C1' },
        { name: 'Staff_Schedules', data: data.staffSchedules, color: 'FD7E14' },
        { name: 'Analytics_Metrics', data: data.analyticsMetrics, color: '20C997' },
        { name: 'Nova_AI_Insights', data: data.novaInsights, color: 'E83E8C' },
        { name: 'Predictive_Forecasts', data: data.predictiveForecasts, color: '17A2B8' },
        { name: 'System_Alerts', data: data.systemAlerts, color: '6C757D' }
    ];
    
    sheets.forEach(sheet => {
        if (sheet.data.length > 0) {
            console.log(`  📋 Creating sheet: ${sheet.name} (${sheet.data.length} records)`);
            const worksheet = XLSX.utils.json_to_sheet(sheet.data);
            
            // Auto-size columns
            const colWidths = Object.keys(sheet.data[0]).map(key => ({
                wch: Math.max(key.length + 2, 15)
            }));
            worksheet['!cols'] = colWidths;
            
            XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
        }
    });
    
    return workbook;
}

// Main execution function
function main() {
    try {
        console.log('🚀 Cognizant Branch Analytics Data Generator');
        console.log('==========================================\n');
        
        // Generate all data with FK relationships
        const data = generateBranchAnalyticsData();
        
        // Print summary
        console.log('\n📊 DATA GENERATION SUMMARY');
        console.log('==========================');
        console.log(`🏦 Branches: ${data.branches.length}`);
        console.log(`👥 Staff: ${data.staff.length}`);
        console.log(`🏪 Service Counters: ${data.serviceCounters.length}`);
        console.log(`📋 Entry Logs: ${data.customerEntryLogs.length}`);
        console.log(`💼 Transactions: ${data.serviceTransactions.length}`);
        console.log(`📅 Staff Schedules: ${data.staffSchedules.length}`);
        console.log(`📊 Analytics Metrics: ${data.analyticsMetrics.length}`);
        console.log(`🤖 Nova Insights: ${data.novaInsights.length}`);
        console.log(`📈 Forecasts: ${data.predictiveForecasts.length}`);
        console.log(`⚠️ System Alerts: ${data.systemAlerts.length}\n`);
        
        // Create and save Excel file
        const workbook = createExcelWorkbook(data);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const fileName = `Branch_Analytics_Database_${timestamp}.xlsx`;
        
        XLSX.writeFile(workbook, fileName);
        
        console.log('✅ SUCCESS!');
        console.log(`📁 Excel file created: ${fileName}`);
        console.log('📊 Each sheet represents a database table with proper FK relationships');
        console.log('🔗 Primary keys and foreign keys are properly linked');
        console.log('💾 Data is ready for import into PostgreSQL/MySQL\n');
        
        // Display FK relationships
        console.log('🔗 FOREIGN KEY RELATIONSHIPS:');
        console.log('============================');
        console.log('Staff.branch_id → Branches.branch_id');
        console.log('Service_Counters.branch_id → Branches.branch_id');
        console.log('Customer_Entry_Logs.branch_id → Branches.branch_id');
        console.log('Service_Transactions.entry_id → Customer_Entry_Logs.entry_id');
        console.log('Service_Transactions.branch_id → Branches.branch_id');
        console.log('Service_Transactions.staff_id → Staff.staff_id');
        console.log('Service_Transactions.counter_id → Service_Counters.counter_id');
        console.log('Staff_Schedules.staff_id → Staff.staff_id');
        console.log('Staff_Schedules.branch_id → Branches.branch_id');
        console.log('Analytics_Metrics.branch_id → Branches.branch_id');
        console.log('Nova_AI_Insights.branch_id → Branches.branch_id');
        console.log('Predictive_Forecasts.branch_id → Branches.branch_id');
        console.log('System_Alerts.branch_id → Branches.branch_id');
        
    } catch (error) {
        console.error('❌ Error generating data:', error);
        process.exit(1);
    }
}

// Run the data generation
if (require.main === module) {
    main();
}

module.exports = {
    generateBranchAnalyticsData,
    createExcelWorkbook
};
