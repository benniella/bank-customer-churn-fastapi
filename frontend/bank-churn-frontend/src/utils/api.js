// Use CORS proxy if direct connection fails
const USE_PROXY = false; // Set to true if CORS issues persist
const PROXY_URL = "https://corsproxy.io/?";
const DIRECT_URL = (import.meta.env.VITE_API_URL || "https://bank-customer-churn-fastapi.onrender.com").replace(/\/$/, '');
const API_URL = USE_PROXY ? PROXY_URL + encodeURIComponent(DIRECT_URL) : DIRECT_URL;

export async function predictChurn(customerData, { signal, timeout = 60000 } = {}) {
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
    if (!data || typeof data.prediction === 'undefined' || typeof data.probability === 'undefined') {
      throw new Error("Invalid response format from server");
    }

    // Transform backend response to match frontend expectations
    // Backend returns: { prediction: 0/1, probability: [prob_no_churn, prob_churn] }
    // Frontend expects: { prediction: "No Churn"/"Churn", churn_probability: number, threshold: number }
    
    // Handle probability as either array or number
    let churnProb;
    if (Array.isArray(data.probability)) {
      // If array, take the second element (probability of churn/positive class)
      churnProb = data.probability[1];
    } else {
      // If single number, use it directly
      churnProb = data.probability;
    }

    const transformedData = {
      prediction: data.prediction === 1 ? "Churn" : "No Churn",
      churn_probability: churnProb, // Probability of churn
      threshold: data.threshold || 0.57 // Threshold from backend or default
    };

    return transformedData;
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.name === "AbortError") {
      throw new Error("The server is taking too long to respond. This might be because the server is waking up (Render free tier). Please wait a moment and try again.");
    }
    
    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    
    throw err;
  }
}

// Wake up the server (for Render free tier)
export async function wakeUpServer() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const res = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
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
    return data.message && data.message.includes("Churn Prediction API is running");
  } catch {
    return false;
  }
}