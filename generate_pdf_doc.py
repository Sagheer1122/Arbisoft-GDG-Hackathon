import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf():
    pdf_filename = "c:\\Users\\Tech Planet\\Desktop\\New folder (3)\\NurseFlow_Complete_Documentation.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom Color Token Definitions
    PURPLE_PRIMARY = colors.HexColor("#5142C5")
    PURPLE_DARK = colors.HexColor("#16162A")
    PURPLE_LIGHT = colors.HexColor("#EDE9FE")
    TEXT_DARK = colors.HexColor("#16162A")
    GRAY_TEXT = colors.HexColor("#707080")
    GOLD = colors.HexColor("#D97706")
    GREEN = colors.HexColor("#059669")
    BG_LIGHT = colors.HexColor("#F7F7FB")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=PURPLE_PRIMARY,
        alignment=TA_LEFT,
        spaceAfter=6
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
        fontSize=18,
        leading=22,
        textColor=PURPLE_DARK,
        spaceBefore=16,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=PURPLE_PRIMARY,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
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

    # Document Header Title
    story.append(Paragraph("🏥 NurseFlow — Full Platform Documentation", title_style))
    story.append(Paragraph("Enterprise Healthcare Scheduling, Gemma 4 AI Patient Simulator & Break Lounge | Complete System Reference", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PURPLE_PRIMARY, spaceAfter=15))

    # SECTION 1: EXECUTIVE OVERVIEW
    story.append(Paragraph("1. Executive Overview & Platform Vision", h1_style))
    story.append(Paragraph(
        "<b>NurseFlow</b> is an enterprise-grade full-stack web platform designed to solve modern hospital workforce challenges, nurse fatigue, and clinical communication gaps. It combines automated smart roster scheduling, dynamic shift-swap workflows, Gemma 4 AI patient roleplay simulation, and a 10-minute shift break relaxation lounge into a unified glassmorphic interface.",
        body_style
    ))
    story.append(Paragraph("<b>Core Objectives:</b>", h2_style))
    story.append(Paragraph("• <b>Eliminate Duty Conflicts:</b> Standardized shift timings (Morning, Evening, Night) with clear weekly/monthly card views.", bullet_style))
    story.append(Paragraph("• <b>Elevate Clinical Communication:</b> Practice high-stress patient/family conversations using Gemma 4 AI with 8-competency evaluations.", bullet_style))
    story.append(Paragraph("• <b>Reduce Shift Burnout:</b> Non-medical break lounge mini-games (Tick & Cross) to revitalize focus during 10-minute shift breaks.", bullet_style))
    story.append(Paragraph("• <b>Instant Alert Broadcasts:</b> Socket.IO WebSocket push notifications for emergency ward calls and swap approvals.", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 2: SYSTEM ARCHITECTURE & TECH STACK
    story.append(Paragraph("2. Technical Architecture & Technology Stack", h1_style))
    
    tech_data = [
        [Paragraph("<b>Component</b>", table_header_style), Paragraph("<b>Technologies Used</b>", table_header_style), Paragraph("<b>Purpose</b>", table_header_style)],
        [Paragraph("Frontend Framework", table_body_style), Paragraph("React 18 + Vite, TypeScript", table_body_style), Paragraph("High-performance client UI rendering", table_body_style)],
        [Paragraph("Design System", table_body_style), Paragraph("Tailwind CSS, Glassmorphism, Lucide Icons", table_body_style), Paragraph("Modern aesthetics & responsive UI", table_body_style)],
        [Paragraph("Backend Server", table_body_style), Paragraph("Node.js, Express, REST API", table_body_style), Paragraph("API middleware, Auth & Routing", table_body_style)],
        [Paragraph("Database & ORM", table_body_style), Paragraph("Prisma ORM, SQLite (dev.db)", table_body_style), Paragraph("Data persistence & schema migrations", table_body_style)],
        [Paragraph("AI Intelligence", table_body_style), Paragraph("Gemma 4 AI Engine, Minimax Algorithm", table_body_style), Paragraph("Roleplay dialogue & Tic-Tac-Toe AI", table_body_style)],
        [Paragraph("Real-Time Engine", table_body_style), Paragraph("Socket.IO WebSockets", table_body_style), Paragraph("Instant push notifications & alerts", table_body_style)]
    ]

    t_tech = Table(tech_data, colWidths=[130, 200, 202])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E7E7F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_tech)

    story.append(Spacer(1, 15))

    # SECTION 3: CORE MODULE 1 — DUTY ROSTER CALENDAR
    story.append(Paragraph("3. Core Module 1: Duty Roster Calendar & Schedule Management", h1_style))
    story.append(Paragraph(
        "The Roster Calendar module provides nurses and administrators with a spacious, color-coded weekly and monthly duty schedule. Cards are formatted to prevent text overlapping regardless of viewport width.",
        body_style
    ))
    story.append(Paragraph("<b>Standardized Shift Definitions:</b>", h2_style))
    story.append(Paragraph("• <b>Morning Shift:</b> 7:00 AM – 3:00 PM (Soft Emerald Tint #ECFDF5)", bullet_style))
    story.append(Paragraph("• <b>Evening Shift:</b> 3:00 PM – 11:00 PM (Soft Amber Tint #FFFBEB)", bullet_style))
    story.append(Paragraph("• <b>Night Shift:</b> 11:00 PM – 7:00 AM (Soft Purple Tint #EDE9FE)", bullet_style))
    story.append(Paragraph("• <b>Off Duty:</b> No Duty Assigned (Soft Slate Tint #F8FAFC)", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 4: CORE MODULE 2 — GEMMA 4 AI PATIENT SIMULATOR
    story.append(Paragraph("4. Core Module 2: Gemma 4 AI Patient Communication Simulator", h1_style))
    story.append(Paragraph(
        "The AI Patient Communication Simulator allows nurses to practice healthcare communication in simulated scenarios with realistic patient and caregiver personas. It is an educational tool designed to build empathy and de-escalation skills.",
        body_style
    ))
    story.append(Paragraph("<b>Key Features:</b>", h2_style))
    story.append(Paragraph("• <b>Pre-Seeded Scenarios:</b> Anxious Patient, Angry Family Member, Confused Elderly Patient, Non-Cooperative Patient, Difficult Conversation, Emergency Triage.", bullet_style))
    story.append(Paragraph("• <b>Dynamic Character Emotion Tracking:</b> The character's emotional state transitions in real time based on nurse empathy signals (Hostile → Frustrated → Worried → Calm → Reassured).", bullet_style))
    story.append(Paragraph("• <b>8-Competency Evaluation Report:</b> Post-simulation analysis scoring Empathy, Active Listening, Clarity, Professionalism, Emotional Intelligence, De-escalation, Patient Engagement, and Confidence (0–100).", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 5: CORE MODULE 3 — GEMMA 4 AI BREAK GAMES
    story.append(Paragraph("5. Core Module 3: Gemma 4 AI Tick & Cross (Tic-Tac-Toe ❌⭕) Break Game", h1_style))
    story.append(Paragraph(
        "Designed specifically for 10-minute shift breaks, this 100% non-medical relaxation game allows nurses to play Tic-Tac-Toe against Gemma 4 AI to unwind and reset focus.",
        body_style
    ))
    story.append(Paragraph("• <b>3 AI Difficulty Modes:</b> Easy (Casual Chill), Medium (Smart Rival), and Unbeatable (Gemma 4 Minimax Algorithm).", bullet_style))
    story.append(Paragraph("• <b>Scoreboard & Wellness Points:</b> Tracks Nurse Wins, AI Wins, Draws, and awards Wellness Points.", bullet_style))
    story.append(Paragraph("• <b>10-Minute Break Timer:</b> A live countdown timer keeps break durations structured.", bullet_style))

    story.append(Spacer(1, 15))

    # SECTION 6: FULL API REFERENCE TABLE
    story.append(Paragraph("6. Backend REST API Endpoints Reference", h1_style))
    
    api_data = [
        [Paragraph("<b>Method</b>", table_header_style), Paragraph("<b>Endpoint</b>", table_header_style), Paragraph("<b>Description</b>", table_header_style), Paragraph("<b>Access</b>", table_header_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/auth/login", table_body_style), Paragraph("User login & returns JWT token", table_body_style), Paragraph("Public", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/auth/register", table_body_style), Paragraph("Create new staff account", table_body_style), Paragraph("Public", table_body_style)],
        [Paragraph("GET", table_body_style), Paragraph("/api/rosters", table_body_style), Paragraph("Fetch weekly duty schedules", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/rosters", table_body_style), Paragraph("Assign roster to nurse", table_body_style), Paragraph("Admin", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/leave-requests", table_body_style), Paragraph("Submit leave application", table_body_style), Paragraph("Nurse", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/shift-swaps", table_body_style), Paragraph("Request duty exchange with peer", table_body_style), Paragraph("Nurse", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/notifications/send-alert", table_body_style), Paragraph("Broadcast ward emergency alert", table_body_style), Paragraph("Admin", table_body_style)],
        [Paragraph("GET", table_body_style), Paragraph("/api/communication-simulator/scenarios", table_body_style), Paragraph("List roleplay scenarios", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/communication-simulator/sessions/:id/messages", table_body_style), Paragraph("Send dialogue & get AI roleplay reply", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/communication-simulator/sessions/:id/end", table_body_style), Paragraph("End simulation & get 8-score report", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/games/tic-tac-toe/move", table_body_style), Paragraph("Calculate Gemma 4 AI move", table_body_style), Paragraph("Auth", table_body_style)],
        [Paragraph("POST", table_body_style), Paragraph("/api/games/tic-tac-toe/score", table_body_style), Paragraph("Save match outcome & wellness points", table_body_style), Paragraph("Auth", table_body_style)]
    ]

    t_api = Table(api_data, colWidths=[50, 190, 210, 82])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_DARK),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E7E7F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_api)

    story.append(Spacer(1, 15))

    # SECTION 7: DATABASE SCHEMA SUMMARY
    story.append(Paragraph("7. Database Schema & Models Data Dictionary", h1_style))
    story.append(Paragraph("• <b>User:</b> id, name, email, passwordHash, role (NURSE, ADMIN, HEAD_NURSE), employeeId, departmentId, avatar.", bullet_style))
    story.append(Paragraph("• <b>Roster:</b> id, nurseId, shiftId, departmentId, date, status (ON_DUTY, SCHEDULED, OFF), notes.", bullet_style))
    story.append(Paragraph("• <b>CommunicationScenario:</b> id, title, category, description, characterRole, personality, difficulty, objectives.", bullet_style))
    story.append(Paragraph("• <b>CommunicationSession & Analysis:</b> id, userId, scenarioId, status, overallScore, empathyScore, activeListeningScore, clarityScore, strengths, feedback.", bullet_style))
    story.append(Paragraph("• <b>NurseGameScore:</b> id, userId, gameType, nurseWins, aiWins, draws, pointsEarned.", bullet_style))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE_PRIMARY, spaceAfter=10))
    story.append(Paragraph("NurseFlow Platform Documentation  |  GitHub: Sagheer1122/Arbisoft-GDG-Hackathon", subtitle_style))

    doc.build(story)
    print(f"PDF documentation created successfully at {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
