import { 
  users, studySessions, tasks, doubts, doubtAnswers, notes, bookRequests, 
  careerAssessments, userStats,
  type User, type InsertUser, type StudySession, type InsertStudySession,
  type Task, type InsertTask, type Doubt, type InsertDoubt,
  type DoubtAnswer, type InsertDoubtAnswer, type Note, type InsertNote,
  type BookRequest, type InsertBookRequest, type CareerAssessment, 
  type InsertCareerAssessment, type UserStats
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Study session methods
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getStudySessionsByUser(userId: string): Promise<StudySession[]>;
  updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession | undefined>;
  getActiveStudySession(userId: string): Promise<StudySession | undefined>;
  
  // Task methods
  createTask(task: InsertTask): Promise<Task>;
  getTasksByUser(userId: string): Promise<Task[]>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<void>;
  
  // Doubt methods
  createDoubt(doubt: InsertDoubt): Promise<Doubt>;
  getDoubts(filters?: { subject?: string; status?: string; search?: string }): Promise<Doubt[]>;
  getDoubtById(id: string): Promise<Doubt | undefined>;
  updateDoubt(id: string, updates: Partial<Doubt>): Promise<Doubt | undefined>;
  upvoteDoubt(id: string): Promise<void>;
  
  // Doubt answer methods
  createDoubtAnswer(answer: InsertDoubtAnswer): Promise<DoubtAnswer>;
  getDoubtAnswers(doubtId: string): Promise<DoubtAnswer[]>;
  upvoteDoubtAnswer(id: string): Promise<void>;
  acceptDoubtAnswer(id: string): Promise<void>;
  
  // Notes methods
  createNote(note: InsertNote): Promise<Note>;
  getNotes(filters?: { subject?: string; college?: string; type?: string; search?: string }): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | undefined>;
  incrementDownloads(id: string): Promise<void>;
  
  // Book request methods
  createBookRequest(request: InsertBookRequest): Promise<BookRequest>;
  getBookRequestsByUser(userId: string): Promise<BookRequest[]>;
  updateBookRequest(id: string, updates: Partial<BookRequest>): Promise<BookRequest | undefined>;
  
  // Career assessment methods
  getCareerAssessment(userId: string): Promise<CareerAssessment | undefined>;
  createOrUpdateCareerAssessment(assessment: InsertCareerAssessment & { userId: string }): Promise<CareerAssessment>;
  
  // User stats methods
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  async getStudySessionsByUser(userId: string): Promise<StudySession[]> {
    return await db.select().from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(desc(studySessions.createdAt));
  }

  async updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession | undefined> {
    const [session] = await db.update(studySessions)
      .set(updates)
      .where(eq(studySessions.id, id))
      .returning();
    return session || undefined;
  }

  async getActiveStudySession(userId: string): Promise<StudySession | undefined> {
    const [session] = await db.select().from(studySessions)
      .where(and(
        eq(studySessions.userId, userId),
        eq(studySessions.status, 'active')
      ));
    return session || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db.update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async createDoubt(doubt: InsertDoubt): Promise<Doubt> {
    const [newDoubt] = await db.insert(doubts).values(doubt).returning();
    return newDoubt;
  }

  async getDoubts(filters?: { subject?: string; status?: string; search?: string }): Promise<Doubt[]> {
    let query = db.select().from(doubts);
    
    if (filters) {
      const conditions = [];
      if (filters.subject) {
        conditions.push(eq(doubts.subject, filters.subject));
      }
      if (filters.status) {
        conditions.push(eq(doubts.status, filters.status));
      }
      if (filters.search) {
        conditions.push(
          or(
            ilike(doubts.title, `%${filters.search}%`),
            ilike(doubts.description, `%${filters.search}%`)
          )
        );
      }
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query.orderBy(desc(doubts.createdAt));
  }

  async getDoubtById(id: string): Promise<Doubt | undefined> {
    const [doubt] = await db.select().from(doubts).where(eq(doubts.id, id));
    return doubt || undefined;
  }

  async updateDoubt(id: string, updates: Partial<Doubt>): Promise<Doubt | undefined> {
    const [doubt] = await db.update(doubts)
      .set(updates)
      .where(eq(doubts.id, id))
      .returning();
    return doubt || undefined;
  }

  async upvoteDoubt(id: string): Promise<void> {
    await db.update(doubts)
      .set({ upvotes: sql`${doubts.upvotes} + 1` })
      .where(eq(doubts.id, id));
  }

  async createDoubtAnswer(answer: InsertDoubtAnswer): Promise<DoubtAnswer> {
    const [newAnswer] = await db.insert(doubtAnswers).values(answer).returning();
    return newAnswer;
  }

  async getDoubtAnswers(doubtId: string): Promise<DoubtAnswer[]> {
    return await db.select().from(doubtAnswers)
      .where(eq(doubtAnswers.doubtId, doubtId))
      .orderBy(desc(doubtAnswers.upvotes), desc(doubtAnswers.createdAt));
  }

  async upvoteDoubtAnswer(id: string): Promise<void> {
    await db.update(doubtAnswers)
      .set({ upvotes: sql`${doubtAnswers.upvotes} + 1` })
      .where(eq(doubtAnswers.id, id));
  }

  async acceptDoubtAnswer(id: string): Promise<void> {
    await db.update(doubtAnswers)
      .set({ isAccepted: true })
      .where(eq(doubtAnswers.id, id));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async getNotes(filters?: { subject?: string; college?: string; type?: string; search?: string }): Promise<Note[]> {
    let query = db.select().from(notes);
    
    if (filters) {
      const conditions = [];
      if (filters.subject) {
        conditions.push(eq(notes.subject, filters.subject));
      }
      if (filters.college) {
        conditions.push(eq(notes.college, filters.college));
      }
      if (filters.type) {
        conditions.push(eq(notes.type, filters.type));
      }
      if (filters.search) {
        conditions.push(
          or(
            ilike(notes.title, `%${filters.search}%`),
            ilike(notes.description, `%${filters.search}%`)
          )
        );
      }
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query.orderBy(desc(notes.createdAt));
  }

  async getNoteById(id: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note || undefined;
  }

  async incrementDownloads(id: string): Promise<void> {
    await db.update(notes)
      .set({ downloads: sql`${notes.downloads} + 1` })
      .where(eq(notes.id, id));
  }

  async createBookRequest(request: InsertBookRequest): Promise<BookRequest> {
    const [newRequest] = await db.insert(bookRequests).values(request).returning();
    return newRequest;
  }

  async getBookRequestsByUser(userId: string): Promise<BookRequest[]> {
    return await db.select().from(bookRequests)
      .where(or(
        eq(bookRequests.requesterId, userId),
        eq(bookRequests.ownerId, userId)
      ))
      .orderBy(desc(bookRequests.createdAt));
  }

  async updateBookRequest(id: string, updates: Partial<BookRequest>): Promise<BookRequest | undefined> {
    const [request] = await db.update(bookRequests)
      .set(updates)
      .where(eq(bookRequests.id, id))
      .returning();
    return request || undefined;
  }

  async getCareerAssessment(userId: string): Promise<CareerAssessment | undefined> {
    const [assessment] = await db.select().from(careerAssessments)
      .where(eq(careerAssessments.userId, userId));
    return assessment || undefined;
  }

  async createOrUpdateCareerAssessment(assessment: InsertCareerAssessment & { userId: string }): Promise<CareerAssessment> {
    const existing = await this.getCareerAssessment(assessment.userId);
    
    if (existing) {
      const [updated] = await db.update(careerAssessments)
        .set({ ...assessment, updatedAt: new Date() })
        .where(eq(careerAssessments.userId, assessment.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(careerAssessments).values(assessment).returning();
      return created;
    }
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats)
      .where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    const existing = await this.getUserStats(userId);
    
    if (existing) {
      const [updated] = await db.update(userStats)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userStats.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(userStats)
        .values({ userId, ...updates } as any)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
