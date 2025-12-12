// posts/[id]/page
import Breadcrumbs from "@/components/Breadcrumbs";
import { prisma } from "@/lib/db";
import Link from "next/link";

type Props = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: { id: true, title: true, content: true, createdAt: true, sourceUrl: true },
  });

  if (!post)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Post not found</p>
      </main>
    );

  return (
    <main className="flex justify-center py-8 px-4 bg-gray-50">
      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow">
        <Breadcrumbs />
        <p className="text-gray-400 mb-6 text-xs">
          {new Date(post.createdAt).toTimeString()}
        </p>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-700 max-w-xxl whitespace-pre-line" dangerouslySetInnerHTML={{__html: post.content}}></div>
        <p className="text-gray-400 mb-6 text-xs">
          <Link target="_blank" className="text-blue-400 mb-4 bg-gray-100 hover:bg-gray-200" key={post.id} href={post.sourceUrl || ""}>{post.sourceUrl}</Link>
        </p>
      </div>
    </main>
  );
}
