# 📖 NurseFlow API Reference & Developer Documentation

Welcome to the **NurseFlow REST API Documentation**. This guide provides complete request schemas, JSON parameters, authentication methods, and example responses for all backend endpoints.

---

## 🌐 Global API Information

- **Base URL**: `http://localhost:5000/api`
- **Content Type**: `application/json`
- **Authentication**: JWT Bearer Token passed via HTTP Header:
  ```http
  Authorization: Bearer <YOUR_JWT_TOKEN>
  ```

---

## 🔐 1. Authentication Endpoints (`/api/auth`)

### 1.1 Login User
Authenticate nurse or administrator credentials and return JWT token.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public

**Request Body**:
```json
{
  "email": "sarah.johnson@nurseflow.com",
  "password": "password123"
}
```

**Response (`200 OK`)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "sarah-uuid",
    "name": "Sarah Johnson",
    "email": "sarah.johnson@nurseflow.com",
    "role": "NURSE",
    "employeeId": "NUR-101",
    "departmentId": "dept-1"
  }
}
```

---

### 1.2 Register User
Create a new staff nurse or administrator account.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Access**: Public

**Request Body**:
```json
{
  "name": "Amina Khan",
  "email": "amina.khan@nurseflow.com",
  "password": "password123",
  "role": "NURSE",
  "employeeId": "NUR-105",
  "phone": "+1 (555) 678-9012",
  "departmentId": "dept-1"
}
```

---

### 1.3 Get Current User Profile
Fetch profile details for the authenticated user.

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Access**: Authenticated

---

## 👥 2. Staff Management (`/api/users`)

### 2.1 List All Staff
Fetch all registered nurses and hospital staff.

- **URL**: `/api/users`
- **Method**: `GET`
- **Access**: Admin

---

### 2.2 Update Staff User
Update employee role, phone number, or department assignment.

- **URL**: `/api/users/:id`
- **Method**: `PATCH`
- **Access**: Admin

**Request Body**:
```json
{
  "role": "HEAD_NURSE",
  "phone": "+1 (555) 999-1111"
}
```

---

## 🏢 3. Departments (`/api/departments`)

### 3.1 Get All Departments
- **URL**: `/api/departments`
- **Method**: `GET`
- **Access**: Authenticated

---

## 📅 4. Duty Rosters (`/api/rosters`)

### 4.1 Get Weekly Roster Schedule
Fetch duty roster assignments (supports filtering by date or nurse ID).

- **URL**: `/api/rosters?date=2025-05-15`
- **Method**: `GET`
- **Access**: Authenticated

**Sample Response (`200 OK`)**:
```json
[
  {
    "id": "roster-1",
    "nurseId": "sarah-uuid",
    "date": "2025-05-15",
    "status": "ON_DUTY",
    "notes": "Ensure vitals are checked every 2 hours.",
    "shift": {
      "name": "Morning Shift",
      "startTime": "7:00 AM",
      "endTime": "3:00 PM",
      "type": "MORNING"
    },
    "department": {
      "name": "General Ward"
    }
  }
]
```

---

### 4.2 Assign Shift Roster
- **URL**: `/api/rosters`
- **Method**: `POST`
- **Access**: Admin

**Request Body**:
```json
{
  "nurseId": "sarah-uuid",
  "shiftId": "shift-morning-id",
  "departmentId": "dept-1-id",
  "date": "2025-05-16",
  "notes": "Assigned to Ward 3 triage."
}
```

---

## 🏖️ 5. Leave Requests (`/api/leave-requests`)

### 5.1 Submit Leave Application
- **URL**: `/api/leave-requests`
- **Method**: `POST`
- **Access**: Nurse

**Request Body**:
```json
{
  "leaveType": "Annual Leave",
  "fromDate": "2025-05-20",
  "toDate": "2025-05-22",
  "reason": "Family vacation and personal downtime."
}
```

---

### 5.2 Approve Leave Application
- **URL**: `/api/leave-requests/:id/approve`
- **Method**: `PATCH`
- **Access**: Admin

---

## 🔄 6. Shift Swap Requests (`/api/shift-swaps`)

### 6.1 Request Shift Swap Exchange
- **URL**: `/api/shift-swaps`
- **Method**: `POST`
- **Access**: Nurse

**Request Body**:
```json
{
  "targetNurseId": "emily-uuid",
  "originalShiftId": "night-shift-id",
  "requestedDate": "2025-05-15",
  "reason": "Overlapping clinical training session."
}
```

---

## 🔔 7. Notifications (`/api/notifications`)

### 7.1 Broadcast Ward Emergency Alert
- **URL**: `/api/notifications/send-alert`
- **Method**: `POST`
- **Access**: Admin

**Request Body**:
```json
{
  "title": "EMERGENCY: Code Blue Ward 4",
  "message": "All available ICU nurses report immediately to Room 402."
}
```

---

## 🤖 8. Gemma 4 AI Patient Communication Simulator (`/api/communication-simulator`)

### 8.1 Fetch Available Scenarios
- **URL**: `/api/communication-simulator/scenarios`
- **Method**: `GET`
- **Access**: Authenticated

---

### 8.2 Start AI Simulation Session
- **URL**: `/api/communication-simulator/sessions`
- **Method**: `POST`
- **Access**: Authenticated

**Request Body**:
```json
{
  "scenarioId": "scen-anxious-id",
  "characterRole": "Patient",
  "difficulty": "INTERMEDIATE"
}
```

---

### 8.3 Send Nurse Dialogue & Receive Roleplay Reply
- **URL**: `/api/communication-simulator/sessions/:id/messages`
- **Method**: `POST`
- **Access**: Authenticated

**Request Body**:
```json
{
  "content": "I understand you're feeling anxious. I am Nurse Sarah, and I will explain the procedure step by step."
}
```

**Response (`200 OK`)**:
```json
{
  "nurseMsg": {
    "role": "NURSE",
    "content": "I understand you're feeling anxious..."
  },
  "patientMsg": {
    "role": "PATIENT",
    "content": "Thank you nurse, that makes me feel much more comfortable. What should I expect first?",
    "emotion": "Calm"
  },
  "emotion": "Calm"
}
```

---

### 8.4 End Simulation & Analyze Performance
- **URL**: `/api/communication-simulator/sessions/:id/end`
- **Method**: `POST`
- **Access**: Authenticated

**Response (`200 OK`)**:
```json
{
  "message": "Simulation analyzed successfully",
  "analysis": {
    "overallScore": 87,
    "empathyScore": 90,
    "activeListeningScore": 84,
    "clarityScore": 88,
    "professionalismScore": 92,
    "deEscalationScore": 85,
    "strengths": "[\"Acknowledged emotional state\", \"Maintained professional tone\"]",
    "feedback": "Great communication performance! You successfully reassured the patient."
  }
}
```

---

## ❌⭕ 9. Gemma 4 AI Break Games — Tick & Cross (`/api/games`)

### 9.1 Compute Gemma 4 AI Move
- **URL**: `/api/games/tic-tac-toe/move`
- **Method**: `POST`
- **Access**: Authenticated

**Request Body**:
```json
{
  "board": ["X", null, null, null, "O", null, null, null, null],
  "aiSymbol": "O",
  "userSymbol": "X",
  "difficulty": "UNBEATABLE"
}
```

**Response (`200 OK`)**:
```json
{
  "aiMoveIndex": 2,
  "updatedBoard": ["X", null, "O", null, "O", null, null, null, null],
  "winner": null
}
```

---

### 9.2 Record Game Score & Award Points
- **URL**: `/api/games/tic-tac-toe/score`
- **Method**: `POST`
- **Access**: Authenticated

**Request Body**:
```json
{
  "outcome": "NURSE_WIN"
}
```

---

## ⚡ Error Handling Standard

Errors follow the HTTP status code standard:

```json
{
  "error": "Error message description",
  "status": 400
}
```
