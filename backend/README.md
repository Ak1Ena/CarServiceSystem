[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/HHDuFLwg)
# Overview

# Microservices API Overview

This project contains multiple microservices managing a car reservation system.

| Service | Port | Kafka Topic | Description |
|---------|------|-------------|-------------|
| Car Service | 8082 | car | Manages cars in the system. |
| Receipt Service | 8083 | receipt | Manages receipts for transactions. |
| Reserve Service | 8084 | reservation | Manages reservations for cars. |
| User Service | 8085 | user | Manages user information. |
| Payment Service | 8086 | payment | Manages payment. |

---

# Car Service API

This service manages the cars in the system.

## Endpoints

| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| `POST` | `/cars` | Add a new car. | `CarDto` | `CarDto` |
| `GET` | `/cars` | Get all cars. | (none) | `List<CarDto>` |
| `GET` | `/cars/{id}` | Get a car by ID. | (none) | `CarDto` |
| `PATCH` | `/cars/{id}` | Update a car. | `CarDto` | `CarDto` |
| `GET` | `/cars/user/{id}` | Get all cars for a user. | (none) | `List<CarDto>` |
| `GET` | `/cars/{carId}/user` | Get a car with user information. | (none) | `JsonNode` |
| `DELETE` | `/cars/{id}` | Delete a car. | (none) | (none) |

## `CarDto` object

```json
{
  "id": "Long (generated)",
  "model": "string",
  "plateNumber": "string",
  "userId": "Long"
}
```
---

# User Service API

Service นี้จัดการข้อมูลผู้ใช้ และส่ง Kafka Event ทุกครั้งที่มีการสร้าง/แก้ไข/ลบ/เปลี่ยนสถานะ

## Endpoints

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

## `UserDto` object

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
# Reserve Service API

This service manages reservations for cars.

## Endpoints

| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| `POST` | `/reserves` | Create a new reservation | `ReserveDto` | `ReserveDto` |
| `GET` | `/reserves` | Get all reservations | (none) | `List<ReserveDto>` |
| `GET` | `/reserves/{id}` | Get a reservation by ID | (none) | `ReserveDto` |
| `GET` | `/reserves/{id}/receipt` | Get receipt for a reservation | (none) | `ReceiptDto` |
| `PUT` | `/reserves/{id}` | Replace a reservation with new data | `ReserveDto` | `ReserveDto` |
| `PATCH` | `/reserves/{id}` | Partially update a reservation | `ReserveDto` (partial) | `ReserveDto` |
| `DELETE` | `/reserves/{id}` | Delete a reservation | (none) | (none) |

## `ReserveDto` object

```json
{
  "id": "Long (generated)",
  "carId": "Long",
  "userId": "Long",
  "startDate": "String",
  "endDate": "String"
}
```

---


# Receipt Service API

This service manages receipts for transactions.
## Endpoints

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

## `ReceiptDto` object

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
## `ReceiptItemDto` object

```json
{
        "id": "Long (generated)",
        "description": "String",
        "quantity": "int",
        "unitPrice": "int"
    }
```
---
# Payment Service API

This service manages payment for receipt.
## Endpoints

| Method | Path | Description | Request Body | Response Body |
|--------|------|-------------|--------------|---------------|
| GET | `/payments` | Get all payments | (none) | `PaymentDto`|
| GET | `/payments/{paymentId}` | Get a payment by its ID | (none) | `PaymentDto`|
| GET | `/payments/user/{userId}` | Get all payments for a specific user | (none) |`PaymentDto`|
| GET | `/payments/status/{status}` | Get payments by status (`PENDING`, `PAID`) |(none) | `PaymentDto` |
| POST | `/payments` | Create a new payment | `PaymentDto` (requires `userId`, `receiptId`)|`PaymentDto`| 
| PATCH | `/payments/{paymentId}/paid` | make a payment | `PaymentDto (paymentMethod)` |`PaymentDto`|
| DELETE | `/payments/{id}` | Delete a payment | (none) | (none)|

## `PaymentDto` object

```json
{
    "paymentId": "Long (generated)",
    "receiptId": "Long",
    "userId": "Long",
    "userName": "String (generated)",
    "status": "String (generated)",
    "paymentMethod": "String (generated)",
    "grandTotal": "Bigdecimal (generated)",
    "paidAt": "LocalDateTime (generated)"
}
```

