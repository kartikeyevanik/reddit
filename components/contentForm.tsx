
// Client component for the form with useFormState
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitContent } from '@/lib/actions/content-actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Plus, X } from 'lucide-react';

export default function FormComponent() {
    const router = useRouter();
    const [state, formAction] = useActionState(submitContent, null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [selectedType, setSelectedType] = useState('TEXT');

    const addTag = () => {
        if (tagInput.trim() && tags.length < 10) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    // Redirect on success
    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                router.push('/dashboard/submissions');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [state?.success, router]);

    // Get field-specific errors
    const getFieldError = (fieldName: string) => {
        if (!state?.details) return null;
        const error = state.details.find((error: any) => error.path === fieldName);
        return error?.message;
    };

    return (
        <form action={formAction} className="space-y-6">
            {/* Hidden input for tags */}
            <input type="hidden" name="tags" value={JSON.stringify(tags)} />

            {state?.error && !state.details && (
                <div className="p-3 text-sm text-destructive bg-destructive/15 rounded-md">
                    {state.error}
                </div>
            )}

            {state?.details && (
                <div className="p-3 text-sm text-destructive bg-destructive/15 rounded-md">
                    <p className="font-medium mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside space-y-1">
                        {state.details.map((error: any, index: number) => (
                            <li key={index}>{error.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            {state?.success && (
                <div className="p-3 text-sm text-green-600 bg-green-100 rounded-md">
                    {state.success}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter content title"
                    required
                    maxLength={200}
                    className={getFieldError('title') ? 'border-destructive' : ''}
                />
                {getFieldError('title') && (
                    <p className="text-sm text-destructive">{getFieldError('title')}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter content description"
                    rows={3}
                    maxLength={1000}
                    className={getFieldError('description') ? 'border-destructive' : ''}
                />
                {getFieldError('description') && (
                    <p className="text-sm text-destructive">{getFieldError('description')}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Content Type *</Label>
                <Select
                    name="type"
                    defaultValue="TEXT"
                    onValueChange={setSelectedType}
                >
                    <SelectTrigger className={getFieldError('type') ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="IMAGE">Image</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="URL">URL</SelectItem>
                    </SelectContent>
                </Select>
                {getFieldError('type') && (
                    <p className="text-sm text-destructive">{getFieldError('type')}</p>
                )}
            </div>

            {selectedType === 'TEXT' && (
                <div className="space-y-2">
                    <Label htmlFor="textContent">Text Content *</Label>
                    <Textarea
                        id="textContent"
                        name="textContent"
                        placeholder="Enter your text content"
                        rows={6}
                        required
                        maxLength={10000}
                        className={getFieldError('textContent') ? 'border-destructive' : ''}
                    />
                    {getFieldError('textContent') && (
                        <p className="text-sm text-destructive">{getFieldError('textContent')}</p>
                    )}
                </div>
            )}

            {selectedType === 'IMAGE' && (
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL *</Label>
                    <Input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        required
                        className={getFieldError('imageUrl') ? 'border-destructive' : ''}
                    />
                    {getFieldError('imageUrl') && (
                        <p className="text-sm text-destructive">{getFieldError('imageUrl')}</p>
                    )}
                </div>
            )}

            {selectedType === 'VIDEO' && (
                <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL *</Label>
                    <Input
                        id="videoUrl"
                        name="videoUrl"
                        type="url"
                        placeholder="https://example.com/video.mp4"
                        required
                        className={getFieldError('videoUrl') ? 'border-destructive' : ''}
                    />
                    {getFieldError('videoUrl') && (
                        <p className="text-sm text-destructive">{getFieldError('videoUrl')}</p>
                    )}
                </div>
            )}

            {selectedType === 'URL' && (
                <div className="space-y-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://example.com"
                        required
                        className={getFieldError('url') ? 'border-destructive' : ''}
                    />
                    {getFieldError('url') && (
                        <p className="text-sm text-destructive">{getFieldError('url')}</p>
                    )}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="tags-input">Tags</Label>
                <div className="flex gap-2">
                    <Input
                        id="tags-input"
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        maxLength={50}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                    />
                    <Button type="button" onClick={addTag} disabled={tags.length >= 10}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Press Enter or click the + button to add tags (max 10 tags)
                </p>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                            >
                                <span>{tag}</span>
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full">
                Submit Content
            </Button>
        </form>
    );
}