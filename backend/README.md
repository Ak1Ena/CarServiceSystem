[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/HHDuFLwg)

# Car Rental Marketplace - Microservices Architecture

This project implements a car rental marketplace where car owners can list their vehicles and renters can book them. The system follows a microservices architecture pattern with service discovery, event-driven communication, and well-defined service boundaries.

## Architecture Overview

```
     +-------------------+
     |   Frontend/UI     |
     +--------+----------+
              |
     +--------v----------+
     |  Frontend Proxy   |
     +--------+----------+
              |
     +--------v----------+
     |  Service Discovery|
     |   (Eureka Server) |
     +-------------------+
              |
     +--------v----------+
     |       Kafka       |
     |   (Event Stream)  |
     +-------------------+
              |
     +--------+--------+--------+--------+--------+--------+
     |        |        |        |        |        |        |
+----v--+ +---v----+ +--v-----+ +--v-----+ +--v-----+ +--v-----+
|User   | |Car     | |Reserve | |Receipt| |Payment| |       |
|Service| |Service | |Service | |Service | |Service | |Others |
+-------+ +-------+ +--------+ +--------+ +--------+ +-------+
```

## Service Dependencies

- **Eureka Server**: Centralized service discovery for all microservices
- **Frontend Proxy**: Handles communication between frontend and backend services (referenced in pom.xml but not implemented in directory)
- **User Service**: Manages user accounts (both renters and car owners)
- **Car Service**: Manages car listings with owner relationships
- **Reserve Service**: Links users to cars for rental periods
- **Receipt Service**: Aggregates reservation, user, and car information into receipts
- **Payment Service**: Processes payments tied to receipts, can access car info through receipt→reservation→car chain

## Service Details

### Car Service (Port 8082)
Manages cars in the system and their relationship to owners.

#### Endpoints
| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| `POST` | `/cars` | Add a new car (multipart form data with images). | `CarDto` + images | `CarDto` |
| `GET` | `/cars` | Get all cars. | (none) | `List<CarDto>` |
| `GET` | `/cars/{id}` | Get a car by ID. | (none) | `CarDto` |
| `PUT` | `/cars/{id}` | Replace a car completely. | `CarDto` | `CarDto` |
| `PATCH` | `/cars/{id}` | Update a car (multipart form data with images). | `CarDto` + images (optional) | `CarDto` |
| `GET` | `/cars/user/{id}` | Get all cars for a user. | (none) | `List<CarDto>` |
| `GET` | `/cars/{carId}/user` | Get a car with user information. | (none) | `JsonNode` |
| `DELETE` | `/cars/{id}` | Delete a car. | (none) | (none) |

#### `CarDto` object
```json
{
  "id": "Long (generated)",
  "model": "string",
  "plateNumber": "string",
  "userId": "Long",
  "type": "string",
  "price": "Long",
  "pickUp": "string",
  "img1": "byte[] (base64 encoded image data)",
  "img2": "byte[] (base64 encoded image data)",
  "img3": "byte[] (base64 encoded image data)"
}
```

**Example Response for `GET /cars/{carId}/user`:**
```json
{
  "car": {
    "id": 1,
    "model": "Toyota Camry",
    "plateNumber": "กท1234",
    "userId": 5,
    "type": "Sedan",
    "price": 2500,
    "pickUp": "Bangkok",
    "img1": null,
    "img2": null,
    "img3": null
  },
  "user": {
    "userId": 5,
    "username": "car_owner",
    "email": "owner@example.com",
    "name": "John Doe",
    "phone": "0123456789",
    "address": "123 Street, Bangkok",
    "status": "ACTIVE",
    "createdAt": "2023-05-15T10:30:00",
    "updatedAt": "2023-05-15T10:30:00",
    "role": "OWNER"
  }
}
```

---

### User Service (Port 8085)
Manages user information and handles both renters and car owners.

#### Endpoints
| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| `POST` | `/users` | สร้างผู้ใช้ใหม่ | `UserDto` | `UserDto` |
| `GET` | `/users` | ดึงผู้ใช้ทั้งหมด | (none) | `List<UserDto>` |
| `GET` | `/users/{id}` | ดึงผู้ใช้ตาม ID | (none) | `UserDto` |
| `GET` | `/users/username/{username}` | ดึงผู้ใช้ตาม username | (none) | `UserDto` |
| `GET` | `/users/email/{email}` | ดึงผู้ใช้ตาม email | (none) | `UserDto` |
| `GET` | `/users/status/{status}` | ดึงผู้ใช้ตามสถานะ | (none) | `List<UserDto>` |
| `GET` | `/users/search?name=...` | ค้นหาผู้ใช้ตามชื่อ | (none) | `List<UserDto>` |
| `PUT` | `/users/{id}` | อัพเดทข้อมูลผู้ใช้ทั้งหมด | `UserDto` | `UserDto` |
| `PATCH` | `/users/{id}` | อัพเดทบาง field | `UserDto` | `UserDto` |
| `PATCH` | `/users/{id}/status` | เปลี่ยนสถานะผู้ใช้ | `StatusUpdateRequest` | `UserDto` |
| `DELETE` | `/users/{id}` | ลบผู้ใช้ | (none) | `{ "message": "...", "userId": "..." }` |

#### `UserDto` object

**Request Body (สำหรับสร้าง/แก้ไขผู้ใช้)**
```json
{
  "id": "Long (generated)",
  "username": "string",
  "email": "string",
  "name": "string",
  "phone": "string",
  "password": "string",
  "address": "string",
  "role":"string"
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
  "updatedAt": "timestamp",
  "role": "USER | OWNER"
}
```

---

### Reserve Service (Port 8084)
Manages reservations that connect users to cars for specific periods.

#### Endpoints
| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| `POST` | `/reserves` | Create a new reservation | `ReserveDto` | `ReserveDto` |
| `GET` | `/reserves` | Get all reservations | (none) | `List<ReserveDto>` |
| `GET` | `/reserves/{id}` | Get a reservation by ID | (none) | `Reserve` (entity) |
| `GET` | `/reserves/{id}/receipt` | Get receipt for a reservation | (none) | `ReceiptDto` (commented out in code) |
| `GET` | `/reserves/car/{id}` | Get all reservations for a specific car | (none) | `List<Reserve>` |
| `GET` | `/reserves/user/{id}` | Get all reservations for a specific user | (none) | `List<Reserve>` |
| `GET` | `/reserves/owner/{id}` | Get reservations for all cars owned by a user | (none) | `List<Map>` |
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
  "endDate": "String",
  "price": "Long",
  "status": "String"
}
```

**Example Response for `GET /reserves/owner/{id}`:**
```json
[
  {
    "car": {
      "id": 1,
      "model": "Toyota Camry",
      "plateNumber": "กท1234",
      "userId": 5,
      "type": "Sedan",
      "price": 2500,
      "pickUp": "Bangkok"
    },
    "reserve": {
      "id": 1,
      "carId": 1,
      "userId": 2,
      "startDate": "2023-06-01",
      "endDate": "2023-06-05",
      "status": "Wating"
    },
    "user": "Jane Doe"
  },
  {
    "car": {
      "id": 2,
      "model": "Honda Civic",
      "plateNumber": "กท5678",
      "userId": 5,
      "type": "Sedan",
      "price": 2000,
      "pickUp": "Bangkok"
    },
    "reserve": {
      "id": 3,
      "carId": 2,
      "userId": 4,
      "startDate": "2023-06-10",
      "endDate": "2023-06-15",
      "status": "Wating"
    },
    "user": "Bob Smith"
  }
]
```

---

### Receipt Service (Port 8083)
Manages receipts for transactions, aggregating user, car, and reservation information.

#### Endpoints
| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| GET | `/receipts` | Get all receipts | (none) | `List<Receipt>` (entity)|
| GET | `/receipts/{id}` | Get a receipt by its ID | (none) | `ReceiptDto`|
| GET | `/receipts/reserve/{reserveId}` | Get a receipt by reservation ID | (none) |`ReceiptDto`|
| GET | `/receipts/user/{userId}` | Get all receipts for a specific user | (none) |`List<Map>`|
| GET | `/receipts/payment/{receiptId}` | Get payment information for a receipt | (none) |`JsonNode`|
| GET | `/receipts/status/{status}` | Get receipts by status (`PENDING`, `PAID`) |(none) | `List<ReceiptDto>` |
| POST | `/receipts` | Create a new receipt | `ReceiptDto` (requires `userId`, `reserveId`, `items`) |`ReceiptDto`|
| PUT | `/receipts/{id}` | Replace a receipt with new data | `ReceiptDto` |`ReceiptDto`|
| PATCH | `/receipts/{id}` | Partially update a receipt | `ReceiptDto` (partial) |`ReceiptDto`|
| DELETE | `/receipts/{id}` | Delete a receipt | (none) | (none)|
| DELETE | `/receipts/user/{userId}` | Delete all receipts for a user | (none) | (none)|

#### `ReceiptDto` object
```json
{
        "receiptId": "Long (generated)",
        "userId": "Long",
        "userName": "String (generated)",
        "reserveId": "Long",
        "paymentId": "Long",
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

**Example Response for `GET /receipts/user/{userId}`:**
```json
[
  {
    "owner": "John Doe",
    "user": "Jane Doe",
    "car": {
      "id": 1,
      "model": "Toyota Camry",
      "plateNumber": "กท1234",
      "userId": 5,
      "type": "Sedan",
      "price": 2500,
      "pickUp": "Bangkok"
    },
    "payment": {
      "paymentId": 1,
      "reserveId": 1,
      "userId": 2,
      "userName": "Jane Doe",
      "status": "PAID",
      "paymentMethod": "CREDIT_CARD",
      "grandTotal": 2675,
      "paidAt": "2023-06-01T15:30:00"
    }
  }
]
```

---

### Payment Service (Port 8086)
Manages payment processing for receipts, with access to car information through service relationships.

#### Endpoints
| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| GET | `/payments` | Get all payments | (none) | `List<Payment>` (entity)|
| GET | `/payments/{paymentId}` | Get a payment by its ID | (none) | `Payment`|
| GET | `/payments/user/{userId}` | Get all payments for a specific user | (none) |`List<PaymentDto>`|
| GET | `/payments/reserve/{reserveId}` | Get payment for a specific reservation | (none) |`PaymentDto`|
| GET | `/payments/owner/{ownerId}` | Get detailed payment information for an owner | (none) |`JsonNode`|
| GET | `/payments/status/{status}` | Get payments by status (`PENDING`, `PAID`) |(none) | `List<PaymentDto>` |
| POST | `/payments` | Create a new payment | `PaymentDto` (requires `userId`, `reserveId`)|`PaymentDto`| 
| PATCH | `/payments/{paymentId}/paid` | Make a payment | `PaymentDto (paymentMethod)` |`PaymentDto`|
| DELETE | `/payments/{id}` | Delete a payment | (none) | (none)|

#### `PaymentDto` object
```json
{
    "paymentId": "Long (generated)",
    "reserveId": "Long",
    "userId": "Long",
    "userName": "String (generated)",
    "status": "String (generated)",
    "paymentMethod": "String (generated)",
    "grandTotal": "Bigdecimal (generated)",
    "paidAt": "LocalDateTime (generated)"
}
```

**Example Response for `GET /payments/owner/{ownerId}`:**
```json
{
  "ownerId": 1,
  "cars": [
    {
      "car": {
        "id": 1,
        "model": "Toyota Camry",
        "plateNumber": "กท1234",
        "userId": 1,
        "type": "Sedan",
        "price": 2500,
        "pickUp": "Bangkok"
      },
      "reserves": [
        {
          "reserve": {
            "id": 1,
            "carId": 1,
            "userId": 2,
            "startDate": "2023-06-01",
            "endDate": "2023-06-05",
            "price": 2500,
            "status": "Wating"
          },
          "renter": {
            "userId": 2,
            "username": "renter1",
            "email": "renter1@example.com",
            "name": "Jane Doe",
            "phone": "0987654321",
            "address": "456 Street, Bangkok",
            "status": "ACTIVE",
            "role": "USER"
          },
          "payment": {
            "paymentId": 1,
            "reserveId": 1,
            "userId": 2,
            "userName": "Jane Doe",
            "status": "PAID",
            "paymentMethod": "CREDIT_CARD",
            "grandTotal": 2675,
            "paidAt": "2023-06-01T15:30:00"
          }
        }
      ]
    }
  ]
}
```

## Data Flow and Service Interactions

### How Car Information Flows Through the System

1. **Car Listing**: Car owners register their vehicles through the Car Service
2. **Reservation**: Renters make reservations through the Reserve Service, connecting users to cars
3. **Receipt Creation**: The Receipt Service creates receipts that aggregate:
   - User information (from User Service via userId)
   - Car information (from Car Service via reserveId→carId)
   - Rental period and terms (from Reserve Service)
   - Pricing details
4. **Payment Processing**: The Payment Service processes payments based on receipts and can access car information through:
   - Payment → Receipt (via receiptId) → Reservation (via reserveId) → Car (via carId)

### Key Architecture Benefits

- **Scalability**: Each service can be scaled independently based on demand
- **Maintainability**: Clear service boundaries make it easier to update individual components
- **Flexibility**: New features can be added as separate services
- **Resilience**: Failure in one service doesn't necessarily bring down the entire system

### Car Rental Process Flow

1. Car owner registers as a user and lists their car
2. Renter searches and finds an available car
3. Renter creates a reservation specifying dates
4. System generates a receipt with all details
5. Renter processes payment through the payment service
6. Car information is accessible at all stages for both renters and system administrators

### Important Implementation Notes

- **Car Service**: The `POST /cars` and `PATCH /cars/{id}` endpoints accept multipart form data with both car information and image files rather than simple JSON.
- **Response Types**: Several endpoints return different types than documented, including entities instead of DTOs in some cases.
- **Special Endpoints**: Some endpoints like `GET /payments/owner/{id}` and `GET /reserves/owner/{id}` return complex JSON structures combining information from multiple services.

</details>

## Service Communication

All services communicate through:
- HTTP/REST APIs for synchronous communication
- Kafka for event-driven asynchronous communication
- Eureka for service discovery and load balancing
</details>