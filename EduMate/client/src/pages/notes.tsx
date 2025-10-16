import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, Book, FileText, Download, Star, MapPin, Clock } from "lucide-react";

const mockNotes = [
  {
    id: "1",
    title: "Data Structures & Algorithms - Complete Notes",
    description: "Comprehensive notes covering arrays, linked lists, trees, graphs, and sorting algorithms with examples.",
    subject: "Computer Science",
    semester: 4,
    type: "notes",
    downloads: 234,
    rating: 4.8,
    author: {
      name: "Rajesh Kumar",
      college: "BITS Pilani",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32"
    }
  },
  {
    id: "2",
    title: "Introduction to Algorithms - Cormen",
    description: "Available for borrowing. Physical book in excellent condition. Perfect for competitive programming prep.",
    subject: "Computer Science", 
    type: "book",
    status: "available",
    distance: "2 km away",
    duration: "14 days",
    author: {
      name: "Rohan Singh",
      college: "IIT Delhi",
      avatar: "https://pixabay.com/get/g54bafdb2c3c9a3ff22af497fa9ea4e03e619b51c1584e82bd0cbff77d2980494fc59aa56492695542a33e0a31473f6c86d0ac3f55d004bc06627583dff2617a8_1280.jpg"
    }
  },
  {
    id: "3",
    title: "Calculus Mid-Sem Papers (2020-2023)",
    description: "Collection of previous year question papers with solutions. Great for exam preparation.",
    subject: "Mathematics",
    semester: 2,
    type: "previous_paper",
    downloads: 89,
    rating: 4.5,
    author: {
      name: "Arun Mehta",
      college: "IIIT Hyderabad", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32"
    }
  }
];

const getTypeConfig = (type: string) => {
  switch (type) {
    case "notes":
      return { icon: FileText, color: "bg-primary/10 text-primary", label: "Notes" };
    case "book":
      return { icon: Book, color: "bg-secondary/10 text-secondary", label: "Book" };
    case "previous_paper":
      return { icon: FileText, color: "bg-accent/10 text-accent", label: "Previous Year" };
    default:
      return { icon: FileText, color: "bg-slate-100 text-slate-600", label: "Document" };
  }
};

export default function Notes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Filter notes based on search and selection criteria
  const filteredNotes = mockNotes.filter((note) => {
    const matchesSearch = searchTerm === "" || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCollege = selectedCollege === "all" || 
      note.author.college.toLowerCase().includes(selectedCollege.replace("-", " "));
    
    const matchesSubject = selectedSubject === "all" || 
      note.subject.toLowerCase() === selectedSubject.replace("-", " ");
    
    const matchesType = selectedType === "all" || note.type === selectedType;
    
    return matchesSearch && matchesCollege && matchesSubject && matchesType;
  });

  return (
    <div className="space-y-8 slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-8 glass-card bounce-in">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
              Notes & Books Sharing 📝
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">Share and access study materials from your community</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="secondary" size="sm" className="w-full sm:w-auto hover-lift transition-all duration-300" data-testid="button-request-book">
              <Book className="w-4 h-4 mr-2" />
              Request Book
            </Button>
            <Button size="sm" className="w-full sm:w-auto gradient-bg hover:opacity-90 transition-all duration-300 hover-lift" data-testid="button-upload-notes">
              <Upload className="w-4 h-4 mr-2" />
              Upload Notes
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-0 hover-lift">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search notes, books, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-notes"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-college">
                  <SelectValue placeholder="All Colleges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  <SelectItem value="bits-pilani">BITS Pilani</SelectItem>
                  <SelectItem value="iit-delhi">IIT Delhi</SelectItem>
                  <SelectItem value="iiit-hyderabad">IIIT Hyderabad</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-subject">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32" data-testid="select-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="book">Books</SelectItem>
                  <SelectItem value="previous_paper">Previous Papers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 text-lg">No notes found matching your criteria.</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
          const typeConfig = getTypeConfig(note.type);
          const TypeIcon = typeConfig.icon;
          
          return (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 ${typeConfig.color} rounded-lg`}>
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <Badge className={typeConfig.color}>
                      {typeConfig.label}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" data-testid={`button-bookmark-${note.id}`}>
                    <i className="fas fa-bookmark text-slate-400"></i>
                  </Button>
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-2">{note.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{note.description}</p>
                
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={note.author.avatar} 
                    alt="Contributor" 
                    className="w-6 h-6 rounded-full"
                    data-testid={`img-author-${note.id}`}
                  />
                  <span className="text-sm text-slate-600">
                    {note.author.name} • {note.author.college}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    {note.subject}
                  </Badge>
                  {note.semester && (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                      Semester {note.semester}
                    </Badge>
                  )}
                  {note.status && (
                    <Badge 
                      variant="secondary" 
                      className={note.status === "available" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
                    >
                      {note.status}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="flex items-center space-x-3">
                    {note.type === "book" ? (
                      <>
                        <span className="text-sm text-slate-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {note.distance}
                        </span>
                        <span className="text-sm text-slate-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {note.duration}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-slate-600 flex items-center">
                          <Download className="w-3 h-3 mr-1" />
                          {note.downloads}
                        </span>
                        <span className="text-sm text-slate-600 flex items-center">
                          <Star className="w-3 h-3 mr-1 text-accent" />
                          {note.rating}
                        </span>
                      </>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant={note.type === "book" ? "secondary" : "default"}
                    data-testid={`button-${note.type === "book" ? "request" : "download"}-${note.id}`}
                  >
                    {note.type === "book" ? "Request" : "Download"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }))}
      </div>
    </div>
  );
}
