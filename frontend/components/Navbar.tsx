"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Brain } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const toggleServices = useCallback(() => {
    setIsServicesOpen(!isServicesOpen);
  }, [isServicesOpen]);

  return (
    <nav className="bg-white shadow-md border rounded-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold text-gray-800">
                SoulCare
              </span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <Link
                href="/home"
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <div className="relative">
                <button
                  onClick={toggleServices}
                  className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isServicesOpen && (
                  <div className="absolute right-0 z-10 mt-3 w-screen max-w-xs sm:max-w-md">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                        <Link
                          href="/cbt"
                          className="flex items-start rounded-lg hover:bg-gray-50 -m-3 p-3"
                        >
                          <div>
                            <p className="text-base font-medium text-gray-900">
                              CBT
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Improve your mental health with Cognitive
                              Behavioral
                            </p>
                          </div>
                        </Link>
                        <Link
                          href="/rag"
                          className="flex items-start rounded-lg hover:bg-gray-50 -m-3 p-3"
                        >
                          <div>
                            <p className="text-base font-medium text-gray-900">
                              RAG
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Get personalized recommendations for your mental
                              health based on your medical history.
                            </p>
                          </div>
                        </Link>
                        <Link
                          href="/information"
                          className="flex items-start rounded-lg hover:bg-gray-50 -m-3 p-3"
                        >
                          <div>
                            <p className="text-base font-medium text-gray-900">
                              Information
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Get information on mental health and how to
                              improve it.
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/contact"
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Link
                  href="/about"
                  className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
              </SignedOut>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              About
            </Link>
            <button
              onClick={toggleServices}
              className="w-full text-left flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Services
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
            {isServicesOpen && (
              <div className="pl-4 space-y-1">
                <Link
                  href="/services/web-development"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  CBT
                </Link>
                <Link
                  href="/services/mobile-apps"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  RAG
                </Link>
                <Link
                  href="/services/consulting"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Information
                </Link>
              </div>
            )}
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
