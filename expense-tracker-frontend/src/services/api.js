import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (Unauthorized) responses
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const refreshResponse = await axios.post(
            "token/refresh/",
            { refresh: refreshToken }
          );

          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem("access_token", newAccessToken);

          // Retry the failed request with the new token
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Remove invalid tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Fetch expenses
export const getExpenses = async (params = '') => {
  try {
    return await API.get(`expenses/?${params}`);
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
};

// Add expense
export const addExpense = async (expense) => {
  try {
    return await API.post("expenses/", expense);
  } catch (error) {
    console.error("Error adding expense:", error);
    if (error.response?.status === 401) {
      window.location.href = "/login"; // Force redirect if unauthorized
    }
  }
};

// Update expense
export const updateExpense = async (id, updatedExpense) => {
  try {
    return await API.put(`expenses/${id}/`, updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    return await API.delete(`expenses/${id}/`);
  } catch (error) {
    console.error("Error deleting expense:", error);
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Fetch expense summary
export const getExpenseSummary = async () => {
  try {
    return await API.get("expense-summary/");
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Fetch spending trends (monthly or weekly spending data)
export const getSpendingTrends = async (period = 'month', startDate) => {
  try {
    // Construct the URL with the period and optionally the startDate
    const url = period === 'week' && startDate 
      ? `spending-trends/${period}/?start_date=${startDate}` 
      : `spending-trends/${period}/`;
    
    // Make the API request
    return await API.get(url);
  } catch (error) {
    console.error("Error fetching spending trends:", error);
    if (error.response?.status === 401) {
      window.location.href = "/login"; // Force redirect if unauthorized
    }
  }
};


export const getCategoryBreakdown = async (period) => {
  try {
    return await API.get(`category-breakdown/${period}/`);
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    if (error.response?.status === 401) {
      window.location.href = "/login"; // Force redirect if unauthorized
    }
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login"; // Redirect to login page
};

export default API;
