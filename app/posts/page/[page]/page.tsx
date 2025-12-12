// app/posts/page/[page]/page.tsx
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/db";

const PAGE_SIZE = 10;

type Props = {
  params: { page: string } | Promise<{ page: string }>;
};

export default async function PostsPage({ params: _params }: Props) {
  const params = await _params;
  const pageNumber = Math.max(1, Number(params.page ?? "1"));
  const skip = (pageNumber - 1) * PAGE_SIZE;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
      select: { id: true, title: true, content: true, createdAt: true },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
      <div className="w-full max-w-3xl space-y-6">
        <Breadcrumbs />
        {posts.map((post) => (
            <PostCard key={post.id} {...post} />
        ))}
        <Pagination page={pageNumber} totalPages={totalPages} basePath="/posts/page" />
      </div>
    </main>
  );
}
