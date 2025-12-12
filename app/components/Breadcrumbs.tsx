"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = [
    { label: "Home", href: "/" },
    ...parts.map((p, i) => {
      const href = "/" + parts.slice(0, i + 1).join("/");
      return {
        label: p.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        href: i === parts.length - 1 ? null : href,
      };
    }),
  ];

  return (
    <nav className="flex gap-2 text-sm mb-6">
      {crumbs.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.href ? (
            <Link className="text-blue-600 hover:underline" href={item.href}>
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-semibold">{item.label}</span>
          )}

          {i < crumbs.length - 1 && <span>/</span>}
        </span>
      ))}
    </nav>
  );
}
