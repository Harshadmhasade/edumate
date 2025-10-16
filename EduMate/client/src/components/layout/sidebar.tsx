import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, Clock, HelpCircle, BookOpen, Compass, 
  Trophy, Medal, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, section: "main" },
  { name: "FocusGuard", href: "/focus-guard", icon: Clock, section: "main" },
  { name: "Doubt Solver", href: "/doubts", icon: HelpCircle, section: "main" },
  { name: "Notes & Books", href: "/notes", icon: BookOpen, section: "main" },
  { name: "Career Guide", href: "/career", icon: Compass, section: "main" },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy, section: "community" },
  { name: "Achievements", href: "/achievements", icon: Medal, section: "community" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();

  const mainItems = navigation.filter(item => item.section === "main");
  const communityItems = navigation.filter(item => item.section === "community");

  return (
    <aside 
      className="w-64 bg-white shadow-sm border-r border-slate-200 fixed left-0 top-0 h-full overflow-y-auto z-40"
      data-testid="sidebar"
    >
      <div className="p-6 pt-6">
        {/* Mobile close button */}
        {onClose && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <i className="fas fa-graduation-cap text-primary text-2xl"></i>
              <span className="text-xl font-semibold text-slate-900">EduMate</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2"
              data-testid="button-close-sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {/* Desktop spacing */}
        {!onClose && <div className="pt-14" />}
        <nav className="space-y-2">
          <div className="pb-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Main Modules
            </h3>
          </div>
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors",
                  isActive && "bg-primary/10 text-primary border-r-2 border-primary"
                )}
                data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          <div className="pt-6 pb-4 border-t border-slate-200 mt-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Community
            </h3>
          </div>
          {communityItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors",
                  isActive && "bg-primary/10 text-primary border-r-2 border-primary"
                )}
                data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
