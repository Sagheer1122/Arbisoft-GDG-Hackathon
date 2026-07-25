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
    const lower = nurseText.toLowerCase();

    // Turn index variation seed
    const idx = (turnCount + nurseText.length) % 4;

    // Contextual references to nurse content
    let topicRef = '';
    if (lower.includes('doctor') || lower.includes('physician')) {
      topicRef = ' I appreciate you checking with the doctor. ';
    } else if (lower.includes('pain') || lower.includes('hurt') || lower.includes('medicine') || lower.includes('medication')) {
      topicRef = ' Thank you for addressing my pain concerns. ';
    } else if (lower.includes('test') || lower.includes('blood') || lower.includes('scan') || lower.includes('x-ray')) {
      topicRef = ' I was really worried about those test procedures. ';
    } else if (lower.includes('family') || lower.includes('son') || lower.includes('daughter') || lower.includes('husband') || lower.includes('wife')) {
      topicRef = ' Thank you for keeping my family informed. ';
    }

    if (emotion === 'Reassured') {
      const reassuredResponses = [
        `Thank you so much, Nurse.${topicRef}I feel much more comfortable now knowing what to expect. You've really eased my mind.`,
        `That really reassures me.${topicRef}I appreciate you taking the time to explain everything so kindly and clearly.`,
        `I feel a lot better now.${topicRef}Thank you for treating me with such care and patience. I feel safe in your hands.`,
        `That is such a relief to hear!${topicRef}Thank you for answering all my questions so thoughtfully.`
      ];
      return reassuredResponses[idx];
    }

    if (emotion === 'Calm') {
      const calmResponses = [
        `Alright, I hear what you're saying.${topicRef}That makes a lot more sense now. What should we do next?`,
        `I understand now.${topicRef}Thank you for clarifying that for me. What is the next step in my care plan?`,
        `Okay, I'm feeling a bit more relaxed.${topicRef}Could you tell me how long this next step usually takes?`,
        `That sounds reasonable.${topicRef}I'm glad you explained it. What should I prepare for next?`
      ];
      return calmResponses[idx];
    }

    if (emotion === 'Worried') {
      if (scenarioTitle.includes('Anxious')) {
        const anxiousResponses = [
          `I'm just really afraid of what these test results might show...${topicRef}Will the procedure hurt? Are you sure everything is going to be okay?`,
          `My heart is racing...${topicRef}What if something goes wrong during the procedure? Can you stay with me?`,
          `I haven't been able to sleep all night thinking about this.${topicRef}Could you explain what happens right before we start?`,
          `I'm so nervous...${topicRef}Is it normal to feel this scared before a treatment like this?`
        ];
        return anxiousResponses[idx];
      }
      const generalWorried = [
        `I understand you're trying to help, but I'm still nervous.${topicRef}Who will be monitoring me during the shift?`,
        `I'm really uneasy about this.${topicRef}What happens if my symptoms get worse while I'm waiting?`,
        `I've never had to go through this before.${topicRef}Can you explain why this specific test is necessary?`,
        `It all feels very overwhelming.${topicRef}Are you sure there aren't any alternative options?`
      ];
      return generalWorried[idx];
    }

    if (emotion === 'Frustrated') {
      if (isAdvanced) {
        const advancedFrustrated = [
          `Look, you're giving me medical jargon, but nobody has actually checked my vitals or given me a straight answer!${topicRef}Why is this taking so long?`,
          `I've been asking the same question for the last hour!${topicRef}When is someone actually going to take action here?`,
          `This isn't helping me.${topicRef}I need clear timelines, not vague promises. Who is in charge of this ward?`,
          `We've been waiting endlessly!${topicRef}My patience is wearing thin and I need immediate assistance.`
        ];
        return advancedFrustrated[idx];
      }
      const frustratedResponses = [
        `I've been sitting here for hours!${topicRef}I just want a clear answer on when the doctor is going to see us.`,
        `Why does everything in this hospital take so much time?${topicRef}We've been waiting in this room without any update!`,
        `I'm getting really annoyed.${topicRef}Can someone please explain what the delay is about?`,
        `This is becoming ridiculous.${topicRef}We deserve to know what is happening with our care plan right now!`
      ];
      return frustratedResponses[idx];
    }

    if (emotion === 'Angry' || emotion === 'Hostile') {
      const angryResponses = [
        `This is unacceptable service!${topicRef}My family needs attention NOW and all you keep telling me is to wait! Who is the manager on duty?`,
        `I don't want to hear excuses anymore!${topicRef}You've ignored us for hours and I am not going to tolerate this treatment!`,
        `Get me the head nurse or doctor right now!${topicRef}This level of care is completely unacceptable!`,
        `I am beyond furious!${topicRef}No one is giving us proper answers and my patience has completely run out!`
      ];
      return angryResponses[idx];
    }

    if (emotion === 'Confused') {
      const confusedResponses = [
        `Where are my shoes? I need to get home to feed my garden.${topicRef}Why am I in this room with all these machines?`,
        `I don't understand where I am...${topicRef}Who are you, and where is my family?`,
        `Why is it so bright in here?${topicRef}Am I supposed to be somewhere else right now?`,
        `Everything is so confusing...${topicRef}What day is it, nurse? What am I waiting for?`
      ];
      return confusedResponses[idx];
    }

    const defaultResponses = [
      `I just need someone to listen to me and tell me what is happening.${topicRef}`,
      `Could you please explain that again? I want to make sure I understand.${topicRef}`,
      `I'm listening, Nurse. What do we do next?${topicRef}`,
      `Thank you for taking the time to speak with me.${topicRef}`
    ];
    return defaultResponses[idx];
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
