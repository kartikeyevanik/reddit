"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ActionModal from "@/components/moderation/ActionModal";

interface ModerationQueueTableProps {
  pendingContents: any[];
}

export default function ModerationQueueTable({ pendingContents }: ModerationQueueTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Content ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingContents.map((content: any) => (
          <TableRow key={content._id}>
            <TableCell>{content._id}</TableCell>
            <TableCell>{content.type}</TableCell>
            <TableCell>{content.submitterEmail}</TableCell>
            <TableCell>{content.status}</TableCell>
            <TableCell>{content.description}</TableCell>
            <TableCell>
              <ActionModal contentId={content._id.toString()} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
