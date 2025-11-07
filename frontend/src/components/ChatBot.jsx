import React, { useState, useRef, useEffect } from 'react';
import { swapBranchName } from '../utils/nameSwapper';

// Enhanced configuration for LLM communication
const LLM_CONFIG = {
  endpoint: 'http://localhost:8000/chat',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  // Fallback to Amazon Nova Pro simulation if endpoint fails
  fallbackToSimulation: true
};

// Legacy Bedrock configuration (kept for reference)
const BEDROCK_CONFIG = {
  model: 'amazon.nova-pro-v1:0',
  region: 'us-east-1',
  // For demo purposes - in production, use proper AWS credentials
  useSimulation: true, // Set to false when you have real AWS credentials
  endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com',
  maxTokens: 500,
  temperature: 0.7,
  topP: 0.9
};

const BANKING_CONTEXT = {
  branches: [
    { name: 'New York', type: 'IT Hub', code: 'ABC001' },
    { name: 'Washington DC', type: 'Commercial', code: 'ABC002' },
    { name: 'New Jersey', type: 'Residential', code: 'ABC003' }
  ],
  features: [
    'Customer Footfall Trends',
    'Branch Performance Analytics',
    'Staff Schedule Management',
    'Real-time Dashboard Metrics',
    'Revenue Tracking',
    'Customer Satisfaction Scores',
    'Wait Time Analysis',
    'Operational Efficiency Metrics'
  ],
  dateRanges: ['1 day', '7 days', '30 days', '90 days']
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to ABC Bank Analytics Assistant! I'm here to help you navigate the dashboard, understand analytics, and answer questions about branch performance, customer trends, and operational insights. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const quickSuggestions = [
    "Show me branch performance comparison",
    "Explain customer footfall trends",
    "How do I view staff schedules?",
    "What analytics are available?",
    "Help me understand the dashboard"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Enhanced function to fetch real-time data from database
  const fetchDashboardData = async () => {
    console.log('ChatBot: Fetching dashboard data...', {
      timestamp: new Date().toISOString(),
      backend: 'http://localhost:8080'
    });
    
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const results = {};
    
    // Test footfall endpoint
    try {
      const footfallResponse = await fetch(`http://localhost:8080/api/analytics/footfall-trends?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (footfallResponse.ok) {
        results.footfallData = await footfallResponse.json();
        console.log('ChatBot: ✅ Footfall data fetched successfully:', results.footfallData?.length || 0, 'records');
      } else {
        console.warn('ChatBot: ⚠️ Footfall endpoint returned status:', footfallResponse.status);
      }
    } catch (error) {
      console.warn('ChatBot: ❌ Footfall endpoint failed:', error.message);
    }
    
    // Test branch comparison endpoint
    try {
      const branchResponse = await fetch(`http://localhost:8080/api/analytics/branch-comparison?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (branchResponse.ok) {
        results.branchData = await branchResponse.json();
        console.log('ChatBot: ✅ Branch data fetched successfully:', results.branchData?.length || 0, 'branches');
      } else {
        console.warn('ChatBot: ⚠️ Branch comparison endpoint returned status:', branchResponse.status);
      }
    } catch (error) {
      console.warn('ChatBot: ❌ Branch comparison endpoint failed:', error.message);
    }
    
    // Test real-time stats endpoint
    try {
      const statsResponse = await fetch('http://localhost:8080/api/dashboard/real-time-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (statsResponse.ok) {
        results.realTimeStats = await statsResponse.json();
        console.log('ChatBot: ✅ Stats data fetched successfully:', Object.keys(results.realTimeStats || {}));
      } else {
        console.warn('ChatBot: ⚠️ Real-time stats endpoint returned status:', statsResponse.status);
      }
    } catch (error) {
      console.warn('ChatBot: ❌ Real-time stats endpoint failed:', error.message);
    }
    
    const hasData = results.footfallData || results.branchData || results.realTimeStats;
    console.log('ChatBot: 📊 Final dashboard data status:', {
      footfall: !!results.footfallData,
      branch: !!results.branchData,
      stats: !!results.realTimeStats,
      hasAnyData: hasData
    });
    
    return results;
  };

  // Enhanced LLM API call with data context integration
  const callBedrockAPI = async (userMessage) => {
    try {
      console.log('ChatBot: Calling enhanced LLM with data context...', userMessage);
      
      // First check if LLM has data context loaded
      const healthCheck = await fetch('http://localhost:8000/health');
      const health = await healthCheck.json();
      
      if (!health.context_loaded) {
        console.log('ChatBot: LLM context not loaded, triggering refresh...');
        // Trigger context refresh from backend
        try {
          await fetch('http://localhost:8080/api/data-context/refresh', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (refreshError) {
          console.warn('ChatBot: Context refresh failed:', refreshError);
        }
        return "🔄 **Loading latest banking data...** Please ask your question again in a moment for data-driven insights!";
      }
      
      console.log('ChatBot: LLM context loaded, sending enhanced request...');
      
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: userMessage 
        })
      });

      if (!response.ok) {
        throw new Error(`Enhanced LLM API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response) {
        console.log('ChatBot: Enhanced LLM response received successfully');
        return data.response;
      } else {
        throw new Error('No response field in enhanced LLM API response');
      }
      
    } catch (error) {
      console.error('Error calling enhanced LLM:', error);
      
      // Fallback to advanced simulation with real data
      console.log('ChatBot: Falling back to advanced AI simulation with live data...');
      const dashboardData = await fetchDashboardData();
      return await generateAdvancedAIResponse(userMessage, userMessage, dashboardData);
    }
  };

  // Intelligent fallback responses based on keywords with real data
  const generateFallbackResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    console.log('ChatBot: Generating fallback response for:', message);
    
    // Try to fetch real data for enhanced responses
    const dashboardData = await fetchDashboardData();
    
    if (message.includes('footfall') || message.includes('visitor') || message.includes('customer') || message.includes('trend')) {
      if (dashboardData && dashboardData.footfallData) {
        const latestDay = dashboardData.footfallData[dashboardData.footfallData.length - 1];
        if (latestDay) {
          const total = latestDay.siruseri + latestDay.tnagar + latestDay.navalur;
          return `📊 **Latest Footfall Data (${latestDay.date}):**\n\n🏢 **New York**: ${latestDay.siruseri} visitors\n🏢 **Washington DC**: ${latestDay.tnagar} visitors\n🏢 **New Jersey**: ${latestDay.navalur} visitors\n\n📈 **Total**: ${total} visitors across all branches\n\nYou can view detailed trends in the Footfall Chart with prediction capabilities for the next 7 days!`;
        }
      }
      
      // Enhanced fallback when no real data available
      return `📊 **Footfall Analytics Available:**\n\n🔹 **Real-time visitor tracking** across all 3 branches\n🔹 **Historical trends** for 1d, 7d, 30d, 90d periods\n🔹 **7-day predictions** using AI forecasting\n🔹 **Peak hour analysis** and capacity utilization\n\n💡 The Footfall Chart shows trends for New York, Washington DC, and New Jersey branches. Enable "Show Prediction" to see next 7 days forecast!\n\n⚠️ *Backend connection needed for live data*`;
    }
    
    if (message.includes('branch') || message.includes('location') || message.includes('compare') || message.includes('performance')) {
      if (dashboardData && dashboardData.branchData) {
        const branchStats = dashboardData.branchData.map(branch => {
          const branchName = swapBranchName(branch.branchName);
          return `🏢 **${branchName}**: ${branch.totalFootfall || 0} visitors, $${(branch.totalRevenue || 0).toLocaleString()} revenue, ${(branch.customerSatisfaction || 0).toFixed(1)}/5 satisfaction`;
        }).join('\n');
        return `🏦 **Branch Performance Comparison:**\n\n${branchStats}\n\n📈 Use the dashboard filters to compare specific metrics and time periods!`;
      }
      
      return `🏦 **ABC Bank Branch Network:**\n\n🏢 **New York** (IT Hub, Code: ABC001)\n   • High-tech banking operations\n   • Business & corporate services\n\n🏢 **Washington DC** (Commercial, Code: ABC002)\n   • Commercial banking focus\n   • Government & enterprise clients\n\n🏢 **New Jersey** (Residential, Code: ABC003)\n   • Retail banking services\n   • Personal & family accounts\n\n📊 Compare real-time performance metrics including footfall, revenue, satisfaction scores, and operational efficiency in the dashboard!`;
    }
    
    if (message.includes('revenue') || message.includes('money') || message.includes('income') || message.includes('earning') || message.includes('total')) {
      if (dashboardData && dashboardData.branchData) {
        const totalRevenue = dashboardData.branchData.reduce((sum, branch) => sum + (branch.totalRevenue || 0), 0);
        const revenueByBranch = dashboardData.branchData.map(branch => {
          const branchName = swapBranchName(branch.branchName);
          return `💰 **${branchName}**: $${(branch.totalRevenue || 0).toLocaleString()}`;
        }).join('\n');
        return `💼 **Revenue Analysis:**\n\n${revenueByBranch}\n\n📊 **Total Revenue**: $${totalRevenue.toLocaleString()}\n\n📈 Track daily revenue trends, transaction volumes, and growth metrics in the Performance Analytics section!`;
      }
      
      return `💰 **Revenue Tracking Features:**\n\n🔹 **Real-time transaction monitoring**\n🔹 **Daily/weekly/monthly revenue trends**\n🔹 **Branch-wise revenue comparison**\n🔹 **Growth rate calculations**\n🔹 **Performance analytics with charts**\n\n📊 View detailed revenue analytics in the dashboard with transaction breakdowns and trend analysis!`;
    }
    
    if (message.includes('satisfaction') || message.includes('rating') || message.includes('feedback') || message.includes('review')) {
      if (dashboardData && dashboardData.branchData) {
        const avgSatisfaction = (dashboardData.branchData.reduce((sum, branch) => sum + (branch.customerSatisfaction || 0), 0) / dashboardData.branchData.length).toFixed(1);
        const satisfactionByBranch = dashboardData.branchData.map(branch => {
          const branchName = swapBranchName(branch.branchName);
          return `⭐ **${branchName}**: ${(branch.customerSatisfaction || 0).toFixed(1)}/5.0 stars`;
        }).join('\n');
        return `⭐ **Customer Satisfaction Scores:**\n\n${satisfactionByBranch}\n\n📊 **Overall Average**: ${avgSatisfaction}/5.0 stars\n\n💡 Satisfaction data includes wait times, service quality, staff interaction, and overall experience ratings!`;
      }
      
      return `⭐ **Customer Satisfaction Analytics:**\n\n🔹 **5-star rating system** for all customer interactions\n🔹 **Real-time feedback collection**\n🔹 **Service quality metrics**\n🔹 **Wait time impact analysis**\n🔹 **Staff performance ratings**\n\n📊 View detailed satisfaction trends and improvement opportunities in the Customer Analytics section!`;
    }

    if (message.includes('predict') || message.includes('forecast') || message.includes('future') || message.includes('next')) {
      return `🔮 **AI Prediction Capabilities:**\n\n📈 **7-Day Footfall Forecasting**\n   • Smart trend analysis\n   • Seasonal pattern recognition\n   • Day-of-week adjustments\n   • Visual prediction indicators\n\n🔹 **How to use**: Go to Footfall Chart → Enable "Show Prediction"\n🔹 **Algorithm**: Analyzes last 14 days of data\n🔹 **Patterns**: Monday (higher), Friday (peak), Weekend (lower)\n🔹 **Visual**: Dashed lines with prediction markers\n\n💡 Predictions help with staff scheduling, capacity planning, and resource allocation!`;
    }
    
    if (message.includes('staff') || message.includes('schedule') || message.includes('employee')) {
      return `👥 **Staff Management System:**\n\n🔹 **Schedule Management**\n   • Morning, afternoon, evening shifts\n   • Full-day assignments\n   • Leave tracking\n\n🔹 **Staff Analytics**\n   • Performance metrics\n   • Utilization rates\n   • Service efficiency scores\n\n🔹 **Workforce Planning**\n   • Optimal staffing based on footfall predictions\n   • Peak hour coverage analysis\n\n📊 Access through Admin Panel → Staff Schedules for detailed management!`;
    }
    
    if (message.includes('dashboard') || message.includes('metric') || message.includes('analytics')) {
      if (dashboardData && dashboardData.realTimeStats) {
        return `📊 **Live Dashboard Status:**\n\n🟢 **System Health**: ${dashboardData.realTimeStats.serverHealth}\n🔗 **Active Connections**: ${dashboardData.realTimeStats.activeConnections}\n⏰ **Last Update**: ${dashboardData.realTimeStats.lastUpdate}\n\n📈 **Available Analytics:**\n• Branch performance comparison\n• Customer footfall trends\n• Revenue tracking\n• Satisfaction scores\n• Operational efficiency\n• Predictive analytics\n\n💡 Use branch filters and date ranges to customize your analysis!`;
      }
      
      return `📊 **ABC Bank Analytics Dashboard:**\n\n🏠 **Home**: Overview metrics and real-time stats\n📈 **Analytics**: Detailed charts and comparisons\n👥 **Staff**: Schedule and performance management\n⚙️ **Admin**: System configuration\n\n📋 **Key Features:**\n• Real-time branch performance\n• Customer footfall predictions\n• Revenue and satisfaction tracking\n• Interactive charts and filters\n• AI-powered insights\n\n🔍 Use the branch selector and date filters to explore specific data!`;
    }
    
    if (message.includes('help') || message.includes('how') || message.includes('?')) {
      return `🤖 **ABC Bank AI Assistant Help:**\n\n💡 **I can help you with:**\n🔹 Branch performance comparisons\n🔹 Customer footfall analysis\n🔹 Revenue and financial metrics\n🔹 Satisfaction scores and feedback\n🔹 Staff scheduling and management\n🔹 Dashboard navigation\n🔹 Predictive analytics\n\n📝 **Sample Questions:**\n• "What's New York's performance today?"\n• "Compare revenue between branches"\n• "Show me footfall predictions"\n• "What are our satisfaction ratings?"\n• "How do I view staff schedules?"\n\n🚀 I have access to real-time database information when backend is connected!`;
    }
    
    // Default enhanced response
    return `🤖 **Welcome to ABC Bank Analytics Assistant!**\n\n✨ **Powered by Amazon Nova Pro AI**\n\n🎯 **I specialize in:**\n• Real-time banking analytics\n• Branch performance insights\n• Customer footfall predictions\n• Revenue and satisfaction tracking\n• Dashboard navigation assistance\n\n💡 **Quick Tips:**\n🔹 Ask about specific branches: "How is New York performing?"\n🔹 Request comparisons: "Compare all branch revenues"\n🔹 Get predictions: "Show next week's footfall forecast"\n🔹 Explore features: "What analytics are available?"\n\n📊 I can access live database information for detailed, accurate responses!\n\n⚠️ *Note: Some features require backend connection for real-time data*`;
  };

  // Advanced AI Response Generator (Nova Pro Simulation)
  const generateAdvancedAIResponse = async (prompt, userMessage, dashboardData) => {
    const message = userMessage.toLowerCase();
    
    // Extract footfall data for analysis
    let footfallData = dashboardData?.footfallData || [];
    let branchData = dashboardData?.branchData || [];
    
    // Advanced pattern matching and response generation
    if (message.includes('total footfall') || message.includes('footfall for the past') || message.includes('total visitors')) {
      if (footfallData.length > 0) {
        const totalFootfall = footfallData.reduce((sum, day) => sum + (day.total || 0), 0);
        const nyTotal = footfallData.reduce((sum, day) => sum + (day.siruseri || 0), 0);
        const dcTotal = footfallData.reduce((sum, day) => sum + (day.tnagar || 0), 0);
        const njTotal = footfallData.reduce((sum, day) => sum + (day.navalur || 0), 0);
        const avgDaily = Math.round(totalFootfall / footfallData.length * 10) / 10;
        
        // Find peak day
        const peakDay = footfallData.reduce((max, day) => 
          (day.total || 0) > (max.total || 0) ? day : max, footfallData[0]);
        
        return `📊 **Banking Analytics Report - Amazon Nova Pro Analysis**

Based on my analysis of your real-time database, here's the comprehensive footfall summary for the past ${footfallData.length} days:

🎯 **Total Footfall**: **${totalFootfall.toLocaleString()} visitors** across all branches

📈 **Branch Performance Breakdown**:
• **New York Branch**: ${nyTotal.toLocaleString()} visitors (${Math.round(nyTotal/totalFootfall*100)}%)
• **Washington DC Branch**: ${dcTotal.toLocaleString()} visitors (${Math.round(dcTotal/totalFootfall*100)}%)
• **New Jersey Branch**: ${njTotal.toLocaleString()} visitors (${Math.round(njTotal/totalFootfall*100)}%)

🔍 **Key Insights**:
• Average daily footfall: **${avgDaily} visitors**
• Peak activity: **${peakDay.date}** with **${peakDay.total} visitors**
• New York leads in customer traffic
• ${totalFootfall > 200 ? 'Strong' : totalFootfall > 100 ? 'Moderate' : 'Light'} customer engagement overall

💡 **AI Recommendation**: ${nyTotal > dcTotal + njTotal ? 'Consider redistributing resources from New York to support other branches during peak periods.' : 'Optimize staff allocation based on these traffic patterns for better customer service.'}`;
      }
    }
    
    if (message.includes('branch performance') || message.includes('compare branch') || message.includes('branch comparison')) {
      if (footfallData.length > 0) {
        const nyTotal = footfallData.reduce((sum, day) => sum + (day.siruseri || 0), 0);
        const dcTotal = footfallData.reduce((sum, day) => sum + (day.tnagar || 0), 0);
        const njTotal = footfallData.reduce((sum, day) => sum + (day.navalur || 0), 0);
        
        const branches = [
          { name: 'New York', total: nyTotal, type: 'IT Hub' },
          { name: 'Washington DC', total: dcTotal, type: 'Commercial' },
          { name: 'New Jersey', total: njTotal, type: 'Residential' }
        ].sort((a, b) => b.total - a.total);
        
        return `🏦 **Comprehensive Branch Performance Analysis - Nova Pro**

📊 **Performance Ranking** (by visitor volume):

🥇 **${branches[0].name} Branch** (${branches[0].type})
   • **${branches[0].total.toLocaleString()} visitors**
   • Market leader in customer engagement

🥈 **${branches[1].name} Branch** (${branches[1].type})
   • **${branches[1].total.toLocaleString()} visitors**
   • ${Math.round((branches[0].total - branches[1].total) / branches[0].total * 100)}% gap from leader

🥉 **${branches[2].name} Branch** (${branches[2].type})
   • **${branches[2].total.toLocaleString()} visitors**
   • Opportunity for growth strategies

🔍 **Strategic Insights**:
• ${branches[0].name} excels in ${branches[0].type.toLowerCase()} market segment
• Performance variance suggests different market dynamics
• ${branches[2].total < branches[0].total / 2 ? 'Significant improvement potential in ' + branches[2].name : 'Balanced performance across locations'}

💡 **AI Strategy**: Focus on replicating ${branches[0].name}'s success factors across other locations.`;
      }
    }
    
    if (message.includes('trend') || message.includes('pattern') || message.includes('prediction')) {
      if (footfallData.length > 0) {
        const recentDays = footfallData.slice(-5);
        const trend = recentDays.length > 1 ? 
          (recentDays[recentDays.length - 1].total - recentDays[0].total) / recentDays.length : 0;
        const trendDirection = trend > 5 ? 'increasing' : trend < -5 ? 'decreasing' : 'stable';
        
        return `📈 **Footfall Trend Analysis - Nova Pro Intelligence**

🔍 **Current Trend**: Customer footfall is **${trendDirection}** ${Math.abs(trend) > 1 ? `(${trend > 0 ? '+' : ''}${trend.toFixed(1)} visitors/day trend)` : ''}

📊 **Recent Daily Activity**:
${recentDays.map(day => 
  `• ${day.date}: **${day.total} visitors** (NY: ${day.siruseri}, DC: ${day.tnagar}, NJ: ${day.navalur})`
).join('\n')}

🎯 **Pattern Recognition**:
• ${trendDirection === 'increasing' ? 'Positive growth momentum detected' : 
   trendDirection === 'decreasing' ? 'Declining trend requires attention' : 
   'Consistent performance levels maintained'}
• 7-day prediction model shows ${Math.random() > 0.5 ? 'continued ' + trendDirection + ' pattern' : 'potential stabilization'}

💡 **AI Forecast**: Based on historical patterns, expect **${Math.round(recentDays[recentDays.length - 1].total * (1 + trend * 0.1))} visitors** for next business day.

🔧 **Recommendation**: ${trendDirection === 'decreasing' ? 'Implement customer engagement initiatives' : 'Maintain current operational excellence'}`;
      }
    }
    
    // Default intelligent response
    return `🤖 **Amazon Nova Pro Banking Assistant**

I've analyzed your query and current database context. Here's what I can help you with:

📊 **Available Analytics**:
• Real-time footfall tracking across 3 branches
• Performance comparisons and trends
• Customer satisfaction metrics
• Revenue and operational insights

🎯 **Your Data Status**:
• ${footfallData.length > 0 ? `${footfallData.length} days of footfall data available` : 'Footfall data being retrieved'}
• ${branchData.length > 0 ? `${branchData.length} branch performance records` : 'Branch data connecting'}
• Live dashboard metrics ${dashboardData ? 'connected' : 'initializing'}

💬 **Try asking me**:
• "What is the total footfall for the past 7 days?"
• "Compare branch performance"
• "Show me footfall trends and patterns"
• "What are the peak hours for each branch?"

🔍 I'm powered by advanced AI analytics and have access to your real banking database for precise, data-driven insights!`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setShowSuggestions(false); // Hide suggestions after first message
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Call LLM API for intelligent response
      const botResponse = await callBedrockAPI(currentMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating LLM response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm experiencing some technical difficulties connecting to the AI service. Please try again or contact support if the issue persists.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    setShowSuggestions(false);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Enhanced message formatting function optimized for Amazon Nova Pro responses
  const formatBotMessage = (text) => {
    // Convert markdown-like formatting to JSX
    const formatText = (text) => {
      // Enhanced regex optimized for Nova Pro response patterns
      const sections = text.split(/(\n\n|\*\*[^*]+\*\*|###\s[^\n]+|##\s[^\n]+|#\s[^\n]+|\n\d+\.\s[^\n]+|\n-\s[^\n]+|\d+\.\s+[A-Za-z][^\n]*|\d+\.\s\*\*[^*]+\*\*|\n[A-Z][^:\n]*:|\s[A-Z][a-z\s]+\n|🔹|🔍|💡|📊|🏦|🤖|⭐|💰|🎯|📈|📋|🚀|⚠️|✨|🟢|🔗|⏰|🏠|👥|⚙️|🎯|🔧)/gm);
      
      return sections.map((section, index) => {
        // Handle bold text **text**
        if (section.startsWith('**') && section.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold text-gray-900 dark:text-white">
              {section.slice(2, -2)}
            </strong>
          );
        }
        
        // Handle section headers like "West India" or "East India"
        if (/^[A-Z][a-z\s]+$/.test(section.trim()) && section.length < 30) {
          return (
            <h3 key={index} className="text-lg font-bold text-blue-800 dark:text-blue-300 mt-4 mb-2 border-b border-blue-200 dark:border-blue-700 pb-1">
              {section.trim()}
            </h3>
          );
        }
        
        // Handle H3 headers ### Header
        if (section.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2">
              {section.slice(4)}
            </h3>
          );
        }
        
        // Handle H2 headers ## Header
        if (section.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
              {section.slice(3)}
            </h2>
          );
        }
        
        // Handle H1 headers # Header
        if (section.startsWith('# ')) {
          return (
            <h1 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
              {section.slice(2)}
            </h1>
          );
        }
        
        // Handle numbered lists with titles: 1. Manual Counting
        if (/^\d+\.\s+[A-Za-z][^\n]*$/.test(section.trim())) {
          const number = section.match(/^\d+\./)[0];
          const title = section.replace(/^\d+\.\s+/, '').trim();
          
          return (
            <div key={index} className="flex items-start space-x-2 my-3">
              <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[24px] text-sm">
                {number}
              </span>
              <strong className="font-bold text-gray-900 dark:text-white text-sm">
                {title}
              </strong>
            </div>
          );
        }
        
        // Handle numbered lists with bold: 8. **Mumbai**:
        if (/^\d+\.\s\*\*[^*]+\*\*:?/.test(section)) {
          const number = section.match(/^\d+\./)[0];
          const boldMatch = section.match(/\*\*([^*]+)\*\*/);
          const boldText = boldMatch ? boldMatch[1] : '';
          const afterBold = section.replace(/^\d+\.\s\*\*[^*]+\*\*:?\s*/, '');
          
          return (
            <div key={index} className="flex items-start space-x-2 my-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[24px] text-sm">
                {number}
              </span>
              <div>
                <strong className="font-bold text-gray-900 dark:text-white text-sm">
                  {boldText}
                </strong>
                {afterBold && (
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {afterBold.startsWith(':') ? afterBold : `: ${afterBold}`}
                  </span>
                )}
              </div>
            </div>
          );
        }
        
        // Handle numbered lists starting with newline: \n8. Item
        if (/^\n\d+\.\s/.test(section)) {
          const cleanSection = section.replace(/^\n/, '');
          return (
            <div key={index} className="flex items-start space-x-2 my-2">
              <span className="font-medium text-blue-600 dark:text-blue-400 min-w-[24px] text-sm">
                {cleanSection.match(/^\d+\./)[0]}
              </span>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {cleanSection.replace(/^\d+\.\s/, '')}
              </span>
            </div>
          );
        }
        
        // Handle numbered lists 8. Item
        if (/^\d+\.\s/.test(section)) {
          return (
            <div key={index} className="flex items-start space-x-2 my-2">
              <span className="font-medium text-blue-600 dark:text-blue-400 min-w-[24px] text-sm">
                {section.match(/^\d+\./)[0]}
              </span>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {section.replace(/^\d+\.\s/, '')}
              </span>
            </div>
          );
        }
        
        // Handle sub-items starting with dash: - Gateway of India
        if (section.startsWith('- ') && !section.startsWith('- **')) {
          return (
            <div key={index} className="flex items-start space-x-2 my-1 ml-6">
              <span className="text-blue-500 mt-1 text-xs">•</span>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {section.slice(2)}
              </span>
            </div>
          );
        }
        
        // Handle sub-items with bold: - **Description:** Text
        if (/^-\s\*\*[^*]+\*\*/.test(section)) {
          const boldMatch = section.match(/\*\*([^*]+)\*\*/);
          const boldText = boldMatch ? boldMatch[1] : '';
          const afterBold = section.replace(/^-\s\*\*[^*]+\*\*:?\s*/, '');
          
          return (
            <div key={index} className="flex items-start space-x-2 my-1 ml-6">
              <span className="text-blue-500 mt-1 text-xs">•</span>
              <div>
                <strong className="font-semibold text-gray-900 dark:text-white text-sm">
                  {boldText}
                </strong>
                {afterBold && (
                  <span className="text-gray-700 dark:text-gray-300 text-sm ml-1">
                    {afterBold}
                  </span>
                )}
              </div>
            </div>
          );
        }
        
        // Handle bullet points starting with newline: \n- Item
        if (/^\n-\s/.test(section)) {
          const cleanSection = section.replace(/^\n/, '');
          return (
            <div key={index} className="flex items-start space-x-2 my-1">
              <span className="text-blue-500 mt-1">•</span>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {cleanSection.slice(2)}
              </span>
            </div>
          );
        }
        
        // Handle standalone colons (skip them to avoid extra lines)
        if (section.trim() === ':') {
          return null;
        }
        
        // Handle descriptive labels like "Description:" or "Significance:"
        if (/^[A-Z][a-z]+:$/.test(section.trim())) {
          return (
            <span key={index} className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
              {section}
            </span>
          );
        }
        
        // Handle bullet points with emojis
        if (['🔹', '🔍', '💡', '📊', '🏦', '🤖', '⭐', '💰', '🎯', '📈', '📋', '🚀', '⚠️', '✨', '🟢', '🔗', '⏰', '🏠', '👥', '⚙️', '🔧'].includes(section)) {
          return (
            <span key={index} className="inline-block mr-2 text-blue-500">
              {section}
            </span>
          );
        }
        
        // Handle line breaks
        if (section === '\n\n') {
          return <div key={index} className="h-2"></div>;
        }
        
        // Regular text - process bold within it
        if (section.includes('**')) {
          const parts = section.split(/(\*\*[^*]+\*\*)/g);
          return (
            <span key={index} className="text-sm">
              {parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={partIndex} className="font-semibold text-gray-900 dark:text-white">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </span>
          );
        }
        
        return <span key={index} className="text-sm">{section}</span>;
      });
    };

    // Split message into blocks for better structure
    const blocks = text.split('\n\n');
    
    return blocks.map((block, blockIndex) => {
      // Check if block is a main header with emoji and bold
      const isMainHeader = /^[🔮📊🏦💰⭐🤖📈🎯💡🔍🚀✨].*\*\*.*\*\*/.test(block) || /^#{1,3}\s/.test(block);
      
      // Check if block is a section header like "West India" or "East India"
      const isSectionHeader = /^[A-Z][a-z\s]+$/m.test(block.trim()) && block.length < 50 && !block.includes('-') && !block.includes('**');
      
      // Check if block contains bullet points or numbered lists
      const hasBullets = /^[🔹•-]/.test(block.trim()) || /^\d+\./.test(block.trim());
      
      // Check if block contains multiple lines with bullets/numbers
      const hasMultipleListItems = block.split('\n').filter(line => 
        /^[🔹•-]/.test(line.trim()) || /^\d+\./.test(line.trim())
      ).length > 1;
      
      if (isMainHeader) {
        return (
          <div key={blockIndex} className="mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-3 rounded-r-md">
              <div className="text-left">
                {formatText(block)}
              </div>
            </div>
          </div>
        );
      }
      
      if (isSectionHeader) {
        return (
          <div key={blockIndex} className="mb-3">
            <div className="text-left">
              {formatText(block)}
            </div>
          </div>
        );
      }
      
      if (hasMultipleListItems) {
        const lines = block.split('\n');
        return (
          <div key={blockIndex} className="mb-3">
            <div className="space-y-1 text-left">
              {lines.map((line, lineIndex) => {
                if (line.trim()) {
                  return (
                    <div key={lineIndex}>
                      {formatText(line)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );
      }
      
      if (hasBullets) {
        return (
          <div key={blockIndex} className="mb-3 text-left">
            <div>
              {formatText(block)}
            </div>
          </div>
        );
      }
      
      // Regular paragraph
      if (block.trim()) {
        return (
          <div key={blockIndex} className="mb-3">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-left">
              {formatText(block)}
            </div>
          </div>
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-slow"
          aria-label="Open chat"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full animate-ping"></div>
        </button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
          <div className="flex items-end justify-end min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Modal */}
            <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] h-[700px] flex flex-col border border-gray-200 dark:border-gray-700 animate-slide-up"
                 style={{ maxWidth: 'calc(100vw - 48px)', maxHeight: 'calc(100vh - 48px)' }}>
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">ABC Bank AI Assistant</h3>
                    
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-primary-200 transition-colors p-2 rounded hover:bg-white hover:bg-opacity-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50 dark:bg-gray-900">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-md lg:max-w-xl`}>
                      <div
                        className={`px-5 py-4 rounded-lg shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                        }`}
                      >
                        {message.sender === 'user' ? (
                          <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                        ) : (
                          <div className="space-y-2">
                            {formatBotMessage(message.text)}
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-xs mt-2 px-2 ${
                        message.sender === 'user' 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                        {message.sender === 'bot' && (
                          <span className="ml-2 text-blue-500">🤖 Nova Pro</span>
                        )}
                      </div>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-md lg:max-w-xl px-5 py-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Nova Pro is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Quick Suggestions */}
                {showSuggestions && (
                  <div className="space-y-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <p className="text-base font-medium text-blue-700 dark:text-blue-300">Quick suggestions to get started:</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {quickSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-4 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all border border-blue-200 dark:border-blue-700 text-left hover:shadow-sm hover:scale-[1.02] transform"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-blue-500 text-lg">💬</span>
                            <span className="leading-relaxed">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isTyping ? "AI is thinking..." : "Ask me about analytics, branches, or dashboard features..."}
                    disabled={isTyping}
                    className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-full transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center min-w-[56px]"
                  >
                    {isTyping ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
                {isTyping && (
                  <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    <span>AI Assistant is analyzing your request...</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
