# Car Service System

## Project Overview
This is a comprehensive car reservation and management system built using a microservices architecture. The system allows users to register, list cars, make reservations, generate receipts, and process payments through a distributed system of interconnected services.

## System Architecture

This system is built using a microservices architecture with the following components:

### Backend Services
- **Eureka Server** - Service discovery and registry
- **Apache Kafka** - Event streaming platform for inter-service communication
- **Zookeeper** - Coordination service for Kafka
- **User Service** - Manages user accounts and authentication
- **Car Service** - Manages car listings and inventory
- **Reserve Service** - Handles car reservations
- **Receipt Service** - Generates and manages receipts for reservations
- **Payment Service** - Processes payments for reservations

### Frontend
The frontend application will be built using React and should be placed in the `/frontend` directory. It will serve as the user interface for interacting with the backend services, providing functionality for:
- User registration and login
- Car browsing and search
- Reservation booking
- Payment processing
- Receipt viewing

## Technology Stack

### Backend
- **Java Spring Boot** - Microservices framework
- **Eureka** - Service discovery
- **Apache Kafka** - Event streaming and messaging
- **Zookeeper** - Distributed coordination
- **Maven** - Build and dependency management
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### Frontend
- **React** - Frontend framework
- **Modern JavaScript/TypeScript** - Client-side development
- **REST API** - Communication with backend services

## Prerequisites

Before running this application, ensure you have the following software installed:

- **Docker Desktop** (with Docker Compose support)
- **Java 17+** (for local backend development)
- **Node.js 16+** (for frontend development)
- **npm or yarn** (package managers)

## Getting Started - Backend Services

### Running the System with Docker Compose

1. Navigate to the backend directory:
   ```bash
   cd car-service/backend
   ```

2. Start all services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Wait for all services to start (this may take a few minutes). You should see confirmation that all services are healthy.

4. Access the services:
   - Eureka Server Dashboard: http://localhost:8761
   - Car Service API: http://localhost:8082
   - User Service API: http://localhost:8085
   - Reserve Service API: http://localhost:8084
   - Receipt Service API: http://localhost:8083
   - Payment Service API: http://localhost:8086

### Backend Microservices API Overview

| Service | Port | Kafka Topic | Description |
|---------|------|-------------|-------------|
| Car Service | 8082 | car | Manages cars in the system. |
| Receipt Service | 8083 | receipt | Manages receipts for transactions. |
| Reserve Service | 8084 | reservation | Manages reservations for cars. |
| User Service | 8085 | user | Manages user information. |
| Payment Service | 8086 | payment | Manages payment. |

## Getting Started - Frontend Development

### Setting Up the Frontend

1. Create the frontend application:
   ```bash
   cd car-service/frontend
   npx create-react-app .
   ```

2. Install additional dependencies as needed:
   ```bash
   npm install axios react-router-dom
   ```

3. Create a `.env` file in the frontend directory with the following environment variables:
   ```bash
   REACT_APP_API_BASE_URL=http://localhost:8085
   REACT_APP_USER_SERVICE=http://localhost:8085
   REACT_APP_CAR_SERVICE=http://localhost:8082
   REACT_APP_RESERVE_SERVICE=http://localhost:8084
   REACT_APP_RECEIPT_SERVICE=http://localhost:8083
   REACT_APP_PAYMENT_SERVICE=http://localhost:8086
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

5. The frontend should now be accessible at http://localhost:3000

## Backend API Details

### Car Service API

This service manages the cars in the system.

#### Endpoints

| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| `POST` | `/cars` | Add a new car. | `CarDto` | `CarDto` |
| `GET` | `/cars` | Get all cars. | (none) | `List<CarDto>` |
| `GET` | `/cars/{id}` | Get a car by ID. | (none) | `CarDto` |
| `PATCH` | `/cars/{id}` | Update a car. | `CarDto` | `CarDto` |
| `GET` | `/cars/user/{id}` | Get all cars for a user. | (none) | `List<CarDto>` |
| `GET` | `/cars/{carId}/user` | Get a car with user information. | (none) | `JsonNode` |
| `DELETE` | `/cars/{id}` | Delete a car. | (none) | (none) |

#### `CarDto` object

```json
{
  "id": "Long (generated)",
  "model": "string",
  "plateNumber": "string",
  "userId": "Long"
}
```

### User Service API

This service manages user information and sends Kafka events for all create/update/delete operations.

#### Endpoints

| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| `POST` | `/users` | Create a new user | `UserDto` | `UserDto` |
| `GET` | `/users` | Retrieve all users | (none) | `List<UserDto>` |
| `GET` | `/users/{id}` | Retrieve a user by ID | (none) | `UserDto` |
| `GET` | `/users/username/{username}` | Retrieve a user by username | (none) | `UserDto` |
| `GET` | `/users/email/{email}` | Retrieve a user by email | (none) | `UserDto` |
| `GET` | `/users/status/{status}` | Retrieve users by status | (none) | `List<UserDto>` |
| `GET` | `/users/search?name=...` | Search users by name | (none) | `List<UserDto>` |
| `PUT` | `/users/{id}` | Update all user data | `UserDto` | `UserDto` |
| `PATCH` | `/users/{id}` | Partially update user data | `UserDto` | `UserDto` |
| `PATCH` | `/users/{id}/status` | Change user status | `StatusUpdateRequest` | `UserDto` |
| `DELETE` | `/users/{id}` | Delete a user | (none) | `{ "message": "...", "userId": "..." }` |

#### `UserDto` object

**Request Body (for creating/updating users)**
```json
{
  "id": "Long (generated)",
  "username": "string",
  "email": "string",
  "name": "string",
  "phone": "string",
  "password": "string",
  "address": "string"
}
```
**Response Body**
```json
{
  "id": "Long (generated)",
  "username": "string",
  "email": "string",
  "name": "string",
  "phone": "string",
  "address": "string",
  "status": "ACTIVE | INACTIVE",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Reserve Service API

This service manages reservations for cars.

#### Endpoints

| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| `POST` | `/reserves` | Create a new reservation | `ReserveDto` | `ReserveDto` |
| `GET` | `/reserves` | Get all reservations | (none) | `List<ReserveDto>` |
| `GET` | `/reserves/{id}` | Get a reservation by ID | (none) | `ReserveDto` |
| `GET` | `/reserves/{id}/receipt` | Get receipt for a reservation | (none) | `ReceiptDto` |
| `PUT` | `/reserves/{id}` | Replace a reservation with new data | `ReserveDto` | `ReserveDto` |
| `PATCH` | `/reserves/{id}` | Partially update a reservation | `ReserveDto` (partial) | `ReserveDto` |
| `DELETE` | `/reserves/{id}` | Delete a reservation | (none) | (none) |

#### `ReserveDto` object

```json
{
  "id": "Long (generated)",
  "carId": "Long",
  "userId": "Long",
  "startDate": "String",
  "endDate": "String"
}
```

### Receipt Service API

This service manages receipts for transactions.

#### Endpoints

| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| GET | `/receipts` | Get all receipts | (none) | `ReceiptDto`|
| GET | `/receipts/{id}` | Get a receipt by its ID | (none) | `ReceiptDto`|
| GET | `/receipts/reserve/{reserveId}` | Get a receipt by reservation ID | (none) |`ReceiptDto`|
| GET | `/receipts/user/{userId}` | Get all receipts for a specific user | (none) |`ReceiptDto`|
| GET | `/receipts/status/{status}` | Get receipts by status (`PENDING`, `PAID`) |(none) | `ReceiptDto` |
| POST | `/receipts` | Create a new receipt | `ReceiptDto` (requires `userId`, `reserveId`, `items`) |`ReceiptDto`|
| PUT | `/receipts/{id}` | Replace a receipt with new data | `ReceiptDto` |`ReceiptDto`|
| PATCH | `/receipts/{id}` | Partially update a receipt | `ReceiptDto` (partial) |`ReceiptDto`|
| DELETE | `/receipts/{id}` | Delete a receipt | (none) | (none)|

#### `ReceiptDto` object

```json
{
        "receiptId": "Long (generated)",
        "userId": "Long",
        "userName": "String (generated)",
        "reserveId": "Long",
        "issueAt": "String (generated)",
        "items": "List<ReceiptItemDto>",
        "subtotal": "BigDecimal (generated)",
        "vatAmount": "BigDecimal (generated)",
        "grandTotal": "BigDecimal (generated)",
        "status": "String (generated)"
    }
```
#### `ReceiptItemDto` object

```json
{
        "id": "Long (generated)",
        "description": "String",
        "quantity": "int",
        "unitPrice": "int"
    }
```

### Payment Service API

This service manages payment for receipts.

#### Endpoints

| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| GET | `/payments` | Get all payments | (none) | `PaymentDto`|
| GET | `/payments/{paymentId}` | Get a payment by its ID | (none) | `PaymentDto`|
| GET | `/payments/user/{userId}` | Get all payments for a specific user | (none) |`PaymentDto`|
| GET | `/payments/status/{status}` | Get payments by status (`PENDING`, `PAID`) |(none) | `PaymentDto` |
| POST | `/payments` | Create a new payment | `PaymentDto` (requires `userId`, `receiptId`)|`PaymentDto`| 
| PATCH | `/payments/{paymentId}/paid` | Process a payment | `PaymentDto (paymentMethod)` |`PaymentDto`|
| DELETE | `/payments/{id}` | Delete a payment | (none) | (none)|

#### `PaymentDto` object

```json
{
    "paymentId": "Long (generated)",
    "receiptId": "Long",
    "userId": "Long",
    "userName": "String (generated)",
    "status": "String (generated)",
    "paymentMethod": "String (generated)",
    "grandTotal": "BigDecimal (generated)",
    "paidAt": "LocalDateTime (generated)"
}
```

## Frontend Development Guidelines

### Available Scripts

In the frontend directory, you can run:

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

### Environment Configuration

The frontend needs to be configured with the backend service URLs. The default configuration expects services to be running on the ports specified above.

### API Integration Best Practices

1. Use environment variables to configure API endpoints
2. Implement proper error handling for API calls
3. Use axios or fetch for HTTP requests
4. Implement authentication middleware for protected routes
5. Use React state management (useState, useReducer, or context) to manage application state

## Project Structure

```
car-service/
├── backend/
│   ├── docker-compose.yml
│   ├── pom.xml
│   ├── car-service/          # Car listing and 
│   ├── eureka-server/        # Service discovery
│   ├── kafka/               # Kafka event streaming
│   ├── payment-service/     # Payment processing
│   ├── receipt-service/     # Receipt generation
│   ├── reserve-service/     # Reservation management
│   ├── user-service/        # User management
│   └── zookeeper/           # Kafka coordination
├── frontend/                # React frontend application
└── README.md
```

## Development Workflow

1. Start backend services with Docker Compose: `cd backend && docker-compose up --build`
2. In a separate terminal, navigate to the frontend directory: `cd frontend`
3. Install frontend dependencies: `npm install`
4. Start frontend development server: `npm start`
5. The frontend will automatically connect to backend services using configured URLs
6. Make changes and test functionality across services

## Deployment

To deploy the application:

1. Build the frontend for production:
   ```bash
   cd frontend && npm run build
   ```

2. The production build will be available in the `build/` directory, which can be served by a static server.

3. For full deployment of the microservices, ensure your Docker environment is properly configured and run:
   ```bash
   cd backend && docker-compose up -d
   ```