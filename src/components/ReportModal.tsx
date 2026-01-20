import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/client';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  listingId: number;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  "Prohibited Item",
  "Misleading Information",
  "Scam or Fraud",
  "Harassment",
  "Duplicate Listing",
  "Other"
];

export default function ReportModal({ listingId, isOpen, onClose }: ReportModalProps) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/reports', {
        listingId,
        reason,
        description: details
      });
      toast({ title: "Report Submitted", description: "Our team will review this listing shortly." });
      onClose();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not submit report." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-slate-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-semibold text-slate-900">
            <AlertTriangle className="text-amber-500" size={20} /> Report Listing
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Help us keep the Husky community safe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {REPORT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Additional Details</label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="bg-slate-50 border-slate-200 min-h-[120px] focus:ring-2 focus:ring-indigo-500"
              placeholder="Provide more context for our moderators..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !details.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm"
          >
            {submitting ? <Loader2 className="animate-spin" /> : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}