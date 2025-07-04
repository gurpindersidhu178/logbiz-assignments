# 🔐 REST API with Authentication Assignment

> **Welcome to Backend Development Track!** This assignment focuses on building a secure REST API with comprehensive authentication and authorization features.

---

## 📋 Assignment Overview

### 🎯 Project Summary
Build a secure REST API with user authentication, authorization, and CRUD operations for a task management system.

**🏷️ Skill Tags**: `backend`, `nodejs`, `express`, `mongodb`, `jwt`, `authentication`, `authorization`

**📚 Prerequisites**:
- Basic understanding of Node.js and Express
- Knowledge of MongoDB and database operations
- Understanding of REST API principles
- Familiarity with authentication concepts

**📊 Difficulty Level**: 🟡 **Intermediate** (1-3 years experience)

**🎯 Learning Objectives**:
- JWT-based authentication implementation
- Role-based authorization
- Secure password handling
- API security best practices
- Database design and optimization

**⏱️ Estimated Time**: 7 days (40-50 hours)

---

## 📋 Core Requirements (80 points)

### 🔐 Authentication System (25 points)
- [ ] **User Registration** (8 points):
  - [ ] Email and password validation
  - [ ] Password hashing with bcrypt
  - [ ] Email uniqueness validation
  - [ ] Input sanitization and validation
- [ ] **User Login** (8 points):
  - [ ] JWT token generation
  - [ ] Password verification
  - [ ] Token expiration handling
  - [ ] Login attempt limiting
- [ ] **Password Management** (9 points):
  - [ ] Password reset functionality
  - [ ] Email verification for password reset
  - [ ] Secure password requirements
  - [ ] Account lockout after failed attempts

### 🛡️ Authorization & Security (20 points)
- [ ] **Role-Based Access Control** (10 points):
  - [ ] User roles (admin, user, moderator)
  - [ ] Role-based route protection
  - [ ] Permission-based access control
  - [ ] Middleware for role verification
- [ ] **API Security** (10 points):
  - [ ] Rate limiting implementation
  - [ ] CORS configuration
  - [ ] Input validation and sanitization
  - [ ] SQL injection prevention

### 📊 Task Management API (25 points)
- [ ] **CRUD Operations** (15 points):
  - [ ] Create, read, update, delete tasks
  - [ ] Task ownership validation
  - [ ] Bulk operations support
  - [ ] Soft delete functionality
- [ ] **Advanced Features** (10 points):
  - [ ] Task filtering and search
  - [ ] Pagination implementation
  - [ ] Task assignment to users
  - [ ] Task status management

### 🧪 Testing & Documentation (10 points)
- [ ] **API Testing** (5 points):
  - [ ] Unit tests for authentication
  - [ ] Integration tests for API endpoints
  - [ ] Error handling tests
- [ ] **Documentation** (5 points):
  - [ ] OpenAPI/Swagger documentation
  - [ ] README with setup instructions
  - [ ] API endpoint documentation

---

## 🚀 Bonus Features (20 points)

### 🔒 Advanced Security (10 points)
- [ ] **OAuth 2.0 Integration** (5 points):
  - [ ] Google OAuth login
  - [ ] GitHub OAuth login
- [ ] **Two-Factor Authentication** (5 points):
  - [ ] TOTP implementation
  - [ ] SMS-based 2FA

### 📈 Performance & Monitoring (10 points)
- [ ] **API Performance** (5 points):
  - [ ] Response caching
  - [ ] Database query optimization
- [ ] **Monitoring & Logging** (5 points):
  - [ ] Request/response logging
  - [ ] Error tracking and alerting

---

## 📤 Deliverables

### 📋 Required Files
1. **Working API**: Fully functional REST API with authentication
2. **Database Schema**: MongoDB collections and indexes
3. **API Documentation**: OpenAPI/Swagger specification
4. **Test Suite**: Comprehensive test coverage
5. **README**: Setup and usage instructions
6. **Environment Configuration**: .env.example file

### 📊 Submission Requirements
- [ ] All endpoints working and tested
- [ ] Authentication flow complete
- [ ] Role-based access implemented
- [ ] API documentation generated
- [ ] Test coverage > 80%
- [ ] Security best practices followed

---

## 🛠️ Technical Stack

### 🎯 Required Technologies
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Validation**: Joi or express-validator
- **Testing**: Jest, Supertest
- **Documentation**: Swagger/OpenAPI

### 📁 Project Structure
```
rest-api-auth/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── email.js
│   └── app.js
├── tests/
├── docs/
├── .env.example
├── package.json
└── README.md
```

---

## 🎯 API Endpoints

### 🔐 Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
POST /api/auth/refresh - Refresh JWT token
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password - Reset password
POST /api/auth/verify-email - Verify email address
```

### 👥 User Management Endpoints
```
GET /api/users/profile - Get user profile
PUT /api/users/profile - Update user profile
GET /api/users - List users (admin only)
PUT /api/users/:id/role - Update user role (admin only)
DELETE /api/users/:id - Delete user (admin only)
```

### 📋 Task Management Endpoints
```
GET /api/tasks - List tasks (with filtering)
POST /api/tasks - Create new task
GET /api/tasks/:id - Get task details
PUT /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task
POST /api/tasks/:id/assign - Assign task to user
PUT /api/tasks/:id/status - Update task status
```

---

## 🧪 Testing Requirements

### 📊 Test Coverage
- **Unit Tests**: 90% coverage for controllers and utilities
- **Integration Tests**: All API endpoints tested
- **Authentication Tests**: Login, registration, token validation
- **Authorization Tests**: Role-based access control
- **Error Handling Tests**: Invalid inputs, unauthorized access

### 🛠️ Test Tools
- **Jest**: Test framework
- **Supertest**: API testing
- **MongoDB Memory Server**: In-memory database for testing
- **Faker**: Test data generation

---

## 📚 Learning Resources

### 🔗 Documentation
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB with Mongoose](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [bcrypt Password Hashing](https://github.com/dcodeIO/bcrypt.js/)

### 📖 Tutorials
- [Node.js Authentication](https://www.freecodecamp.org/news/how-to-setup-jwt-authentication-with-node-js/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)

---

## 🎉 Success Tips

### 💡 Best Practices
1. **Security First**: Always validate and sanitize inputs
2. **Error Handling**: Implement comprehensive error handling
3. **Logging**: Add structured logging for debugging
4. **Documentation**: Keep API documentation updated
5. **Testing**: Write tests as you develop features

### ⚡ Pro Tips
- **Start with Authentication**: Build auth system first
- **Use Environment Variables**: Keep secrets secure
- **Implement Rate Limiting**: Protect against abuse
- **Add Request Validation**: Validate all inputs
- **Monitor Performance**: Track API response times

### 🚀 Common Pitfalls to Avoid
- **Weak Passwords**: Implement strong password requirements
- **Token Security**: Use secure JWT configuration
- **Database Security**: Implement proper access controls
- **Input Validation**: Don't trust user inputs
- **Error Messages**: Don't expose sensitive information

---

*Good luck with your REST API assignment! We're excited to see your authentication and security skills in action! 🚀*

---

**📝 Last Updated**: December 2024  
**📋 Version**: 1.0  
**👥 Maintained By**: Logbiz HR Recruitment Team 