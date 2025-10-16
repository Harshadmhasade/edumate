import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, ThumbsUp, MessageCircle, Share2, Bookmark, Bot } from "lucide-react";

const mockDoubts = [
  {
    id: "1",
    title: "How to implement a Binary Search Tree in Python?",
    description: "I'm having trouble understanding the insertion and deletion methods in BST. Can someone explain with code examples?",
    subject: "Computer Science",
    tags: ["data-structures", "python", "algorithms"],
    status: "solved",
    upvotes: 24,
    answers: 7,
    timeAgo: "2 hours ago",
    isAnonymous: true,
    hasAiAnswer: true,
    user: {
      name: "Anonymous Student",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40"
    }
  },
  {
    id: "2", 
    title: "Integration by parts - when to use which method?",
    description: "I'm confused about when to use integration by parts vs substitution method. Are there specific patterns to look for?",
    subject: "Mathematics",
    tags: ["calculus", "integration"],
    status: "in_progress",
    upvotes: 12,
    answers: 3,
    timeAgo: "5 hours ago",
    isAnonymous: true,
    hasAiAnswer: false,
    user: {
      name: "Anonymous Student", 
      avatar: "https://pixabay.com/get/g54bafdb2c3c9a3ff22af497fa9ea4e03e619b51c1584e82bd0cbff77d2980494fc59aa56492695542a33e0a31473f6c86d0ac3f55d004bc06627583dff2617a8_1280.jpg"
    }
  }
];

export default function Doubts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [likedDoubts, setLikedDoubts] = useState<Set<string>>(new Set());
  const [savedDoubts, setSavedDoubts] = useState<Set<string>>(new Set());
  const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);
  const [newDoubt, setNewDoubt] = useState({
    title: "",
    description: "",
    subject: "",
    tags: ""
  });
  const { toast } = useToast();

  // Filter doubts based on search and selection criteria
  const filteredDoubts = mockDoubts.filter((doubt) => {
    const matchesSearch = searchTerm === "" || 
      doubt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doubt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doubt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === "all" || 
      doubt.subject.toLowerCase() === selectedSubject.replace("-", " ");
    
    const matchesStatus = selectedStatus === "all" || doubt.status === selectedStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const handleLikeDoubt = (doubtId: string) => {
    setLikedDoubts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(doubtId)) {
        newLiked.delete(doubtId);
        toast({
          title: "Like removed",
          description: "You've unliked this doubt",
        });
      } else {
        newLiked.add(doubtId);
        toast({
          title: "Doubt liked!",
          description: "You've liked this doubt",
        });
      }
      return newLiked;
    });
  };

  const handleSaveDoubt = (doubtId: string) => {
    setSavedDoubts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(doubtId)) {
        newSaved.delete(doubtId);
        toast({
          title: "Removed from saved",
          description: "Doubt removed from your saved list",
        });
      } else {
        newSaved.add(doubtId);
        toast({
          title: "Doubt saved!",
          description: "Added to your saved doubts",
        });
      }
      return newSaved;
    });
  };

  const handleAskDoubt = () => {
    if (!newDoubt.title || !newDoubt.description || !newDoubt.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Doubt posted!",
      description: "Your doubt has been posted and will be answered soon",
    });
    
    setIsAskDoubtOpen(false);
    setNewDoubt({
      title: "",
      description: "",
      subject: "",
      tags: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved": return "bg-secondary/10 text-secondary";
      case "in_progress": return "bg-accent/10 text-accent";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "solved": return "Solved";
      case "in_progress": return "In Progress";
      default: return "Open";
    }
  };

  return (
    <div className="space-y-8 slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-8 glass-card bounce-in">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
              Digital Doubt Solver ❓
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">Get instant help from AI and peer community</p>
          </div>
          <Dialog open={isAskDoubtOpen} onOpenChange={setIsAskDoubtOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg hover:opacity-90 transition-all duration-300 hover-lift" data-testid="button-ask-doubt">
                <Plus className="w-4 h-4 mr-2" />
                Ask Doubt
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ask a New Doubt</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Brief title for your doubt..."
                  value={newDoubt.title}
                  onChange={(e) => setNewDoubt({...newDoubt, title: e.target.value})}
                  data-testid="input-doubt-title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject *</label>
                <Select value={newDoubt.subject} onValueChange={(value) => setNewDoubt({...newDoubt, subject: value})}>
                  <SelectTrigger data-testid="select-doubt-subject">
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
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Describe your doubt in detail..."
                  value={newDoubt.description}
                  onChange={(e) => setNewDoubt({...newDoubt, description: e.target.value})}
                  className="min-h-[100px]"
                  data-testid="textarea-doubt-description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (optional)</label>
                <Input
                  placeholder="e.g., calculus, integration, algorithms"
                  value={newDoubt.tags}
                  onChange={(e) => setNewDoubt({...newDoubt, tags: e.target.value})}
                  data-testid="input-doubt-tags"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAskDoubtOpen(false)} data-testid="button-cancel-doubt">
                Cancel
              </Button>
              <Button onClick={handleAskDoubt} data-testid="button-submit-doubt">
                Post Doubt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-0 hover-lift">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search doubts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-doubts"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-subject">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32" data-testid="select-status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doubts Feed */}
      <div className="space-y-6">
        {filteredDoubts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No doubts found matching your criteria.</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredDoubts.map((doubt) => (
          <Card key={doubt.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={doubt.user.avatar} 
                    alt="Student avatar" 
                    className="w-10 h-10 rounded-full"
                    data-testid={`img-doubt-avatar-${doubt.id}`}
                  />
                  <div>
                    <p className="font-medium text-slate-900">{doubt.user.name}</p>
                    <p className="text-sm text-slate-500">
                      {doubt.timeAgo} • {doubt.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(doubt.status)}>
                    {getStatusText(doubt.status)}
                  </Badge>
                  <Button variant="ghost" size="sm" data-testid={`button-bookmark-${doubt.id}`}>
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-slate-900 mb-3">{doubt.title}</h3>
              <p className="text-slate-700 mb-4">{doubt.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {doubt.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Interaction Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleLikeDoubt(doubt.id)}
                    className={likedDoubts.has(doubt.id) ? "text-primary bg-primary/10" : ""}
                    data-testid={`button-upvote-${doubt.id}`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">{doubt.upvotes + (likedDoubts.has(doubt.id) ? 1 : 0)}</span>
                  </Button>
                  <Button variant="ghost" size="sm" data-testid={`button-answers-${doubt.id}`}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{doubt.answers} answers</span>
                  </Button>
                  <Button variant="ghost" size="sm" data-testid={`button-share-${doubt.id}`}>
                    <Share2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">Share</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSaveDoubt(doubt.id)}
                    className={savedDoubts.has(doubt.id) ? "text-primary bg-primary/10" : ""}
                    data-testid={`button-save-${doubt.id}`}
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    <span className="text-sm">{savedDoubts.has(doubt.id) ? "Saved" : "Save"}</span>
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  {doubt.hasAiAnswer && (
                    <>
                      <span className="text-xs text-slate-500">AI Answer Available</span>
                      <Bot className="w-4 h-4 text-primary" />
                    </>
                  )}
                  {doubt.status !== "solved" && (
                    <Button size="sm" data-testid={`button-answer-${doubt.id}`}>
                      Answer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )))}
      </div>
    </div>
  );
}
