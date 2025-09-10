// app/submit/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormComponent from '@/components/contentForm';

export default function SubmitContentPage() {
    return (
        <div className="container max-w-4xl p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Submit Content</h1>
                <p className="text-muted-foreground">Submit new content for moderation</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Content Details</CardTitle>
                    <CardDescription>
                        Fill in the details of the content you want to submit for moderation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FormComponent />
                </CardContent>
            </Card>
        </div>
    );
}
