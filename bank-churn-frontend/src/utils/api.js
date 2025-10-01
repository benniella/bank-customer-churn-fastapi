// src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL || "https://bank-customer-churn-fastapi.onrender.com";

/**
 * predictChurn(customerData, { signal })
 * - customerData: plain object matching backend Pydantic schema
 * - options.signal: AbortController.signal (optional) for timeout/cancel
 *
 * Throws on non-2xx, timeout, or network error.
 */
export async function predictChurn(customerData, { signal } = {}) {
  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
      signal,
    });

    if (!res.ok) {
      // try parse json error details, fallback to status text
      const text = await res.text().catch(() => null);
      let message = `Request failed (${res.status})`;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          message = parsed.detail || JSON.stringify(parsed);
        } catch {
          message = text;
        }
      } else {
        message = res.statusText || message;
      }
      throw new Error(message);
    }

    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Request timed out");
    throw err;
  }
}
