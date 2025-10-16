import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Lock, User, Mail, Building2, BookOpen, Hash } from "lucide-react";

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export default function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    college: "",
    semester: "",
    course: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.name) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields (username, email, password, name)",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        college: formData.college || undefined,
        semester: formData.semester ? parseInt(formData.semester) : undefined,
        course: formData.course || undefined,
      });
      toast({
        title: "Welcome to EduMate!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-2xl relative z-10 glass-card border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-600 to-green-500 rounded-2xl flex items-center justify-center hover-lift">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
            Join EduMate
          </CardTitle>
          <p className="text-slate-600 mt-2">Create your account and start your learning journey</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-medium">
                  Username <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    data-testid="input-username"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    data-testid="input-email"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    data-testid="input-name"
                  />
                </div>
              </div>

              {/* College */}
              <div className="space-y-2">
                <Label htmlFor="college" className="text-slate-700 font-medium">
                  College/University
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="college"
                    name="college"
                    type="text"
                    placeholder="Your college name"
                    value={formData.college}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    data-testid="input-college"
                  />
                </div>
              </div>

              {/* Course */}
              <div className="space-y-2">
                <Label htmlFor="course" className="text-slate-700 font-medium">
                  Course
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="course"
                    name="course"
                    type="text"
                    placeholder="e.g., B.Tech CSE"
                    value={formData.course}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    data-testid="input-course"
                  />
                </div>
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-slate-700 font-medium">
                  Semester
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="semester"
                    name="semester"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="Current semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    data-testid="input-semester"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    data-testid="input-password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-bg hover:opacity-90 transition-all duration-300 hover-lift text-white font-semibold py-6 mt-6"
              disabled={isLoading}
              data-testid="button-signup"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                  data-testid="link-login"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
