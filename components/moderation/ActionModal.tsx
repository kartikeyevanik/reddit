"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";

interface ActionModalProps {
  contentId: string;
}

export default function ActionModal({ contentId }: ActionModalProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: "approve" | "reject" | "escalate") => {
    setLoading(true);

    await fetch("/api/moderation/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, action }),
    });

    setLoading(false);
    router.refresh(); // Reload updated queue from DB
  };

  return (
    <Modal
      trigger={<Button variant="outline">Actions</Button>}
      title="Moderation Action"
    >
      <div className="space-y-4">
        <Button onClick={() => handleAction("approve")} disabled={loading}>Approve</Button>
        <Button onClick={() => handleAction("reject")} disabled={loading}>Reject</Button>
        <Button onClick={() => handleAction("escalate")} disabled={loading}>Escalate</Button>
      </div>
    </Modal>
  );
}
