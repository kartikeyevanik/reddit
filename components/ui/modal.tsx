"use client";

import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

import { useState } from "react";

interface ModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Modal({ trigger, title, description, children }: ModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>

        <div className="space-y-4">
          {children}
        </div>

        <div className="mt-6 text-right">
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
