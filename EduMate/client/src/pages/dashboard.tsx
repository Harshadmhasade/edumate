import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, HelpCircle, Star } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/lib/auth";

// Mock data for demonstration
const mockTasks = [
  {
    id: "1",
    title: "Review Linear Algebra concepts",
    subject: "Mathematics",
    priority: "high",
    status: "pending",
    dueDate: "6:00 PM"
  },
  {
    id: "2", 
    title: "Submit Database assignment",
    subject: "Computer Science",
    priority: "medium",
    status: "completed",
    dueDate: "Completed"
  },
  {
    id: "3",
    title: "Read Chapter 5: Operating Systems", 
    subject: "Computer Science",
    priority: "medium",
    status: "pending",
    dueDate: "Tomorrow"
  }
];

const mockStats = {
  studyTime: "4h 32m",
  tasksCompleted: "12/18",
  doubtsSolved: "8",
  pointsEarned: "1,247"
};

const mockActiveSession = {
  subject: "Data Structures & Algorithms",
  topic: "Binary Trees - Session 2 of 4",
  timeRemaining: "23:47",
  progress: 67
};

const mockRecentActivity = [
  {
    id: "1",
    text: "You solved a doubt about \"Binary Search Trees\"",
    time: "2 hours ago",
    type: "doubt"
  },
  {
    id: "2", 
    text: "Completed 45min study session on Calculus",
    time: "5 hours ago", 
    type: "study"
  },
  {
    id: "3",
    text: "Downloaded \"Physics Notes - Chapter 3\" from Rajesh Kumar", 
    time: "1 day ago",
    type: "download"
  }
];

export default function Dashboard() {
  const user = useUser();
  const firstName = user?.name.split(' ')[0] || 'there';

  return (
    <div className="space-y-8 slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-8 glass-card bounce-in">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
              Welcome back, {firstName}! 🌟
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">Let's make today productive and achieve your goals.</p>
          </div>
          <div className="flex space-x-3">
            <Button size="sm" className="w-full sm:w-auto gradient-bg hover:opacity-90 transition-all duration-300 hover-lift" data-testid="button-quick-action">
              <i className="fas fa-plus mr-2"></i>
              Quick Action
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-up">
        <StatsCard
          title="Study Time Today"
          value={mockStats.studyTime}
          icon={Clock}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatsCard
          title="Tasks Completed"
          value={mockStats.tasksCompleted}
          icon={CheckCircle}
          iconColor="text-secondary"
          iconBg="bg-secondary/10"
        />
        <StatsCard
          title="Doubts Solved"
          value={mockStats.doubtsSolved}
          icon={HelpCircle}
          iconColor="text-accent"
          iconBg="bg-accent/10"
        />
        <StatsCard
          title="Points Earned"
          value={mockStats.pointsEarned}
          icon={Star}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Study Session and Tasks */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass-card border-0 hover-lift overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Active Study Session</h2>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  In Progress
                </Badge>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-xl p-6 mb-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-slate-900">{mockActiveSession.subject}</h3>
                    <p className="text-sm text-slate-600">{mockActiveSession.topic}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary" data-testid="text-session-time">
                      {mockActiveSession.timeRemaining}
                    </div>
                    <div className="text-sm text-slate-600">remaining</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${mockActiveSession.progress}%` }}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="secondary" className="flex-1" data-testid="button-pause-session">
                    <i className="fas fa-pause mr-2"></i>
                    Pause
                  </Button>
                  <Button variant="outline" data-testid="button-end-session">
                    <i className="fas fa-stop mr-2"></i>
                    End Session
                  </Button>
                </div>
              </div>

              {/* Today's Tasks */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Today's Priority Tasks</h3>
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg">
                      <Checkbox 
                        checked={task.status === "completed"}
                        className="w-4 h-4"
                        data-testid={`checkbox-task-${task.id}`}
                      />
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium text-slate-900 ${task.status === "completed" ? "line-through opacity-60" : ""}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {task.subject} • {task.status === "completed" ? "Completed" : `Due: ${task.dueDate}`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={task.status === "completed" ? "secondary" : task.priority === "high" ? "destructive" : "default"}
                          className={
                            task.status === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : task.priority === "high" 
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {task.status === "completed" ? "Done" : task.priority}
                        </Badge>
                        {task.status !== "completed" && (
                          <Button variant="ghost" size="sm" data-testid={`button-task-menu-${task.id}`}>
                            <i className="fas fa-ellipsis-v"></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access and Recent Activity */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Access</h2>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 bg-slate-50 hover:bg-slate-100"
                  data-testid="button-start-study-session"
                >
                  <i className="fas fa-plus-circle text-primary mr-3"></i>
                  <span className="font-medium">Start Study Session</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 bg-slate-50 hover:bg-slate-100"
                  data-testid="button-ask-doubt"
                >
                  <i className="fas fa-question-circle text-accent mr-3"></i>
                  <span className="font-medium">Ask a Doubt</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 bg-slate-50 hover:bg-slate-100"
                  data-testid="button-upload-notes"
                >
                  <i className="fas fa-upload text-secondary mr-3"></i>
                  <span className="font-medium">Upload Notes</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "doubt" ? "bg-secondary" :
                      activity.type === "study" ? "bg-accent" :
                      "bg-primary"
                    }`} />
                    <div>
                      <p className="text-sm text-slate-900">{activity.text}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
