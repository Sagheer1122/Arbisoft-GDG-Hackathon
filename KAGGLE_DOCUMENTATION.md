# 🏥 NurseFlow — Smart Roster Management & Gemma 4 AI Clinical Platform
### 🏆 Official Kaggle Competition & Dataset Documentation

![Kaggle Badge](https://img.shields.io/badge/Kaggle-Documentation-blue?style=for-the-badge&logo=kaggle)
![Gemma 4 AI](https://img.shields.io/badge/Gemma_4-AI_Engine-8B5CF6?style=for-the-badge&logo=google)
![Full Stack](https://img.shields.io/badge/Stack-React_18_%7C_Express_%7C_Prisma-5142C5?style=for-the-badge)

---

## 📌 Executive Summary & Kaggle Overview

**NurseFlow** is an AI-powered full-stack healthcare management platform engineered to solve hospital workforce burnout, duty roster friction, and clinical communication challenges.

Key AI innovations integrated into NurseFlow:
1. **🤖 Gemma 4 AI Clinical Patient Communication Simulator**: Interactive roleplay training simulator allowing nurses to practice communicating with simulated patient & caregiver personas (*Anxious Patient, Angry Family Member, Confused Elderly Patient*). Features dynamic emotion tracking and an 8-competency AI evaluation engine.
2. **❌⭕ Gemma 4 AI Tick & Cross Break Game**: 100% non-medical relaxation mini-game with 3 AI difficulty modes (*Easy, Medium, Unbeatable Minimax Algorithm*) and a live 10-minute shift break timer to help nurses de-stress.
3. **📅 Smart Duty Roster Engine**: Color-coded weekly and monthly duty calendar with non-overlapping card layouts.
4. **⚡ Socket.IO Real-Time Push Alerts**: Instant emergency ward broadcasts and shift swap notifications.

---

## 📸 Application Screenshots Gallery

| Application Screen | High-Resolution Preview |
| :--- | :--- |
| **Nurse Active Shift Dashboard** | ![Dashboard Overview](https://raw.githubusercontent.com/Sagheer1122/Arbisoft-GDG-Hackathon/main/screenshots/dashboard_overview.png) |
| **Duty Roster Calendar Grid** | ![Duty Roster Calendar](https://raw.githubusercontent.com/Sagheer1122/Arbisoft-GDG-Hackathon/main/screenshots/roster_calendar.png) |
| **Gemma 4 AI Patient Simulator Chat** | ![Gemma AI Communication Simulator](https://raw.githubusercontent.com/Sagheer1122/Arbisoft-GDG-Hackathon/main/screenshots/gemma_communication_simulator.png) |
| **8-Competency AI Evaluation Report** | ![Gemma AI Evaluation Report](https://raw.githubusercontent.com/Sagheer1122/Arbisoft-GDG-Hackathon/main/screenshots/gemma_evaluation_results.png) |
| **Gemma 4 AI Tick & Cross Break Game** | ![Gemma AI Tick & Cross Game](https://raw.githubusercontent.com/Sagheer1122/Arbisoft-GDG-Hackathon/main/screenshots/gemma_tick_tac_toe_break_game.png) |
| **Shift Swap & Leave Requests Portal** | ![Shift Swaps & Requests](https://raw.githubusercontent.com/Sagheer1122/Arbisoft-GDG-Hackathon/main/screenshots/shift_swap_requests.png) |

---

## 📊 Key Metrics & Performance Summary

| Metric | Specification | Impact |
| :--- | :--- | :--- |
| **AI Model Engine** | Google Gemma 4 AI | Natural language roleplay & 8-score evaluation |
| **Shift Break Game** | Tic-Tac-Toe Minimax AI | Non-medical relaxation & 10-min break structure |
| **Competencies Evaluated** | 8 Key Clinical Metrics | Empathy, Active Listening, De-escalation, Clarity, etc. |
| **Real-time Engine** | Socket.IO WebSockets | < 50ms latency alert dispatch |
| **Database ORM** | Prisma ORM (SQLite) | Type-safe queries across 12 relational models |

---

## 🤖 Gemma 4 AI Model Integration & Algorithms

### 1. Dynamic Emotion Transition Engine
During roleplay simulations, Gemma 4 evaluates the nurse's tone in real-time. Empathetic dialogue keywords (*"understand", "listen", "help", "sorry"*) trigger character emotion state shifts:

$$\text{Emotion State Sequence: } \text{Hostile} \longrightarrow \text{Frustrated} \longrightarrow \text{Worried} \longrightarrow \text{Calm} \longrightarrow \text{Reassured}$$

### 2. 8-Competency Performance Evaluation
Upon completing a simulation session, Gemma 4 analyzes the entire conversation transcript and outputs 0–100 scores across:
1. **Empathy & Compassion**
2. **Active Listening**
3. **Communication Clarity**
4. **Professionalism**
5. **Emotional Intelligence**
6. **De-escalation Capability**
7. **Patient Engagement**
8. **Confidence**

### 3. Minimax Decision Tree (Tick & Cross Game)
The Tic-Tac-Toe AI utilizes a full-depth Minimax decision tree algorithm to evaluate all possible grid outcomes and choose the optimal move:

$$\text{Minimax Score} = \begin{cases} 
10 - \text{depth} & \text{if AI Wins} \\
\text{depth} - 10 & \text{if Nurse Wins} \\
0 & \text{if Draw}
\end{cases}$$

---

## 🗄️ Dataset & Database Schema (Prisma Data Dictionary)

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("NURSE") // NURSE, ADMIN, HEAD_NURSE
  employeeId   String   @unique
  departmentId String?
}

model Roster {
  id           String   @id @default(uuid())
  nurseId      String
  shiftId      String
  departmentId String
  date         String   // YYYY-MM-DD
  status       String   @default("SCHEDULED")
  notes        String?
}

model CommunicationScenario {
  id            String   @id @default(uuid())
  title         String
  category      String
  description   String
  characterRole String
  personality   String
  difficulty    String   @default("BEGINNER")
  objectives    String
}

model CommunicationSession {
  id            String    @id @default(uuid())
  userId        String
  scenarioId    String
  characterRole String
  difficulty    String    @default("BEGINNER")
  status        String    @default("ACTIVE")
  overallScore  Int?
}

model CommunicationMessage {
  id        String   @id @default(uuid())
  sessionId String
  role      String   // NURSE or PATIENT
  content   String
  emotion   String?  @default("Calm")
}

model CommunicationAnalysis {
  id                          String   @id @default(uuid())
  sessionId                   String   @unique
  overallScore                Int      @default(0)
  empathyScore                Int      @default(0)
  activeListeningScore        Int      @default(0)
  clarityScore                Int      @default(0)
  professionalismScore        Int      @default(0)
  emotionalIntelligenceScore Int      @default(0)
  deEscalationScore           Int      @default(0)
  patientEngagementScore     Int      @default(0)
  confidenceScore             Int      @default(0)
  strengths                   String
  improvementAreas            String
  feedback                    String
}

model NurseGameScore {
  id           String   @id @default(uuid())
  userId       String
  gameType     String   @default("TIC_TAC_TOE")
  nurseWins    Int      @default(0)
  aiWins       Int      @default(0)
  draws        Int      @default(0)
  pointsEarned Int      @default(0)
}
```

---

## ⚡ Complete REST API Reference

All requests require `Authorization: Bearer <token>`.

### 🔑 Auth API
- `POST /api/auth/login`: Login user & return JWT token.
- `POST /api/auth/register`: Register new nurse or admin.
- `GET /api/auth/me`: Get profile info.

### 📅 Duty Roster API
- `GET /api/rosters`: Fetch weekly/monthly schedules.
- `POST /api/rosters`: Assign roster entry.
- `PATCH /api/rosters/:id`: Update roster entry.

### 🤖 AI Patient Simulator API
- `GET /api/communication-simulator/scenarios`: Fetch training scenarios list.
- `POST /api/communication-simulator/sessions`: Initialize roleplay session.
- `POST /api/communication-simulator/sessions/:id/messages`: Send nurse message & get Gemma 4 reply.
- `POST /api/communication-simulator/sessions/:id/end`: End simulation & calculate 8-score report.
- `GET /api/communication-simulator/progress`: Get personal nurse progress trend.

### ❌⭕ AI Tick & Cross Break Game API
- `POST /api/games/tic-tac-toe/move`: Compute Gemma 4 AI move.
- `POST /api/games/tic-tac-toe/score`: Save match outcome & award wellness points.
- `GET /api/games/tic-tac-toe/score`: Fetch nurse win streak & wellness stats.

---

## 🚀 Quickstart Guide for Kaggle Notebooks

```python
# Sample Python script to query NurseFlow API from a Kaggle Notebook
import requests

BASE_URL = "http://localhost:5000/api"

# 1. Login
auth_payload = {
    "email": "sarah.johnson@nurseflow.com",
    "password": "password123"
}
response = requests.post(f"{BASE_URL}/auth/login", json=auth_payload)
token = response.json().get("token")
headers = {"Authorization": f"Bearer {token}"}

# 2. Fetch AI Communication Scenarios
scenarios = requests.get(f"{BASE_URL}/communication-simulator/scenarios", headers=headers)
print("Scenarios Available:", scenarios.json())
```

---

## 🎨 Design System & Visual Assets

- **Brand Primary Color**: Deep Purple `#5142C5`
- **Dark Background Mesh**: Dark Purple `#16162A`
- **Light Accent Color**: Soft Light Purple `#EDE9FE`
- **Glassmorphism Styling**: Liquid glass buttons (`bg-white/15 backdrop-blur-md border border-white/30 text-white`)
- **Photorealistic Nurse Avatars**: Generated 8K realistic portraits for female nurse with full hijab (`client/public/images/hijab_nurse.png`) and male nurse (`client/public/images/male_nurse.png`).

---

## 📄 License & Attribution

- **License**: MIT License
- **Author**: Sagheer Ahmad
- **GitHub Repository**: [https://github.com/Sagheer1122/Arbisoft-GDG-Hackathon.git](https://github.com/Sagheer1122/Arbisoft-GDG-Hackathon.git)
