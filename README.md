# 🏥 NurseFlow — Smart Healthcare Roster & AI Clinical Training Platform

NurseFlow is an enterprise-grade full-stack web application designed for hospital nurse scheduling, duty roster optimization, real-time shift swaps, leave management, and AI-powered clinical skill training.

---

## 🌟 Key Features

- **📅 Smart Roster Calendar**: Weekly and monthly calendar grid views with shift color-coding (Morning, Evening, Night, Off Duty) and zero text overlap.
- **🤖 Gemma 4 AI Patient Communication Simulator**: Interactive roleplay training simulator allowing nurses to practice communicating with simulated patient & caregiver personas (*Anxious Patient, Angry Family Member, Confused Elderly Patient*). Features real-time emotion tracking and an 8-competency evaluation report.
- **❌⭕ Gemma 4 AI Tick & Cross Break Game**: 100% non-medical relaxation game with 3 AI difficulty modes (*Easy, Medium, Unbeatable Minimax*) and a 10-minute shift break timer.
- **🔄 Shift Swap & Leave Management**: Nurse-to-nurse shift exchange system and admin approval workflows.
- **⚡ Socket.IO Real-Time Push Alerts**: Instant emergency broadcasts and roster change notifications.
- **🎨 Glassmorphic Aesthetic**: Modern HSL-tailored purple theme (`#5142C5`), liquid glass buttons, and photorealistic 8K nurse avatars.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System tokens (`rounded-card`, `shadow-nurse-md`)
- **Icons**: Lucide React
- **Routing**: React Router v6

### Backend & Database
- **Server**: Node.js + Express
- **ORM**: Prisma ORM
- **Database**: SQLite (`dev.db`)
- **Real-Time Communication**: Socket.IO
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt Password Hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/Sagheer1122884/campus-connect-hub.git
cd campus-connect-hub

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Database Migration & Seeding
```bash
cd ../server
npx prisma db push
npx ts-node prisma/seed.ts
```

### 3. Running the Development Environment
```bash
# Terminal 1: Run Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Run Frontend Client (Port 5173)
cd client
npm run dev
```

Visit the client application at `http://localhost:5173`.

---

## 📖 Complete Backend API Endpoint Documentation

All authenticated endpoints require an `Authorization: Bearer <token>` header.

### 🔑 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new nurse or administrator account | Public |
| `POST` | `/api/auth/login` | Authenticate user and return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch current logged-in user profile | Authenticated |

---

### 👥 2. User & Staff Management (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | List all staff nurses and hospital employees | Admin |
| `GET` | `/api/users/:id` | Get user details by ID | Authenticated |
| `PATCH` | `/api/users/:id` | Update staff profile, role, or department | Admin |

---

### 🏢 3. Departments (`/api/departments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/departments` | Fetch all hospital ward departments | Authenticated |
| `POST` | `/api/departments` | Create a new hospital department | Admin |

---

### ⏰ 4. Shift Types (`/api/shifts`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shifts` | List shift definitions (Morning, Evening, Night, Off) | Authenticated |
| `POST` | `/api/shifts` | Define custom hospital shift hours | Admin |

---

### 📅 5. Duty Rosters (`/api/rosters`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rosters` | Get weekly/monthly duty schedule (filter by date/nurse) | Authenticated |
| `POST` | `/api/rosters` | Assign shift roster to a nurse | Admin |
| `PATCH` | `/api/rosters/:id` | Modify an existing roster entry | Admin |
| `DELETE` | `/api/rosters/:id` | Cancel/Delete a roster assignment | Admin |

---

### 🏖️ 6. Leave Requests (`/api/leave-requests`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leave-requests` | List leave applications | Authenticated |
| `POST` | `/api/leave-requests` | Submit leave request (Sick, Annual, Emergency) | Nurse |
| `PATCH` | `/api/leave-requests/:id/approve` | Approve leave application | Admin |
| `PATCH` | `/api/leave-requests/:id/reject` | Reject leave application | Admin |

---

### 🔄 7. Shift Swap Requests (`/api/shift-swaps`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shift-swaps` | List shift swap requests | Authenticated |
| `POST` | `/api/shift-swaps` | Request shift exchange with another nurse | Nurse |
| `PATCH` | `/api/shift-swaps/:id/approve` | Approve shift swap exchange | Admin |
| `PATCH` | `/api/shift-swaps/:id/reject` | Reject shift swap exchange | Admin |

---

### 🔔 8. Notifications (`/api/notifications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Fetch user push notifications | Authenticated |
| `PATCH` | `/api/notifications/:id/read` | Mark specific notification as read | Authenticated |
| `PATCH` | `/api/notifications/read-all` | Mark all user notifications as read | Authenticated |
| `POST` | `/api/notifications/send-alert` | Broadcast emergency alert across ward | Admin |

---

### 📊 9. Reports & Analytics (`/api/reports`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports` | Summary analytics on ward staffing and hours | Admin |

---

### 🤖 10. Gemma 4 AI Patient Communication Simulator (`/api/communication-simulator`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/communication-simulator/scenarios` | List training scenarios (Anxious, Angry, Confused) | Authenticated |
| `POST` | `/api/communication-simulator/sessions` | Initialize new AI simulation roleplay session | Authenticated |
| `GET` | `/api/communication-simulator/sessions/:id` | Fetch session details and transcript history | Authenticated |
| `POST` | `/api/communication-simulator/sessions/:id/messages` | Send nurse dialogue & receive Gemma 4 roleplay reply | Authenticated |
| `POST` | `/api/communication-simulator/sessions/:id/end` | End simulation & trigger 8-competency evaluation | Authenticated |
| `GET` | `/api/communication-simulator/sessions/:id/results` | Get performance report & AI clinical advice | Authenticated |
| `GET` | `/api/communication-simulator/progress` | Get nurse historical communication progress trend | Authenticated |

---

### ❌⭕ 11. Gemma 4 AI Break Games — Tick & Cross (`/api/games`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/games/tic-tac-toe/move` | Compute Gemma 4 AI move (Easy, Medium, Minimax) | Authenticated |
| `POST` | `/api/games/tic-tac-toe/score` | Record match outcome and award wellness points | Authenticated |
| `GET` | `/api/games/tic-tac-toe/score` | Fetch nurse win streak & wellness stats | Authenticated |

---

## 🔐 Security & Roles

- **Nurse (`NURSE`)**: Access to personal dashboard, roster calendar, leave requests, shift swaps, AI Patient Communication Simulator, and Tick & Cross Break Game.
- **Admin (`ADMIN` / `HEAD_NURSE`)**: Full system access including roster creation, staff management, request approvals, and ward analytics.

---

## 📄 License

This project is open-source and available under the MIT License.
