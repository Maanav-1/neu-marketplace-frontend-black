import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Corrected Import
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
      <DialogContent className="bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-black tracking-tight text-white">
            <AlertTriangle className="text-orange-500" size={20} /> Report Listing
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Help us keep the Husky community safe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Reason</label>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-11 bg-zinc-900 border-zinc-800 rounded-lg text-sm px-3 text-white outline-none focus:ring-1 focus:ring-blue-600"
            >
              {REPORT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Additional Details</label>
            {/* Updated to use the new Textarea component */}
            <Textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="bg-zinc-900 border-zinc-800 min-h-[120px] focus:ring-blue-600 text-white"
              placeholder="Provide more context for our moderators..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-zinc-500 hover:text-white hover:bg-zinc-900">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || !details.trim()} 
            className="bg-orange-600 hover:bg-orange-700 font-bold shadow-lg shadow-orange-500/10"
          >
            {submitting ? <Loader2 className="animate-spin" /> : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}