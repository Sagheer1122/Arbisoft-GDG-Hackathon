import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#707080"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 755, "NurseFlow — Enterprise System & API Documentation")
            self.setStrokeColor(colors.HexColor("#E7E7F0"))
            self.setLineWidth(0.5)
            self.line(40, 747, 572, 747)

        # Footer
        self.setStrokeColor(colors.HexColor("#E7E7F0"))
        self.setLineWidth(0.5)
        self.line(40, 45, 572, 45)
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 30, page_str)
        self.drawString(40, 30, "Confidential — Hospital Systems Architecture Manual")
        self.restoreState()

def build_pdf():
    pdf_filename = "c:\\Users\\Tech Planet\\Desktop\\New folder (3)\\NurseFlow_Complete_Documentation.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Color Palette Definitions
    PURPLE_PRIMARY = colors.HexColor("#5142C5")
    PURPLE_DARK = colors.HexColor("#16162A")
    PURPLE_LIGHT = colors.HexColor("#EDE9FE")
    TEXT_DARK = colors.HexColor("#16162A")
    GRAY_TEXT = colors.HexColor("#707080")
    GOLD = colors.HexColor("#D97706")
    GREEN = colors.HexColor("#059669")
    BG_LIGHT = colors.HexColor("#F7F7FB")
    BORDER_COLOR = colors.HexColor("#E7E7F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=PURPLE_PRIMARY,
        alignment=TA_LEFT,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=GRAY_TEXT,
        alignment=TA_LEFT,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PURPLE_DARK,
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PURPLE_PRIMARY,
        spaceBefore=12,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=6,
        alignment=TA_JUSTIFY
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4,
        alignment=TA_LEFT
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#1E293B"),
        backColor=BG_LIGHT,
        borderColor=BORDER_COLOR,
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white,
        alignment=TA_LEFT
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK,
        alignment=TA_LEFT
    )

    story = []

    # ==========================================
    # COVER / HEADER
    # ==========================================
    story.append(Paragraph("🏥 NurseFlow — Enterprise System Architecture & API Documentation", title_style))
    story.append(Paragraph("Comprehensive System Reference Manual | Smart Duty Rostering, Gemma 4 AI Clinical Patient Simulator, and Shift Break Lounge Engine", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2.5, color=PURPLE_PRIMARY, spaceAfter=15))

    # SECTION 1: EXECUTIVE OVERVIEW
    story.append(Paragraph("1. Executive Overview & Problem Vision", h1_style))
    story.append(Paragraph(
        "<b>NurseFlow</b> is an enterprise-grade full-stack web platform engineered to modernize hospital workforce scheduling, eliminate shift overlaps, reduce clinical nurse burnout, and provide continuous communication skill training. Built with React 18, Node.js, Prisma ORM, and Google Gemma 4 AI, NurseFlow transforms hospital operational efficiency.",
        body_style
    ))
    story.append(Paragraph("<b>Primary Platform Pillar Goals:</b>", h2_style))
    story.append(Paragraph("• <b>Duty Roster Optimization:</b> Elimination of text collisions and scheduling friction through clear weekly/monthly card layouts.", bullet_style))
    story.append(Paragraph("• <b>AI Clinical Training (Gemma 4):</b> Interactive patient roleplay simulation enabling nurses to practice communicating with high-stress patient and caregiver personas.", bullet_style))
    story.append(Paragraph("• <b>Shift Break Fatigue Reduction:</b> 100% non-medical relaxation games (AI Tick & Cross ❌⭕) to revitalize mental focus during 10-minute shift breaks.", bullet_style))
    story.append(Paragraph("• <b>Real-Time Event Dispatch:</b> WebSocket-based push notification engine for instant ward emergency broadcasts and shift swap approvals.", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 2: ARCHITECTURE & TECH STACK
    story.append(Paragraph("2. Full-Stack System Architecture", h1_style))
    story.append(Paragraph(
        "NurseFlow follows a decoupled client-server architecture. The frontend application communicates with the Node.js Express backend via REST API endpoints and Socket.IO WebSockets for real-time notifications.",
        body_style
    ))

    tech_data = [
        [Paragraph("<b>Layer</b>", table_header_style), Paragraph("<b>Technology / Framework</b>", table_header_style), Paragraph("<b>Architecture Description & Purpose</b>", table_header_style)],
        [Paragraph("Frontend Client", table_body_style), Paragraph("React 18, Vite, TypeScript, Tailwind CSS", table_body_style), Paragraph("Single-Page Application (SPA) with glassmorphism design tokens & responsive components.", table_body_style)],
        [Paragraph("State & Routing", table_body_style), Paragraph("React Context API, React Router v6", table_body_style), Paragraph("Global AuthContext, SocketContext, and protected route guards.", table_body_style)],
        [Paragraph("Backend Server", table_body_style), Paragraph("Node.js, Express, TypeScript", table_body_style), Paragraph("REST API routing, JWT authentication, and error-handling middleware.", table_body_style)],
        [Paragraph("Database Layer", table_body_style), Paragraph("Prisma ORM, SQLite (dev.db)", table_body_style), Paragraph("Relational data modeling, schema migrations, and type-safe query generation.", table_body_style)],
        [Paragraph("AI Intelligence", table_body_style), Paragraph("Google Gemma 4 AI Engine", table_body_style), Paragraph("Roleplay persona generation, 8-score analysis engine, and Minimax AI for Tic-Tac-Toe.", table_body_style)],
        [Paragraph("Real-Time Messaging", table_body_style), Paragraph("Socket.IO (WebSockets)", table_body_style), Paragraph("Bi-directional real-time alert broadcasts and unread badge sync.", table_body_style)]
    ]

    t_tech = Table(tech_data, colWidths=[110, 180, 242])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_tech)

    story.append(Spacer(1, 10))

    # SECTION 3: CORE MODULE 1 — DUTY ROSTER CALENDAR
    story.append(Paragraph("3. Core Module 1: Smart Duty Roster Calendar Engine", h1_style))
    story.append(Paragraph(
        "The Roster Calendar module (<code>NurseRoster.tsx</code>) presents nurses and hospital administrators with a clear, color-coded weekly and monthly duty grid view.",
        body_style
    ))
    story.append(Paragraph("<b>Standardized Shift Hours & Styling Tokens:</b>", h2_style))
    story.append(Paragraph("• <b>Morning Shift:</b> 7:00 AM – 3:00 PM (Soft Emerald Tint <code>bg-emerald-50/70 border-emerald-200</code>)", bullet_style))
    story.append(Paragraph("• <b>Evening Shift:</b> 3:00 PM – 11:00 PM (Soft Amber Tint <code>bg-amber-50/70 border-amber-200</code>)", bullet_style))
    story.append(Paragraph("• <b>Night Shift:</b> 11:00 PM – 7:00 AM (Soft Light Purple Tint <code>bg-[#EDE9FE]/50 border-purple-200</code>)", bullet_style))
    story.append(Paragraph("• <b>Off Duty:</b> No Duty Assigned (Soft Slate Tint <code>bg-slate-50 border-slate-200</code>)", bullet_style))
    story.append(Paragraph("• <b>Full-Width Action Button:</b> Every day card contains a full-width <code>View Details →</code> button that prevents text collision regardless of screen resolution.", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 4: CORE MODULE 2 — GEMMA 4 AI PATIENT SIMULATOR
    story.append(Paragraph("4. Core Module 2: Gemma 4 AI Patient Communication Simulator", h1_style))
    story.append(Paragraph(
        "The AI Patient Communication Simulator allows nurses to practice Healthcare Communication with simulated patient and caregiver personas. It roleplays realistic situations to develop empathy, active listening, and de-escalation skills.",
        body_style
    ))
    story.append(Paragraph("<b>Simulation Engine Architecture & Features:</b>", h2_style))
    story.append(Paragraph("• <b>Pre-Seeded Scenarios:</b> <i>Anxious Patient, Angry Family Member, Confused Elderly Patient, Non-Cooperative Patient, Difficult Conversation, Emergency Communication</i>.", bullet_style))
    story.append(Paragraph("• <b>Dynamic Character Emotion Tracking:</b> Evaluates the nurse's tone in real time. Compassionate words ('understand', 'listen', 'help') trigger positive emotion transitions: <b>Hostile ➔ Frustrated ➔ Worried ➔ Calm ➔ Reassured</b>.", bullet_style))
    story.append(Paragraph("• <b>8-Competency Evaluation System:</b> Calculates 0–100 scores across <i>Empathy, Active Listening, Clarity, Professionalism, Emotional Intelligence, De-escalation, Patient Engagement</i>, and <i>Confidence</i>.", bullet_style))
    story.append(Paragraph("• <b>Actionable Coaching:</b> Generates transcript quote highlights (Effective vs Growth Opportunities) and personalized summary recommendations.", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 5: CORE MODULE 3 — GEMMA 4 AI BREAK GAMES
    story.append(Paragraph("5. Core Module 3: Gemma 4 AI Tick & Cross (Tic-Tac-Toe ❌⭕) Break Game", h1_style))
    story.append(Paragraph(
        "To help nurses disconnect from shift stress during 10-minute breaks, NurseFlow includes a 100% non-medical <b>Tick & Cross (Tic-Tac-Toe) Break Game</b> powered by Gemma 4 AI.",
        body_style
    ))
    story.append(Paragraph("• <b>3 AI Difficulty Modes:</b> Easy (Casual Chill), Medium (Smart Rival), and Unbeatable (Minimax Decision Tree Algorithm).", bullet_style))
    story.append(Paragraph("• <b>Scoreboard & Wellness Points:</b> Tracks Nurse Wins, AI Wins, Draws, and awards Wellness Points.", bullet_style))
    story.append(Paragraph("• <b>10-Minute Break Countdown:</b> Built-in live timer ensures shift breaks stay structured and restorative.", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 6: PRISMA DATABASE SCHEMAS
    story.append(Paragraph("6. Database Schemas & Data Dictionary (Prisma ORM)", h1_style))
    
    schema_code = """model User {
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

model CommunicationSession {
  id            String    @id @default(uuid())
  userId        String
  scenarioId    String
  characterRole String
  difficulty    String    @default("BEGINNER")
  status        String    @default("ACTIVE")
  overallScore  Int?
}

model NurseGameScore {
  id           String   @id @default(uuid())
  userId       String
  gameType     String   @default("TIC_TAC_TOE")
  nurseWins    Int      @default(0)
  aiWins       Int      @default(0)
  draws        Int      @default(0)
  pointsEarned Int      @default(0)
}"""
    story.append(Paragraph(schema_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Spacer(1, 10))

    # SECTION 7: COMPLETE REST API ENDPOINTS
    story.append(Paragraph("7. Complete Backend REST API Reference", h1_style))
    
    api_data = [
        [Paragraph("<b>Method</b>", table_header_style), Paragraph("<b>Endpoint Route</b>", table_header_style), Paragraph("<b>Functionality Description</b>", table_header_style), Paragraph("<b>Access</b>", table_header_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/auth/login", table_body_style), Paragraph("Authenticate user credentials & return JWT token", table_body_style), Paragraph("Public", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/auth/register", table_body_style), Paragraph("Register new nurse or administrator account", table_body_style), Paragraph("Public", table_body_style)],
        [Paragraph("GET", table_body_style), Paragraph("/api/users", table_body_style), Paragraph("Fetch list of all staff nurses & employees", table_body_style), Paragraph("Admin", table_body_style)],
        [Paragraph("GET", table_body_style), Paragraph("/api/rosters", table_body_style), Paragraph("Fetch duty rosters (filter by date/nurse)", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/rosters", table_body_style), Paragraph("Assign shift roster entry to nurse", table_body_style), Paragraph("Admin", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/leave-requests", table_body_style), Paragraph("Submit leave application (Sick, Annual)", table_body_style), Paragraph("Nurse", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/shift-swaps", table_body_style), Paragraph("Request shift exchange with target nurse", table_body_style), Paragraph("Nurse", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/notifications/send-alert", table_body_style), Paragraph("Broadcast ward emergency push notification", table_body_style), Paragraph("Admin", table_body_style)],
        [Paragraph("GET", table_body_style), Paragraph("/api/communication-simulator/scenarios", table_body_style), Paragraph("Fetch roleplay scenarios list", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/communication-simulator/sessions", table_body_style), Paragraph("Initialize new AI roleplay session", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/communication-simulator/sessions/:id/messages", table_body_style), Paragraph("Send nurse dialogue & get AI roleplay reply", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/communication-simulator/sessions/:id/end", table_body_style), Paragraph("End session & generate 8-competency evaluation", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/games/tic-tac-toe/move", table_body_style), Paragraph("Compute Gemma 4 AI move (Minimax)", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/games/tic-tac-toe/score", table_body_style), Paragraph("Save match outcome & update wellness points", table_body_style), Paragraph("Auth", table_body_style)]
    ]

    t_api = Table(api_data, colWidths=[50, 195, 210, 77])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_DARK),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_api)

    story.append(Spacer(1, 15))

    # SECTION 8: INSTALLATION & OPERATIONAL GUIDE
    story.append(Paragraph("8. Operational Setup & Deployment Guide", h1_style))
    story.append(Paragraph("<b>Local Setup Commands:</b>", h2_style))
    
    setup_cmd = """# 1. Install Server & Client Dependencies
cd server && npm install
cd ../client && npm install

# 2. Sync Prisma Database Schema & Run Seeding
cd ../server
npx prisma db push
npx ts-node prisma/seed.ts

# 3. Start Backend Server (Port 5000) & Client (Port 5173)
npm run dev   # inside server
npm run dev   # inside client"""
    story.append(Paragraph(setup_cmd.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE_PRIMARY, spaceAfter=10))
    story.append(Paragraph("NurseFlow Complete System Documentation  |  GitHub: Sagheer1122/Arbisoft-GDG-Hackathon", subtitle_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Detailed PDF Documentation successfully generated at {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
