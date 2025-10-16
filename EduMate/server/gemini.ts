import { GoogleGenAI } from "@google/genai";
import type { Task, StudySession } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDoubtAnswer(title: string, description: string, subject: string): Promise<string> {
  try {
    const prompt = `You are an expert tutor in ${subject}. A student has asked the following question:

Title: ${title}
Description: ${description}

Please provide a comprehensive, educational answer that:
1. Explains the concept clearly
2. Provides step-by-step solutions if applicable
3. Includes examples or analogies to aid understanding
4. Suggests related topics for further study

Keep the answer educational and encouraging.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I apologize, but I couldn't generate an answer at this time. Please try asking your question again or seek help from the community.";
  } catch (error) {
    console.error("Error generating doubt answer:", error);
    throw new Error("Failed to generate AI answer. Please try again later.");
  }
}

export async function generateStudyRecommendations(tasks: Task[], sessions: StudySession[]): Promise<{
  recommendations: string[];
  prioritySuggestions: string[];
  scheduleOptimization: string[];
}> {
  try {
    const tasksSummary = tasks.map(task => ({
      title: task.title,
      subject: task.subject,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    }));

    const sessionsSummary = sessions.slice(0, 10).map(session => ({
      subject: session.subject,
      duration: session.duration,
      status: session.status,
      sessionType: session.sessionType
    }));

    const systemPrompt = `You are an AI study coach that analyzes student data and provides personalized recommendations for better academic performance. 
Analyze the data and provide a JSON response with recommendations, priority suggestions, and schedule optimization tips.
Respond with JSON in this format: 
{'recommendations': ['rec1', 'rec2'], 'prioritySuggestions': ['p1', 'p2'], 'scheduleOptimization': ['o1', 'o2']}`;

    const prompt = `Based on the following student data, provide personalized study recommendations:

Current Tasks:
${JSON.stringify(tasksSummary, null, 2)}

Recent Study Sessions:
${JSON.stringify(sessionsSummary, null, 2)}

Focus on:
1. Time management and productivity
2. Subject balance and priority
3. Study session optimization
4. Deadline management`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            recommendations: { type: "array", items: { type: "string" } },
            prioritySuggestions: { type: "array", items: { type: "string" } },
            scheduleOptimization: { type: "array", items: { type: "string" } },
          },
          required: ["recommendations", "prioritySuggestions", "scheduleOptimization"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    const result = rawJson ? JSON.parse(rawJson) : {};
    
    return {
      recommendations: result.recommendations || ["Focus on completing high-priority tasks first", "Take regular breaks between study sessions", "Review completed topics weekly"],
      prioritySuggestions: result.prioritySuggestions || ["Complete overdue assignments", "Prepare for upcoming deadlines"],
      scheduleOptimization: result.scheduleOptimization || ["Use Pomodoro technique for better focus", "Study difficult subjects when most alert"]
    };
  } catch (error) {
    console.error("Error generating study recommendations:", error);
    return {
      recommendations: ["Focus on completing high-priority tasks first", "Take regular breaks between study sessions", "Review completed topics weekly"],
      prioritySuggestions: ["Complete overdue assignments", "Prepare for upcoming deadlines"],
      scheduleOptimization: ["Use Pomodoro technique for better focus", "Study difficult subjects when most alert"]
    };
  }
}

export async function analyzeCareerProfile(assessmentData: any): Promise<{
  personalityType: string;
  recommendations: Array<{
    title: string;
    match: number;
    description: string;
    skills: string[];
    growth: string;
    salary: string;
  }>;
}> {
  try {
    const systemPrompt = `You are an expert career counselor that analyzes personality assessments and provides personalized career recommendations. 
Analyze the assessment data and provide career recommendations.
Respond with JSON in this format: 
{'personalityType': 'XXXX', 'recommendations': [{'title': 'Career Title', 'match': 85, 'description': 'Brief description', 'skills': ['skill1', 'skill2'], 'growth': 'High Growth', 'salary': 'X-Y LPA'}]}`;

    const prompt = `Analyze the following career assessment data and provide career recommendations:

Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Base recommendations on:
1. Personality traits and strengths
2. Interest areas and preferences
3. Current skill level and potential
4. Market demand and growth prospects
5. Salary expectations and career progression

Provide 3-5 career recommendations with match percentages between 70-95%.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            personalityType: { type: "string" },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  match: { type: "number" },
                  description: { type: "string" },
                  skills: { type: "array", items: { type: "string" } },
                  growth: { type: "string" },
                  salary: { type: "string" },
                },
                required: ["title", "match", "description", "skills", "growth", "salary"],
              },
            },
          },
          required: ["personalityType", "recommendations"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    const result = rawJson ? JSON.parse(rawJson) : {};
    
    return {
      personalityType: result.personalityType || "INTJ",
      recommendations: result.recommendations || [
        {
          title: "Software Developer",
          match: 85,
          description: "Build applications and software solutions",
          skills: ["Programming", "Problem Solving", "Logic"],
          growth: "High Growth",
          salary: "6-12 LPA"
        },
        {
          title: "Data Analyst",
          match: 80,
          description: "Analyze data to derive business insights",
          skills: ["Analytics", "Statistics", "Communication"],
          growth: "Very High Growth", 
          salary: "5-10 LPA"
        }
      ]
    };
  } catch (error) {
    console.error("Error analyzing career profile:", error);
    return {
      personalityType: "INTJ",
      recommendations: [
        {
          title: "Software Developer",
          match: 85,
          description: "Build applications and software solutions",
          skills: ["Programming", "Problem Solving", "Logic"],
          growth: "High Growth",
          salary: "6-12 LPA"
        },
        {
          title: "Data Analyst", 
          match: 80,
          description: "Analyze data to derive business insights",
          skills: ["Analytics", "Statistics", "Communication"],
          growth: "Very High Growth",
          salary: "5-10 LPA"
        }
      ]
    };
  }
}

export async function generatePersonalizedSchedule(
  subjects: string[],
  preferences: {
    studyHours: number;
    breakDuration: number;
    difficultSubjectTime: string;
    preferredSessionLength: number;
  },
  upcomingDeadlines: Array<{ subject: string; task: string; dueDate: Date }>
): Promise<{
  schedule: Array<{
    day: string;
    sessions: Array<{
      time: string;
      subject: string;
      topic: string;
      duration: number;
      type: string;
    }>;
  }>;
  tips: string[];
}> {
  try {
    const systemPrompt = `You are an AI study scheduler that creates optimized study schedules based on student preferences and academic requirements. 
Create a personalized weekly study schedule and provide helpful tips.
Respond with JSON in this format: 
{'schedule': [{'day': 'Monday', 'sessions': [{'time': '9:00-10:30', 'subject': 'Math', 'topic': 'Calculus', 'duration': 90, 'type': 'study'}]}], 'tips': ['tip1', 'tip2']}`;

    const prompt = `Create a personalized weekly study schedule based on:

Subjects: ${subjects.join(", ")}
Daily study hours: ${preferences.studyHours}
Preferred session length: ${preferences.preferredSessionLength} minutes
Break duration: ${preferences.breakDuration} minutes
Best time for difficult subjects: ${preferences.difficultSubjectTime}

Upcoming deadlines:
${upcomingDeadlines.map(d => `${d.subject}: ${d.task} (Due: ${d.dueDate.toDateString()})`).join("\n")}

Consider:
1. Spaced repetition for better retention
2. Deadline priorities
3. Subject difficulty and time preferences
4. Balanced workload across the week`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            schedule: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string" },
                  sessions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        time: { type: "string" },
                        subject: { type: "string" },
                        topic: { type: "string" },
                        duration: { type: "number" },
                        type: { type: "string" },
                      },
                      required: ["time", "subject", "topic", "duration", "type"],
                    },
                  },
                },
                required: ["day", "sessions"],
              },
            },
            tips: { type: "array", items: { type: "string" } },
          },
          required: ["schedule", "tips"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    const result = rawJson ? JSON.parse(rawJson) : {};
    
    return {
      schedule: result.schedule || [],
      tips: result.tips || [
        "Review previous day's material for 10 minutes before starting new topics",
        "Take breaks every 45-60 minutes to maintain focus",
        "Use active recall techniques during study sessions"
      ]
    };
  } catch (error) {
    console.error("Error generating personalized schedule:", error);
    return {
      schedule: [],
      tips: [
        "Review previous day's material for 10 minutes before starting new topics",
        "Take breaks every 45-60 minutes to maintain focus", 
        "Use active recall techniques during study sessions"
      ]
    };
  }
}
