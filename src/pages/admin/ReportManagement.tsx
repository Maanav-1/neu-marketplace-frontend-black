import { useEffect, useState } from 'react';
import api from '@/api/client';
import { Button } from '@/components/ui/button';
import { Trash2, ShieldBan, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';
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
      toast({ title: "Done", description: "Report has been handled." });
      fetchReports();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Action failed." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-black">Reports</h1>

      {reports.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
          <CheckCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No pending reports</p>
          <p className="text-gray-400 text-sm mt-1">All clear for now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex gap-2 items-center">
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle size={10} /> {report.reason}
                    </span>
                    <span className="text-xs text-gray-400">#{report.id}</span>
                  </div>
                  <p className="text-sm text-gray-700">{report.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>By: <span className="text-gray-700">{report.reporterName}</span></span>
                    <span>Listing: <span className="text-gray-700">{report.listingTitle}</span></span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 h-fit shrink-0">
                  <Button size="sm" variant="outline" className="h-8 text-xs border-gray-200 hover:bg-gray-50">
                    <ExternalLink size={12} className="mr-1" /> View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-gray-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleAction(report.id, 'DELETE_LISTING')}
                  >
                    <Trash2 size={12} className="mr-1" /> Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-gray-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleAction(report.id, 'BLOCK_USER')}
                  >
                    <ShieldBan size={12} className="mr-1" /> Block
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-black hover:bg-gray-800 text-white"
                    onClick={() => handleAction(report.id, 'RESOLVE')}
                  >
                    <CheckCircle size={12} className="mr-1" /> Resolve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}