import React, { useEffect, useState } from 'react';
import api from '@/api/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShieldBan, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportManagement() {
  const [reports, setReports] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchReports = async () => {
    const { data } = await api.get('/admin/reports');
    setReports(data.content);
  };

  useEffect(() => { fetchReports(); }, []);

  const handleAction = async (reportId: number, action: 'RESOLVE' | 'DELETE_LISTING' | 'BLOCK_USER') => {
    try {
      await api.post(`/admin/reports/${reportId}/action`, { action });
      toast({ title: "Action Applied", description: "The report has been handled." });
      fetchReports();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not complete action." });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black tracking-tighter">Reports & Moderation</h1>
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="bg-zinc-950 border-zinc-800 p-6 flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex gap-2 items-center">
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">{report.reason}</Badge>
                <span className="text-xs text-zinc-500 font-mono">ID: #{report.id}</span>
              </div>
              <p className="text-sm text-zinc-300">{report.description}</p>
              <div className="pt-2 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>By: {report.reporterName}</span>
                <span>Target: {report.listingTitle}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 h-fit">
              <Button size="sm" variant="outline" className="border-zinc-800 text-zinc-400">
                <ExternalLink size={14} className="mr-2" /> View Listing
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleAction(report.id, 'DELETE_LISTING')}
              >
                <Trash2 size={14} className="mr-2" /> Delete Listing
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleAction(report.id, 'BLOCK_USER')}
              >
                <ShieldBan size={14} className="mr-2" /> Block User
              </Button>
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleAction(report.id, 'RESOLVE')}
              >
                <CheckCircle size={14} className="mr-2" /> Resolve
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}