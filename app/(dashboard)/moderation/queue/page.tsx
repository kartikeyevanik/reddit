import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import  Content  from "@/lib/models/Content";
import ModerationQueueTable from "@/components/moderation/ModerationQueueTable";

type ContentType = {
  _id: string;
  description: string;
  url?: string;
  image: string;
  user: string | null;
  status: string;
  createdAt: string;
};

export default async function ModerationQueuePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUBMITTER") {
    return redirect("/"); // Only submitters allowed
  }

  await connectToDatabase();
  const pendingContents = (await Content.find({ status: "pending" }).lean()) as any[];

  const sanitizedContents: ContentType[] = pendingContents.map((content) => ({
    _id: content._id.toString(),
    description: content.description,
    url: content.url,
    image: content.image,
    user: content.user ? content.user.toString() : null,
    status: content.status,
    createdAt: content.createdAt.toISOString(),
  }));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Moderation Queue</h1>
      <ModerationQueueTable pendingContents={sanitizedContents} />
    </div>
  );
}
