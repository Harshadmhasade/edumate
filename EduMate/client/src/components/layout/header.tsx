import { Bell, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40";

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden p-2"
              onClick={onMenuClick}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <i className="fas fa-graduation-cap text-primary text-2xl"></i>
              <span className="text-xl font-semibold text-slate-900">EduMate</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative p-2" data-testid="button-notifications">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 focus:outline-none hover:opacity-80 transition-opacity" data-testid="button-user-menu">
                  <img 
                    src={user?.avatar || defaultAvatar} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full"
                    data-testid="img-avatar"
                  />
                  <div className="text-sm hidden sm:block text-left">
                    <p className="font-medium text-slate-900" data-testid="text-username">{user?.name || "User"}</p>
                    <p className="text-slate-500 text-xs" data-testid="text-college">{user?.college || "Student"}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600" 
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
