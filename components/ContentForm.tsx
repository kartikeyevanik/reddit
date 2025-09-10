"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    description: z.string().min(1, "Required"),
    url: z.string().url().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContentForm() {
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { description: "", url: "" },
    });

    async function onSubmit(data: FormData) {
        setIsSubmitting(true);
        

        try {
            const formData = new FormData();
            formData.append("description", data.description);
            if (data.url) formData.append("url", data.url);
            if (file) formData.append("file", file, file.name);

            const res = await fetch("/api/content/submit", { method: "POST", body: formData });

            if (!res.ok) {
                console.error(`HTTP error! status: ${res.status}`);
                return;
            }

            const result = await res.json();

            if (result.success) {
                console.log("Content submitted successfully!", result.data);
                form.reset();
                setFile(null);
            } else {
                console.error(`Submission failed: ${result.error || "Unknown error"}`);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`Submission failed: ${message}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <FormProvider {...form}>
            <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField<FormData>
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Enter description" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField<FormData>
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                                <Input {...field} type="url" placeholder="https://example.com" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel htmlFor="file">Image/File</FormLabel>
                    <FormControl>
                        <Input
                            id="file"
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </Form>
        </FormProvider>
    );
}
