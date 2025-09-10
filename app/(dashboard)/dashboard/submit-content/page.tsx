import ContentForm from "@/components/ContentForm";

export default function DashboardPage() {
    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-6">Content Submission</h1>
            <ContentForm />
        </main>
    );
}
