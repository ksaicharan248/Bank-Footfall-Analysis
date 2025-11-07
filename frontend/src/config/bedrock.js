// Amazon Bedrock Configuration
// Note: In production, use environment variables for sensitive data

export const BEDROCK_CONFIG = {
  model: 'amazon.nova-pro-v1:0',
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  apiKey: import.meta.env.VITE_BEDROCK_API_KEY || 'bedrock-api-key-', // Replace with your actual API key
  endpoint: import.meta.env.VITE_BEDROCK_ENDPOINT || 'https://bedrock-runtime.us-east-1.amazonaws.com',
  maxTokens: 500,
  temperature: 0.7,
  topP: 0.9
};

// Banking Analytics Context for AI Assistant
export const BANKING_CONTEXT = {
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
