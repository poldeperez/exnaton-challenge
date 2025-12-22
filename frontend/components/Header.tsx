"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="bg-white border-b border-gray-200 pl-15 pr-6 lg:px-6 py-4">
      <div className="flex items-center justify-between mx-auto">
        
        <Link href="/" className="relative h-8 w-30">
          <Image
            src="/company.svg"
            alt="exnaton"
            fill
            priority
            className="object-contain cursor-pointer"
          />
        </Link>
      
        <div className="flex items-center relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="focus:outline-none hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Open menu"
          >
            <Image
              src="/logo.png"
              alt="exnaton"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer "
            />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-10 right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <ul className="py-2">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                    Profile
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                    Settings
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}