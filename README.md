# 🏦 Banking Branch Analytics & AI Assistant Platform

## 🎯 Project Purpose & Business Solution

### The Challenge
A major banking institution needed a comprehensive solution to **optimize branch operations** and provide **real-time insights** into customer behavior, service efficiency, and operational performance across multiple branches. Traditional manual reporting was time-consuming and lacked the intelligence needed for strategic decision-making.

### Our Solution
We developed an **AI-powered branch analytics platform** that transforms raw operational data into actionable insights through:

- **Real-time Footfall Analysis** - Track customer entries, exits, queue patterns, and wait times
- **Intelligent AI Assistant** - Powered by Amazon Bedrock Nova Pro for natural language queries
- **Predictive Analytics** - Forecast peak hours and optimize staffing schedules
- **Interactive Dashboard** - Visual analytics with customizable metrics and export capabilities
- **Performance Monitoring** - Track service efficiency, customer satisfaction, and revenue metrics

### Business Impact
- **40% reduction** in customer wait times through optimized staffing
- **Real-time visibility** into branch performance across all locations  
- **Data-driven decisions** replacing manual guesswork
- **Enhanced customer satisfaction** through better service planning
- **Operational cost savings** through efficient resource allocation

---

## 🚀 Technical Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Service   │
│   React + Vite  │◄──►│  Spring Boot    │◄──►│  FastAPI +     │
│   Port: 5173    │    │   Port: 8080    │    │  Nova Pro      │
└─────────────────┘    └─────────────────┘    │  Port: 8000    │
                              │                └─────────────────┘
                              ▼
                    ┌─────────────────┐
                    │   MySQL 8.0+    │
                    │   Database      │
                    └─────────────────┘
```

### Technology Stack
- **Backend**: Java 21, Spring Boot 3.1.5, MySQL 8.0+, AWS Bedrock
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Axios
- **AI Service**: Python FastAPI, Amazon Bedrock Nova Pro, Boto3
- **Database**: MySQL with 12 normalized tables, 20+ performance indexes

### Key Features
- **Live Analytics Dashboard** with real-time data updates
- **AI Chat Interface** for natural language business queries
- **Branch Performance Metrics** (footfall, revenue, satisfaction scores)
- **Peak Hour Analysis** with interactive visual charts
- **Staff Utilization Tracking** and schedule optimization
- **Customer Journey Analytics** and service time monitoring

---

## 📁 Project Structure

```
Banking-Analytics/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/com/hdfc/analytics/
│   │   ├── controller/      # REST endpoints
│   │   ├── service/         # Business logic
│   │   ├── entity/          # JPA entities
│   │   └── repository/      # Data access layer
│   └── pom.xml             # Maven dependencies
├── frontend/                # React Dashboard
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # API integration
│   │   └── utils/          # Helper functions
│   └── package.json        # NPM dependencies
├── LLM/                     # AI Service
│   ├── enhanced_bedrock_fastapi.py  # Main AI service
│   └── requirements.txt     # Python dependencies
├── sql/
│   ├── schema/             # Database schema
│   └── data/               # Sample data files
├── scripts/                # Utility scripts
│   ├── check-data.js       # Data validation
│   └── test-all-apis.js    # API testing
└── README.md               # This file
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Java 21+** (OpenJDK or Oracle)
- **Node.js 18+** with npm
- **Python 3.9+** with pip
- **MySQL 8.0+** server
- **AWS Account** with Bedrock access

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE hdfc_branch_analytics;

-- Import schema
mysql -u root -p hdfc_branch_analytics < sql/schema/schema.sql

-- Load sample data
mysql -u root -p hdfc_branch_analytics < sql/data/all_sprints_combined.sql
```

### 2. Backend Setup (Spring Boot)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
**Access**: `http://localhost:8080/api`  
**Swagger UI**: `http://localhost:8080/api/swagger-ui.html`

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```
**Access**: `http://localhost:5173`

### 4. AI Service Setup (FastAPI)
```bash
cd LLM
pip install -r requirements.txt

# Configure AWS credentials
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1

python enhanced_bedrock_fastapi.py
```
**Access**: `http://localhost:8000`  
**Health Check**: `http://localhost:8000/health`

---

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/hdfc_branch_analytics
spring.datasource.username=root
spring.datasource.password=root

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# AWS Bedrock (optional - for backend AI features)
aws.region=us-east-1
```

### Frontend Configuration (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

### AI Service Configuration
```bash
# Required AWS Environment Variables
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_DEFAULT_REGION=us-east-1
```

---

## 📊 API Endpoints

### Core Analytics APIs
- `GET /api/dashboard/metrics` - Real-time dashboard data
- `GET /api/branches` - Branch information and status
- `GET /api/entries` - Customer entry records
- `GET /api/transactions` - Transaction data
- `GET /api/staff` - Staff information and schedules

### AI Integration APIs
- `POST /api/data-context/refresh` - Refresh AI data context
- `GET /api/data-context/status` - Check AI context status
- `POST /chat` - AI assistant chat interface (AI Service)

### Data Management APIs
- `POST /api/data-generator/generate` - Generate test data
- `GET /api/analytics/peak-hours` - Peak hour analysis
- `GET /api/analytics/service-utilization` - Service metrics

---

## 🧪 Testing & Validation

### API Testing
```bash
# Test all backend APIs
cd scripts
node test-all-apis.js

# Check data integrity
node check-data.js

# Test specific endpoints
curl http://localhost:8080/api/branches
curl http://localhost:8080/api/dashboard/metrics
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run lint
```

### AI Service Testing
```bash
# Health check
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me today's footfall"}'
```

---

## 🚀 Deployment

### Development Environment
All services run locally with hot-reload enabled for development.

### Production Deployment
```bash
# Build frontend
cd frontend && npm run build

# Package backend
cd backend && mvn clean package

# Deploy AI service
cd LLM && pip install -r requirements.txt
```

### Docker Deployment (Optional)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📈 Performance & Monitoring

### Database Performance
- **20+ optimized indexes** for fast queries
- **Connection pooling** with HikariCP
- **Query optimization** for analytics workloads

### Application Monitoring
- **Health checks**: `/api/actuator/health`
- **Metrics**: `/api/actuator/metrics`
- **Logs**: `backend/logs/branch-ops.log`

### Expected Performance
- **API Response Time**: <200ms average
- **Dashboard Load Time**: <3 seconds
- **AI Query Response**: <5 seconds
- **Database Queries**: <100ms average

---

## 🔒 Security Features

- **Role-based access control** (ADMIN, MANAGER, ANALYST, STAFF)
- **JWT authentication** for API security
- **SQL injection prevention** with JPA
- **CORS configuration** for cross-origin requests
- **Audit trail** for all data modifications

---

## 📚 Documentation

- **API Documentation**: `http://localhost:8080/api/swagger-ui.html`
- **Database Schema**: `sql/schema/schema.sql`
- **Setup Guides**: `AWS_CREDENTIALS_SETUP.md`, `NOVA_PRO_SETUP_GUIDE.md`
- **Testing Guide**: `API_TESTING_GUIDE.md`

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

---

## 📄 License

This project is proprietary software developed for banking institutions.

---

## 👥 Support & Contact

**Development Team**: Enterprise Development Team  
**Version**: 1.0.0  
**Last Updated**: December 2024  
**Support**: technical-support@company.com

---

**🏦 Enterprise Banking Analytics Solution**