# Components Folder

This folder contains reusable UI components related to the receipt page. Each component is modular and can be used independently in different parts of the application.

## Components

### `ReceiptHeader.js`
- **Purpose**: Displays the header section of the receipt page.
- **Props**:
  - `renterName` (string): The name of the renter.
  - `car` (object): Contains information about the rented car (brand, model, license plate).
- **Usage**:
  ```jsx
  <ReceiptHeader renterName="John Doe" car={{ brand: "Toyota", model: "Corolla", licensePlate: "ABC 123" }} />
