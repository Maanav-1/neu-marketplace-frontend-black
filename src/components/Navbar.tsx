import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, MessageSquare, PlusCircle, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
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

              {/* Messages */}
              <Link
                to="/inbox"
                className="p-2 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="p-2 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>

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

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline text-xs font-semibold">Logout</span>
              </Button>
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