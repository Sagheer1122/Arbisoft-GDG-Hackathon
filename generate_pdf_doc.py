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
            self.drawString(40, 755, "NurseFlow — Complete System & Frontend Architecture Manual")
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
    story.append(Paragraph("🏥 NurseFlow — Full Platform & Frontend Architecture Manual", title_style))
    story.append(Paragraph("Comprehensive Frontend Architecture Reference | All Pages, UI Components, Context Providers & 12 Database Schemas", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2.5, color=PURPLE_PRIMARY, spaceAfter=15))

    # SECTION 1: EXECUTIVE OVERVIEW
    story.append(Paragraph("1. Executive Overview & System Architecture", h1_style))
    story.append(Paragraph(
        "<b>NurseFlow</b> is built as a Single-Page Application (SPA) using React 18, Vite, TypeScript, and Tailwind CSS. The frontend architecture is structured into decoupled modules comprising pages, reusable UI components, navigation layouts, global context providers, and API service integration.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # SECTION 2: FRONTEND PAGES SPECIFICATION
    story.append(Paragraph("2. Complete Frontend Pages Specification (All 21 Views)", h1_style))
    story.append(Paragraph(
        "Below is the complete technical reference for every single page component in the <code>client/src/pages/</code> codebase.",
        body_style
    ))

    pages_data = [
        [Paragraph("<b>Page Component</b>", table_header_style), Paragraph("<b>Route URL</b>", table_header_style), Paragraph("<b>Role Guard</b>", table_header_style), Paragraph("<b>Description & Functionality</b>", table_header_style)],
        [Paragraph("SplashPage.tsx", table_body_style), Paragraph("/", table_body_style), Paragraph("Public", table_body_style), Paragraph("Landing page with realistic nurse avatars, features, and quick login shortcuts.", table_body_style)],
        [Paragraph("RoleSelectionPage.tsx", table_body_style), Paragraph("/role-selection", table_body_style), Paragraph("Public", table_body_style), Paragraph("Interactive portal for choosing Nurse vs Administrator workspace login.", table_body_style)],
        [Paragraph("LoginPage.tsx", table_body_style), Paragraph("/login", table_body_style), Paragraph("Public", table_body_style), Paragraph("JWT authentication login screen with demo credentials quick-fill buttons.", table_body_style)],
        [Paragraph("NurseDashboard.tsx", table_body_style), Paragraph("/nurse/dashboard", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Nurse home portal with active shift banner, quick actions, and schedule preview.", table_body_style)],
        [Paragraph("AdminDashboard.tsx", table_body_style), Paragraph("/admin/dashboard", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Executive overview with staffing metrics, ward attendance, and request queues.", table_body_style)],
        [Paragraph("NurseRoster.tsx", table_body_style), Paragraph("/nurse/roster", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Weekly/monthly roster calendar grid with color-coded shifts & details buttons.", table_body_style)],
        [Paragraph("CreateRosterPage.tsx", table_body_style), Paragraph("/admin/roster/create", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Admin schedule builder interface for assigning shifts across hospital wards.", table_body_style)],
        [Paragraph("ShiftDetailsPage.tsx", table_body_style), Paragraph("/nurse/shifts/:id", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Detailed view of a shift assignment, handover notes, and ward contacts.", table_body_style)],
        [Paragraph("CommunicationSimulatorPage.tsx", table_body_style), Paragraph("/nurse/communication-simulator", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Scenario selection dashboard for the Gemma 4 AI Patient Simulator.", table_body_style)],
        [Paragraph("CommunicationSessionPage.tsx", table_body_style), Paragraph("/nurse/communication-simulator/session/:id", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Live roleplay chat room with emotion status pills & real-time Gemma 4 reply.", table_body_style)],
        [Paragraph("CommunicationResultsPage.tsx", table_body_style), Paragraph("/nurse/communication-simulator/session/:id/results", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("Post-simulation analysis dashboard displaying 8-competency radar scores & advice.", table_body_style)],
        [Paragraph("TicTacToeGamePage.tsx", table_body_style), Paragraph("/nurse/break-games/tic-tac-toe", table_body_style), Paragraph("Nurse, Admin", table_body_style), Paragraph("AI Tick & Cross break game with 3 difficulty modes, 10-min timer, and scoreboard.", table_body_style)],
        [Paragraph("ShiftSwapPage.tsx", table_body_style), Paragraph("/nurse/shift-swap", table_body_style), Paragraph("Nurse", table_body_style), Paragraph("Form to submit shift exchange requests with target peer nurses.", table_body_style)],
        [Paragraph("LeaveRequestPage.tsx", table_body_style), Paragraph("/nurse/leave-request", table_body_style), Paragraph("Nurse", table_body_style), Paragraph("Form to apply for Sick, Annual, or Emergency leave with date selectors.", table_body_style)],
        [Paragraph("MyRequestsPage.tsx", table_body_style), Paragraph("/nurse/requests", table_body_style), Paragraph("Nurse", table_body_style), Paragraph("Nurse personal status tracker for pending/approved swaps & leave applications.", table_body_style)],
        [Paragraph("PendingRequestsPage.tsx", table_body_style), Paragraph("/admin/requests", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Admin portal to review, approve, or reject pending leave and swap applications.", table_body_style)],
        [Paragraph("StaffManagementPage.tsx", table_body_style), Paragraph("/admin/staff", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Staff directory for viewing and updating employee roles & ward departments.", table_body_style)],
        [Paragraph("NotificationsPage.tsx", table_body_style), Paragraph("/nurse/notifications", table_body_style), Paragraph("Auth", table_body_style), Paragraph("Real-time push notification center with unread filtering & mark-read actions.", table_body_style)],
        [Paragraph("DutyReportPage.tsx", table_body_style), Paragraph("/admin/reports", table_body_style), Paragraph("Admin", table_body_style), Paragraph("Ward staffing analytics and duty hours reporting interface.", table_body_style)],
        [Paragraph("ProfilePage.tsx", table_body_style), Paragraph("/nurse/profile", table_body_style), Paragraph("Auth", table_body_style), Paragraph("User profile settings, employee badge ID, and department settings.", table_body_style)]
    ]

    t_pages = Table(pages_data, colWidths=[115, 150, 75, 192])
    t_pages.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_pages)

    story.append(Spacer(1, 12))

    # SECTION 3: REUSABLE UI COMPONENTS & NAVIGATION
    story.append(Paragraph("3. Reusable UI Components & Layout Systems", h1_style))
    
    ui_data = [
        [Paragraph("<b>Component Name</b>", table_header_style), Paragraph("<b>File Path</b>", table_header_style), Paragraph("<b>Description & Styling Tokens</b>", table_header_style)],
        [Paragraph("Button.tsx", table_body_style), Paragraph("components/ui/Button.tsx", table_body_style), Paragraph("Polymorphic button supporting primary, secondary, outline, ghost, danger, success variants, loading spinner, and icon props.", table_body_style)],
        [Paragraph("Card.tsx", table_body_style), Paragraph("components/ui/Card.tsx", table_body_style), Paragraph("Glassmorphic container card with hover elevation tokens (shadow-nurse-sm, shadow-nurse-md).", table_body_style)],
        [Paragraph("Badge.tsx", table_body_style), Paragraph("components/ui/Badge.tsx", table_body_style), Paragraph("Status pill indicators for shift types (Morning, Evening, Night) and approvals (Pending, Approved, Rejected).", table_body_style)],
        [Paragraph("Modal.tsx", table_body_style), Paragraph("components/ui/Modal.tsx", table_body_style), Paragraph("Accessible modal overlay backdrop for popups, shift notes, and confirmation dialogs.", table_body_style)],
        [Paragraph("Input.tsx & Select.tsx", table_body_style), Paragraph("components/ui/Input.tsx", table_body_style), Paragraph("Custom styled form input fields and dropdown select components with validation ring states.", table_body_style)],
        [Paragraph("StatCard.tsx", table_body_style), Paragraph("components/ui/StatCard.tsx", table_body_style), Paragraph("Dashboard metric display card with icon badges and trend indicators.", table_body_style)],
        [Paragraph("RealisticNurseDisplay.tsx", table_body_style), Paragraph("components/ui/RealisticNurseDisplay.tsx", table_body_style), Paragraph("Dual photorealistic nurse avatar component displaying female nurse with full hijab & male nurse together.", table_body_style)],
        [Paragraph("Sidebar.tsx", table_body_style), Paragraph("components/navigation/Sidebar.tsx", table_body_style), Paragraph("Desktop left navigation menu with active link highlighting, badge counts, and reordered AI feature links right above Profile.", table_body_style)],
        [Paragraph("Topbar.tsx", table_body_style), Paragraph("components/navigation/Topbar.tsx", table_body_style), Paragraph("Glassmorphic header bar with user avatar, role badge, notification bell dropdown, and quick logout.", table_body_style)],
        [Paragraph("MobileBottomNav.tsx", table_body_style), Paragraph("components/navigation/MobileBottomNav.tsx", table_body_style), Paragraph("Bottom navigation tab bar for mobile viewports with quick icons.", table_body_style)],
        [Paragraph("MainLayout.tsx", table_body_style), Paragraph("layouts/MainLayout.tsx", table_body_style), Paragraph("Master layout wrapper integrating Sidebar, Topbar, and MobileBottomNav with responsive content area.", table_body_style)]
    ]

    t_ui = Table(ui_data, colWidths=[120, 160, 252])
    t_ui.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_DARK),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_ui)

    story.append(Spacer(1, 12))

    # SECTION 4: CONTEXT PROVIDERS & STATE MANAGEMENT
    story.append(Paragraph("4. Context Providers & Global State Management", h1_style))
    story.append(Paragraph("• <b>AuthContext.tsx:</b> Manages global user authentication state, JWT Bearer token storage in <code>localStorage</code>, login, register, profile fetching, and logout functions.", bullet_style))
    story.append(Paragraph("• <b>SocketContext.tsx:</b> Establishes bi-directional Socket.IO WebSocket connection with backend server, manages real-time emergency ward alert popups, and syncs unread notification counters.", bullet_style))
    story.append(Paragraph("• <b>api.ts Service Layer:</b> Axios API wrapper with request interceptors injecting Bearer tokens, providing type-safe backend call methods for all 25+ REST endpoints.", bullet_style))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE_PRIMARY, spaceAfter=10))
    story.append(Paragraph("NurseFlow Complete Frontend & System Documentation  |  GitHub: Sagheer1122/Arbisoft-GDG-Hackathon", subtitle_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF documentation with complete Frontend Reference generated at {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
