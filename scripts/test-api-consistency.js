// Test script to verify API consistency between dashboard metrics and footfall trends
const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

async function testAPIConsistency() {
    try {
        // Use the same date range for both APIs
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        console.log(`Testing API consistency for date range: ${startDate} to ${endDate}`);
        console.log('='.repeat(60));
        
        // Test 1: Dashboard Metrics API (all branches)
        console.log('🔍 Testing Dashboard Metrics API...');
        const metricsResponse = await axios.get(`${BASE_URL}/analytics/dashboard/metrics`, {
            params: { startDate, endDate }
        });
        
        const totalFootfallFromMetrics = metricsResponse.data.totalFootfall;
        console.log(`📊 Dashboard Metrics API - Total Footfall: ${totalFootfallFromMetrics}`);
        
        // Test 2: Footfall Trends API
        console.log('\n🔍 Testing Footfall Trends API...');
        const trendsResponse = await axios.get(`${BASE_URL}/analytics/footfall-trends`, {
            params: { startDate, endDate }
        });
        
        // Calculate total footfall from trends data
        const trendsData = trendsResponse.data;
        const totalFootfallFromTrends = trendsData.reduce((sum, day) => sum + (day.total || 0), 0);
        
        console.log(`📈 Footfall Trends API - Total Footfall: ${totalFootfallFromTrends}`);
        console.log(`📈 Footfall Trends API - Number of days: ${trendsData.length}`);
        console.log(`📈 Footfall Trends API - Sample day:`, trendsData[0]);
        
        // Compare results
        console.log('\n' + '='.repeat(60));
        console.log('🔍 COMPARISON RESULTS:');
        console.log(`Dashboard Metrics API: ${totalFootfallFromMetrics}`);
        console.log(`Footfall Trends API:   ${totalFootfallFromTrends}`);
        console.log(`Difference:           ${Math.abs(totalFootfallFromMetrics - totalFootfallFromTrends)}`);
        console.log(`Match:                ${totalFootfallFromMetrics === totalFootfallFromTrends ? '✅ YES' : '❌ NO'}`);
        
        if (totalFootfallFromMetrics !== totalFootfallFromTrends) {
            console.log('\n⚠️  ISSUE DETECTED: APIs returning different total footfall values!');
            console.log('This explains why the dashboard metrics and chart don\'t match.');
        } else {
            console.log('\n✅ SUCCESS: APIs are consistent!');
        }
        
    } catch (error) {
        console.error('❌ Error testing APIs:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testAPIConsistency();
