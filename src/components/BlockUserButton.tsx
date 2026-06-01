import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Ban } from 'lucide-react';

interface BlockUserButtonProps {
  targetUserId: string;
  size?: 'sm' | 'default';
  variant?: 'ghost' | 'outline' | 'destructive';
}

const BlockUserButton = ({ targetUserId, size = 'sm', variant = 'ghost' }: BlockUserButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.id === targetUserId) return;
    supabase.from('user_blocks')
      .select('id')
      .eq('blocker_id', user.id)
      .eq('blocked_id', targetUserId)
      .maybeSingle()
      .then(({ data }) => setBlocked(!!data));
  }, [user, targetUserId]);

  if (!user || user.id === targetUserId) return null;

  const toggle = async () => {
    setLoading(true);
    if (blocked) {
      const { error } = await supabase.from('user_blocks')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', targetUserId);
      if (error) toast.error('Could not unblock.');
      else { setBlocked(false); toast.success('User unblocked.'); }
    } else {
      const { error } = await supabase.from('user_blocks')
        .insert({ blocker_id: user.id, blocked_id: targetUserId });
      if (error) toast.error('Could not block.');
      else { setBlocked(true); toast.success('User blocked. You won\'t see their content.'); }
    }
    setLoading(false);
  };

  return (
    <Button size={size} variant={variant} onClick={toggle} disabled={loading}>
      <Ban className="h-4 w-4 mr-1" />
      {blocked ? 'Unblock' : 'Block'}
    </Button>
  );
};

export default BlockUserButton;
