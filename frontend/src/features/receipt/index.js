const API_URL = "http://localhost:8083";

export async function fetchReceiptById(receiptId) {
  const res = await fetch(`${API_URL}/receipts/${receiptId}`);
  return res.json();
}

export async function createReceipt(data) {
  const res = await fetch(`${API_URL}/receipts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
