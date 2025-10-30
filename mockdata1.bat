@echo off

REM ===============================
REM 1. Check and create User 1 (Car Owner)
REM ===============================
curl -s http://localhost:8085/users/1 | findstr "Car Owner" > nul
IF ERRORLEVEL 1 (
    echo Creating User 1...
    curl -X POST http://localhost:8085/users ^
    -H "Content-Type: application/json" ^
    -d "{\"username\":\"carowner\",\"email\":\"owner@example.com\",\"password\":\"password123\",\"status\":\"ACTIVE\",\"phone\":\"0812345678\",\"address\":\"123 Car Street\",\"role\":\"OWNER\",\"name\":\"Car Owner\",\"firstName\":\"Car\",\"lastName\":\"Owner\"}"
) ELSE (
    echo User 1 already exists, skipping...
)

:wait_user1
curl -s http://localhost:8085/users/1 | findstr "Car Owner" > nul
IF ERRORLEVEL 1 (
    timeout /t 2 > nul
    goto wait_user1
)
echo User 1 is ready.

REM ===============================
REM 2. Check and create User 2 (Renter)
REM ===============================
curl -s http://localhost:8085/users | findstr "renter@example.com" > nul
IF ERRORLEVEL 1 (
    echo Creating User 2...
    curl -X POST http://localhost:8085/users ^
    -H "Content-Type: application/json" ^
    -d "{\"username\":\"renter\",\"email\":\"renter@example.com\",\"password\":\"password123\",\"status\":\"ACTIVE\",\"phone\":\"0898765432\",\"address\":\"456 Rent Road\",\"role\":\"RENTER\",\"name\":\"Renter User\",\"firstName\":\"Renter\",\"lastName\":\"User\"}"
) ELSE (
    echo User 2 already exists, skipping...
)

:wait_user2
curl -s http://localhost:8085/users/2 | findstr "Renter User" > nul
IF ERRORLEVEL 1 (
    timeout /t 2 > nul
    goto wait_user2
)
echo User 2 is ready.

REM ===============================
REM 3. Create Reservation 1
REM ===============================
curl -s http://localhost:8084/reserves/1 | findstr "\"carId\":1" > nul
IF ERRORLEVEL 1 (
    echo Creating Reservation 1...
    curl -X POST http://localhost:8084/reserves ^
    -H "Content-Type: application/json" ^
    -d "{\"carId\":1,\"userId\":2,\"startDate\":\"2025-10-25T10:00:00\",\"endDate\":\"2025-10-27T10:00:00\",\"price\":4200,\"status\":\"PENDING\"}"
) ELSE (
    echo Reservation 1 already exists, skipping...
)

:wait_reserve1
curl -s http://localhost:8084/reserves/1 | findstr "\"status\":\"Wating\"" > nul
IF ERRORLEVEL 1 (
    timeout /t 2 > nul
    goto wait_reserve1
)
echo Reservation 1 is ready.

REM ===============================
REM 4. Update Reservation 1 to SUCCESS
REM ===============================
echo Updating Reservation 1 status to SUCCESS...
curl -X PATCH http://localhost:8084/reserves/2 ^
-H "Content-Type: application/json" ^
-d "{\"id\":2,\"userId\":2,\"status\":\"SUCCESS\",\"price\":4000}"

REM ===============================
REM 5. Create Payment 1
REM ===============================
curl -s http://localhost:8086/payments/1 | findstr "\"reserveId\":1" > nul
IF ERRORLEVEL 1 (
    echo Creating Payment 1...
    curl -X POST http://localhost:8086/payments ^
    -H "Content-Type: application/json" ^
    -d "{\"reserveId\":1,\"userId\":2,\"userName\":\"Renter User\",\"grandTotal\":4200,\"paymentMethod\":\"CASH\",\"status\":\"PENDING\"}"
) ELSE (
    echo Payment 1 already exists, skipping...
)

:wait_payment1
curl -s http://localhost:8086/payments/1 | findstr "\"reserveId\":1" > nul
IF ERRORLEVEL 1 (
    timeout /t 2 > nul
    goto wait_payment1
)
echo Payment 1 is ready.

REM ===============================
REM 6. Update Payment 1 to PAID
REM ===============================
echo Updating Payment 1 status to PAID...
curl -X PATCH http://localhost:8086/payments/1/paid ^
-H "Content-Type: application/json" ^
-d "{\"paymentMethod\":\"CASH\"}"

echo All steps completed.
pause
