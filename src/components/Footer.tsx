import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 py-6 mt-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span>Made with</span>
                        <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
                        <span>in Boston</span>
                    </div>
                    <p className="text-xs text-gray-500">
                        © 2026 Maanav Chellani
                    </p>
                    <p className="text-xs text-gray-400">
                        Not affiliated with Northeastern University
                    </p>
                </div>
            </div>
        </footer>
    );
}
