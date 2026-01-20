import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  User,
  LogOut,
  Package,
  Heart,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors"
        >
          neu<span className="text-indigo-600">-Marketplace</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <>
              {/* Admin Link */}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                  </Button>
                </Link>
              )}

              {/* My Listings - Desktop */}
              <Link to="/my-listings" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-md hover:shadow-indigo-200/50 hover:ring-1 hover:ring-indigo-200 transition-all duration-200"
                >
                  <Package className="mr-2 h-4 w-4" /> My Listings
                </Button>
              </Link>

              {/* Saved - Desktop */}
              <Link to="/saved" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-md hover:shadow-indigo-200/50 hover:ring-1 hover:ring-indigo-200 transition-all duration-200"
                >
                  <Heart className="mr-2 h-4 w-4" /> Saved
                </Button>
              </Link>

              {/* Chats */}
              <Link to="/inbox">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-md hover:shadow-indigo-200/50 hover:ring-1 hover:ring-indigo-200 transition-all duration-200"
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> Chats
                </Button>
              </Link>

              {/* User Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 gap-1"
                  >
                    <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <ChevronDown className="h-3 w-3 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 shadow-lg">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  {/* Mobile only links */}
                  <Link to="/my-listings" className="md:hidden">
                    <DropdownMenuItem className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" /> My Listings
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/saved" className="md:hidden">
                    <DropdownMenuItem className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" /> Saved Items
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="md:hidden" />

                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" /> Account Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* List Item Button */}
              <Link to="/create">
                <Button
                  size="sm"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm hidden sm:flex"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> List Item
                </Button>
                {/* Mobile version */}
                <Button
                  size="icon"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white sm:hidden h-9 w-9"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-semibold"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Join
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}