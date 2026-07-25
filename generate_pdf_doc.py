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
            self.drawString(40, 755, "NurseFlow — Complete System Architecture & Data Model Documentation")
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
        fontSize=26,
        leading=32,
        textColor=PURPLE_PRIMARY,
        alignment=TA_LEFT,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=GRAY_TEXT,
        alignment=TA_LEFT,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PURPLE_DARK,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=PURPLE_PRIMARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
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
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#1E293B"),
        backColor=BG_LIGHT,
        borderColor=BORDER_COLOR,
        borderWidth=0.5,
        borderPadding=5,
        spaceBefore=4,
        spaceAfter=6
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=TA_LEFT
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=TEXT_DARK,
        alignment=TA_LEFT
    )

    story = []

    # COVER HEADER
    story.append(Paragraph("🏥 NurseFlow — Enterprise System & Database Architecture Manual", title_style))
    story.append(Paragraph("Full Technical Reference | 12 Prisma Relational Database Models, Gemma 4 AI Simulator & Shift Break Engine", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2.5, color=PURPLE_PRIMARY, spaceAfter=15))

    # SECTION 1: EXECUTIVE OVERVIEW
    story.append(Paragraph("1. Executive Overview & Platform Objectives", h1_style))
    story.append(Paragraph(
        "<b>NurseFlow</b> is a full-stack healthcare scheduling and clinical simulation platform. Built using React 18, Node.js, Prisma ORM, SQLite, Socket.IO, and Google Gemma 4 AI, NurseFlow solves shift scheduling friction, nurse fatigue, and clinical communication challenges across hospital wards.",
        body_style
    ))
    story.append(Paragraph("• <b>Duty Roster Optimization:</b> Standardized shift timings (Morning 7am-3pm, Evening 3pm-11pm, Night 11pm-7am) with non-overlapping card layouts.", bullet_style))
    story.append(Paragraph("• <b>Gemma 4 AI Patient Simulator:</b> Educational roleplay simulator with dynamic emotion tracking and 8-competency evaluations.", bullet_style))
    story.append(Paragraph("• <b>AI Break Lounge Games:</b> 100% non-medical relaxation games (Tick & Cross) for 10-minute shift breaks.", bullet_style))
    story.append(Paragraph("• <b>Real-Time Push Alerts:</b> Socket.IO WebSocket push notifications for emergency ward calls and swap approvals.", bullet_style))

    story.append(Spacer(1, 10))

    # SECTION 2: ALL 12 PRISMA DATABASE MODELS EXPLAINED IN DETAIL
    story.append(Paragraph("2. Full Database Schema Data Dictionary (All 12 Prisma Models)", h1_style))
    story.append(Paragraph(
        "NurseFlow utilizes <b>Prisma ORM</b> with a relational SQLite database (<code>dev.db</code>). Below is the comprehensive technical breakdown of all 12 database models, their fields, default values, and relational constraints.",
        body_style
    ))

    all_models_data = [
        ("1. User Model", "Stores staff credentials, role permissions (NURSE, ADMIN, HEAD_NURSE), department assignments, and contact details.", [
            ("id", "String (UUID)", "Primary Key"),
            ("name", "String", "Full Name of Staff Member"),
            ("email", "String (Unique)", "Login Credential Email"),
            ("passwordHash", "String", "Bcrypt Hashed Password"),
            ("role", "String (Default: NURSE)", "NURSE | ADMIN | HEAD_NURSE"),
            ("employeeId", "String (Unique)", "Hospital Badge ID"),
            ("departmentId", "String (Optional)", "Foreign Key to Department"),
            ("phone", "String (Optional)", "Contact Mobile Number"),
            ("avatar", "String (Optional)", "Profile Picture Path")
        ]),
        ("2. Department Model", "Represents hospital ward units (e.g., General Ward, Intensive Care Unit, Emergency, Pediatrics).", [
            ("id", "String (UUID)", "Primary Key"),
            ("name", "String (Unique)", "Department Name"),
            ("description", "String (Optional)", "Ward Description & Capacity")
        ]),
        ("3. Shift Model", "Defines hospital shift timings, color coding, and shift categories.", [
            ("id", "String (UUID)", "Primary Key"),
            ("name", "String", "Shift Name (Morning, Evening, Night)"),
            ("startTime", "String", "Formatted Start Time (e.g., 7:00 AM)"),
            ("endTime", "String", "Formatted End Time (e.g., 3:00 PM)"),
            ("type", "String", "MORNING | EVENING | NIGHT | OFF"),
            ("color", "String", "Theme Color Code (green, yellow, purple, gray)")
        ]),
        ("4. Roster Model", "Stores daily duty assignments linking nurses, shifts, and departments.", [
            ("id", "String (UUID)", "Primary Key"),
            ("nurseId", "String", "Foreign Key to User (Cascade Delete)"),
            ("shiftId", "String", "Foreign Key to Shift (Cascade Delete)"),
            ("departmentId", "String", "Foreign Key to Department (Cascade Delete)"),
            ("date", "String", "Duty Date (YYYY-MM-DD)"),
            ("status", "String (Default: SCHEDULED)", "ON_DUTY | SCHEDULED | OFF | COMPLETED"),
            ("notes", "String (Optional)", "Handover Shift Instructions")
        ]),
        ("5. LeaveRequest Model", "Tracks leave applications submitted by nurses and review decisions by administrators.", [
            ("id", "String (UUID)", "Primary Key"),
            ("nurseId", "String", "Foreign Key to User (Applicant)"),
            ("leaveType", "String", "Annual Leave | Sick Leave | Emergency"),
            ("fromDate", "String", "Start Date (YYYY-MM-DD)"),
            ("toDate", "String", "End Date (YYYY-MM-DD)"),
            ("reason", "String", "Application Reason Text"),
            ("status", "String (Default: PENDING)", "PENDING | APPROVED | REJECTED"),
            ("reviewedBy", "String (Optional)", "Foreign Key to Admin User"),
            ("reviewedAt", "DateTime (Optional)", "Timestamp of Review Decision")
        ]),
        ("6. ShiftSwapRequest Model", "Manages nurse-to-nurse shift exchange applications.", [
            ("id", "String (UUID)", "Primary Key"),
            ("requesterId", "String", "Foreign Key to User (Requesting Nurse)"),
            ("targetNurseId", "String", "Foreign Key to User (Peer Nurse)"),
            ("originalShiftId", "String", "Foreign Key to Original Shift"),
            ("requestedDate", "String", "Target Shift Date (YYYY-MM-DD)"),
            ("reason", "String", "Swap Justification Note"),
            ("status", "String (Default: PENDING)", "PENDING | APPROVED | REJECTED"),
            ("reviewedBy", "String (Optional)", "Foreign Key to Admin Reviewer")
        ]),
        ("7. Notification Model", "Stores user-specific push notifications and emergency ward alerts.", [
            ("id", "String (UUID)", "Primary Key"),
            ("userId", "String", "Foreign Key to User"),
            ("title", "String", "Notification Header Title"),
            ("message", "String", "Push Notification Content"),
            ("type", "String (Default: INFO)", "SHIFTS | LEAVE | SWAP | ROSTER | ALERT | INFO"),
            ("isRead", "Boolean (Default: false)", "Read/Unread State Flag")
        ]),
        ("8. CommunicationScenario Model", "Defines AI simulation roleplay scenarios and character personalities.", [
            ("id", "String (UUID)", "Primary Key"),
            ("title", "String", "Scenario Header Title"),
            ("category", "String", "Patient | Family | Elderly | Emergency"),
            ("description", "String", "Detailed Context & Medical Background"),
            ("characterRole", "String", "Patient | Family Member | Elderly Patient"),
            ("personality", "String", "Anxious | Hostile | Confused | Demanding"),
            ("difficulty", "String (Default: BEGINNER)", "BEGINNER | INTERMEDIATE | ADVANCED"),
            ("objectives", "String", "JSON Array String of Learning Goals")
        ]),
        ("9. CommunicationSession Model", "Tracks active and completed AI roleplay sessions.", [
            ("id", "String (UUID)", "Primary Key"),
            ("userId", "String", "Foreign Key to User (Nurse)"),
            ("scenarioId", "String", "Foreign Key to CommunicationScenario"),
            ("characterRole", "String", "Roleplayed Character Persona"),
            ("difficulty", "String", "Simulation Complexity Level"),
            ("status", "String (Default: ACTIVE)", "ACTIVE | COMPLETED | ABANDONED"),
            ("overallScore", "Int (Optional)", "Final Overall Score (0-100)")
        ]),
        ("10. CommunicationMessage Model", "Stores individual dialogue turns and emotion states in roleplay chats.", [
            ("id", "String (UUID)", "Primary Key"),
            ("sessionId", "String", "Foreign Key to CommunicationSession"),
            ("role", "String", "NURSE or PATIENT"),
            ("content", "String", "Transcribed Dialogue Text"),
            ("emotion", "String (Default: Calm)", "Calm | Worried | Confused | Frustrated | Angry | Reassured")
        ]),
        ("11. CommunicationAnalysis Model", "Stores 8-competency scores and AI clinical feedback reports.", [
            ("id", "String (UUID)", "Primary Key"),
            ("sessionId", "String (Unique)", "Foreign Key to CommunicationSession"),
            ("overallScore", "Int", "Calculated Overall Score (0-100)"),
            ("empathyScore", "Int", "Empathy & Compassion Score"),
            ("activeListeningScore", "Int", "Active Listening Score"),
            ("clarityScore", "Int", "Communication Clarity Score"),
            ("professionalismScore", "Int", "Professional Composure Score"),
            ("emotionalIntelligenceScore", "Int", "EQ & Self-Awareness Score"),
            ("deEscalationScore", "Int", "De-escalation Score"),
            ("patientEngagementScore", "Int", "Patient Engagement Score"),
            ("confidenceScore", "Int", "Clinical Confidence Score"),
            ("strengths", "String", "JSON Array String of Key Strengths"),
            ("improvementAreas", "String", "JSON Array String of Growth Areas"),
            ("feedback", "String", "Comprehensive AI Coaching Summary Text")
        ]),
        ("12. NurseGameScore Model", "Tracks nurse wins, AI wins, draws, and earned wellness points in Tick & Cross game.", [
            ("id", "String (UUID)", "Primary Key"),
            ("userId", "String", "Foreign Key to User (Nurse)"),
            ("gameType", "String (Default: TIC_TAC_TOE)", "Break Game Category"),
            ("nurseWins", "Int (Default: 0)", "Total Nurse Victory Count"),
            ("aiWins", "Int (Default: 0)", "Total Gemma 4 AI Victory Count"),
            ("draws", "Int (Default: 0)", "Total Draw Count"),
            ("pointsEarned", "Int (Default: 0)", "Total Shift Wellness Points Earned")
        ])
    ]

    for m_title, m_desc, fields in all_models_data:
        story.append(Paragraph(f"<b>{m_title}</b>", h2_style))
        story.append(Paragraph(m_desc, body_style))
        
        table_rows = [[Paragraph("<b>Field Name</b>", table_header_style), Paragraph("<b>Data Type & Constraints</b>", table_header_style), Paragraph("<b>Description</b>", table_header_style)]]
        for f_name, f_type, f_desc in fields:
            table_rows.append([
                Paragraph(f"<code>{f_name}</code>", table_body_style),
                Paragraph(f_type, table_body_style),
                Paragraph(f_desc, table_body_style)
            ])
        
        t_model = Table(table_rows, colWidths=[120, 180, 232])
        t_model.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_model)
        story.append(Spacer(1, 8))

    story.append(Spacer(1, 10))

    # SECTION 3: COMPLETE REST API ENDPOINTS
    story.append(Paragraph("3. Full REST API Endpoints Specification", h1_style))
    
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
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE_PRIMARY, spaceAfter=10))
    story.append(Paragraph("NurseFlow Complete System & Database Manual  |  GitHub: Sagheer1122/Arbisoft-GDG-Hackathon", subtitle_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF documentation with ALL 12 Prisma models successfully generated at {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
