import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Page</h1>

      <Link href="/moderation/queue">
        <Button>Go to Moderation Queue</Button>
      </Link>
    </div>
  );
}
