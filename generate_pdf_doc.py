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
            self.drawString(40, 755, "NurseFlow — Enterprise System Architecture & Operational Manual")
            self.setStrokeColor(colors.HexColor("#E7E7F0"))
            self.setLineWidth(0.5)
            self.line(40, 747, 572, 747)

        # Footer
        self.setStrokeColor(colors.HexColor("#E7E7F0"))
        self.setLineWidth(0.5)
        self.line(40, 45, 572, 45)
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 30, page_str)
        self.drawString(40, 30, "Confidential — Hospital Systems & AI Architecture Reference")
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
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=GRAY_TEXT,
        alignment=TA_LEFT,
        spaceAfter=20
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
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=8,
        alignment=TA_JUSTIFY
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=5,
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

    # ==========================================
    # PAGE 1: TITLE & COVER PAGE
    # ==========================================
    story.append(Spacer(1, 20))
    story.append(Paragraph("🏥 NURSEFLOW", title_style))
    story.append(Paragraph("Enterprise Healthcare Scheduling, Gemma 4 AI Patient Simulator & Break Lounge Engine", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=3, color=PURPLE_PRIMARY, spaceAfter=25))

    meta_data = [
        [Paragraph("<b>Document Parameter</b>", table_header_style), Paragraph("<b>Metadata Specification</b>", table_header_style)],
        [Paragraph("System Version", table_body_style), Paragraph("NurseFlow v1.0.0 Enterprise Release", table_body_style)],
        [Paragraph("Target Audience", table_body_style), Paragraph("Hospital Administrators, Lead Nurses, System Architects & Hackathon Judges", table_body_style)],
        [Paragraph("Primary Tech Stack", table_body_style), Paragraph("React 18 (Vite), Node.js, Express, Prisma ORM, SQLite, Socket.IO, Google Gemma 4 AI", table_body_style)],
        [Paragraph("Repository URL", table_body_style), Paragraph("https://github.com/Sagheer1122/Arbisoft-GDG-Hackathon.git", table_body_style)],
        [Paragraph("Documentation Status", table_body_style), Paragraph("Complete Master System & API Manual (10–15 Pages Detailed Specifications)", table_body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[160, 372])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_meta)

    story.append(Spacer(1, 30))
    story.append(Paragraph("<b>Notice of Confidentiality:</b> This document contains proprietary system architecture specifications, database schemas, and AI algorithm designs for the NurseFlow platform. Authorized for internal hospital operations and hackathon review.", body_style))
    
    story.append(PageBreak())

    # ==========================================
    # PAGE 2: EXECUTIVE SUMMARY & PROBLEM ANALYSIS
    # ==========================================
    story.append(Paragraph("1. Executive Summary & Industry Problem Analysis", h1_style))
    story.append(Paragraph(
        "Modern hospital environments across Pakistan and globally face severe operational and human resource challenges. Nursing personnel work under extreme stress during 12-hour duty shifts, dealing with complex patient handovers, manual scheduling conflicts, and demanding family interactions.",
        body_style
    ))

    story.append(Paragraph("<b>Core Industry Challenges Addressed:</b>", h2_style))
    story.append(Paragraph("1. <b>Scheduling Friction & Overlap:</b> Manual paper schedules or basic spreadsheets lead to shift collisions, missed duties, and unreadable shift handover notes.", bullet_style))
    story.append(Paragraph("2. <b>Clinical Nurse Burnout:</b> Extended duty hours without structured mental resets degrade decision-making confidence and increase clinical turnover rates.", bullet_style))
    story.append(Paragraph("3. <b>Communication Skill Gaps:</b> Nurses rarely have a safe environment to practice high-stress patient/family conversations (handling anxious surgical patients or angry relatives).", bullet_style))
    story.append(Paragraph("4. <b>Delayed Ward Emergency Broadcasts:</b> Traditional phone calls or manual alerts delay response times during urgent hospital ward code calls.", bullet_style))

    story.append(Paragraph("<b>The NurseFlow Strategic Solution:</b>", h2_style))
    story.append(Paragraph("NurseFlow delivers a unified glassmorphic platform combining automated duty roster intelligence, Google Gemma 4 AI clinical patient roleplay simulation, an AI-powered 10-minute shift break relaxation lounge, and real-time Socket.IO emergency alerts.", body_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 3: FULL SYSTEM ARCHITECTURE
    # ==========================================
    story.append(Paragraph("2. Full-Stack System Architecture & Technology Ecosystem", h1_style))
    story.append(Paragraph(
        "NurseFlow follows a decoupled client-server architecture. The frontend application operates as a Single-Page Application (SPA) communicating with the Node.js Express backend via REST APIs and Socket.IO WebSockets.",
        body_style
    ))

    arch_data = [
        [Paragraph("<b>Architecture Layer</b>", table_header_style), Paragraph("<b>Technologies & Libraries</b>", table_header_style), Paragraph("<b>Responsibility & Architectural Purpose</b>", table_header_style)],
        [Paragraph("Frontend Client (SPA)", table_body_style), Paragraph("React 18, Vite, TypeScript, Tailwind CSS", table_body_style), Paragraph("Renders responsive user interfaces with glassmorphic UI design tokens.", table_body_style)],
        [Paragraph("State & Security Context", table_body_style), Paragraph("React Context API, JWT Storage", table_body_style), Paragraph("Global AuthContext, SocketContext, and protected route access guards.", table_body_style)],
        [Paragraph("Backend REST API", table_body_style), Paragraph("Node.js, Express, TypeScript", table_body_style), Paragraph("Handles REST endpoints, JWT authentication, and request middleware.", table_body_style)],
        [Paragraph("Database & ORM", table_body_style), Paragraph("Prisma ORM, SQLite (dev.db)", table_body_style), Paragraph("Type-safe query generation, schema migrations, and relational integrity.", table_body_style)],
        [Paragraph("AI Intelligence Engine", table_body_style), Paragraph("Google Gemma 4 AI Engine", table_body_style), Paragraph("Roleplay persona generation, 8-score analysis, and Minimax Game AI.", table_body_style)],
        [Paragraph("Real-Time Messaging", table_body_style), Paragraph("Socket.IO (WebSockets)", table_body_style), Paragraph("Instant bi-directional emergency broadcasts and unread alert counters.", table_body_style)]
    ]
    t_arch = Table(arch_data, colWidths=[120, 170, 242])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_arch)

    story.append(PageBreak())

    # ==========================================
    # PAGE 4 & 5: COMPLETE FRONTEND SPECIFICATION (ALL 21 PAGES)
    # ==========================================
    story.append(Paragraph("3. Complete Frontend Pages Specification (All 21 Views)", h1_style))
    story.append(Paragraph(
        "Below is the exhaustive technical breakdown for every single page component in the <code>client/src/pages/</code> codebase, detailing routes, role access guards, and functional specifications.",
        body_style
    ))

    pages_p1 = [
        [Paragraph("<b>Page Component</b>", table_header_style), Paragraph("<b>Route URL</b>", table_header_style), Paragraph("<b>Guard</b>", table_header_style), Paragraph("<b>Functional Specifications</b>", table_header_style)],
        [Paragraph("SplashPage.tsx", table_body_style), Paragraph("/", table_body_style), Paragraph("Public", table_body_style), Paragraph("Landing page featuring realistic nurse portraits, brand tagline, and CTAs.", table_body_style)],
        [Paragraph("RoleSelectionPage.tsx", table_body_style), Paragraph("/role-selection", table_body_style), Paragraph("Public", table_body_style), Paragraph("Portal for choosing Nurse vs Administrator workspace login.", table_body_style)],
        [Paragraph("LoginPage.tsx", table_body_style), Paragraph("/login", table_body_style), Paragraph("Public", table_body_style), Paragraph("JWT authentication screen with quick-fill demo credentials.", table_body_style)],
        [Paragraph("NurseDashboard.tsx", table_body_style), Paragraph("/nurse/dashboard", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Nurse home portal with active shift banner, quick actions, and schedule preview.", table_body_style)],
        [Paragraph("AdminDashboard.tsx", table_body_style), Paragraph("/admin/dashboard", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Executive overview with staffing metrics, ward attendance, and request queues.", table_body_style)],
        [Paragraph("NurseRoster.tsx", table_body_style), Paragraph("/nurse/roster", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Weekly/monthly roster calendar grid with color-coded shifts & details buttons.", table_body_style)],
        [Paragraph("CreateRosterPage.tsx", table_body_style), Paragraph("/admin/roster/create", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Admin schedule builder interface for assigning shifts across hospital wards.", table_body_style)],
        [Paragraph("ShiftDetailsPage.tsx", table_body_style), Paragraph("/nurse/shifts/:id", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Detailed view of a shift assignment, handover notes, and ward contacts.", table_body_style)],
        [Paragraph("CommunicationSimulatorPage.tsx", table_body_style), Paragraph("/nurse/communication-simulator", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Scenario selection dashboard for the Gemma 4 AI Patient Simulator.", table_body_style)],
        [Paragraph("CommunicationSessionPage.tsx", table_body_style), Paragraph("/nurse/communication-simulator/session/:id", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Live roleplay chat room with emotion status pills & real-time Gemma 4 reply.", table_body_style)]
    ]
    t_p1 = Table(pages_p1, colWidths=[115, 150, 65, 202])
    t_p1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_p1)

    story.append(PageBreak())

    # PAGE 5: CONTINUATION OF FRONTEND PAGES
    story.append(Paragraph("3. Complete Frontend Pages Specification (Continued)", h1_style))
    
    pages_p2 = [
        [Paragraph("<b>Page Component</b>", table_header_style), Paragraph("<b>Route URL</b>", table_header_style), Paragraph("<b>Guard</b>", table_header_style), Paragraph("<b>Functional Specifications</b>", table_header_style)],
        [Paragraph("CommunicationResultsPage.tsx", table_body_style), Paragraph("/nurse/communication-simulator/session/:id/results", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Post-simulation analysis dashboard displaying 8-competency radar scores & advice.", table_body_style)],
        [Paragraph("TicTacToeGamePage.tsx", table_body_style), Paragraph("/nurse/break-games/tic-tac-toe", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("AI Tick & Cross break game with 3 difficulty modes, 10-min timer, and scoreboard.", table_body_style)],
        [Paragraph("ShiftSwapPage.tsx", table_body_style), Paragraph("/nurse/shift-swap", table_body_style), Paragraph("Nurse", table_body_style), Paragraph("Form to submit shift exchange requests with target peer nurses.", table_body_style)],
        [Paragraph("LeaveRequestPage.tsx", table_body_style), Paragraph("/nurse/leave-request", table_body_style), Paragraph("Nurse", table_body_style), Paragraph("Form to apply for Sick, Annual, or Emergency leave with date selectors.", table_body_style)],
        [Paragraph("MyRequestsPage.tsx", table_body_style), Paragraph("/nurse/requests", table_body_style), Paragraph("Nurse", table_body_style), Paragraph("Nurse personal status tracker for pending/approved swaps & leave applications.", table_body_style)],
        [Paragraph("PendingRequestsPage.tsx", table_body_style), Paragraph("/admin/requests", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Admin portal to review, approve, or reject pending leave and swap applications.", table_body_style)],
        [Paragraph("StaffManagementPage.tsx", table_body_style), Paragraph("/admin/staff", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Staff directory for viewing and updating employee roles & ward departments.", table_body_style)],
        [Paragraph("NotificationsPage.tsx", table_body_style), Paragraph("/nurse/notifications", table_body_style), Paragraph("Auth", table_body_style), Paragraph("Real-time push notification center with unread filtering & mark-read actions.", table_body_style)],
        [Paragraph("DutyReportPage.tsx", table_body_style), Paragraph("/admin/reports", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Ward staffing analytics and duty hours reporting interface.", table_body_style)],
        [Paragraph("ProfilePage.tsx", table_body_style), Paragraph("/nurse/profile", table_body_style), Paragraph("Auth", table_body_style), Paragraph("User profile settings, employee badge ID, and department settings.", table_body_style)],
        [Paragraph("PublicPage.tsx", table_body_style), Paragraph("/public", table_body_style), Paragraph("Public", table_body_style), Paragraph("Public ward information landing page.", table_body_style)]
    ]
    t_p2 = Table(pages_p2, colWidths=[115, 150, 65, 202])
    t_p2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_p2)

    story.append(PageBreak())

    # ==========================================
    # PAGE 6: REUSABLE UI COMPONENTS & DESIGN SYSTEM
    # ==========================================
    story.append(Paragraph("4. Reusable UI Component Library & Design System Tokens", h1_style))
    story.append(Paragraph(
        "NurseFlow implements a custom Glassmorphic design system using Tailwind CSS design tokens, HSL purple brand colors (<code>#5142C5</code>), and photorealistic nurse visual assets.",
        body_style
    ))

    ui_data = [
        [Paragraph("<b>UI Component</b>", table_header_style), Paragraph("<b>File Path</b>", table_header_style), Paragraph("<b>Design Tokens & Functional Properties</b>", table_header_style)],
        [Paragraph("Button.tsx", table_body_style), Paragraph("components/ui/Button.tsx", table_body_style), Paragraph("Polymorphic button with primary, secondary, outline, ghost, danger, success variants & spinners.", table_body_style)],
        [Paragraph("Card.tsx", table_body_style), Paragraph("components/ui/Card.tsx", table_body_style), Paragraph("Glassmorphic container card with elevation tokens (shadow-nurse-sm, shadow-nurse-md).", table_body_style)],
        [Paragraph("Badge.tsx", table_body_style), Paragraph("components/ui/Badge.tsx", table_body_style), Paragraph("Status pill indicators for shift types (Morning, Evening, Night) & approvals (Pending, Approved).", table_body_style)],
        [Paragraph("Modal.tsx", table_body_style), Paragraph("components/ui/Modal.tsx", table_body_style), Paragraph("Accessible modal backdrop for shift notes, handover details, and confirmation dialogs.", table_body_style)],
        [Paragraph("Input & Select", table_body_style), Paragraph("components/ui/Input.tsx", table_body_style), Paragraph("Custom form input fields and select dropdowns with focus ring states.", table_body_style)],
        [Paragraph("StatCard.tsx", table_body_style), Paragraph("components/ui/StatCard.tsx", table_body_style), Paragraph("Dashboard metric display card with icon badges and trend indicators.", table_body_style)],
        [Paragraph("RealisticNurseDisplay", table_body_style), Paragraph("components/ui/RealisticNurseDisplay.tsx", table_body_style), Paragraph("Dual photorealistic nurse avatar component displaying female nurse with full hijab & male nurse together.", table_body_style)],
        [Paragraph("Sidebar.tsx", table_body_style), Paragraph("components/navigation/Sidebar.tsx", table_body_style), Paragraph("Desktop left navigation menu with active link highlighting & AI feature links positioned above Profile.", table_body_style)],
        [Paragraph("Topbar.tsx", table_body_style), Paragraph("components/navigation/Topbar.tsx", table_body_style), Paragraph("Glassmorphic header bar with user avatar, role badge, notification dropdown, and quick logout.", table_body_style)],
        [Paragraph("MobileBottomNav.tsx", table_body_style), Paragraph("components/navigation/MobileBottomNav.tsx", table_body_style), Paragraph("Bottom navigation tab bar for mobile viewports.", table_body_style)]
    ]
    t_ui = Table(ui_data, colWidths=[120, 160, 252])
    t_ui.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_ui)

    story.append(PageBreak())

    # ==========================================
    # PAGE 7: CORE MODULE 1 — DUTY ROSTER CALENDAR
    # ==========================================
    story.append(Paragraph("5. Core Feature Module 1: Smart Duty Roster Calendar Engine", h1_style))
    story.append(Paragraph(
        "The Roster Calendar module (<code>NurseRoster.tsx</code>) provides nurses and administrators with a spacious, color-coded weekly and monthly duty schedule. Cards are styled to prevent text collision regardless of screen resolution.",
        body_style
    ))
    story.append(Paragraph("<b>Shift Definitions & Color Tokens:</b>", h2_style))
    story.append(Paragraph("• <b>Morning Shift:</b> 7:00 AM – 3:00 PM (Soft Emerald Tint <code>bg-emerald-50/70 border-emerald-200</code>)", bullet_style))
    story.append(Paragraph("• <b>Evening Shift:</b> 3:00 PM – 11:00 PM (Soft Amber Tint <code>bg-amber-50/70 border-amber-200</code>)", bullet_style))
    story.append(Paragraph("• <b>Night Shift:</b> 11:00 PM – 7:00 AM (Soft Light Purple Tint <code>bg-[#EDE9FE]/50 border-purple-200</code>)", bullet_style))
    story.append(Paragraph("• <b>Off Duty:</b> No Duty Assigned (Soft Slate Tint <code>bg-slate-50 border-slate-200</code>)", bullet_style))
    story.append(Paragraph("• <b>Dedicated Full-Width Button:</b> Every day card contains a full-width <code>View Details →</code> glass button that opens shift notes and handover instructions without text overlapping.", bullet_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 8 & 9: CORE MODULE 2 — GEMMA 4 AI PATIENT SIMULATOR
    # ==========================================
    story.append(Paragraph("6. Core Feature Module 2: Gemma 4 AI Patient Communication Simulator", h1_style))
    story.append(Paragraph(
        "The AI Patient Communication Simulator allows nurses to practice Healthcare Communication in simulated scenarios with realistic patient and caregiver personas. It roleplays realistic situations to develop empathy, active listening, and de-escalation skills.",
        body_style
    ))
    story.append(Paragraph("<b>Pre-Seeded Clinical Training Scenarios:</b>", h2_style))
    story.append(Paragraph("1. <b>Anxious Patient:</b> Pre-surgery fears and anxiety regarding anesthesia risks.", bullet_style))
    story.append(Paragraph("2. <b>Angry Family Member:</b> Relatives upset about delayed physician visits in ward 3.", bullet_style))
    story.append(Paragraph("3. <b>Confused Elderly Patient:</b> Post-operative disorientation and memory lapse.", bullet_style))
    story.append(Paragraph("4. <b>Non-Cooperative Patient:</b> Patient refusing prescribed medication or IV placement.", bullet_style))

    story.append(Paragraph("<b>Dynamic Character Emotion Transition Engine:</b>", h2_style))
    story.append(Paragraph("The AI engine continuously monitors nurse dialogue. Empathy keywords trigger positive emotional state transitions:", body_style))
    story.append(Paragraph("<b>Hostile ➔ Frustrated ➔ Worried ➔ Calm ➔ Reassured</b>", h2_style))

    story.append(PageBreak())

    # PAGE 9: 8-COMPETENCY SCORING METRICS
    story.append(Paragraph("6. Core Feature Module 2: 8-Competency AI Evaluation Radar (Continued)", h1_style))
    story.append(Paragraph(
        "Upon completing a simulation session, Gemma 4 evaluates the entire conversation transcript and outputs 0–100 scores across 8 key competencies:",
        body_style
    ))

    comp_data = [
        [Paragraph("<b>Competency Metric</b>", table_header_style), Paragraph("<b>Scoring Criteria & Evaluation Focus</b>", table_header_style)],
        [Paragraph("1. Empathy & Compassion", table_body_style), Paragraph("Validating patient feelings & maintaining a caring, supportive tone.", table_body_style)],
        [Paragraph("2. Active Listening", table_body_style), Paragraph("Addressing patient questions without skipping medical details.", table_body_style)],
        [Paragraph("3. Communication Clarity", table_body_style), Paragraph("Explaining complex medical procedures in clear, understandable terms.", table_body_style)],
        [Paragraph("4. Professional Composure", table_body_style), Paragraph("Maintaining calm professionalism under hostile or demanding situations.", table_body_style)],
        [Paragraph("5. Emotional Intelligence (EQ)", table_body_style), Paragraph("Recognizing emotional cues and shifting tone appropriately.", table_body_style)],
        [Paragraph("6. De-escalation Capability", table_body_style), Paragraph("Neutralizing angry family members or agitated patients effectively.", table_body_style)],
        [Paragraph("7. Patient Engagement", table_body_style), Paragraph("Involving the patient actively in care plan decisions.", table_body_style)],
        [Paragraph("8. Clinical Confidence", table_body_style), Paragraph("Reassuring the patient with confident healthcare guidance.", table_body_style)]
    ]
    t_comp = Table(comp_data, colWidths=[160, 372])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_comp)

    story.append(PageBreak())

    # ==========================================
    # PAGE 10: CORE MODULE 3 — AI BREAK GAME
    # ==========================================
    story.append(Paragraph("7. Core Feature Module 3: Gemma 4 AI Tick & Cross (Tic-Tac-Toe ❌⭕) Break Game", h1_style))
    story.append(Paragraph(
        "Designed specifically for 10-minute shift breaks, this 100% non-medical relaxation game allows nurses to play Tic-Tac-Toe against Gemma 4 AI to unwind and reset mental focus.",
        body_style
    ))
    story.append(Paragraph("• <b>3 AI Difficulty Modes:</b> Easy (Casual Chill), Medium (Smart Rival), and Unbeatable (Gemma 4 Minimax Algorithm).", bullet_style))
    story.append(Paragraph("• <b>Minimax Algorithm:</b> Evaluates move trees up to depth 6 for optimal move selection.", bullet_style))
    story.append(Paragraph("• <b>Scoreboard & Wellness Points:</b> Tracks Nurse Wins, AI Wins, Draws, and awards Wellness Points to the <code>NurseGameScore</code> model.", bullet_style))
    story.append(Paragraph("• <b>10-Minute Break Countdown:</b> Built-in live timer ensures shift breaks stay structured.", bullet_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 11: SHIFT SWAPS, LEAVE & SOCKET ALERTS
    # ==========================================
    story.append(Paragraph("8. Core Feature Module 4: Shift Swaps, Leave Portal & Socket.IO Push Alerts", h1_style))
    story.append(Paragraph(
        "NurseFlow includes administrative tools for duty exchanges, leave management, and instant push notification broadcasting.",
        body_style
    ))
    story.append(Paragraph("• <b>Shift Swap Requests:</b> Nurse-to-nurse duty exchange system with target peer selection, reason tracking, and 1-click admin approval portals.", bullet_style))
    story.append(Paragraph("• <b>Leave Requests Portal:</b> Annual, Sick, and Emergency leave applications with date range selectors and status badges (Pending, Approved, Rejected).", bullet_style))
    story.append(Paragraph("• <b>Socket.IO Push Engine:</b> Bi-directional WebSocket event engine for instant emergency ward broadcasts and unread notification badge syncing.", bullet_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 12 & 13: ALL 12 PRISMA DATABASE MODELS
    # ==========================================
    story.append(Paragraph("9. Full Database Schema & Data Dictionary (All 12 Prisma Models)", h1_style))
    story.append(Paragraph(
        "NurseFlow utilizes <b>Prisma ORM</b> with a relational SQLite database (<code>dev.db</code>). Below is the complete technical breakdown of all 12 database models.",
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
            ("departmentId", "String (Optional)", "Foreign Key to Department")
        ]),
        ("2. Department Model", "Represents hospital ward units (General Ward, ICU, Emergency, Pediatrics).", [
            ("id", "String (UUID)", "Primary Key"),
            ("name", "String (Unique)", "Department Name"),
            ("description", "String (Optional)", "Ward Description & Capacity")
        ]),
        ("3. Shift Model", "Defines hospital shift timings, color coding, and shift categories.", [
            ("id", "String (UUID)", "Primary Key"),
            ("name", "String", "Shift Name (Morning, Evening, Night)"),
            ("startTime", "String", "Formatted Start Time (7:00 AM)"),
            ("endTime", "String", "Formatted End Time (3:00 PM)"),
            ("type", "String", "MORNING | EVENING | NIGHT | OFF")
        ]),
        ("4. Roster Model", "Stores daily duty assignments linking nurses, shifts, and departments.", [
            ("id", "String (UUID)", "Primary Key"),
            ("nurseId", "String", "Foreign Key to User (Cascade Delete)"),
            ("shiftId", "String", "Foreign Key to Shift (Cascade Delete)"),
            ("departmentId", "String", "Foreign Key to Department (Cascade Delete)"),
            ("date", "String", "Duty Date (YYYY-MM-DD)"),
            ("status", "String", "ON_DUTY | SCHEDULED | OFF | COMPLETED")
        ]),
        ("5. LeaveRequest Model", "Tracks leave applications submitted by nurses and review decisions.", [
            ("id", "String (UUID)", "Primary Key"),
            ("nurseId", "String", "Foreign Key to User (Applicant)"),
            ("leaveType", "String", "Annual Leave | Sick Leave | Emergency"),
            ("fromDate", "String", "Start Date (YYYY-MM-DD)"),
            ("toDate", "String", "End Date (YYYY-MM-DD)"),
            ("status", "String", "PENDING | APPROVED | REJECTED")
        ]),
        ("6. ShiftSwapRequest Model", "Manages nurse-to-nurse shift exchange applications.", [
            ("id", "String (UUID)", "Primary Key"),
            ("requesterId", "String", "Foreign Key to Requesting Nurse"),
            ("targetNurseId", "String", "Foreign Key to Target Peer Nurse"),
            ("originalShiftId", "String", "Foreign Key to Original Shift"),
            ("status", "String", "PENDING | APPROVED | REJECTED")
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
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_model)
        story.append(Spacer(1, 6))

    story.append(PageBreak())

    # PAGE 13: CONTINUATION OF DATABASE MODELS
    story.append(Paragraph("9. Full Database Schema & Data Dictionary (Continued)", h1_style))

    all_models_data_p2 = [
        ("7. Notification Model", "Stores user-specific push notifications and emergency ward alerts.", [
            ("id", "String (UUID)", "Primary Key"),
            ("userId", "String", "Foreign Key to User"),
            ("title", "String", "Notification Header Title"),
            ("message", "String", "Push Notification Content"),
            ("type", "String", "SHIFTS | LEAVE | SWAP | ROSTER | ALERT | INFO"),
            ("isRead", "Boolean", "Read/Unread State Flag")
        ]),
        ("8. CommunicationScenario Model", "Defines AI simulation roleplay scenarios and character personalities.", [
            ("id", "String (UUID)", "Primary Key"),
            ("title", "String", "Scenario Header Title"),
            ("category", "String", "Patient | Family | Elderly | Emergency"),
            ("description", "String", "Detailed Context & Medical Background"),
            ("characterRole", "String", "Patient | Family Member | Elderly Patient"),
            ("personality", "String", "Anxious | Hostile | Confused | Demanding")
        ]),
        ("9. CommunicationSession Model", "Tracks active and completed AI roleplay sessions.", [
            ("id", "String (UUID)", "Primary Key"),
            ("userId", "String", "Foreign Key to User (Nurse)"),
            ("scenarioId", "String", "Foreign Key to CommunicationScenario"),
            ("characterRole", "String", "Roleplayed Character Persona"),
            ("status", "String", "ACTIVE | COMPLETED | ABANDONED")
        ]),
        ("10. CommunicationMessage Model", "Stores individual dialogue turns and emotion states in roleplay chats.", [
            ("id", "String (UUID)", "Primary Key"),
            ("sessionId", "String", "Foreign Key to CommunicationSession"),
            ("role", "String", "NURSE or PATIENT"),
            ("content", "String", "Transcribed Dialogue Text"),
            ("emotion", "String", "Calm | Worried | Confused | Frustrated | Angry | Reassured")
        ]),
        ("11. CommunicationAnalysis Model", "Stores 8-competency scores and AI clinical feedback reports.", [
            ("id", "String (UUID)", "Primary Key"),
            ("sessionId", "String (Unique)", "Foreign Key to CommunicationSession"),
            ("overallScore", "Int", "Calculated Overall Score (0-100)"),
            ("empathyScore", "Int", "Empathy & Compassion Score"),
            ("activeListeningScore", "Int", "Active Listening Score"),
            ("clarityScore", "Int", "Communication Clarity Score"),
            ("feedback", "String", "Comprehensive AI Coaching Summary Text")
        ]),
        ("12. NurseGameScore Model", "Tracks nurse wins, AI wins, draws, and earned wellness points in Tick & Cross game.", [
            ("id", "String (UUID)", "Primary Key"),
            ("userId", "String", "Foreign Key to User (Nurse)"),
            ("gameType", "String", "Break Game Category"),
            ("nurseWins", "Int", "Total Nurse Victory Count"),
            ("aiWins", "Int", "Total Gemma 4 AI Victory Count"),
            ("pointsEarned", "Int", "Total Shift Wellness Points Earned")
        ])
    ]

    for m_title, m_desc, fields in all_models_data_p2:
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
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_model)
        story.append(Spacer(1, 6))

    story.append(PageBreak())

    # ==========================================
    # PAGE 14: COMPLETE REST API ENDPOINTS SPECIFICATION
    # ==========================================
    story.append(Paragraph("10. Full Backend REST API Endpoints Specification", h1_style))
    story.append(Paragraph(
        "All authenticated endpoints require an <code>Authorization: Bearer &lt;token&gt;</code> HTTP header.",
        body_style
    ))

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
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_api)

    story.append(PageBreak())

    # ==========================================
    # PAGE 15: OPERATIONAL SETUP & CONCLUSION
    # ==========================================
    story.append(Paragraph("11. Security, Role Guards & Operational Setup", h1_style))
    story.append(Paragraph("<b>Security & Authorization Guards:</b>", h2_style))
    story.append(Paragraph("• <b>Authentication Token Middleware:</b> Express middleware <code>authenticateToken</code> verifies JWT validity.", bullet_style))
    story.append(Paragraph("• <b>Role-Based Protected Routes:</b> React Router <code>ProtectedRoute</code> component checks role permissions (<code>NURSE</code>, <code>ADMIN</code>, <code>HEAD_NURSE</code>).", bullet_style))

    story.append(Paragraph("<b>Local Setup & Deployment Commands:</b>", h2_style))
    setup_cmd = """# 1. Install Server & Client Dependencies
cd server && npm install
cd ../client && npm install

# 2. Sync Database Schema & Run Seed Data
cd ../server
npx prisma db push
npx ts-node prisma/seed.ts

# 3. Start Development Servers
npm run dev   # inside server (Port 5000)
npm run dev   # inside client (Port 5173)"""
    story.append(Paragraph(setup_cmd.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PURPLE_PRIMARY, spaceAfter=12))
    story.append(Paragraph("NurseFlow Complete System Manual  |  GitHub: Sagheer1122/Arbisoft-GDG-Hackathon", subtitle_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Master 15-Page PDF documentation successfully generated at {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
