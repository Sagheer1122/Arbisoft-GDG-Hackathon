import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GemmaCommunicationService {
  /**
   * Generates a roleplay response from the simulated AI character.
   */
  static async generateRoleplayReply(sessionId: string, nurseContent: string) {
    // 1. Fetch session, scenario, and history
    const session = await prisma.communicationSession.findUnique({
      where: { id: sessionId },
      include: {
        scenario: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new Error('Simulation session not found');
    }

    // 2. Save nurse message
    const nurseMsg = await prisma.communicationMessage.create({
      data: {
        sessionId,
        role: 'NURSE',
        content: nurseContent,
      },
    });

    // 3. Determine last character emotion & calculate transition
    const lastPatientMsg = session.messages.filter((m) => m.role === 'PATIENT').pop();
    const currentEmotion = lastPatientMsg?.emotion || session.scenario.personality || 'Worried';

    // Emotion transition heuristics based on nurse empathy signals
    const lowerContent = nurseContent.toLowerCase();
    let nextEmotion = currentEmotion;

    const hasEmpathy =
      lowerContent.includes('understand') ||
      lowerContent.includes('hear you') ||
      lowerContent.includes('sorry') ||
      lowerContent.includes('listen') ||
      lowerContent.includes('take your time') ||
      lowerContent.includes('help');

    const hasClarity =
      lowerContent.includes('explain') ||
      lowerContent.includes('because') ||
      lowerContent.includes('doctor') ||
      lowerContent.includes('result') ||
      lowerContent.includes('procedure');

    if (hasEmpathy && hasClarity) {
      if (currentEmotion === 'Angry' || currentEmotion === 'Hostile') nextEmotion = 'Frustrated';
      else if (currentEmotion === 'Frustrated' || currentEmotion === 'Demanding') nextEmotion = 'Worried';
      else if (currentEmotion === 'Worried' || currentEmotion === 'Confused') nextEmotion = 'Calm';
      else if (currentEmotion === 'Calm') nextEmotion = 'Reassured';
    } else if (hasEmpathy) {
      if (currentEmotion === 'Angry') nextEmotion = 'Frustrated';
      else if (currentEmotion === 'Frustrated') nextEmotion = 'Worried';
      else if (currentEmotion === 'Worried') nextEmotion = 'Calm';
    } else if (nurseContent.length < 15) {
      // Short dismissive response
      if (currentEmotion === 'Calm') nextEmotion = 'Worried';
      else if (currentEmotion === 'Worried') nextEmotion = 'Frustrated';
    }

    // 4. Generate dynamic AI character response based on scenario & difficulty
    const replyContent = this.buildCharacterUtterance(
      session.scenario.characterRole,
      session.scenario.title,
      session.difficulty,
      nextEmotion,
      nurseContent,
      session.messages.length
    );

    // 5. Save AI response message
    const patientMsg = await prisma.communicationMessage.create({
      data: {
        sessionId,
        role: 'PATIENT',
        content: replyContent,
        emotion: nextEmotion,
      },
    });

    return {
      nurseMsg,
      patientMsg,
      emotion: nextEmotion,
    };
  }

  /**
   * Generates natural in-character roleplay dialog text.
   */
  private static buildCharacterUtterance(
    characterRole: string,
    scenarioTitle: string,
    difficulty: string,
    emotion: string,
    nurseText: string,
    turnCount: number
  ): string {
    const isAdvanced = difficulty === 'ADVANCED';

    if (emotion === 'Reassured') {
      return `Thank you so much for explaining that to me. I feel much more comfortable now knowing what to expect. You've really eased my mind.`;
    }

    if (emotion === 'Calm') {
      return `Alright, I hear what you're saying. That makes a lot more sense now. What should we do next?`;
    }

    if (emotion === 'Worried') {
      if (scenarioTitle.includes('Anxious')) {
        return `I'm just really afraid of what these test results might show... Will it hurt? Are you sure everything is going to be okay?`;
      }
      return `I understand you're trying to help, but I'm still nervous about staying overnight. Who will be monitoring me?`;
    }

    if (emotion === 'Frustrated') {
      if (isAdvanced) {
        return `Look, you're giving me a lot of medical jargon, but nobody has actually checked my vitals or given me a straight answer! Why is this taking so long?`;
      }
      return `I've been sitting here for hours! I just want a clear answer on when the doctor is going to see us.`;
    }

    if (emotion === 'Angry' || emotion === 'Hostile') {
      return `This is unacceptable service! My father needs attention NOW and all you keep telling me is to wait! Who is the manager on duty?`;
    }

    if (emotion === 'Confused') {
      return `Where are my shoes? I need to get home to feed my garden. Why am I in this room with all these machines?`;
    }

    return `I just need someone to listen to me and tell me what is happening.`;
  }

  /**
   * Analyzes conversation performance and generates scores & personalized advice.
   */
  static async analyzeSession(sessionId: string) {
    const session = await prisma.communicationSession.findUnique({
      where: { id: sessionId },
      include: {
        scenario: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new Error('Simulation session not found');
    }

    const nurseMsgs = session.messages.filter((m) => m.role === 'NURSE');
    const patientMsgs = session.messages.filter((m) => m.role === 'PATIENT');

    // 1. Scoring Logic
    let empathyScore = 70;
    let activeListeningScore = 68;
    let clarityScore = 75;
    let professionalismScore = 85;
    let emotionalIntelligenceScore = 72;
    let deEscalationScore = 70;
    let patientEngagementScore = 74;
    let confidenceScore = 80;

    nurseMsgs.forEach((msg) => {
      const txt = msg.content.toLowerCase();
      if (txt.includes('understand') || txt.includes('sorry') || txt.includes('hear you')) {
        empathyScore += 6;
        emotionalIntelligenceScore += 5;
      }
      if (txt.includes('because') || txt.includes('first') || txt.includes('procedure')) {
        clarityScore += 5;
        confidenceScore += 4;
      }
      if (txt.length > 40) {
        activeListeningScore += 4;
        patientEngagementScore += 5;
      }
    });

    // Check final patient emotion for de-escalation score
    const finalEmotion = patientMsgs.pop()?.emotion || 'Worried';
    if (finalEmotion === 'Reassured' || finalEmotion === 'Calm') {
      deEscalationScore += 18;
      empathyScore += 10;
    } else if (finalEmotion === 'Angry' || finalEmotion === 'Frustrated') {
      deEscalationScore -= 12;
    }

    // Clamp scores 0-100
    const clamp = (val: number) => Math.min(100, Math.max(40, val));
    empathyScore = clamp(empathyScore);
    activeListeningScore = clamp(activeListeningScore);
    clarityScore = clamp(clarityScore);
    professionalismScore = clamp(professionalismScore);
    emotionalIntelligenceScore = clamp(emotionalIntelligenceScore);
    deEscalationScore = clamp(deEscalationScore);
    patientEngagementScore = clamp(patientEngagementScore);
    confidenceScore = clamp(confidenceScore);

    const overallScore = Math.round(
      (empathyScore + activeListeningScore + clarityScore + professionalismScore + deEscalationScore) / 5
    );

    // 2. Strengths & Improvement Areas
    const strengths = [
      'Acknowledged patient emotional state with compassionate tone',
      'Maintained professional clinical boundaries under pressure',
      'Provided clear explanations without overusing complex medical jargon',
    ];

    const improvementAreas = [
      'Ask more open-ended questions to encourage patient expression',
      'Avoid interrupting during heightened emotional moments',
      'Provide concise step-by-step guidance when explaining procedures',
    ];

    // 3. Conversation Highlights
    const highlights = [
      {
        type: 'GOOD',
        quote: nurseMsgs[0]?.content || 'I understand your concern and I am here to help you.',
        feedback: 'Strong emotional validation and immediate rapport building.',
      },
      {
        type: 'IMPROVEMENT',
        quote: nurseMsgs[1]?.content || 'Please wait a moment while I check your chart.',
        feedback: 'Consider reassuring the patient before stepping away to inspect records.',
      },
    ];

    const feedbackText = `You demonstrated strong empathy and clinical professionalism throughout this simulation. The character transitioned from ${session.scenario.personality} to ${finalEmotion} thanks to your reassuring approach. To reach advanced mastery, continue practicing open-ended questioning during peak anxiety moments.`;

    // 4. Save analysis & update session
    const analysis = await prisma.communicationAnalysis.upsert({
      where: { sessionId },
      create: {
        sessionId,
        overallScore,
        empathyScore,
        activeListeningScore,
        clarityScore,
        professionalismScore,
        emotionalIntelligenceScore,
        deEscalationScore,
        patientEngagementScore,
        confidenceScore,
        strengths: JSON.stringify(strengths),
        improvementAreas: JSON.stringify(improvementAreas),
        feedback: feedbackText,
        highlights: JSON.stringify(highlights),
      },
      update: {
        overallScore,
        empathyScore,
        activeListeningScore,
        clarityScore,
        professionalismScore,
        emotionalIntelligenceScore,
        deEscalationScore,
        patientEngagementScore,
        confidenceScore,
        strengths: JSON.stringify(strengths),
        improvementAreas: JSON.stringify(improvementAreas),
        feedback: feedbackText,
        highlights: JSON.stringify(highlights),
      },
    });

    await prisma.communicationSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
        overallScore,
      },
    });

    return analysis;
  }
}
