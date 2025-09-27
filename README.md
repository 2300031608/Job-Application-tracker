# 💼 Job Application Tracker

A comprehensive, professional-grade job application tracking platform built with React, Spring Boot, and MySQL. This platform helps job seekers organize and manage their job search process, track application statuses, and set reminders for follow-ups.

## ✨ Features

### 🎯 Core Functionality
- **Job Application Management** - Create, read, update, delete job applications
- **Advanced Search & Filtering** - Search by company, job title, location, status, priority
- **Status Tracking** - Applied, Under Review, Phone Screen, Technical Interview, On Site Interview, Final Interview, Offer Received, Offer Accepted, Rejected, etc.
- **Priority Classification** - Critical, High, Medium, Low priority levels
- **Job Type Management** - Full-time, Part-time, Contract, Internship, Freelance, Temporary
- **Interview Scheduling** - Track interview dates and follow-up reminders
- **Source Tracking** - LinkedIn, Indeed, Company Website, etc.

### 🎨 Professional UI/UX
- **Modern Dark Theme** - Professional job search aesthetic
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Interactive Dashboard** - Real-time statistics and analytics
- **Advanced Search** - Powerful filtering and sorting capabilities
- **Status Indicators** - Visual application status and priority indicators
- **Smooth Animations** - Professional transitions and effects

### 🚀 Technical Features
- **RESTful API** - Complete CRUD operations for job applications
- **Database Integration** - MySQL with H2 fallback
- **Docker Support** - Containerized deployment
- **CI/CD Pipeline** - GitHub Actions automation
- **AWS Deployment** - ECS Fargate and CloudFormation
- **Security Headers** - Comprehensive security implementation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  Spring Boot    │    │     MySQL       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+ (optional - H2 in-memory database is used by default)
- Docker & Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd threat-platform
   ```

2. **Start the Backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - H2 Console: http://localhost:8080/h2-console

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - MySQL: localhost:3306

## 📊 API Endpoints

### Job Applications
- `GET /api/job-applications` - List all job applications
- `POST /api/job-applications` - Create a new job application
- `GET /api/job-applications/{id}` - Get job application by ID
- `PUT /api/job-applications/{id}` - Update job application
- `DELETE /api/job-applications/{id}` - Delete job application
- `GET /api/job-applications/status/{status}` - Get applications by status
- `GET /api/job-applications/priority/{priority}` - Get applications by priority
- `GET /api/job-applications/search` - Search applications
- `GET /api/job-applications/follow-up` - Get applications needing follow-up
- `GET /api/job-applications/upcoming-interviews` - Get upcoming interviews
- `GET /api/job-applications/statistics` - Get application statistics

### Sample Job Application Object
```json
{
  "id": 1,
  "companyName": "Google",
  "jobTitle": "Senior Software Engineer",
  "jobDescription": "We are looking for a Senior Software Engineer...",
  "location": "Mountain View, CA",
  "jobType": "FULL_TIME",
  "status": "UNDER_REVIEW",
  "priority": "HIGH",
  "source": "LinkedIn",
  "jobUrl": "https://careers.google.com/jobs/results/123456",
  "contactPerson": "Sarah Johnson",
  "contactEmail": "sarah.johnson@google.com",
  "appliedDate": "2024-01-10T10:00:00Z",
  "interviewDate": "2024-01-18T14:00:00Z",
  "followUpDate": "2024-01-22T10:00:00Z",
  "notes": "Applied through LinkedIn. Received confirmation email.",
  "salaryRange": "$150,000 - $200,000",
  "createdAt": "2024-01-10T10:00:00Z",
  "updatedAt": "2024-01-10T10:00:00Z"
}
```

## 🎨 UI Components

### Dashboard
- **Statistics Cards** - Real-time application counts by status
- **Search & Filters** - Advanced search and filtering capabilities
- **Application Table** - Comprehensive job application listing with actions
- **Add/Edit Form** - Modal form for job application management

### Features
- **Real-time Updates** - Live data refresh
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Professional job search aesthetic
- **Interactive Elements** - Hover effects and animations
- **Status Indicators** - Visual priority and status badges

## 🐳 Docker Configuration

### Services
- **mysql** - MySQL 8.0 database
- **backend** - Spring Boot application
- **frontend** - React application with Nginx

### Environment Variables
```yaml
# Database
MYSQL_ROOT_PASSWORD: secret
MYSQL_DATABASE: threatintel
MYSQL_USER: threatuser
MYSQL_PASSWORD: threatpass

# Backend
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/threatintel
SPRING_DATASOURCE_USERNAME: threatuser
SPRING_DATASOURCE_PASSWORD: threatpass
```

## ☁️ AWS Deployment

### ECS Fargate
1. **Build and push images to ECR**
2. **Deploy using CloudFormation template**
3. **Configure Application Load Balancer**
4. **Set up auto-scaling**

### CloudFormation Stack
```bash
aws cloudformation create-stack \
  --stack-name threat-intel-platform \
  --template-body file://aws/cloudformation-template.yml \
  --parameters ParameterKey=VpcId,ParameterValue=vpc-12345 \
               ParameterKey=SubnetIds,ParameterValue=subnet-12345,subnet-67890
```

## 🔧 Configuration

### Backend Configuration
```properties
# Database (H2 for development)
spring.datasource.url=jdbc:h2:mem:threatintel
spring.datasource.username=sa
spring.datasource.password=

# Database (MySQL for production)
spring.datasource.url=jdbc:mysql://localhost:3306/threatintel
spring.datasource.username=root
spring.datasource.password=secret

# JPA Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

### Frontend Configuration
```javascript
// API Configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📈 Monitoring & Logging

### Health Checks
- Backend: `GET /actuator/health`
- Frontend: `GET /` (Nginx health check)

### Logging
- **Backend** - Spring Boot logging with Logback
- **Frontend** - Browser console logging
- **Docker** - Container logs via `docker-compose logs`

## 🔒 Security Features

### Backend Security
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

### Frontend Security
- Content Security Policy
- XSS protection headers
- Secure API communication
- Input sanitization

## 🚀 CI/CD Pipeline

### GitHub Actions
- **Test** - Automated testing on PR
- **Build** - Docker image building
- **Deploy** - AWS ECS deployment
- **Security** - Vulnerability scanning

### Pipeline Stages
1. **Code Quality** - Linting and formatting
2. **Testing** - Unit and integration tests
3. **Building** - Docker image creation
4. **Deployment** - AWS ECS deployment
5. **Monitoring** - Health checks and alerts

## 📚 Documentation

### API Documentation
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI Spec: http://localhost:8080/v3/api-docs

### Database Schema
```sql
CREATE TABLE job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT,
    location VARCHAR(100),
    job_type VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'APPLIED',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    source VARCHAR(100),
    job_url VARCHAR(200),
    contact_person VARCHAR(100),
    contact_email VARCHAR(200),
    applied_date DATETIME,
    interview_date DATETIME,
    follow_up_date DATETIME,
    notes TEXT,
    salary_range VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation

## 🎯 Roadmap

### Upcoming Features
- [ ] Real-time notifications for interview reminders
- [ ] Advanced analytics dashboard with success rates
- [ ] Job board integrations (LinkedIn, Indeed)
- [ ] Resume and cover letter management
- [ ] Interview preparation tools
- [ ] Salary negotiation tracking
- [ ] Company research integration
- [ ] Email templates for follow-ups
- [ ] Calendar integration for interviews
- [ ] Export to PDF/Excel functionality

---

**Built with ❤️ for job seekers and career development**
