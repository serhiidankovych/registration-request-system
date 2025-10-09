import Link from "next/link";
import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} registration-request-system.
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Created by Serhiii Dankovych</span>
            <span className="hidden sm:inline">|</span>
            <Link
              href="https://github.com/serhiidankovych/registration-request-system"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub Repository
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
