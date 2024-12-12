"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              News Aggregator
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/feeds"
                className={`${pathname.startsWith('/feeds') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Feeds
              </Link>
              <Link 
                href="/subscription"
                className={`${pathname === '/subscription' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Subscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 