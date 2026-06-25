/**
 * Enhanced error handler for API requests
 * Provides detailed error information for debugging
 */
export const handleApiError = (error, context = '') => {
  const errorDetails = {
    message: 'An error occurred',
    status: null,
    data: null,
    context,
  };

  if (error.response) {
    // Server responded with error status
    errorDetails.status = error.response.status;
    errorDetails.data = error.response.data;
    
    switch (error.response.status) {
      case 400:
        errorDetails.message = 'Invalid data sent to server';
        console.error('❌ 400 Bad Request:', {
          context,
          sentData: error.config?.data,
          serverResponse: error.response.data,
          url: error.config?.url,
        });
        break;
      case 401:
        errorDetails.message = 'Unauthorized - Please login';
        break;
      case 403:
        errorDetails.message = 'Forbidden - You do not have permission';
        break;
      case 404:
        errorDetails.message = 'Resource not found';
        break;
      case 409:
        errorDetails.message = 'Conflict - Resource already exists';
        break;
      case 500:
        errorDetails.message = 'Server error - Please try again later';
        break;
      default:
        errorDetails.message = `Server error: ${error.response.status}`;
    }
  } else if (error.request) {
    // Request made but no response
    errorDetails.message = 'No response from server - Check your connection';
    console.error('❌ Network Error:', {
      context,
      request: error.request,
    });
  } else {
    // Something else happened
    errorDetails.message = error.message || 'Unknown error occurred';
    console.error('❌ Error:', {
      context,
      message: error.message,
    });
  }

  return errorDetails;
};

/**
 * Validate data before sending to API
 */
export const validateData = (data, requiredFields = []) => {
  const errors = [];

  // Check for required fields
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      errors.push(`${field} is required`);
    }
  });

  // Check for null or undefined values
  Object.keys(data).forEach(key => {
    if (data[key] === null || data[key] === undefined) {
      errors.push(`${key} cannot be null or undefined`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Log request for debugging
 */
export const logRequest = (method, url, data = null) => {
  console.group(`🔵 API Request: ${method} ${url}`);
  console.log('Timestamp:', new Date().toISOString());
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Data Type:', typeof data);
    console.log('Data Keys:', Object.keys(data));
  }
  console.groupEnd();
};
