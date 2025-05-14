"use client";
import { HeartPulse } from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary group-data-[collapsible=icon]:justify-center">
      <HeartPulse className="h-7 w-7 text-primary transition-transform duration-300 ease-in-out group-hover:scale-110" />
      <span className="group-data-[collapsible=icon]:hidden">MediChat</span>
    </Link>
  );
};

export default Logo;
