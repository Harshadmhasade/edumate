import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/ui/timer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const mockProductivityData = {
  weeklyScore: 87,
  focusTime: "24h 15m",
  completedTasks: "42/48",
  streakDays: 12
};

const mockSubjectBreakdown = [
  { subject: "Mathematics", time: "8h 30m", color: "bg-primary" },
  { subject: "Computer Science", time: "12h 45m", color: "bg-secondary" },
  { subject: "Physics", time: "6h 20m", color: "bg-accent" }
];

const mockWeekSchedule = [
  { day: "Monday", date: "Dec 18", sessions: [
    { subject: "Math", time: "9-10", color: "bg-primary" },
    { subject: "CS", time: "2-4", color: "bg-secondary" }
  ]},
  { day: "Tuesday", date: "Dec 19", sessions: [
    { subject: "Physics", time: "10-12", color: "bg-primary" },
    { subject: "Chem", time: "3-4", color: "bg-accent" }
  ], isToday: true },
  { day: "Wednesday", date: "Dec 20", sessions: [
    { subject: "CS", time: "9-11", color: "bg-secondary" },
    { subject: "Math", time: "4-5", color: "bg-primary" }
  ]}
];

const mockRecommendations = [
  {
    type: "break",
    title: "Take a break!",
    message: "You've been studying for 3 hours. Consider a 15-minute break.",
    color: "border-primary bg-blue-50"
  },
  {
    type: "progress",
    title: "Great progress on CS!",
    message: "You're ahead of schedule. Maybe focus more on Mathematics tomorrow?",
    color: "border-secondary bg-green-50"
  }
];

export default function FocusGuard() {
  const [currentSession] = useState({
    subject: "Mathematics - Calculus",
    type: "Pomodoro Session 1 of 4",
    duration: 25 * 60, // 25 minutes in seconds
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studyPlan, setStudyPlan] = useState({
    subject: "",
    topic: "",
    duration: "",
    type: "",
    description: ""
  });
  const { toast } = useToast();

  const handleCreateStudyPlan = () => {
    if (!studyPlan.subject || !studyPlan.topic || !studyPlan.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate creating study plan
    toast({
      title: "Study Plan Created!",
      description: `Created ${studyPlan.type} session for ${studyPlan.subject} - ${studyPlan.topic}`,
    });
    
    setIsDialogOpen(false);
    setStudyPlan({
      subject: "",
      topic: "",
      duration: "",
      type: "",
      description: ""
    });
  };

  return (
    <div className="space-y-8 slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-8 glass-card bounce-in">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
              FocusGuard ⏰
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">AI-powered study scheduler and productivity tracker</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg hover:opacity-90 transition-all duration-300 hover-lift" data-testid="button-new-study-plan">
                <Plus className="w-4 h-4 mr-2" />
                New Study Plan
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Study Plan</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject *</label>
                <Select value={studyPlan.subject} onValueChange={(value) => setStudyPlan({...studyPlan, subject: value})}>
                  <SelectTrigger data-testid="select-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic/Chapter *</label>
                <Input
                  placeholder="e.g., Calculus, Data Structures"
                  value={studyPlan.topic}
                  onChange={(e) => setStudyPlan({...studyPlan, topic: e.target.value})}
                  data-testid="input-topic"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Type</label>
                <Select value={studyPlan.type} onValueChange={(value) => setStudyPlan({...studyPlan, type: value})}>
                  <SelectTrigger data-testid="select-session-type">
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pomodoro">Pomodoro (25 min)</SelectItem>
                    <SelectItem value="short">Short Session (15 min)</SelectItem>
                    <SelectItem value="medium">Medium Session (45 min)</SelectItem>
                    <SelectItem value="long">Long Session (90 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration *</label>
                <Select value={studyPlan.duration} onValueChange={(value) => setStudyPlan({...studyPlan, duration: value})}>
                  <SelectTrigger data-testid="select-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="25">25 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  placeholder="Any specific goals or notes for this session..."
                  value={studyPlan.description}
                  onChange={(e) => setStudyPlan({...studyPlan, description: e.target.value})}
                  data-testid="textarea-notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={handleCreateStudyPlan} data-testid="button-create-plan">
                Create Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Study Timer and Schedule */}
        <div className="xl:col-span-2 space-y-6">
          {/* Study Timer */}
          <Card className="glass-card border-0 hover-lift">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 text-center mb-2">
                  {currentSession.subject}
                </h2>
                <p className="text-slate-600 text-center">{currentSession.type}</p>
              </div>
              
              <Timer
                duration={currentSession.duration}
                onComplete={() => console.log("Session completed!")}
                onPause={() => console.log("Session paused")}
                onResume={() => console.log("Session resumed")}
                onStop={() => console.log("Session stopped")}
              />
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">This Week's Schedule</h2>
              <div className="overflow-x-auto">
                <div className="inline-flex space-x-2 pb-2">
                  {mockWeekSchedule.map((day, index) => (
                    <div key={index} className="flex-shrink-0 w-32">
                      <div className={`text-center p-3 rounded-lg ${
                        day.isToday 
                          ? "bg-primary/10 border-2 border-primary" 
                          : "bg-slate-50"
                      }`}>
                        <div className={`text-sm font-medium ${
                          day.isToday ? "text-primary" : "text-slate-600"
                        }`}>
                          {day.day}
                        </div>
                        <div className="text-xs text-slate-500">{day.date}</div>
                        <div className="mt-2 space-y-1">
                          {day.sessions.map((session, sessionIndex) => (
                            <div 
                              key={sessionIndex}
                              className={`text-xs text-white p-1 rounded ${session.color}`}
                            >
                              {session.subject} {session.time}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Productivity Stats and Recommendations */}
        <div className="space-y-6">
          {/* Productivity Score */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Productivity Score</h2>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary" data-testid="text-productivity-score">
                  {mockProductivityData.weeklyScore}%
                </div>
                <p className="text-sm text-slate-600">This week</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Focus Time</span>
                  <span className="text-sm font-medium">{mockProductivityData.focusTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Completed Tasks</span>
                  <span className="text-sm font-medium">{mockProductivityData.completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Streak Days</span>
                  <span className="text-sm font-medium">{mockProductivityData.streakDays} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Breakdown */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Subject Breakdown</h2>
              <div className="space-y-3">
                {mockSubjectBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${item.color} rounded-full`} />
                      <span className="text-sm text-slate-900">{item.subject}</span>
                    </div>
                    <span className="text-sm font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Recommendations</h2>
              <div className="space-y-3">
                {mockRecommendations.map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${rec.color}`}>
                    <p className="text-sm text-slate-900 font-medium">{rec.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{rec.message}</p>
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
