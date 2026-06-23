"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCompare } from "./Providers";
import { useState } from "react";
import {
    GraduationCap,
    Heart,
    LogIn,
    LogOut,
    Menu,
    X,
    GitCompareArrows,
    User,
} from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const { compareIds } = useCompare();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-gray-900">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        <span>CollegeDiscover</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Colleges
                        </Link>
                        <Link
                            href="/compare"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                        >
                            <GitCompareArrows className="w-4 h-4" />
                            Compare
                            {compareIds.length > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {compareIds.length}
                                </span>
                            )}
                        </Link>

                        {session ? (
                            <>
                                <Link
                                    href="/saved"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                                >
                                    <Heart className="w-4 h-4" />
                                    Saved
                                </Link>
                                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        {session.user.name}
                                    </span>
                                    <button
                                        onClick={() => signOut()}
                                        className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 space-y-2">
                        <Link
                            href="/"
                            className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Colleges
                        </Link>
                        <Link
                            href="/compare"
                            className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Compare {compareIds.length > 0 && `(${compareIds.length})`}
                        </Link>
                        {session ? (
                            <>
                                <Link
                                    href="/saved"
                                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Saved Colleges
                                </Link>
                                <div className="border-t border-gray-100 pt-2 mt-2">
                                    <p className="px-3 py-1 text-sm text-gray-500">{session.user.name}</p>
                                    <button
                                        onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
