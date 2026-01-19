import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, MessageSquare, PlusCircle, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="border-b border-zinc-900 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50">
      {/* The 'container' class centers the content. 
        'px-4' and 'md:px-8' provide the left and right margins you're looking for.
      */}
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-black tracking-tighter hover:text-blue-500 transition-colors">
          neu<span className="text-blue-500">-</span>Marketplace
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-zinc-400">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                  </Button>
                </Link>
              )}
              <Link to="/inbox" className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
                <MessageSquare className="h-5 w-5 text-zinc-400" />
              </Link>
              <Link to="/profile" className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
                <User className="h-5 w-5 text-zinc-400" />
              </Link>
              <Link to="/create">
                <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 font-bold hidden sm:flex">
                  <PlusCircle className="mr-2 h-4 w-4" /> List Item
                </Button>
                {/* Mobile version of the button */}
                <Button size="icon" className="rounded-full bg-blue-600 sm:hidden">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 text-[10px] uppercase font-black tracking-widest"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-bold">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 font-bold">Join</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}