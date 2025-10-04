// Use CORS proxy if direct connection fails
const USE_PROXY = false; // Set to true if CORS issues persist
const PROXY_URL = "https://corsproxy.io/?";
const DIRECT_URL = import.meta.env.VITE_API_URL || "https://bank-customer-churn-fastapi.onrender.com";
const API_URL = USE_PROXY ? PROXY_URL + encodeURIComponent(DIRECT_URL) : DIRECT_URL;

export async function predictChurn(customerData, { signal, timeout = 30000 } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(customerData),
      signal: signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `Request failed with status ${res.status}`;
      
      try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          
          // Handle FastAPI validation errors
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              // ValidationError array - format nicely
              errorMessage = errorData.detail
                .map(err => {
                  const field = err.loc[err.loc.length - 1];
                  return `${field}: ${err.msg}`;
                })
                .join(', ');
            } else if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else {
              errorMessage = JSON.stringify(errorData.detail);
            }
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } else {
          const text = await res.text();
          if (text) errorMessage = text;
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
      
      throw new Error(errorMessage);
    }

    const data = await res.json();
    
    // Validate response structure
    if (!data || typeof data.churn_probability === 'undefined') {
      throw new Error("Invalid response format from server");
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your internet connection and try again.");
    }
    
    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    
    throw err;
  }
}

// Health check function
export async function checkAPIHealth() {
  try {
    const res = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    
    if (!res.ok) return false;
    
    const data = await res.json();
    return data.message === "Churn Prediction API is running!";
  } catch {
    return false;
  }
}