import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, Clock, HelpCircle, BookOpen, Compass
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Focus", href: "/focus-guard", icon: Clock },
  { name: "Doubts", href: "/doubts", icon: HelpCircle },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Career", href: "/career", icon: Compass },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex flex-col items-center px-3 py-2 text-xs transition-colors min-w-0",
                isActive 
                  ? "text-primary" 
                  : "text-slate-600 hover:text-slate-900"
              )}
              data-testid={`mobile-link-${item.name.toLowerCase()}`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}