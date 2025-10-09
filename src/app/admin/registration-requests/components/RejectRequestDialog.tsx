import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type RejectRequestDialogProps = {
  isOpen: boolean;
  reason: string;
  isRejecting: boolean;
  onClose: () => void;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
};

export const RejectRequestDialog = ({
  isOpen,
  reason,
  isRejecting,
  onClose,
  onReasonChange,
  onSubmit,
}: RejectRequestDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject Registration Request</DialogTitle>
        <DialogDescription>
          Provide a reason for rejection. This will be sent to the applicant.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <Label htmlFor="rejectionReason">
          Rejection Reason (min. 10 characters)
        </Label>
        <Textarea
          id="rejectionReason"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="e.g., Incomplete information provided..."
          rows={4}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onSubmit}
          disabled={reason.trim().length < 10 || isRejecting}
        >
          {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
          Confirm Rejection
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
