/**
 * Branch Filtering Test Script
 * Tests the complete end-to-end branch filtering functionality
 */

const BASE_URL = 'http://localhost:8080/api/analytics';

// Test utility functions that match our React components
function getBranchId(branchName) {
    const branchMap = { 
        'siruseri': 1, 
        'tnagar': 2, 
        'navalur': 3, 
        'all': null 
    };
    return branchMap[branchName] || null;
}

async function testBranchFiltering() {
    console.log('🧪 Testing Branch Filtering Functionality\n');
    
    const testDate = new Date().toISOString().split('T')[0];
    const branches = ['all', 'siruseri', 'tnagar', 'navalur'];
    
    for (const branch of branches) {
        console.log(`\n📍 Testing branch: ${branch}`);
        console.log('=' .repeat(50));
        
        const branchId = getBranchId(branch);
        console.log(`Branch ID: ${branchId}`);
        
        // Test Peak Hours API
        try {
            const peakHoursUrl = branchId 
                ? `${BASE_URL}/peak-hours?startDate=${testDate}&endDate=${testDate}&branchId=${branchId}`
                : `${BASE_URL}/peak-hours?startDate=${testDate}&endDate=${testDate}`;
            
            console.log(`\n🕐 Peak Hours API: ${peakHoursUrl}`);
            const response1 = await fetch(peakHoursUrl);
            
            if (response1.ok) {
                const data = await response1.json();
                console.log(`✅ Peak Hours: ${data.length} hours returned`);
                console.log(`   Sample: ${data[0]?.hour} - ${data[0]?.visitors} visitors`);
            } else {
                console.log(`❌ Peak Hours failed: ${response1.status}`);
            }
        } catch (error) {
            console.log(`❌ Peak Hours error: ${error.message}`);
        }
        
        // Test Service Utilization API
        try {
            const serviceUtilUrl = branchId 
                ? `${BASE_URL}/service-utilization?startDate=${testDate}&endDate=${testDate}&branchId=${branchId}`
                : `${BASE_URL}/service-utilization?startDate=${testDate}&endDate=${testDate}`;
            
            console.log(`\n🔥 Service Utilization API: ${serviceUtilUrl}`);
            const response2 = await fetch(serviceUtilUrl);
            
            if (response2.ok) {
                const data = await response2.json();
                console.log(`✅ Service Utilization: Data structure returned`);
                console.log(`   Services: ${data.serviceData?.length || 0} rows`);
                console.log(`   Hours: ${data.hourData?.length || 0} columns`);
            } else {
                console.log(`❌ Service Utilization failed: ${response2.status}`);
            }
        } catch (error) {
            console.log(`❌ Service Utilization error: ${error.message}`);
        }
        
        // Test Dashboard Metrics API
        try {
            const metricsUrl = branchId 
                ? `${BASE_URL}/dashboard/metrics?startDate=${testDate}&endDate=${testDate}&branchId=${branchId}`
                : `${BASE_URL}/dashboard/metrics?startDate=${testDate}&endDate=${testDate}`;
            
            console.log(`\n📊 Dashboard Metrics API: ${metricsUrl}`);
            const response3 = await fetch(metricsUrl);
            
            if (response3.ok) {
                const data = await response3.json();
                console.log(`✅ Dashboard Metrics: Retrieved successfully`);
                console.log(`   Footfall: ${data.totalFootfall || 0}`);
                console.log(`   Revenue: $${data.totalRevenue || 0}`);
                console.log(`   Branch: ${data.branchName || 'N/A'}`);
            } else {
                console.log(`❌ Dashboard Metrics failed: ${response3.status}`);
            }
        } catch (error) {
            console.log(`❌ Dashboard Metrics error: ${error.message}`);
        }
    }
    
    console.log('\n🎉 Branch filtering test completed!');
    console.log('\n💡 How to verify in frontend:');
    console.log('1. Open http://localhost:5173');
    console.log('2. Change branch dropdown from "All Branches" to specific branches');
    console.log('3. Verify that Service Heatmap and Peak Hour Analysis show different data');
    console.log('4. Check browser console for API call logs');
}

// Run the test
testBranchFiltering().catch(console.error);
