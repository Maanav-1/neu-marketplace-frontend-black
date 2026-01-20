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
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Moderation</h1>

      {reports.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No pending reports!</p>
          <p className="text-slate-400 text-sm mt-1">All clear for now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="bg-white border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-6 shadow-sm">
              <div className="space-y-2 flex-1">
                <div className="flex gap-2 items-center">
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">{report.reason}</Badge>
                  <span className="text-xs text-slate-400 font-mono">ID: #{report.id}</span>
                </div>
                <p className="text-sm text-slate-700">{report.description}</p>
                <div className="pt-2 flex gap-4 text-xs font-medium text-slate-500">
                  <span>By: <span className="text-slate-700">{report.reporterName}</span></span>
                  <span>Target: <span className="text-slate-700">{report.listingTitle}</span></span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 h-fit">
                <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleAction(report.id, 'RESOLVE')}
                >
                  <CheckCircle size={14} className="mr-2" /> Resolve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}