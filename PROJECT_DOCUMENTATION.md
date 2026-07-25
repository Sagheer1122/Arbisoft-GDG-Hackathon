# 🏥 NurseFlow — Full Platform System & Technical Documentation

Welcome to the comprehensive system manual for **NurseFlow**, an enterprise-grade full-stack web application engineered for hospital nurse scheduling, duty roster optimization, real-time shift swaps, leave management, and AI-powered clinical skill training.

---

## 📋 Table of Contents
1. [Executive Overview & Objectives](#1-executive-overview--objectives)
2. [System Architecture & Tech Stack](#2-system-architecture--tech-stack)
3. [Core Module 1: Duty Roster Calendar Engine](#3-core-module-1-duty-roster-calendar-engine)
4. [Core Module 2: Gemma 4 AI Patient Communication Simulator](#4-core-module-2-gemma-4-ai-patient-communication-simulator)
5. [Core Module 3: Gemma 4 AI Tick & Cross Break Game](#5-core-module-3-gemma-4-ai-tick--cross-break-game)
6. [Core Module 4: Shift Swaps, Leave & Socket.IO Alerts](#6-core-module-4-shift-swaps-leave--socketio-alerts)
7. [Prisma Database Schema & Models](#7-prisma-database-schema--models)
8. [Complete REST API Reference](#8-complete-rest-api-reference)
9. [Design System & Photorealistic Avatars](#9-design-system--photorealistic-avatars)
10. [Setup & Operational Deployment Guide](#10-setup--operational-deployment-guide)

---

## 1. Executive Overview & Objectives

NurseFlow addresses critical hospital ward operational problems:

- **Scheduling Chaos & Overlapping Duty**: Eliminates shift collisions and text overlap on duty rosters.
- **Clinical Communication Gaps**: Provides safe AI roleplay simulation for nurses to practice handling high-stress patient/family conversations.
- **Shift Burnout**: Offers a 100% non-medical break game lounge (*AI Tick & Cross ❌⭕*) to revitalize focus during 10-minute shift breaks.
- **Delayed Communication**: Dispatches instant Socket.IO WebSocket push notifications for emergency ward calls and request approvals.

---

## 2. System Architecture & Tech Stack

NurseFlow follows a decoupled client-server architecture.

### Tech Stack Layer Breakdown
- **Frontend SPA**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Glassmorphism UI.
- **Backend API**: Node.js, Express, TypeScript, REST Architecture, JWT Authentication, Bcrypt.
- **Database Layer**: Prisma ORM, SQLite (`dev.db`), Type-safe queries.
- **AI Intelligence**: Google Gemma 4 AI Engine for roleplay persona generation, 8-score analysis engine, and Minimax AI for Tic-Tac-Toe.
- **Real-Time Engine**: Socket.IO WebSockets for real-time alert broadcasts.

---

## 3. Core Module 1: Duty Roster Calendar Engine

The Roster Calendar module (`NurseRoster.tsx`) presents weekly and monthly calendar views.

### Standardized Shift Definitions & Tokens
- **Morning Shift**: 7:00 AM – 3:00 PM (Soft Emerald Tint `bg-emerald-50/70 border-emerald-200`)
- **Evening Shift**: 3:00 PM – 11:00 PM (Soft Amber Tint `bg-amber-50/70 border-amber-200`)
- **Night Shift**: 11:00 PM – 7:00 AM (Soft Light Purple Tint `bg-[#EDE9FE]/50 border-purple-200`)
- **Off Duty**: No Shift Assigned (Soft Slate Tint `bg-slate-50 border-slate-200`)
- **Full-Width Action Button**: Dedicated `View Details →` button on every day card ensuring non-overlapping layout regardless of viewport width.

---

## 4. Core Module 2: Gemma 4 AI Patient Communication Simulator

Allows nurses to practice Healthcare Communication with simulated patient and caregiver personas.

### Key Features
- **Pre-Seeded Scenarios**: *Anxious Patient, Angry Family Member, Confused Elderly Patient, Non-Cooperative Patient, Difficult Conversation, Emergency Communication*.
- **Dynamic Emotion Shift Tracking**: Evaluates nurse empathy signals ('understand', 'listen', 'help') to transition character emotion state: **Hostile ➔ Frustrated ➔ Worried ➔ Calm ➔ Reassured**.
- **8-Competency Evaluation System**: Scores Empathy, Active Listening, Clarity, Professionalism, Emotional Intelligence, De-escalation, Patient Engagement, and Confidence (0–100).

---

## 5. Core Module 3: Gemma 4 AI Tick & Cross (Tic-Tac-Toe ❌⭕) Break Game

Designed for 10-minute shift breaks, this 100% non-medical relaxation game allows nurses to play Tic-Tac-Toe against Gemma 4 AI.

- **3 AI Difficulty Modes**: Easy (Casual Chill), Medium (Smart Rival), and Unbeatable (Gemma 4 Minimax Algorithm).
- **Scoreboard & Wellness Points**: Tracks Nurse Wins, AI Wins, Draws, and awards Wellness Points.
- **10-Minute Break Timer**: Built-in live countdown timer keeps break durations structured.

---

## 6. Core Module 4: Shift Swaps, Leave & Socket.IO Alerts

- **Shift Swaps**: Nurse-to-nurse duty exchange requests with 1-click admin approval workflows.
- **Leave Requests**: Applications for Sick, Annual, and Emergency leave with status badges (Pending, Approved, Rejected).
- **Real-Time Push Alerts**: WebSocket event broadcasts for emergency ward calls and unread badge count updates.

---

## 7. Complete Prisma Database Schemas (All 12 Relational Models)

```prisma
// 1. Staff User Credentials & Roles
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("NURSE") // NURSE, ADMIN, HEAD_NURSE
  phone        String?
  employeeId   String   @unique
  departmentId String?
  avatar       String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// 2. Hospital Ward Departments
model Department {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
}

// 3. Shift Hour Categories & Color Tokens
model Shift {
  id        String   @id @default(uuid())
  name      String
  startTime String
  endTime   String
  type      String   // MORNING, EVENING, NIGHT, OFF
  color     String   // green, yellow, purple, gray
  createdAt DateTime @default(now())
}

// 4. Daily Duty Roster Assignments
model Roster {
  id           String   @id @default(uuid())
  nurseId      String
  shiftId      String
  departmentId String
  date         String   // YYYY-MM-DD
  status       String   @default("SCHEDULED") // ON_DUTY, SCHEDULED, OFF, COMPLETED
  notes        String?
  createdBy    String?
  createdAt    DateTime @default(now())
}

// 5. Leave Requests & Approval History
model LeaveRequest {
  id         String    @id @default(uuid())
  nurseId    String
  leaveType  String
  fromDate   String
  toDate     String
  reason     String
  attachment String?
  status     String    @default("PENDING") // PENDING, APPROVED, REJECTED
  reviewedBy String?
  reviewedAt DateTime?
  createdAt  DateTime  @default(now())
}

// 6. Nurse-to-Nurse Shift Swap Requests
model ShiftSwapRequest {
  id              String    @id @default(uuid())
  requesterId     String
  targetNurseId   String
  originalShiftId String
  requestedDate   String
  reason          String
  status          String    @default("PENDING") // PENDING, APPROVED, REJECTED
  reviewedBy      String?
  reviewedAt      DateTime?
  createdAt       DateTime  @default(now())
}

// 7. Push Notifications & Ward Alerts
model Notification {
  id        String   @id @default(uuid())
  userId    String
  title     String
  message   String
  type      String   @default("INFO") // SHIFTS, LEAVE, SWAP, ROSTER, ALERT, INFO
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

// 8. AI Roleplay Training Scenarios
model CommunicationScenario {
  id            String   @id @default(uuid())
  title         String
  category      String   // Patient, Family Member, Elderly, Emergency, De-escalation
  description   String
  characterRole String   // Patient, Family Member, Elderly Patient
  personality   String   // Anxious, Hostile, Confused, Demanding
  difficulty    String   @default("BEGINNER") // BEGINNER, INTERMEDIATE, ADVANCED
  objectives    String   // JSON string array of learning objectives
  createdAt     DateTime @default(now())
}

// 9. Active & Completed Roleplay Sessions
model CommunicationSession {
  id            String    @id @default(uuid())
  userId        String
  scenarioId    String
  characterRole String
  difficulty    String    @default("BEGINNER")
  startedAt     DateTime  @default(now())
  endedAt       DateTime?
  status        String    @default("ACTIVE") // ACTIVE, COMPLETED, ABANDONED
  overallScore  Int?      @default(0)
  createdAt     DateTime  @default(now())
}

// 10. Roleplay Conversation Dialogue Turns & Emotions
model CommunicationMessage {
  id        String   @id @default(uuid())
  sessionId String
  role      String   // NURSE or PATIENT
  content   String
  emotion   String?  @default("Calm") // Calm, Worried, Confused, Frustrated, Angry, Reassured
  createdAt DateTime @default(now())
}

// 11. 8-Competency AI Performance Evaluation Reports
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
  strengths                   String   // JSON string
  improvementAreas            String   // JSON string
  feedback                    String   // Overall AI summary paragraph
  highlights                  String?  // JSON string array of positive/negative quotes
  createdAt                   DateTime @default(now())
}

// 12. Nurse Break Game Scores & Wellness Points
model NurseGameScore {
  id           String   @id @default(uuid())
  userId       String
  gameType     String   @default("TIC_TAC_TOE")
  nurseWins    Int      @default(0)
  aiWins       Int      @default(0)
  draws        Int      @default(0)
  pointsEarned Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 8. Complete REST API Reference

| Method | Endpoint Route | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user credentials & return JWT token | Public |
| `POST` | `/api/auth/register` | Register new nurse or administrator account | Public |
| `GET` | `/api/users` | Fetch list of all staff nurses & employees | Admin |
| `GET` | `/api/rosters` | Fetch duty rosters (filter by date/nurse) | Auth |
| `POST` | `/api/rosters` | Assign shift roster entry to nurse | Admin |
| `POST` | `/api/leave-requests` | Submit leave application (Sick, Annual) | Nurse |
| `POST` | `/api/shift-swaps` | Request shift exchange with target nurse | Nurse |
| `POST` | `/api/notifications/send-alert` | Broadcast ward emergency push notification | Admin |
| `GET` | `/api/communication-simulator/scenarios` | Fetch roleplay scenarios list | Auth |
| `POST` | `/api/communication-simulator/sessions` | Initialize new AI roleplay session | Auth |
| `POST` | `/api/communication-simulator/sessions/:id/messages` | Send nurse dialogue & get AI roleplay reply | Auth |
| `POST` | `/api/communication-simulator/sessions/:id/end` | End session & generate 8-competency evaluation | Auth |
| `POST` | `/api/games/tic-tac-toe/move` | Compute Gemma 4 AI move (Minimax) | Auth |
| `POST` | `/api/games/tic-tac-toe/score` | Save match outcome & update wellness points | Auth |

---

## 9. Design System & Photorealistic Avatars

- **Color Palette**: `#5142C5` Primary Purple, `#16162A` Dark Mesh, `#EDE9FE` Light Purple Accent.
- **Glassmorphism**: Liquid glass header buttons (`bg-white/15 backdrop-blur-md border border-white/30 text-white`).
- **Photorealistic Nurse Avatars**: Generated 8K realistic portraits for female nurse with full hijab (`client/public/images/hijab_nurse.png`) and male nurse (`client/public/images/male_nurse.png`).

---

## 10. Setup & Operational Deployment Guide

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Database migration & seeding
cd ../server
npx prisma db push
npx ts-node prisma/seed.ts

# 3. Start development servers
npm run dev # Server (Port 5000)
npm run dev # Client (Port 5173)
```
