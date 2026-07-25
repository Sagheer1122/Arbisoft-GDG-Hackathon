"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting NurseFlow Database Seeding...');
    // 1. Clean existing records
    await prisma.notification.deleteMany();
    await prisma.shiftSwapRequest.deleteMany();
    await prisma.leaveRequest.deleteMany();
    await prisma.roster.deleteMany();
    await prisma.shift.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
    // 2. Departments
    const generalWard = await prisma.department.create({
        data: { name: 'General Ward', description: 'Inpatient general medical care and surgical recovery' },
    });
    const icu = await prisma.department.create({
        data: { name: 'ICU', description: 'Intensive Care Unit for critical patient monitoring' },
    });
    const emergency = await prisma.department.create({
        data: { name: 'Emergency', description: 'Trauma and acute emergency response unit' },
    });
    const pediatrics = await prisma.department.create({
        data: { name: 'Pediatrics', description: 'Pediatric care and specialized child recovery' },
    });
    console.log('✅ Departments created');
    // 3. Shifts
    const morningShift = await prisma.shift.create({
        data: {
            name: 'Morning Shift',
            startTime: '7:00 AM',
            endTime: '3:00 PM',
            type: 'MORNING',
            color: 'green',
        },
    });
    const eveningShift = await prisma.shift.create({
        data: {
            name: 'Evening Shift',
            startTime: '3:00 PM',
            endTime: '11:00 PM',
            type: 'EVENING',
            color: 'yellow',
        },
    });
    const nightShift = await prisma.shift.create({
        data: {
            name: 'Night Shift',
            startTime: '7:00 PM',
            endTime: '7:00 AM',
            type: 'NIGHT',
            color: 'purple',
        },
    });
    const offDutyShift = await prisma.shift.create({
        data: {
            name: 'Off Duty',
            startTime: 'N/A',
            endTime: 'N/A',
            type: 'OFF',
            color: 'gray',
        },
    });
    console.log('✅ Shifts created');
    // 4. Passwords
    const nursePassword = await bcryptjs_1.default.hash('password123', 10);
    const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
    // 5. Users
    const sarah = await prisma.user.create({
        data: {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@nurseflow.com',
            passwordHash: nursePassword,
            role: 'NURSE',
            phone: '+1 (555) 234-5678',
            employeeId: 'NUR-101',
            departmentId: generalWard.id,
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
        },
    });
    const emily = await prisma.user.create({
        data: {
            name: 'Emily Davis',
            email: 'emily.davis@nurseflow.com',
            passwordHash: nursePassword,
            role: 'NURSE',
            phone: '+1 (555) 345-6789',
            employeeId: 'NUR-102',
            departmentId: generalWard.id,
            avatar: 'https://images.unsplash.com/photo-1594824813566-78a1ed649470?w=200&auto=format&fit=crop&q=80',
        },
    });
    const laura = await prisma.user.create({
        data: {
            name: 'Laura Wilson',
            email: 'laura.wilson@nurseflow.com',
            passwordHash: nursePassword,
            role: 'NURSE',
            phone: '+1 (555) 456-7890',
            employeeId: 'NUR-103',
            departmentId: icu.id,
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
        },
    });
    const megan = await prisma.user.create({
        data: {
            name: 'Megan Brown',
            email: 'megan.brown@nurseflow.com',
            passwordHash: nursePassword,
            role: 'NURSE',
            phone: '+1 (555) 567-8901',
            employeeId: 'NUR-104',
            departmentId: emergency.id,
            avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80',
        },
    });
    const adminUser = await prisma.user.create({
        data: {
            name: 'Clara Barton',
            email: 'clara.barton@nurseflow.com',
            passwordHash: adminPassword,
            role: 'ADMIN',
            phone: '+1 (555) 999-0000',
            employeeId: 'ADM-001',
            departmentId: generalWard.id,
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        },
    });
    console.log('✅ Users created');
    // 6. Rosters for current week
    const todayStr = new Date().toISOString().split('T')[0];
    // Today's roster
    await prisma.roster.create({
        data: {
            nurseId: sarah.id,
            shiftId: nightShift.id,
            departmentId: generalWard.id,
            date: todayStr,
            status: 'ON_DUTY',
            notes: 'Ensure vitals are checked every 2 hours.',
            createdBy: adminUser.id,
        },
    });
    await prisma.roster.create({
        data: {
            nurseId: emily.id,
            shiftId: morningShift.id,
            departmentId: generalWard.id,
            date: todayStr,
            status: 'ON_DUTY',
            notes: 'Handover morning medications to Dr. Smith.',
            createdBy: adminUser.id,
        },
    });
    await prisma.roster.create({
        data: {
            nurseId: laura.id,
            shiftId: eveningShift.id,
            departmentId: icu.id,
            date: todayStr,
            status: 'SCHEDULED',
            createdBy: adminUser.id,
        },
    });
    await prisma.roster.create({
        data: {
            nurseId: megan.id,
            shiftId: offDutyShift.id,
            departmentId: emergency.id,
            date: todayStr,
            status: 'OFF',
            createdBy: adminUser.id,
        },
    });
    console.log('✅ Today rosters created');
    // 7. Leave Requests
    await prisma.leaveRequest.create({
        data: {
            nurseId: sarah.id,
            leaveType: 'Annual Leave',
            fromDate: '2025-05-20',
            toDate: '2025-05-22',
            reason: 'Family vacation and personal downtime.',
            status: 'PENDING',
        },
    });
    await prisma.leaveRequest.create({
        data: {
            nurseId: emily.id,
            leaveType: 'Sick Leave',
            fromDate: '2025-05-18',
            toDate: '2025-05-19',
            reason: 'Severe migraine medical recommendation.',
            status: 'APPROVED',
            reviewedBy: adminUser.id,
            reviewedAt: new Date(),
        },
    });
    console.log('✅ Leave Requests created');
    // 8. Shift Swap Requests
    await prisma.shiftSwapRequest.create({
        data: {
            requesterId: sarah.id,
            targetNurseId: emily.id,
            originalShiftId: nightShift.id,
            requestedDate: todayStr,
            reason: 'Overlapping clinical training session.',
            status: 'PENDING',
        },
    });
    console.log('✅ Shift Swap Requests created');
    // 9. Notifications
    await prisma.notification.createMany({
        data: [
            {
                userId: sarah.id,
                title: 'Shift Reminder',
                message: 'Your Night Shift starts at 7:00 PM today in General Ward.',
                type: 'SHIFTS',
                isRead: false,
            },
            {
                userId: sarah.id,
                title: 'Roster Updated',
                message: 'Your roster has been published for next week.',
                type: 'ROSTER',
                isRead: true,
            },
            {
                userId: adminUser.id,
                title: 'Pending Leave Request',
                message: 'Sarah Johnson requested Annual Leave (20-22 May 2025).',
                type: 'LEAVE',
                isRead: false,
            },
        ],
    });
    console.log('✅ Notifications created');
    console.log('🎉 NurseFlow Database Seeding Complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
