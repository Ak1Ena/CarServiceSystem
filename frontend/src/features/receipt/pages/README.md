# Pages Folder

This folder contains the main page components of the application. These components serve as entry points for different sections of the application and are responsible for rendering UI and managing page-specific logic.

## Pages

### `ReceiptPage.js`
- **Purpose**: This is the page where users can view the receipt details after completing a car rental transaction.
- **Description**: 
  - It fetches receipt data from the backend based on the `id` parameter in the URL (e.g., `/receipt/:id`).
  - It displays a detailed receipt, including renter’s name, car details, rental dates, amount, and payment status.
  - This page uses several components like `ReceiptHeader`, `ReceiptCard`, and `ReceiptFooter` to organize the layout.
  
- **Props**:
  - This page does not directly accept props but relies on the `id` parameter in the URL for fetching data from the store or API.

- **Usage**:
  ```jsx
  <Route path="/receipt/:id" element={<ReceiptPage />} />
