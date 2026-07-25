# NurseFlow – AI-Powered Hospital Roster Management & Gemma Clinical Assistant

## 💡 Inspiration

### What local problem are you solving today?
Hospitals across Pakistan and globally face severe operational and clinical challenges:
- **Scheduling Chaos & Overlap**: Nurse rosters are managed manually or with clunky tools, leading to shift collisions, missed duties, and unreadable shift notes.
- **Clinical Nurse Burnout**: Nurses work demanding 12-hour shifts without structured relaxation tools to reset their mental focus.
- **Communication Training Gap**: Nurses rarely have a safe environment to practice difficult, high-stress patient and caregiver conversations (such as communicating with anxious patients or angry family members).

We wanted to build **NurseFlow**, an intelligent healthcare assistant and roster ecosystem powered by Google's Gemma models that automates hospital shift scheduling, provides interactive AI clinical communication roleplay training, and offers shift-break wellness relaxation games.

---

## 🧠 How We Built It

### Which Gemma model did you use?
We integrated **Google Gemma 4 AI Engine** as the core intelligence behind our clinical roleplay simulator and shift-break game engine.

### Did you use RAG, prompt engineering, or fine-tuning?
We utilized **Prompt Engineering**, **Context-Aware Persona Prompting**, **Dynamic Emotion Tracking**, and a **Minimax Decision Tree Algorithm** for shift-break game opponent moves.

### What frameworks did you use?
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Glassmorphic UI Tokens, Lucide React Icons
- **Backend**: Node.js, Express, REST API Architecture, JWT Bearer Token Security, Bcrypt
- **Database**: Prisma ORM, SQLite (`dev.db`), Type-safe schema migrations
- **Real-Time Push**: Socket.IO (WebSockets) for instant emergency broadcasts and unread alert counters
- **AI Intelligence**: Google Gemma 4 AI Engine + Minimax Game Tree

### System Architecture Flow

```
User (Nurse / Admin)
   │
   ▼
React 18 Glassmorphic UI (Vite + TypeScript)
   │
   ▼
Node.js & Express API Server (REST + Socket.IO)
   │
   ▼
Gemma 4 AI Engine  <───>  Prisma ORM (SQLite DB)
   │
   ▼
Real-Time AI Roleplay Reply / 8-Score Analysis / Minimax Game Move
```

---

## 🎯 Key Features

- ✅ **Smart Duty Roster Calendar**: Color-coded shift schedules (*Morning 7:00 AM – 3:00 PM, Evening 3:00 PM – 11:00 PM, Night 11:00 PM – 7:00 AM, Off Duty*) with non-overlapping card layouts.
- ✅ **Gemma 4 AI Patient Communication Simulator**: Interactive educational roleplay simulator with pre-seeded scenarios (*Anxious Patient, Angry Family Member, Confused Patient*).
- ✅ **Real-Time Character Emotion Shift Tracking**: Evaluates nurse empathy signals to dynamically shift character emotion (*Hostile ➔ Frustrated ➔ Worried ➔ Calm ➔ Reassured*).
- ✅ **8-Competency AI Clinical Evaluation**: Generates post-simulation reports scoring Empathy, Active Listening, De-escalation, Communication Clarity, Professionalism, Emotional Intelligence, Engagement, and Confidence (0–100).
- ✅ **Gemma 4 AI Tick & Cross Break Game**: 100% non-medical relaxation lounge game with 3 difficulty modes (*Easy, Medium, Unbeatable Minimax Algorithm*) and a live 10-minute shift break countdown timer.
- ✅ **Shift Swaps & Leave Request Workflows**: Nurse-to-nurse duty exchanges with 1-click admin approval portals.
- ✅ **Socket.IO Real-Time Push Alerts**: Instant emergency ward broadcasts and unread notification badge syncing.

---

## 📹 The Prototype

### Live Demo
[http://localhost:5173](http://localhost:5173)

### GitHub Repository
[https://github.com/Sagheer1122/Arbisoft-GDG-Hackathon.git](https://github.com/Sagheer1122/Arbisoft-GDG-Hackathon.git)

### Kaggle Documentation & Notebook
[https://github.com/Sagheer1122/Arbisoft-GDG-Hackathon/blob/main/KAGGLE_DOCUMENTATION.md](https://github.com/Sagheer1122/Arbisoft-GDG-Hackathon/blob/main/KAGGLE_DOCUMENTATION.md)

---

## ⚙️ How Gemma Was Used

Gemma is the core intelligence behind NurseFlow. The model is responsible for:

1. **Patient & Caregiver Persona Roleplay**: Generating realistic dialogue responses based on scenario personality traits and clinical objectives.
2. **Dynamic Tone & Emotion Analysis**: Continuously evaluating nurse responses for empathetic triggers and updating character emotional states.
3. **8-Competency Transcript Scoring**: Analyzing entire conversation histories to provide granular scores, strengths, quote highlights, and actionable coaching advice.
4. **Shift-Break Minimax AI Opponent**: Calculating strategic move decisions for the Tick & Cross break relaxation game.

*Without Gemma, NurseFlow would not be able to provide adaptive clinical roleplay training or intelligent break lounge interactions.*

---

## 🚧 Challenges We Faced

During this hackathon development, we faced several engineering challenges:

- **Designing Effective Empathy Prompts**: Engineering prompts that accurately evaluate clinical communication nuances without returning generic responses.
- **Managing API Latency**: Optimizing response times for smooth live roleplay chat streams.
- **Non-Overlapping Roster UI Layout**: Designing responsive CSS grid cards that accommodate shift times, ward notes, and action buttons without text collision.
- **Full-Stack End-to-End Integration**: Building database models, authentication, Socket.IO push events, and AI services within strict hackathon timelines.

*Despite these challenges, we successfully developed a fully functional, production-ready proof of concept.*

---

## Author
**Sagheer Ahmad**  
GitHub: [Sagheer1122](https://github.com/Sagheer1122)

---

## Share
**Competition Prize Track**: Main Track  
**License**: This Writeup has been released under the Attribution 4.0 International (CC BY 4.0) license.

### Citation
Sagheer Ahmad. *NurseFlow – AI-Powered Hospital Roster Management & Gemma Clinical Assistant*. 2026. Kaggle / Arbisoft-GDG Hackathon.
