import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          
          {/* Main Credits */}
          <div className="flex items-center gap-2 text-zinc-400 font-medium tracking-tight">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
            <span>in Boston</span>
          </div>

          {/* Legal & Copyright */}
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em]">
              © 2026 Maanav Chellani. All rights reserved.
            </p>
            <p className="max-w-md mx-auto text-[10px] text-zinc-500 leading-relaxed italic">
              Disclaimer: This platform is a independent student-led marketplace. 
              This site is not affiliated with, endorsed by, or sponsored by Northeastern University.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}