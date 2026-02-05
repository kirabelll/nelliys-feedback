"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/app/mode-toggle";

export default function Header() {
  const links = [{ to: "/", label: "Nelliys Coffee" }] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="hidden">
              View Registrations Admin
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
