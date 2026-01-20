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
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex h-14 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-black hover:opacity-70 transition-opacity"
        >
          neu<span className="text-gray-500">marketplace</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              {/* Admin Link */}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-black hover:bg-gray-100 h-8 px-3 text-sm font-medium"
                  >
                    <LayoutDashboard className="mr-1.5 h-4 w-4" /> Admin
                  </Button>
                </Link>
              )}

              {/* My Listings - Desktop */}
              <Link to="/my-listings" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-black hover:bg-gray-100 h-8 px-3 text-sm font-medium"
                >
                  <Package className="mr-1.5 h-4 w-4" /> Listings
                </Button>
              </Link>

              {/* Saved - Desktop */}
              <Link to="/saved" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-black hover:bg-gray-100 h-8 px-3 text-sm font-medium"
                >
                  <Heart className="mr-1.5 h-4 w-4" /> Saved
                </Button>
              </Link>

              {/* Chats */}
              <Link to="/inbox">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-black hover:bg-gray-100 h-8 px-3 text-sm font-medium"
                >
                  <MessageSquare className="mr-1.5 h-4 w-4" /> <span className="hidden sm:inline">Messages</span>
                </Button>
              </Link>

              {/* User Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-black hover:bg-gray-100 h-8 px-2"
                  >
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-gray-600" />
                    </div>
                    <ChevronDown className="h-3 w-3 ml-1 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200 shadow-lg">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-black truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  {/* Mobile only links */}
                  <Link to="/my-listings" className="md:hidden">
                    <DropdownMenuItem className="cursor-pointer text-gray-700 focus:bg-gray-100">
                      <Package className="mr-2 h-4 w-4" /> My Listings
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/saved" className="md:hidden">
                    <DropdownMenuItem className="cursor-pointer text-gray-700 focus:bg-gray-100">
                      <Heart className="mr-2 h-4 w-4" /> Saved Items
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="md:hidden bg-gray-100" />

                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer text-gray-700 focus:bg-gray-100">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* List Item Button */}
              <Link to="/create" className="ml-2">
                <Button
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white font-medium h-8 px-3 text-sm hidden sm:flex"
                >
                  <PlusCircle className="mr-1.5 h-4 w-4" /> Sell
                </Button>
                {/* Mobile version */}
                <Button
                  size="icon"
                  className="bg-black hover:bg-gray-800 text-white sm:hidden h-8 w-8"
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
                  className="text-gray-600 hover:text-black hover:bg-gray-100 h-8 px-3 text-sm font-medium"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white font-medium h-8 px-4 text-sm"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}