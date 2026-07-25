import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NurseFlow Database Seeding...');

  // 1. Clean existing records
  await prisma.communicationAnalysis.deleteMany();
  await prisma.communicationMessage.deleteMany();
  await prisma.communicationSession.deleteMany();
  await prisma.communicationScenario.deleteMany();
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
  const nursePassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

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

  // 6. Rosters
  const todayStr = new Date().toISOString().split('T')[0];
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

  // 7. Seed AI Communication Simulator Scenarios
  await prisma.communicationScenario.createMany({
    data: [
      {
        title: 'Anxious Patient',
        category: 'Patient',
        description: 'Practice communicating with a patient who is worried and afraid about their upcoming diagnostic test.',
        characterRole: 'Patient',
        personality: 'Anxious',
        difficulty: 'BEGINNER',
        objectives: JSON.stringify(['Empathy', 'Reassurance', 'Active listening', 'Clear explanation']),
      },
      {
        title: 'Angry Family Member',
        category: 'Family Member',
        description: 'De-escalate an upset family member who feels their relative has been waiting too long without updates.',
        characterRole: 'Family Member',
        personality: 'Hostile',
        difficulty: 'INTERMEDIATE',
        objectives: JSON.stringify(['De-escalation', 'Calm tone', 'Professional boundaries', 'Active listening']),
      },
      {
        title: 'Confused Elderly Patient',
        category: 'Elderly',
        description: 'Communicate with a disorientation-prone elderly patient who wants to leave the ward unassisted.',
        characterRole: 'Elderly Patient',
        personality: 'Confused',
        difficulty: 'BEGINNER',
        objectives: JSON.stringify(['Patient engagement', 'Validation', 'Patience', 'Safety orientation']),
      },
      {
        title: 'Non-Cooperative Patient',
        category: 'De-escalation',
        description: 'Engage with a young adult patient refusing prescribed morning medication due to fear of side effects.',
        characterRole: 'Young Adult Patient',
        personality: 'Demanding',
        difficulty: 'INTERMEDIATE',
        objectives: JSON.stringify(['Relationship building', 'Setting expectations', 'Empathy', 'Education']),
      },
      {
        title: 'Difficult Conversation',
        category: 'Patient',
        description: 'Support a worried parent whose child needs to remain hospitalized overnight for monitoring.',
        characterRole: 'Parent',
        personality: 'Frightened',
        difficulty: 'ADVANCED',
        objectives: JSON.stringify(['Delivering sensitive news', 'Active listening', 'Emotional support', 'Clarity']),
      },
      {
        title: 'Emergency Communication',
        category: 'Emergency',
        description: 'Obtain critical medical history from a flustered caregiver during an acute triage intake.',
        characterRole: 'Caregiver',
        personality: 'Reluctant',
        difficulty: 'ADVANCED',
        objectives: JSON.stringify(['Clear instructions', 'Rapid assessment', 'Maintaining composure', 'Confidence']),
      },
    ],
  });

  console.log('✅ Communication Simulator Scenarios created');
  console.log('🎉 NurseFlow Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    if (typeof process !== 'undefined') process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
