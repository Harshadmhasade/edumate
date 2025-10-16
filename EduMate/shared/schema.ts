import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  college: text("college"),
  semester: integer("semester"),
  course: text("course"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  topic: text("topic"),
  duration: integer("duration"), // in minutes
  plannedDuration: integer("planned_duration"),
  status: text("status").notNull(), // 'active', 'completed', 'paused'
  sessionType: text("session_type").notNull(), // 'pomodoro', 'custom'
  cycleCount: integer("cycle_count").default(0),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  status: text("status").notNull().default('pending'), // 'pending', 'completed'
  dueDate: timestamp("due_date"),
  estimatedDuration: integer("estimated_duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const doubts = pgTable("doubts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  tags: text("tags").array(),
  status: text("status").notNull().default('open'), // 'open', 'solved', 'in_progress'
  upvotes: integer("upvotes").default(0),
  isAnonymous: boolean("is_anonymous").default(false),
  hasAiAnswer: boolean("has_ai_answer").default(false),
  aiAnswer: text("ai_answer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doubtAnswers = pgTable("doubt_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doubtId: varchar("doubt_id").notNull().references(() => doubts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  isAccepted: boolean("is_accepted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  college: text("college"),
  semester: integer("semester"),
  course: text("course"),
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
  downloads: integer("downloads").default(0),
  rating: real("rating").default(0),
  type: text("type").notNull(), // 'notes', 'book', 'previous_paper'
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookRequests = pgTable("book_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  noteId: varchar("note_id").notNull().references(() => notes.id),
  status: text("status").notNull().default('pending'), // 'pending', 'approved', 'rejected', 'completed'
  message: text("message"),
  pickupLocation: text("pickup_location"),
  returnDate: timestamp("return_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const careerAssessments = pgTable("career_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  personalityType: text("personality_type"),
  strengths: jsonb("strengths"), // array of strength scores
  interests: jsonb("interests"), // array of interest scores
  values: jsonb("values"), // array of value scores
  recommendations: jsonb("recommendations"), // array of career recommendations
  completionPercentage: integer("completion_percentage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalStudyTime: integer("total_study_time").default(0), // in minutes
  tasksCompleted: integer("tasks_completed").default(0),
  doubtsSolved: integer("doubts_solved").default(0),
  pointsEarned: integer("points_earned").default(0),
  currentStreak: integer("current_streak").default(0),
  productivityScore: integer("productivity_score").default(0),
  lastActiveDate: timestamp("last_active_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  studySessions: many(studySessions),
  tasks: many(tasks),
  doubts: many(doubts),
  doubtAnswers: many(doubtAnswers),
  notes: many(notes),
  sentBookRequests: many(bookRequests, { relationName: "requester" }),
  receivedBookRequests: many(bookRequests, { relationName: "owner" }),
  careerAssessment: one(careerAssessments),
  stats: one(userStats),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const doubtsRelations = relations(doubts, ({ one, many }) => ({
  user: one(users, {
    fields: [doubts.userId],
    references: [users.id],
  }),
  answers: many(doubtAnswers),
}));

export const doubtAnswersRelations = relations(doubtAnswers, ({ one }) => ({
  doubt: one(doubts, {
    fields: [doubtAnswers.doubtId],
    references: [doubts.id],
  }),
  user: one(users, {
    fields: [doubtAnswers.userId],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  bookRequests: many(bookRequests),
}));

export const bookRequestsRelations = relations(bookRequests, ({ one }) => ({
  requester: one(users, {
    fields: [bookRequests.requesterId],
    references: [users.id],
    relationName: "requester",
  }),
  owner: one(users, {
    fields: [bookRequests.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  note: one(notes, {
    fields: [bookRequests.noteId],
    references: [notes.id],
  }),
}));

export const careerAssessmentsRelations = relations(careerAssessments, ({ one }) => ({
  user: one(users, {
    fields: [careerAssessments.userId],
    references: [users.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertDoubtSchema = createInsertSchema(doubts).omit({
  id: true,
  createdAt: true,
  upvotes: true,
  hasAiAnswer: true,
  aiAnswer: true,
});

export const insertDoubtAnswerSchema = createInsertSchema(doubtAnswers).omit({
  id: true,
  createdAt: true,
  upvotes: true,
  isAccepted: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  downloads: true,
  rating: true,
});

export const insertBookRequestSchema = createInsertSchema(bookRequests).omit({
  id: true,
  createdAt: true,
});

export const insertCareerAssessmentSchema = createInsertSchema(careerAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type StudySession = typeof studySessions.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Doubt = typeof doubts.$inferSelect;
export type DoubtAnswer = typeof doubtAnswers.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type BookRequest = typeof bookRequests.$inferSelect;
export type CareerAssessment = typeof careerAssessments.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;

export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertDoubt = z.infer<typeof insertDoubtSchema>;
export type InsertDoubtAnswer = z.infer<typeof insertDoubtAnswerSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertBookRequest = z.infer<typeof insertBookRequestSchema>;
export type InsertCareerAssessment = z.infer<typeof insertCareerAssessmentSchema>;
