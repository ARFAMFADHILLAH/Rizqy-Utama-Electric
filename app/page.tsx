import { Suspense } from "react";
import HomeBrowser from "@/components/home/HomeBrowser";
import HomeSkeleton from "@/components/home/HomeSkeleton";

// Data katalog diambil di browser (Client-Side Fetching dari Supabase).
export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeBrowser />
    </Suspense>
  );
}
