const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

async function checkData() {
  try {
    console.log('🔍 Checking database data...\n');
    
    // Check branches
    const branches = await axios.get(`${BASE_URL}/branches`);
    console.log(`✅ Branches: ${branches.data.length} records`);
    
    // Check if we have any customer entries
    try {
      const entries = await axios.get(`${BASE_URL}/entries`);
      console.log(`✅ Customer Entries: ${entries.data.length} records`);
    } catch (e) {
      console.log(`❌ Customer Entries: ERROR - ${e.response?.data?.message || e.message}`);
    }
    
    // Check if we have any staff
    try {
      const staff = await axios.get(`${BASE_URL}/staff`);
      console.log(`✅ Staff: ${staff.data.length} records`);
    } catch (e) {
      console.log(`❌ Staff: ERROR - ${e.response?.data?.message || e.message}`);
    }
    
    // Check if we have any transactions
    try {
      const transactions = await axios.get(`${BASE_URL}/transactions`);
      console.log(`✅ Transactions: ${transactions.data.length} records`);
    } catch (e) {
      console.log(`❌ Transactions: ERROR - ${e.response?.data?.message || e.message}`);
    }
    
  } catch (error) {
    console.error('Error checking data:', error.message);
  }
}

checkData();