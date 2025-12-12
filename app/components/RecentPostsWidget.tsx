// app/components/RecentPostsWidget.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function RecentPostsWidget() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, createdAt: true },
  });

  return (
    <div className={"mx-auto flex flex-col gap-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800"}>
      <h2 className="font-bold text-lg mb-3 text-gray-950 dark:text-white">Recent Posts</h2>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
            <div className="text-gray-400 text-xs">
              {post.createdAt.toISOString().slice(0, 16).replace("T", " ")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
