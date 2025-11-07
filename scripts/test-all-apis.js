const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';
const today = new Date().toISOString().split('T')[0];
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const endpoints = [
  // Branch Management
  { method: 'GET', url: '/branches', name: 'Get All Branches' },
  { method: 'GET', url: '/branches/active', name: 'Get Active Branches' },
  { method: 'GET', url: '/branches/1', name: 'Get Branch by ID' },
  { method: 'GET', url: '/branches/count', name: 'Get Branch Count' },
  { method: 'POST', url: '/branches', name: 'Create Branch', data: {
    branchCode: 'TEST001',
    branchName: 'Test Branch',
    addressLine1: '123 Test St',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    openingTime: '09:00:00',
    closingTime: '18:00:00'
  }},
  
  // Customer Entries
  { method: 'GET', url: '/entries', name: 'Get All Entries' },
  { method: 'GET', url: '/entries/branch/1', name: 'Get Entries by Branch' },
  { method: 'GET', url: `/entries/date/${today}`, name: 'Get Entries by Date' },
  { method: 'GET', url: `/entries/date-range?startDate=${weekAgo}&endDate=${today}`, name: 'Get Entries by Date Range' },
  { method: 'GET', url: `/entries/analytics/satisfaction/1`, name: 'Get Satisfaction by Branch' },
  { method: 'GET', url: `/entries/analytics/count/1?date=${today}`, name: 'Get Daily Count' },
  { method: 'GET', url: `/entries/analytics/footfall?startDate=${weekAgo}&endDate=${today}`, name: 'Get Footfall Analytics' },
  { method: 'POST', url: '/entries', name: 'Create Entry', data: {
    entryDate: today,
    entryTime: '10:00:00',
    customerType: 'REGULAR',
    visitPurpose: 'Test Visit',
    branch: { branchId: 1 }
  }},
  
  // Staff Management
  { method: 'GET', url: '/staff', name: 'Get All Staff' },
  { method: 'GET', url: '/staff/branch/1', name: 'Get Staff by Branch' },
  { method: 'GET', url: '/staff/branch/1/active', name: 'Get Active Staff by Branch' },
  { method: 'GET', url: '/staff/analytics/count/1', name: 'Get Active Staff Count' },
  { method: 'POST', url: '/staff', name: 'Create Staff', data: {
    employeeCode: 'TEST001',
    fullName: 'Test Employee',
    role: 'Teller',
    hireDate: today,
    branch: { branchId: 1 }
  }},
  
  // Transactions
  { method: 'GET', url: '/transactions', name: 'Get All Transactions' },
  { method: 'GET', url: '/transactions/branch/1', name: 'Get Transactions by Branch' },
  { method: 'GET', url: `/transactions/branch/1/date-range?startDate=${weekAgo}&endDate=${today}`, name: 'Get Transactions by Date Range' },
  { method: 'GET', url: '/transactions/analytics/count/1', name: 'Get Transaction Count' },
  { method: 'GET', url: '/transactions/analytics/amount/1', name: 'Get Transaction Amount' },
  { method: 'POST', url: '/transactions', name: 'Create Transaction', data: {
    transactionDate: today,
    transactionTime: '11:00:00',
    serviceType: 'Test Service',
    transactionAmount: 10000,
    branch: { branchId: 1 }
  }},
  
  // Analytics
  { method: 'GET', url: `/analytics/dashboard/metrics?branchId=1&startDate=${weekAgo}&endDate=${today}`, name: 'Get Dashboard Metrics' },
  { method: 'GET', url: `/analytics/footfall-trends?startDate=${weekAgo}&endDate=${today}`, name: 'Get Footfall Trends' },
  { method: 'GET', url: `/analytics/peak-hours/1?startDate=${weekAgo}&endDate=${today}`, name: 'Get Peak Hours' },
  { method: 'GET', url: `/analytics/branch-comparison?startDate=${weekAgo}&endDate=${today}`, name: 'Get Branch Comparison' },
  { method: 'GET', url: `/analytics/service-utilization/1?startDate=${weekAgo}&endDate=${today}`, name: 'Get Service Utilization' },
  
  // Dashboard
  { method: 'GET', url: '/dashboard/real-time-stats', name: 'Get Real-time Stats' },
  { method: 'GET', url: '/dashboard/alerts', name: 'Get Dashboard Alerts' },
  { method: 'GET', url: '/dashboard/summary/1', name: 'Get Branch Summary' }
];

async function testEndpoint(endpoint) {
  try {
    const config = {
      method: endpoint.method,
      url: `${BASE_URL}${endpoint.url}`,
      timeout: 5000
    };
    
    if (endpoint.data) {
      config.data = endpoint.data;
      config.headers = { 'Content-Type': 'application/json' };
    }
    
    const response = await axios(config);
    
    const dataType = Array.isArray(response.data) ? 'Array' : typeof response.data;
    const count = Array.isArray(response.data) ? response.data.length : 
                  response.data && typeof response.data === 'object' ? Object.keys(response.data).length : 1;
    
    console.log(`✅ ${endpoint.name}: ${response.status} | ${dataType}(${count})`);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    console.log(`❌ ${endpoint.name}: ${error.response?.status || 'ERROR'} | ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAllEndpoints() {
  console.log('🚀 Testing HDFC Branch Analytics API Endpoints\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result.success) passed++;
    else failed++;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed (${Math.round(passed/(passed+failed)*100)}% success)`);
  
  if (failed === 0) {
    console.log('🎉 All endpoints are working with dynamic data!');
  }
}

testAllEndpoints().catch(console.error);