"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  page: number;
  totalPages: number;
  basePath?: string;
};

export default function Pagination({ page, totalPages, basePath = "" }: Props) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page, pathname]);

  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    const showLeft = currentPage > 3;
    const showRight = currentPage < totalPages - 2;

    pages.push(1);
    if (showLeft) pages.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }
    if (showRight) pages.push("...");
    pages.push(totalPages);
  }

  const getHref = (p: number) => `${basePath}/${p}`;

  return (
    <nav className="flex justify-center mt-8 gap-2 select-none">
      {currentPage > 1 ? (
        <Link href={getHref(currentPage - 1)} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
          Prev
        </Link>
      ) : (
        <span className="px-3 py-1 border rounded-md text-sm text-gray-400 cursor-not-allowed">Prev</span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <Link
            key={`page-${p}`}
            href={getHref(p)}
            className={`px-3 py-1 border rounded-md text-sm ${
              p === currentPage ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={getHref(currentPage + 1)} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">
          Next
        </Link>
      ) : (
        <span className="px-3 py-1 border rounded-md text-sm text-gray-400 cursor-not-allowed">Next</span>
      )}
    </nav>
  );
}
