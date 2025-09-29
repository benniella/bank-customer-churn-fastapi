const API_URL = "https://bank-customer-churn-fastapi.onrender.com";

export async function predictChurn(customerData) {
  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!res.ok) throw new Error("Failed to fetch prediction");
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return { prediction: "Error", churn_probability: 0 };
  }
}
