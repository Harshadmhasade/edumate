# EduMate - Student Productivity Platform

## Overview

EduMate is a comprehensive student productivity platform designed to help students manage their academic life effectively. The application combines study session management, doubt resolution, note sharing, and career guidance into a unified educational experience. Built as a full-stack web application, it features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and OpenAI for AI-powered features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript in a single-page application (SPA) structure. The UI is built with Radix UI components and styled using Tailwind CSS with a custom design system. State management is handled through TanStack Query for server state and React hooks for local state. The application uses Wouter for client-side routing, providing a lightweight alternative to React Router.

**Key Design Decisions:**
- **Component Library:** Radix UI provides accessible, unstyled components that are customized with Tailwind CSS
- **Styling Approach:** Utility-first CSS with Tailwind, using CSS custom properties for theming
- **State Management:** TanStack Query eliminates the need for complex client-side state management by handling server state efficiently
- **Routing:** Wouter offers a minimal routing solution suitable for the application's scale

### Backend Architecture
The server follows a RESTful API design using Express.js with TypeScript. The architecture separates concerns through distinct layers: routing, business logic (storage), and external service integration (OpenAI). File uploads are handled through Multer middleware, and the application uses session-based request logging.

**Core Components:**
- **Express Server:** Handles HTTP requests with middleware for JSON parsing, file uploads, and request logging
- **Storage Layer:** Abstracts database operations through a unified interface
- **Google Gemini Integration:** Provides AI-powered features for doubt resolution, study recommendations, and career guidance
- **Route Handlers:** Organized by feature area (auth, users, tasks, doubts, notes, career)

### Data Storage
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes tables for users, study sessions, tasks, doubts, notes, and career assessments. Database migrations are managed through Drizzle Kit.

**Database Design:**
- **User Management:** Central user table with authentication and profile information
- **Academic Data:** Separate tables for study sessions, tasks, and notes with user relationships
- **Community Features:** Doubts and answers system with voting mechanisms
- **File Storage:** Local file system storage for uploaded documents and notes

### External Dependencies

**Core Framework Dependencies:**
- **Neon Database:** Serverless PostgreSQL database hosting
- **Drizzle ORM:** Type-safe database operations and schema management
- **Google Gemini API:** Powers AI-driven doubt resolution, study recommendations, and career guidance
- **TanStack Query:** Server state management and caching

**UI and Development Tools:**
- **Radix UI:** Accessible component primitives for building the interface
- **Tailwind CSS:** Utility-first CSS framework for styling
- **Vite:** Development server and build tool with HMR support
- **TypeScript:** Type safety across the entire application stack

**File Handling:**
- **Multer:** File upload middleware for handling notes and document uploads
- **Local File System:** Stores uploaded files in the server's uploads directory

**Authentication and Sessions:**
- **connect-pg-simple:** PostgreSQL session store for user authentication
- **Express Sessions:** Server-side session management for user state

The architecture prioritizes developer experience through comprehensive TypeScript support, modern tooling, and clear separation of concerns while maintaining scalability for future feature additions.