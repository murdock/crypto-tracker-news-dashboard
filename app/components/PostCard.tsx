// PostCard.tsx
"use client";
import Link from "next/link";
import HtmlRenderer from "./HTMLRenderer";

type Props = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
};

export default function PostCard({ id, title, content, createdAt }: Props) {
  return (
    <Link href={`/posts/${id}`}>
      <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition cursor-pointer">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <HtmlRenderer html={content} maxLength={150} skipLinks />
        <span className="text-gray-500 text-xs">{createdAt.toTimeString()}</span>
      </div>
    </Link>
  );
}
