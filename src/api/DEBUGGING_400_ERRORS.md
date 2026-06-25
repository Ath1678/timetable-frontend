# Debugging 400 Bad Request Errors

## What Does This Error Mean?
A 400 error means the server rejected your request because the data you sent is invalid or malformed.

## Step-by-Step Debugging Guide

### Step 1: Check Browser Console
With the updated `apiClient.js`, you should now see detailed logs like:

```
🔵 API Request: POST /classes
Full URL: http://localhost:8081/api/classes
Headers: {...}
Request Data: { name: "Class 10A", section: "A" }
Request Data Type: object

❌ API Error: 400 POST /classes
Status: 400
Error Data: { message: "field 'xyz' is required" }
Sent Data: {...}
```

### Step 2: Common Causes and Solutions

#### 1. **Missing Required Fields**
**Problem:** Backend expects certain fields that you're not sending

**Check:**
- What fields does your backend require?
- Are you sending all of them?

**Example Fix:**
```javascript
// ❌ Wrong - missing required field
const data = { name: "Class 10A" };

// ✅ Correct - includes all required fields
const data = { 
  name: "Class 10A", 
  section: "A",
  academicYear: "2024-2025"
};
```

#### 2. **Wrong Field Names**
**Problem:** Field names don't match what backend expects

**Example:**
```javascript
// ❌ Backend expects 'className', you're sending 'name'
const data = { name: "Class 10A" };

// ✅ Correct field name
const data = { className: "Class 10A" };
```

#### 3. **Wrong Data Types**
**Problem:** Sending string when backend expects number (or vice versa)

**Example:**
```javascript
// ❌ Sending string when backend expects number
const data = { classId: "123" };

// ✅ Sending number
const data = { classId: 123 };
```

#### 4. **Extra/Unexpected Fields**
**Problem:** Sending fields that backend doesn't accept

**Example:**
```javascript
// ❌ Backend doesn't accept 'extraField'
const data = { 
  name: "Class 10A",
  extraField: "something"  // Remove this
};

// ✅ Only send expected fields
const data = { name: "Class 10A" };
```

#### 5. **Null or Undefined Values**
**Problem:** Sending null/undefined for required fields

**Example:**
```javascript
// ❌ Section is undefined
const data = { 
  name: "Class 10A",
  section: undefined
};

// ✅ Provide actual value or remove field
const data = { 
  name: "Class 10A",
  section: "A"
};
```

#### 6. **Invalid Date Format**
**Problem:** Date format doesn't match backend expectations

**Example:**
```javascript
// ❌ Wrong date format
const data = { startDate: "01/02/2024" };

// ✅ ISO format or backend-expected format
const data = { startDate: "2024-02-01" };
```

### Step 3: Compare with Backend Expectations

Check your backend code (Controller/DTO) to see what it expects:

**Example Java Spring Boot:**
```java
public class ClassDTO {
    @NotNull
    private String className;  // Required field
    
    private String section;    // Optional field
    
    @Min(1)
    private Integer capacity;  // Must be number >= 1
}
```

**Then your frontend should send:**
```javascript
const data = {
  className: "Class 10A",  // String, required
  section: "A",            // String, optional
  capacity: 30             // Number, must be >= 1
};
```

### Step 4: Use the Error Handler

Import and use the error handler for better error messages:

```javascript
import { handleApiError, validateData } from './errorHandler';
import { addClass } from './classApi';

const handleSubmit = async (formData) => {
  try {
    // Validate before sending
    const validation = validateData(formData, ['name', 'section']);
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      alert('Please fill all required fields');
      return;
    }

    // Send request
    const result = await addClass(formData);
    console.log('Success:', result);
    
  } catch (error) {
    const errorDetails = handleApiError(error, 'Adding class');
    alert(errorDetails.message);
    
    // Check what the server said
    if (errorDetails.data) {
      console.error('Server says:', errorDetails.data);
    }
  }
};
```

### Step 5: Test with Postman/curl

Test your API directly to see what works:

**Using curl:**
```bash
curl -X POST http://localhost:8081/api/classes \
  -H "Content-Type: application/json" \
  -d '{
    "className": "Class 10A",
    "section": "A"
  }'
```

If this works in Postman but not in your app, the issue is in how you're formatting the data in your frontend.

### Step 6: Common React/Form Issues

#### Issue: Controlled inputs sending wrong data
```javascript
// ❌ Form state might have extra properties
const [formData, setFormData] = useState({
  name: '',
  section: '',
  extraStuff: null  // Remove this
});

// ✅ Only include what backend expects
const [formData, setFormData] = useState({
  name: '',
  section: ''
});
```

#### Issue: Number inputs sending strings
```javascript
// ❌ Input value is always string
<input 
  type="number" 
  value={formData.capacity}
  onChange={(e) => setFormData({
    ...formData, 
    capacity: e.target.value  // This is a string!
  })}
/>

// ✅ Convert to number
<input 
  type="number" 
  value={formData.capacity}
  onChange={(e) => setFormData({
    ...formData, 
    capacity: parseInt(e.target.value, 10)  // Convert to number
  })}
/>
```

## Quick Debugging Checklist

- [ ] Check browser console for detailed error logs
- [ ] Verify all required fields are being sent
- [ ] Confirm field names match backend expectations
- [ ] Check data types (string vs number vs boolean)
- [ ] Remove any extra/unexpected fields
- [ ] Ensure no null/undefined values for required fields
- [ ] Verify date/time formats match backend
- [ ] Test the same request in Postman
- [ ] Check backend logs for more details
- [ ] Verify Content-Type header is "application/json"

## Need More Help?

1. **Share the console output** - Copy the full error from browser console
2. **Share your backend DTO/Model** - Show what the backend expects
3. **Share the form data** - Show exactly what you're trying to send
4. **Share backend error response** - What does the server error message say?

With these details, we can pinpoint the exact issue!
