import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertStudySessionSchema, insertTaskSchema, insertDoubtSchema, insertDoubtAnswerSchema, insertNoteSchema, insertBookRequestSchema } from "@shared/schema";
import { generateDoubtAnswer, generateStudyRecommendations, analyzeCareerProfile } from "./gemini";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({ ...userData, password: hashedPassword });
      
      // Store user in session
      req.session.userId = user.id;
      
      res.json({ user: { id: user.id, username: user.username, email: user.email, name: user.name, college: user.college, avatar: user.avatar } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      // Validate request body
      const loginSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      });
      
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user in session
      req.session.userId = user.id;

      res.json({ user: { id: user.id, username: user.username, email: user.email, name: user.name, college: user.college, avatar: user.avatar } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      // Clear the session cookie
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user: { id: user.id, username: user.username, email: user.email, name: user.name, college: user.college, avatar: user.avatar, semester: user.semester, course: user.course } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:id/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.id);
      if (!stats) {
        // Create default stats if none exist
        const defaultStats = await storage.updateUserStats(req.params.id, {
          totalStudyTime: 0,
          tasksCompleted: 0,
          doubtsSolved: 0,
          pointsEarned: 0,
          currentStreak: 0,
          productivityScore: 0,
        });
        return res.json(defaultStats);
      }
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Study session routes
  app.post("/api/study-sessions", async (req, res) => {
    try {
      const sessionData = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession(sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/study-sessions", async (req, res) => {
    try {
      const sessions = await storage.getStudySessionsByUser(req.params.userId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/study-sessions/active", async (req, res) => {
    try {
      const session = await storage.getActiveStudySession(req.params.userId);
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/study-sessions/:id", async (req, res) => {
    try {
      const session = await storage.updateStudySession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ message: "Study session not found" });
      }
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Task routes
  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasksByUser(req.params.userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.json({ message: "Task deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI recommendations
  app.get("/api/users/:userId/study-recommendations", async (req, res) => {
    try {
      const tasks = await storage.getTasksByUser(req.params.userId);
      const sessions = await storage.getStudySessionsByUser(req.params.userId);
      const recommendations = await generateStudyRecommendations(tasks, sessions);
      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Doubt routes
  app.post("/api/doubts", async (req, res) => {
    try {
      const doubtData = insertDoubtSchema.parse(req.body);
      const doubt = await storage.createDoubt(doubtData);
      
      // Generate AI answer if requested
      if (req.body.generateAiAnswer) {
        try {
          const aiAnswer = await generateDoubtAnswer(doubt.title, doubt.description, doubt.subject);
          await storage.updateDoubt(doubt.id, { 
            aiAnswer: aiAnswer,
            hasAiAnswer: true 
          });
        } catch (aiError) {
          console.error("Failed to generate AI answer:", aiError);
        }
      }
      
      res.json(doubt);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/doubts", async (req, res) => {
    try {
      const { subject, status, search } = req.query;
      const doubts = await storage.getDoubts({
        subject: subject as string,
        status: status as string,
        search: search as string,
      });
      res.json(doubts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/doubts/:id", async (req, res) => {
    try {
      const doubt = await storage.getDoubtById(req.params.id);
      if (!doubt) {
        return res.status(404).json({ message: "Doubt not found" });
      }
      res.json(doubt);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/doubts/:id/upvote", async (req, res) => {
    try {
      await storage.upvoteDoubt(req.params.id);
      res.json({ message: "Doubt upvoted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Doubt answer routes
  app.post("/api/doubts/:doubtId/answers", async (req, res) => {
    try {
      const answerData = insertDoubtAnswerSchema.parse({
        ...req.body,
        doubtId: req.params.doubtId,
      });
      const answer = await storage.createDoubtAnswer(answerData);
      res.json(answer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/doubts/:doubtId/answers", async (req, res) => {
    try {
      const answers = await storage.getDoubtAnswers(req.params.doubtId);
      res.json(answers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/doubt-answers/:id/upvote", async (req, res) => {
    try {
      await storage.upvoteDoubtAnswer(req.params.id);
      res.json({ message: "Answer upvoted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/doubt-answers/:id/accept", async (req, res) => {
    try {
      await storage.acceptDoubtAnswer(req.params.id);
      res.json({ message: "Answer accepted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Notes routes
  app.post("/api/notes", upload.single('file'), async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse({
        ...req.body,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        fileName: req.file?.originalname,
        fileSize: req.file?.size,
        fileType: req.file?.mimetype,
      });
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/notes", async (req, res) => {
    try {
      const { subject, college, type, search } = req.query;
      const notes = await storage.getNotes({
        subject: subject as string,
        college: college as string,
        type: type as string,
        search: search as string,
      });
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/notes/:id", async (req, res) => {
    try {
      const note = await storage.getNoteById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/notes/:id/download", async (req, res) => {
    try {
      await storage.incrementDownloads(req.params.id);
      res.json({ message: "Download counted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  // Book request routes
  app.post("/api/book-requests", async (req, res) => {
    try {
      const requestData = insertBookRequestSchema.parse(req.body);
      const request = await storage.createBookRequest(requestData);
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/book-requests", async (req, res) => {
    try {
      const requests = await storage.getBookRequestsByUser(req.params.userId);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/book-requests/:id", async (req, res) => {
    try {
      const request = await storage.updateBookRequest(req.params.id, req.body);
      if (!request) {
        return res.status(404).json({ message: "Book request not found" });
      }
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Career assessment routes
  app.get("/api/users/:userId/career-assessment", async (req, res) => {
    try {
      const assessment = await storage.getCareerAssessment(req.params.userId);
      res.json(assessment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/career-assessment", async (req, res) => {
    try {
      const assessmentData = {
        ...req.body,
        userId: req.params.userId,
      };
      
      // Analyze with AI if we have enough data
      if (assessmentData.completionPercentage >= 50) {
        try {
          const analysis = await analyzeCareerProfile(assessmentData);
          assessmentData.recommendations = analysis.recommendations;
          assessmentData.personalityType = analysis.personalityType;
        } catch (aiError) {
          console.error("Failed to analyze career profile:", aiError);
        }
      }
      
      const assessment = await storage.createOrUpdateCareerAssessment(assessmentData);
      res.json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
