import Link from 'next/link';
import { Landmark } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-wide font-headline">
            SplitEasy
          </span>
        </Link>
      </div>
    </header>
  );
}
