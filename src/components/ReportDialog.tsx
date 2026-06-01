import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';
import { Flag } from 'lucide-react';

type ReportType = 'user' | 'product' | 'message';

interface ReportDialogProps {
  type: ReportType;
  reportedUserId?: string;
  reportedProductId?: string;
  trigger?: React.ReactNode;
}

const REASONS = [
  'Spam or scam',
  'Inappropriate or offensive content',
  'Counterfeit or stolen item',
  'Prohibited item',
  'Harassment or hate speech',
  'Other',
];

const ReportDialog = ({ type, reportedUserId, reportedProductId, trigger }: ReportDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) {
      toast.error('Please sign in to report.');
      navigate('/auth/login');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId ?? null,
      reported_product_id: reportedProductId ?? null,
      report_type: type,
      reason,
      details: details || null,
    });
    setLoading(false);
    if (error) {
      toast.error('Could not submit report.');
      return;
    }
    toast.success('Report submitted. Our team will review it.');
    setOpen(false);
    setDetails('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            <Flag className="h-4 w-4 mr-1" /> Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report {type}</DialogTitle>
          <DialogDescription>
            Help keep TomaShops safe. Tell us what's wrong and we'll review it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Reason</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
              {REASONS.map(r => (
                <div key={r} className="flex items-center space-x-2">
                  <RadioGroupItem id={r} value={r} />
                  <Label htmlFor={r} className="font-normal cursor-pointer">{r}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="details" className="mb-2 block">Details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Add any context that will help our review."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={1000}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? 'Submitting…' : 'Submit report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
