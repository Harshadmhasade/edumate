import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import FocusGuard from "@/pages/focus-guard";
import Doubts from "@/pages/doubts";
import Notes from "@/pages/notes";
import Career from "@/pages/career";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

function AuthFlow() {
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return <SignupPage onSwitchToLogin={() => setShowSignup(false)} />;
  }
  
  return <LoginPage onSwitchToSignup={() => setShowSignup(true)} />;
}

function AuthenticatedApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-4 pb-20 lg:pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/focus-guard" component={FocusGuard} />
              <Route path="/doubts" component={Doubts} />
              <Route path="/notes" component={Notes} />
              <Route path="/career" component={Career} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-slate-200 z-40 backdrop-blur-md">
        <div className="flex items-center justify-around py-3">
          <a href="/" className="flex flex-col items-center px-3 py-2 text-xs text-white bg-gradient-to-r from-purple-600 to-green-500 rounded-lg transition-all duration-300 hover-lift">
            <div className="w-5 h-5 mb-1">📚</div>
            <span className="font-medium">Home</span>
          </a>
          <a href="/focus-guard" className="flex flex-col items-center px-3 py-2 text-xs text-slate-600 hover:text-purple-600 transition-colors duration-300">
            <div className="w-5 h-5 mb-1">⏰</div>
            <span>Focus</span>
          </a>
          <a href="/doubts" className="flex flex-col items-center px-3 py-2 text-xs text-slate-600 hover:text-purple-600 transition-colors duration-300">
            <div className="w-5 h-5 mb-1">❓</div>
            <span>Doubts</span>
          </a>
          <a href="/notes" className="flex flex-col items-center px-3 py-2 text-xs text-slate-600 hover:text-purple-600 transition-colors duration-300">
            <div className="w-5 h-5 mb-1">📝</div>
            <span>Notes</span>
          </a>
          <a href="/career" className="flex flex-col items-center px-3 py-2 text-xs text-slate-600 hover:text-purple-600 transition-colors duration-300">
            <div className="w-5 h-5 mb-1">🎯</div>
            <span>Career</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-green-500 rounded-2xl flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
            Loading EduMate...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedApp /> : <AuthFlow />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
