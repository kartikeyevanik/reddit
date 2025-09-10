"use client";

import React from "react";
import { Controller, Control, FieldValues, ControllerRenderProps, FieldError, useFormContext } from "react-hook-form";

export function Form({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
    return <form {...props}>{children}</form>;
}

interface FormFieldProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    name: keyof TFieldValues;
    render: (props: {
        field: ControllerRenderProps<TFieldValues, any>;
        fieldState: { error?: FieldError };
    }) => React.ReactElement<any, any>;
}

export function FormField<TFieldValues extends FieldValues>({
    control,
    name,
    render,
}: FormFieldProps<TFieldValues>) {
    return <Controller control={control} name={name as any} render={render} />;
}

export function FormItem({ children }: { children: React.ReactNode }) {
    return <div className="mb-4">{children}</div>;
}

export function FormLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
            {children}
        </label>
    );
}

export function FormControl({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
}

export function FormMessage() {
    const methods = useFormContext();

    if (!methods) return null;

    const { formState } = methods;

    return Object.keys(formState.errors).length > 0 ? (
        <p className="text-red-500 text-sm mt-1">
            {Object.values(formState.errors).map((err: any) => err.message).join(", ")}
        </p>
    ) : null;
}
