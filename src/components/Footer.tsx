import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/50 py-6 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-2 text-center">

          {/* Made with Love */}
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <span>Made with</span>
            <Heart size={14} className="text-rose-500 fill-rose-500" />
            <span>in Boston</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © 2026 Maanav Chellani
          </p>

          {/* Disclaimer - smallest & lightest */}
          <p className="text-xs text-slate-400">
            An independent student-led marketplace — not affiliated with or endorsed by Northeastern University.
          </p>

        </div>
      </div>
    </footer>
  );
}