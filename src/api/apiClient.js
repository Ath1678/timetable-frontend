import axios from "axios";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log outgoing request for debugging
    console.group(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Full URL:', config.baseURL + config.url);
    console.log('Headers:', config.headers);
    if (config.data) {
      console.log('Request Data:', config.data);
      console.log('Request Data Type:', typeof config.data);
    }
    if (config.params) {
      console.log('Query Params:', config.params);
    }
    console.groupEnd();

    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.group(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.groupEnd();

    return response;
  },
  (error) => {
    // Detailed error logging
    if (error.response) {
      // Server responded with error status
      console.group(`❌ API Error: ${error.response.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.log('Status:', error.response.status);
      console.log('Error Data:', error.response.data);
      console.log('Sent Data:', error.config?.data);
      console.log('Headers:', error.response.headers);

      // Specific handling for 400 errors
      if (error.response.status === 400) {
        console.warn('⚠️ BAD REQUEST - Common causes:');
        console.warn('1. Missing required fields');
        console.warn('2. Invalid data format');
        console.warn('3. Data type mismatch (e.g., string instead of number)');
        console.warn('4. Invalid field names');
        console.warn('5. Extra fields not expected by backend');

        if (error.response.data) {
          console.warn('Server Error Message:', error.response.data);
        }
      }
      console.groupEnd();
    } else if (error.request) {
      // Request made but no response
      console.group('❌ Network Error');
      console.error('No response received from server');
      console.error('Request:', error.request);
      console.error('Possible causes:');
      console.error('1. Server is not running');
      console.error('2. Wrong API URL');
      console.error('3. CORS issues');
      console.error('4. Network connectivity problems');
      console.groupEnd();
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
