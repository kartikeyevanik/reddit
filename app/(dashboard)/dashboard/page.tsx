import ContentForm from "@/components/ContentForm";

export default function DashboardPage() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Content Submission</h1>

      <ContentForm></ContentForm>
    </main>
  );
}
