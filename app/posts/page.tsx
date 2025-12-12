// app/posts/page.tsx
import { redirect } from "next/navigation";

export default function RedirectToFirstPage() {
  redirect("/posts/page/1");
}
