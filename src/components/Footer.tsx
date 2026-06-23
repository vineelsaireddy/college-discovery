import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                            CollegeDiscover
                        </div>
                        <p className="text-sm text-gray-500">
                            Helping students find the right college through detailed information,
                            reviews, and comparison tools.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3 text-sm">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                                    Browse Colleges
                                </Link>
                            </li>
                            <li>
                                <Link href="/compare" className="text-sm text-gray-500 hover:text-gray-700">
                                    Compare Colleges
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3 text-sm">Account</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-sm text-gray-500 hover:text-gray-700">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/saved" className="text-sm text-gray-500 hover:text-gray-700">
                                    Saved Colleges
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} CollegeDiscover. Built as a Full Stack Engineering project.
                    </p>
                </div>
            </div>
        </footer>
    );
}
