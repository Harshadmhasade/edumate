import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, FileText, Mic, Search, DollarSign, TrendingUp } from "lucide-react";

const mockCareerProfile = {
  personalityType: "INTJ",
  primaryInterest: "Tech", 
  matchScore: 94,
  completionPercentage: 85
};

const mockStrengths = [
  { name: "Problem Solving", score: 83 },
  { name: "Analytical Thinking", score: 80 },
  { name: "Leadership", score: 75 }
];

const mockInterests = [
  "Software Development",
  "Data Science", 
  "AI/ML",
  "Entrepreneurship"
];

const mockCareerPaths = [
  {
    id: "1",
    title: "Full Stack Developer",
    description: "Build end-to-end web applications using modern frameworks",
    matchPercentage: 92,
    salaryRange: "8-15 LPA",
    growth: "High Growth"
  },
  {
    id: "2",
    title: "Data Scientist", 
    description: "Extract insights from data using ML and statistical methods",
    matchPercentage: 89,
    salaryRange: "12-25 LPA",
    growth: "Very High Growth"
  },
  {
    id: "3",
    title: "Product Manager",
    description: "Lead product strategy and coordinate cross-functional teams",
    matchPercentage: 84,
    salaryRange: "15-30 LPA", 
    growth: "High Growth"
  }
];

const mockNextSteps = [
  {
    step: 1,
    title: "Complete Python Course",
    description: "Build foundation for your chosen path",
    actionText: "Start Now",
    actionType: "primary"
  },
  {
    step: 2,
    title: "Build Portfolio Projects", 
    description: "Showcase your skills to employers",
    actionText: "View Ideas",
    actionType: "secondary"
  },
  {
    step: 3,
    title: "Apply for Internships",
    description: "Gain real-world experience", 
    actionText: "Find Opportunities",
    actionType: "secondary"
  }
];

const mockResources = [
  { icon: FileText, title: "Resume Builder", description: "Create professional resumes", color: "text-primary" },
  { icon: Mic, title: "Mock Interview", description: "Practice with AI interviewer", color: "text-secondary" },
  { icon: Search, title: "Job Finder", description: "Discover opportunities", color: "text-accent" }
];

const mockAssessmentProgress = [
  { name: "Personality Test", status: "complete", color: "text-secondary" },
  { name: "Skills Assessment", status: "complete", color: "text-secondary" },
  { name: "Interest Analysis", status: "in_progress", color: "text-accent" },
  { name: "Values Assessment", status: "pending", color: "text-slate-400" }
];

export default function Career() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career Guidance</h1>
          <p className="text-slate-600 mt-1">Discover your potential and plan your career path</p>
        </div>
        <Button data-testid="button-take-assessment">
          <Play className="w-4 h-4 mr-2" />
          Take Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assessment Results */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Your Career Profile</h2>
                <Badge className="bg-secondary/10 text-secondary">
                  {mockCareerProfile.completionPercentage}% Complete
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary" data-testid="text-personality-type">
                    {mockCareerProfile.personalityType}
                  </div>
                  <div className="text-sm text-slate-600">Personality Type</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold text-secondary" data-testid="text-primary-interest">
                    {mockCareerProfile.primaryInterest}
                  </div>
                  <div className="text-sm text-slate-600">Primary Interest</div>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent" data-testid="text-match-score">
                    {mockCareerProfile.matchScore}%
                  </div>
                  <div className="text-sm text-slate-600">Match Score</div>
                </div>
              </div>

              {/* Strengths & Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Top Strengths</h3>
                  <div className="space-y-3">
                    {mockStrengths.map((strength, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">{strength.name}</span>
                          <span className="text-sm font-medium">{strength.score}%</span>
                        </div>
                        <Progress value={strength.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Interest Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockInterests.map((interest, index) => {
                      const colors = [
                        "bg-primary/10 text-primary",
                        "bg-secondary/10 text-secondary", 
                        "bg-accent/10 text-accent",
                        "bg-purple-100 text-purple-700"
                      ];
                      return (
                        <Badge 
                          key={index} 
                          className={`${colors[index % colors.length]} px-3 py-1 rounded-full text-sm`}
                        >
                          {interest}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Recommendations */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recommended Career Paths</h2>
              <div className="space-y-4">
                {mockCareerPaths.map((path) => {
                  const matchColor = path.matchPercentage >= 90 ? "text-primary" : 
                                   path.matchPercentage >= 85 ? "text-secondary" : "text-accent";
                  
                  return (
                    <div key={path.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{path.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{path.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <span className={`text-lg font-bold ${matchColor}`}>
                            {path.matchPercentage}%
                          </span>
                          <div className="text-xs text-slate-500">Match</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-slate-600 flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {path.salaryRange}
                          </span>
                          <span className="text-sm text-slate-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {path.growth}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-roadmap-${path.id}`}
                        >
                          View Roadmap
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items and Resources */}
        <div className="space-y-6">
          {/* Next Steps */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Next Steps</h2>
              <div className="space-y-3">
                {mockNextSteps.map((step) => {
                  const stepColors = ["bg-primary", "bg-secondary", "bg-accent"];
                  const stepColor = stepColors[step.step - 1];
                  
                  return (
                    <div key={step.step} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className={`w-6 h-6 ${stepColor} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{step.title}</p>
                        <p className="text-xs text-slate-600">{step.description}</p>
                        <div className="mt-2">
                          <Button 
                            size="sm"
                            variant={step.actionType === "primary" ? "default" : "secondary"}
                            data-testid={`button-step-${step.step}`}
                          >
                            {step.actionText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Resources</h2>
              <div className="space-y-3">
                {mockResources.map((resource, index) => {
                  const ResourceIcon = resource.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start p-3 bg-slate-50 hover:bg-slate-100"
                      data-testid={`button-resource-${index}`}
                    >
                      <ResourceIcon className={`w-4 h-4 mr-3 ${resource.color}`} />
                      <div className="text-left">
                        <p className="font-medium text-slate-900">{resource.title}</p>
                        <p className="text-xs text-slate-600">{resource.description}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Progress */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Assessment Progress</h2>
              <div className="space-y-3">
                {mockAssessmentProgress.map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{assessment.name}</span>
                    <span className={`text-sm font-medium ${assessment.color}`}>
                      {assessment.status === "complete" ? "Complete" :
                       assessment.status === "in_progress" ? "In Progress" : "Pending"}
                    </span>
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
