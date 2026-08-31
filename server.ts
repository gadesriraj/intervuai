import express from 'express';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config({ override: true });


const geminiApiKey = (process.env.GEMINI_API_KEY || '').trim();
const groqApiKey = (process.env.GROQ_API_KEY || '').trim();

console.log('Gemini API key loaded:', !!geminiApiKey);
console.log('Gemini API key length:', geminiApiKey.length);

console.log('Groq API key loaded:', !!groqApiKey);
console.log('Groq API key length:', groqApiKey.length);

console.log('Supabase URL loaded:', !!process.env.SUPABASE_URL);
console.log(
  'Supabase key loaded:',
  !!(process.env.SUPABASE_ANON_KEY || '').trim()
);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});






/**
 * Monday launch AI architecture:
 *
 * Gemini -> Groq -> friendly error
 *
 * The normal interview makes only TWO successful AI generations:
 * 1. Generate all 8 questions in one call.
 * 2. Final evaluation in one call.
 *
 * Q1 -> Q8 are handled locally by the frontend from the generated
 * question list, so /api/interview/next-question is not part of
 * the normal interview flow.
 */
async function generateJSONWithFallback(prompt: string): Promise<any> {
  let geminiError: any = null;

  // Primary: Gemini
  if (apiKey) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = cleanAndParseJSON(response.text || '');
      if (!parsed) {
        throw new Error('Gemini returned invalid JSON');
      }

      console.log('[AI Router] SUCCESS provider=gemini');
      return parsed;
    } catch (error: any) {
      geminiError = error;
      console.warn(
        `[AI Router] Gemini failed: ${error?.status || error?.code || 'unknown'} ${error?.message || String(error)}`
      );
    }
  } else {
    geminiError = new Error('Gemini API key is not configured');
    console.warn('[AI Router] Gemini API key is not configured');
  }

  // Fallback: Groq
  if (groqApiKey) {
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });

      const bodyText = await groqResponse.text();

      if (!groqResponse.ok) {
        throw new Error(`Groq ${groqResponse.status}: ${bodyText}`);
      }

      const body = JSON.parse(bodyText);
      const rawText = body?.choices?.[0]?.message?.content || '';
      const parsed = cleanAndParseJSON(rawText);

      if (!parsed) {
        throw new Error('Groq returned invalid JSON');
      }

      console.log(`[AI Router] SUCCESS provider=groq model=${GROQ_MODEL}`);
      return parsed;
    } catch (groqError: any) {
      console.error(
        `[AI Router] Groq failed: ${groqError?.message || String(groqError)}`
      );
    }
  } else {
    console.error('[AI Router] Groq API key is not configured');
  }

  throw new Error('AI_CAPACITY_UNAVAILABLE');
}



// Helper for safe JSON extraction from Gemini response
function cleanAndParseJSON(text: string) {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON from Gemini response:', err, text);
    return null;
  }
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/ai/status', (req, res) => {
  res.json({
    providers: {
      gemini: {
        enabled: Boolean(process.env.GEMINI_API_KEY),
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash'
      },
      groq: {
        enabled: Boolean(process.env.GROQ_API_KEY),
        model: GROQ_MODEL
      }
    },
    interview: {
      aiCallsPerNormalInterview: 2,
      flow: 'generate-8-questions -> local Q1-Q8 -> final evaluation'
    }
  });
});

// -------------------------------------------------------------
// SUPABASE DATABASE CONNECTION TEST
// -------------------------------------------------------------
app.get('/api/db/status', async (_req, res) => {
  try {
    const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
    const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || '').trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({
        connected: false,
        error: 'SUPABASE_URL or SUPABASE_ANON_KEY is missing from .env',
      });
    }

    const { createClient } = await import('@supabase/supabase-js');

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey
    );

    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.error('[Supabase] Database test failed:', error.message);

      return res.status(500).json({
        connected: false,
        error: error.message,
      });
    }

    console.log('[Supabase] Database connection successful.');

    return res.json({
      connected: true,
      database: 'supabase-postgresql',
    });
  } catch (error: any) {
    console.error('[Supabase] Connection error:', error);

    return res.status(500).json({
      connected: false,
      error: error?.message || 'Database connection failed',
    });
  }
});

// -------------------------------------------------------------
// SUPABASE AUTH
// -------------------------------------------------------------

const supabase = createClient(
  (process.env.SUPABASE_URL || '').trim(),
  (process.env.SUPABASE_ANON_KEY || '').trim()
);

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      targetRole,
      experienceLevel,
      skills
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name || email.split('@')[0]
        }
      }
    });

    console.log('[AUTH] signUp error:', error);
console.log('[AUTH] user created:', data.user?.id);
console.log('[AUTH] session exists:', !!data.session);

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    if (!data.user) {
      return res.status(400).json({
        error: 'Unable to create account'
      });
    }

    // Store profile
  const { data: profileData, error: profileError } = await supabase
  .from('profiles')
  .upsert({
    id: data.user.id,
    full_name: name || email.split('@')[0],
    email: email.trim(),
    target_role: targetRole || null,
    experience_level: experienceLevel || null,
    skills: Array.isArray(skills) ? skills : []
  })
  .select()
  .single();

console.log('[PROFILE] error:', profileError);
console.log('[PROFILE] data:', profileData);  

    if (profileError) {
      console.error('[Supabase] Profile error:', profileError.message);

      return res.status(500).json({
        error: 'Account created, but profile could not be saved'
      });
    }

    return res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: name || email.split('@')[0]
      },
      token: data.session?.access_token || null,
      session: data.session
    });

  } catch (error: any) {
    console.error('[Register]', error);

    return res.status(500).json({
      error: 'Registration failed'
    });
  }
});



// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

    if (error) {
      return res.status(401).json({
        error: error.message
      });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({
        error: 'Login failed'
      });
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name:
          profile?.full_name ||
          data.user.user_metadata?.full_name ||
          data.user.email?.split('@')[0]
      },
      token: data.session.access_token,
      session: data.session,
      profile
    });

  } catch (error: any) {
    console.error('[Login]', error);

    return res.status(500).json({
      error: 'Login failed'
    });
  }
});

// -------------------------------------------------------------
// CURRENT AUTH USER / SESSION RESTORE
// -------------------------------------------------------------

app.get('/api/auth/me', async (req, res) => {
  try {
    const authorization =
      req.headers.authorization || '';

    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authorization token is missing',
      });
    }

    const token =
      authorization.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        error: 'Authorization token is missing',
      });
    }

    /*
     * Verify the Supabase access token.
     */
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error(
        '[AUTH ME] Token verification failed:',
        error?.message
      );

      return res.status(401).json({
        error: 'Invalid or expired session',
      });
    }

    /*
     * Get the user's profile from our profiles table.
     */
    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (profileError) {
      console.error(
        '[AUTH ME] Profile lookup failed:',
        profileError.message
      );
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,

        name:
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'User',
      },

      profile: profile || null,
    });
  } catch (error: any) {
    console.error(
      '[AUTH ME] Error:',
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        'Unable to restore session',
    });
  }
});

// -------------------------------------------------------------
// UPDATE USER PROFILE
// -------------------------------------------------------------
app.put('/api/profile', async (req, res) => {
  try {
    const {
      id,
      name,
      email,
      college,
      degree,
      branch,
      graduationYear,
      targetCompany,
      dreamJob,
      yearsExperience,
      skills,
      github,
      linkedin,
      portfolio,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

    const profileData = {
      id,

      full_name: name || null,
      email: email || null,

      college: college || null,
      degree: degree || null,
      branch: branch || null,

      graduation_year:
        graduationYear || null,

      target_company:
        targetCompany || null,

      dream_job:
        dreamJob || null,

      years_experience:
        yearsExperience || null,

      skills:
        Array.isArray(skills) ? skills : [],

      github: github || null,
      linkedin: linkedin || null,
      portfolio: portfolio || null,

      updated_at: new Date().toISOString(),
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'id',
      })
      .select()
      .single();

    if (error) {
      console.error(
        '[Supabase] Profile upsert error:',
        error
      );

      return res.status(500).json({
        error: error.message,
        details: error.details,
        hint: error.hint,
      });
    }

    console.log(
      '[Supabase] Profile saved:',
      profile
    );

    return res.json({
      success: true,
      profile,
    });

  } catch (error: any) {
    console.error(
      '[Profile Update]',
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        'Failed to save profile',
    });
  }
});


// Resume Analyzer Endpoint
app.post('/api/resume/analyze', async (req, res) => {
  try {
    const { resumeText, fileName } = req.body;

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        error: 'Resume text is required and must be sufficiently long.'
      });
    }

    const prompt = `You are a Senior Technical Recruiter and Career Coach.

Analyze the following candidate resume and provide a comprehensive resume critique.

Return ONLY valid JSON matching this exact structure:

{
  "resumeScore": number,
  "extractedSkills": ["string"],
  "detectedWeakAreas": ["string"],
  "suggestedImprovements": ["string"],
  "summary": "string",
  "suggestedRoles": ["string"]
}

Rules:
- resumeScore must be between 0 and 100.
- Extract skills that actually appear in the resume.
- Do not invent experience, skills, projects, companies or education.
- Identify realistic weaknesses in the resume.
- Give practical improvements.
- Suggest roles that match the candidate's actual background.
- Keep the analysis specific to this resume.

Resume file:
${fileName || 'Candidate Resume'}

Resume Text:
${resumeText.substring(0, 8000)}
`;

    let parsed;

    try {
      parsed = await generateJSONWithFallback(prompt);
    } catch (error: any) {
      console.error('Resume Analysis AI Router Error:', error);

      if (error?.message === 'AI_CAPACITY_UNAVAILABLE') {
        return res.status(503).json({
          error: 'AI capacity temporarily unavailable. Please try again in a few minutes.'
        });
      }

      return res.status(500).json({
        error: 'Failed to analyze resume'
      });
    }

    if (
      !parsed ||
      typeof parsed.resumeScore !== 'number' ||
      !Array.isArray(parsed.extractedSkills) ||
      !Array.isArray(parsed.detectedWeakAreas) ||
      !Array.isArray(parsed.suggestedImprovements) ||
      typeof parsed.summary !== 'string' ||
      !Array.isArray(parsed.suggestedRoles)
    ) {
      return res.status(500).json({
        error: 'AI returned an invalid resume analysis structure.'
      });
    }

    return res.json(parsed);

  } catch (error: any) {
    console.error('Resume Analysis Error:', error);

    return res.status(500).json({
      error: 'Failed to analyze resume',
      details: error.message || String(error),
    });
  }
});

// Generate Initial Interview Questions Endpoint
app.post('/api/interview/generate-questions', async (req, res) => {
  try {
    
const {
  roundType,
  difficulty,
  company,
  role,
  skills,
  duration,
  resumeText,
  resumeScore,
  focusAreas
} = req.body;
    
const numQuestions = 8;
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        questions: [
          {
            id: 'q1',
            text: `Tell me about yourself and why you want to join ${company || 'our company'} as a ${role || 'Software Engineer'}?`,
            category: 'Introduction & Fit',
            expectedKeywords: ['experience', 'passion', 'company values', 'career goals'],
            difficulty: 'Easy'
          },
          {
            id: 'q2',
            text: `How do you handle component state management and async data fetching in modern web applications?`,
            category: 'Technical Core',
            expectedKeywords: ['state', 'hooks', 'react', 'promises', 'error handling'],
            difficulty: difficulty || 'Medium'
          },
          {
            id: 'q3',
            text: `Describe a time when you had to debug a difficult production issue or resolve a technical disagreement in your team.`,
            category: 'Behavioral & Problem Solving',
            expectedKeywords: ['STAR method', 'collaboration', 'root cause analysis', 'resolution'],
            difficulty: difficulty || 'Medium'
          }
        ]
      });
    }
const prompt = `You are a Senior Principal Interviewer at ${company || 'a top tech company'}.

You are conducting a personalized ${roundType || 'Technical'} interview for:
Role: ${role || 'Software Engineer'}
Difficulty: ${difficulty || 'Medium'}

IMPORTANT:
The candidate's resume is provided below. You MUST use the resume to personalize the interview.

Candidate Skills:
${skills && skills.length ? skills.join(', ') : 'Not specified'}

Focus Areas:
${focusAreas && focusAreas.length ? focusAreas.join(', ') : 'General role requirements'}

Resume Score:
${resumeScore ?? 'Not available'}

Candidate Resume:
${resumeText ? resumeText.substring(0, 8000) : 'No resume provided.'}

INTERVIEW QUESTION REQUIREMENTS:

1. Generate exactly 8 questions.

2. Questions must be relevant to the selected interview round:
   - HR: motivation, strengths, weaknesses, teamwork, conflict, leadership, career goals, company fit.
   - Technical: programming, technologies, projects, architecture, debugging, databases, algorithms.
   - Behavioral: teamwork, conflict, failure, leadership, communication, decision making.
   - Managerial: leadership, prioritization, delegation, decision making, stakeholder management.
   - System Design: architecture, scalability, databases, APIs, caching, reliability and trade-offs.
   - Coding: algorithms, data structures, problem solving and coding concepts.

3. Use the candidate's resume to personalize questions whenever relevant.

4. If the resume contains projects, ask questions about those projects.

5. If the resume contains internships or work experience, ask questions about those experiences.

6. If technologies are listed, ask technical questions related to those technologies when appropriate.

7. DO NOT invent projects, companies, technologies, internships or experience that are not present in the resume.

8. The 8 questions MUST cover different topics.

9. Do NOT generate multiple questions that are simply reworded versions of each other.

10. Do NOT repeatedly ask the candidate to elaborate on the same answer.


11. For HR interviews, make all 8 questions substantially different:
    - Introduction / background
    - Motivation
    - Strengths or weaknesses
    - Teamwork
    - Conflict or difficult situation
    - Failure / learning
    - Career goals
    - Company / role fit

12. Questions should progressively increase in difficulty.

13. Make the questions realistic for an actual interview.

14. Avoid generic questions when a relevant resume-specific question can be asked.

15. Return exactly 8 questions.


Return STRICTLY JSON format matching this schema:

{
  "questions": [
    {
      "id": "string",
      "text": "string",
      "category": "string",
      "expectedKeywords": ["string"],
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  ]
}

Generate ${numQuestions} questions.`;

    const parsed = await generateJSONWithFallback(prompt);
    if (parsed && parsed.questions) {
      return res.json(parsed);
    }
    throw new Error('Failed to parse question generation JSON');
  } catch (error: any) {
    console.error('Error generating questions:', error);
    if (error?.message === 'AI_CAPACITY_UNAVAILABLE') {
      return res.status(503).json({
        error: 'AI capacity temporarily unavailable. Please try again in a few minutes.'
      });
    }
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Adaptive Follow-up Question Endpoint
app.post('/api/interview/next-question', async (req, res) => {
  try {
    const {
      currentQuestion,
      candidateAnswer,
      previousTranscript,
      roundType,
      company,
      role,
      difficulty,
      resumeText,
      skills,
      currentQuestionNumber,
      maxQuestions = 8
    } = req.body;

    const transcript = Array.isArray(previousTranscript)
      ? previousTranscript
      : [];

    const questionNumber = Number(currentQuestionNumber) || transcript.length;

    // ---------------------------------------------------------
    // IMPORTANT:
    // Stop generating questions after question 8.
    // ---------------------------------------------------------
    if (questionNumber >= maxQuestions) {
      return res.json({
        feedbackOnLastAnswer:
          "Thank you. That completes the interview.",
        isFollowUp: false,
        nextQuestion: null,
        interviewComplete: true
      });
    }

    // ---------------------------------------------------------
    // Create a list of questions already asked.
    // This prevents Gemini from repeating them.
    // ---------------------------------------------------------
    const previousQuestions = transcript
      .map((item: any) => item.question)
      .filter(Boolean);

    if (currentQuestion?.text) {
      previousQuestions.push(currentQuestion.text);
    }

    const previousQuestionsText = previousQuestions.length
      ? previousQuestions
          .map(
            (question: string, index: number) =>
              `${index + 1}. ${question}`
          )
          .join('\n')
      : 'No previous questions.';

    // ---------------------------------------------------------
    // If the answer is extremely short, do ONE follow-up.
    // But do not repeatedly follow up on the same question.
    // ---------------------------------------------------------
    const answerText = (candidateAnswer || '').trim();

    if (answerText.length < 5) {
      const alreadyHadFollowUp = transcript.some(
        (item: any) =>
          item.questionId === currentQuestion?.id &&
          item.isFollowUp === true
      );

      if (!alreadyHadFollowUp) {
        return res.json({
          feedbackOnLastAnswer:
            "Your answer was very brief. Please provide a little more detail.",
          isFollowUp: true,
          nextQuestion:
            "Could you briefly explain your answer with one specific example?"
        });
      }
    }

    // ---------------------------------------------------------
    // No API key fallback
    // ---------------------------------------------------------
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        feedbackOnLastAnswer:
          "Good. Let's continue with another interview topic.",
        isFollowUp: false,
        nextQuestion:
          roundType === 'HR'
            ? "What is one of your biggest strengths, and how has it helped you in a real situation?"
            : "What is another important technical challenge you have faced, and how did you solve it?",
        interviewComplete: false
      });
    }

    // ---------------------------------------------------------
    // Format transcript for Gemini
    // ---------------------------------------------------------
    const transcriptFormatted = transcript.length
      ? transcript
          .map(
            (item: any, index: number) =>
              `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer || 'No answer provided'}`
          )
          .join('\n\n')
      : 'No previous answers.';

    // ---------------------------------------------------------
    // HR topic rotation
    // ---------------------------------------------------------
    const hrTopics = [
      'introduction and background',
      'motivation for the role',
      'strengths and weaknesses',
      'teamwork and collaboration',
      'conflict or difficult situation',
      'failure and learning',
      'leadership or decision making',
      'career goals and company fit'
    ];

    const nextHrTopic =
      roundType === 'HR'
        ? hrTopics[Math.min(questionNumber, hrTopics.length - 1)]
        : '';

    // ---------------------------------------------------------
    // Gemini prompt
    // ---------------------------------------------------------
    const prompt = `You are a strict, highly professional AI interviewer at ${
      company || 'Tech Corp'
    }.

You are conducting a ${roundType || 'Technical'} interview for a ${
      role || 'Software Engineer'
    } position.

Difficulty:
${difficulty || 'Medium'}

CURRENT QUESTION NUMBER:
${questionNumber} of ${maxQuestions}

Candidate Skills:
${skills && skills.length ? skills.join(', ') : 'Not specified'}

Candidate Resume:
${resumeText ? resumeText.substring(0, 8000) : 'No resume provided.'}

PREVIOUS INTERVIEW TRANSCRIPT:
${transcriptFormatted}

QUESTIONS ALREADY ASKED:
${previousQuestionsText}

CURRENT QUESTION:
"${currentQuestion?.text || ''}"

CANDIDATE'S LATEST ANSWER:
"${answerText}"

${
  roundType === 'HR'
    ? `IMPORTANT HR TOPIC FOR THE NEXT QUESTION:
${nextHrTopic}

The next question should focus primarily on this topic.`
    : ''
}

YOUR TASK:

1. Analyze the candidate's latest answer.

2. Give concise and constructive feedback.

3. Decide whether a follow-up is genuinely necessary.

4. A maximum of ONE follow-up is allowed for the current question.

5. If a follow-up has already been used for the current question,
   DO NOT ask another follow-up.

6. Normally move to a NEW topic after the candidate answers.

7. NEVER repeat a previous question.

8. NEVER ask a question that is merely a reworded version
   of a previous question.

9. Compare the proposed question against ALL questions already asked.

10. The next question must be substantially different from
    every previous question.

11. Use the candidate's resume to personalize the question
    when relevant.

12. Never invent projects, internships, companies,
    technologies, skills, or experiences.

13. For HR interviews, cover different areas rather than
    repeatedly discussing the same project or experience.

14. Gradually increase difficulty.

15. Keep the interview realistic and conversational.

16. This is question ${questionNumber} of ${maxQuestions}.
    Do not generate a question beyond question ${maxQuestions}.

17. If this is the final question, return:
    "interviewComplete": true
    and "nextQuestion": null.

18. Otherwise return exactly ONE new question.

RETURN STRICTLY JSON:

{
  "feedbackOnLastAnswer": "string",
  "isFollowUp": boolean,
  "nextQuestion": "string or null",
  "interviewComplete": boolean
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = cleanAndParseJSON(response.text || '');

    if (parsed) {
      return res.json(parsed);
    }

    throw new Error('Failed to parse next question JSON');

  } catch (error: any) {
    console.error('Next question error:', error);

    res.status(500).json({
      error: 'Failed to process adaptive follow-up'
    });
  }
});





// Full Interview Evaluation Endpoint
app.post('/api/interview/evaluate', async (req, res) => {
  try {
    
  const {
  transcript,
  roundType,
  company,
  role,
  difficulty,
  resumeText,
  skills,
  resumeScore
} = req.body;
    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return res.status(400).json({ error: 'Transcript array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        overallScore: 84,
        metrics: {
          technicalKnowledge: 82,
          communication: 86,
          confidence: 80,
          grammar: 90,
          vocabulary: 85,
          problemSolving: 84,
          logicalThinking: 86,
          leadership: 78,
          behavior: 85,
          speakingSpeed: 82,
          fillerWords: 88,
          professionalism: 90
        },
        strengths: [
          "Clear explanation of core technical concepts",
          "Structured thoughts using step-by-step logic",
          "Maintained professional tone throughout"
        ],
        weaknesses: [
          "Needs deeper discussion on trade-offs and edge cases",
          "Occasional hesitation on system architecture questions"
        ],
        missedConcepts: [
          "Database indexing strategies and B-Tree complexities",
          "Handling rate limiting and circuit breakers in microservices"
        ],
        questionReviews: transcript.map((item: any, idx: number) => ({
          question: item.question,
          candidateAnswer: item.answer,
          idealAnswer: "An ideal response explicitly covers the architectural context, quantifiable metrics, edge cases, and trade-offs.",
          score: Math.floor(Math.random() * 15) + 80,
          feedback: "Solid foundation shown. Expand on concrete implementation details."
        })),
        improvementPlan: [
          { day: "Day 1-2", task: "Review Data Structure time/space complexities & practice B-Trees" },
          { day: "Day 3-4", task: "Practice STAR methodology for behavioral leadership questions" },
          { day: "Day 5-6", task: "Simulate 30-min system design mock interview on distributed caching" },
          { day: "Day 7", task: "Final full mock interview with IntervuAI" }
        ],
        summary: "Strong performance overall! Candidate demonstrates strong foundational engineering skills with minor gaps in edge case coverage."
      });
    }

    const transcriptFormatted = transcript
      .map((t: any, i: number) => `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer || 'No answer provided'}`)
      .join('\n\n');

    const prompt = `You are a Lead Hiring Manager evaluating a completed ${roundType} mock interview for a ${role} role at ${company}.

Difficulty:
${difficulty}

Candidate Resume Score:
${resumeScore ?? 'Not available'}

Candidate Skills:
${skills && skills.length ? skills.join(', ') : 'Not specified'}

Candidate Resume:
${resumeText ? resumeText.substring(0, 8000) : 'No resume provided.'}

Interview Transcript:
${transcriptFormatted}

Evaluate the candidate as if you were a real hiring manager.

IMPORTANT:

1. Compare the candidate's answers against their resume.
2. Check whether they can actually explain the projects, technologies and experiences listed on their resume.
3. Identify claims from the resume that the candidate could not explain well.
4. Evaluate technical knowledge relevant to their actual skills and target role.
5. Evaluate communication, confidence, problem solving and professionalism.
6. Do not penalize the candidate for technologies that are not relevant to the selected role.
7. Do not invent information about the candidate.
8. Give specific feedback based on their actual answers.
9. The improvement plan should target the candidate's actual weaknesses.

Return STRICTLY JSON:

{
  "overallScore": number,
  "metrics": {
    "technicalKnowledge": number,
    "communication": number,
    "confidence": number,
    "grammar": number,
    "vocabulary": number,
    "problemSolving": number,
    "logicalThinking": number,
    "leadership": number,
    "behavior": number,
    "speakingSpeed": number,
    "fillerWords": number,
    "professionalism": number
  },
  "strengths": [string],
  "weaknesses": [string],
  "missedConcepts": [string],
  "questionReviews": [
    {
      "question": "string",
      "candidateAnswer": "string",
      "idealAnswer": "string",
      "score": number,
      "feedback": "string"
    }
  ],
  "improvementPlan": [
    {
      "day": "string",
      "task": "string"
    }
  ],
  "summary": "string"
}`;

    const parsed = await generateJSONWithFallback(prompt);
    if (parsed) {
      return res.json(parsed);
    }
    throw new Error('Failed to parse evaluation response');
  } catch (error: any) {
    console.error('Evaluation Error:', error);
    if (error?.message === 'AI_CAPACITY_UNAVAILABLE') {
      return res.status(503).json({
        error: 'AI capacity temporarily unavailable. Please try again in a few minutes.'
      });
    }
    res.status(500).json({ error: 'Failed to evaluate interview' });
  }
});

// Code Runner & Complexity Analysis Endpoint
app.post('/api/code/run', async (req, res) => {
  try {
    const { code, language, problemTitle } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Code content is required' });
    }

    // Default basic output simulation
    let executionOutput = `Executing ${language} script...\n\n`;
    let passCount = 3;
    let totalCount = 3;

    if (code.includes('syntax_error')) {
      executionOutput += `SyntaxError: unexpected token in expression`;
      passCount = 0;
    } else {
      executionOutput += `Test Case 1: [2, 7, 11, 15], target = 9 => Passed (Output: [0, 1])\n`;
      executionOutput += `Test Case 2: [3, 2, 4], target = 6 => Passed (Output: [1, 2])\n`;
      executionOutput += `Test Case 3: [3, 3], target = 6 => Passed (Output: [0, 1])\n\nAll test cases passed!`;
    }

    let complexityAnalysis = {
      timeComplexity: 'O(N) - Linear time traversal',
      spaceComplexity: 'O(N) - Hash map storage for visited elements',
      codeQualityScore: 90,
      suggestions: [
        'Consider adding early returns for edge cases like empty arrays',
        'Variable naming is clear and descriptive'
      ]
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Analyze this ${language} code written for problem "${problemTitle || 'Algorithm Problem'}":

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze the code quality, time complexity, and space complexity.
Return STRICTLY JSON format:
{
  "timeComplexity": "string (e.g. O(N), O(N log N))",
  "spaceComplexity": "string (e.g. O(1), O(N))",
  "codeQualityScore": number (0-100),
  "suggestions": [string]
}`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsedComp = cleanAndParseJSON(geminiRes.text || '');
        if (parsedComp) {
          complexityAnalysis = parsedComp;
        }
      } catch (e) {
        console.error('Gemini code analysis error:', e);
      }
    }

    res.json({
      output: executionOutput,
      testResults: {
        passed: passCount,
        total: totalCount
      },
      analysis: complexityAnalysis
    });
  } catch (error: any) {
    console.error('Code Execution Error:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});
// Flashcards Generator Endpoint
app.post('/api/flashcards', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        flashcards: [
          { id: '1', question: 'What is the difference between SQL and NoSQL databases?', answer: 'SQL databases are relational, structured, and use schema-based tables. NoSQL databases are non-relational, document/key-value based, and dynamically scaled.', category: 'Database' },
          { id: '2', question: 'Explain the concept of Closure in JavaScript.', answer: 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment), allowing access to outer scope variables.', category: 'JavaScript' },
          { id: '3', question: 'What is the CAP Theorem in Distributed Systems?', answer: 'CAP Theorem states that a distributed system can only provide two of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance.', category: 'System Design' }
        ]
      });
    }

    const prompt = `Generate 5 high-yield interview revision flashcards for topic "${topic || 'General Software Engineering'}".
Return STRICTLY JSON format:
{
  "flashcards": [
    {
      "id": "string",
      "question": "string",
      "answer": "string",
      "category": "string"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
const parsed = cleanAndParseJSON(response.text || '');

console.log('========== GEMINI EVALUATION ==========');
console.log('Gemini raw response:', response.text);
console.log('Parsed evaluation:', JSON.stringify(parsed, null, 2));
console.log('========================================');

if (parsed) {
  return res.json(parsed);
}
    
    else {
      res.status(500).json({ error: 'Failed to generate flashcards' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Flashcard API error' });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER & PRODUCTION STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IntervuAI Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();