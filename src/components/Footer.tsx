export default function Footer() {
    return (
        <footer className="border-t border-gray-200 py-6 mt-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span>Made with ❤️ in Boston</span>
                    </div>
                    <a
                        href="https://www.linkedin.com/in/maanav-chellani/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                    >
                        © 2026 Maanav Chellani
                    </a>
                    <p className="text-xs text-gray-400">
                        Not affiliated with Northeastern University
                    </p>
                </div>
            </div>
        </footer>
    );
}
