const API_URL = "http://localhost:5000/api";

export async function fetchReceiptById(receiptId) {
  const res = await fetch(`${API_URL}/receipt/${receiptId}`);
  return res.json();
}

export async function createReceipt(data) {
  const res = await fetch(`${API_URL}/receipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
