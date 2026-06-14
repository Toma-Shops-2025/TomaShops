import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

const BackButton = ({ to, label = 'Back', className = '' }: BackButtonProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (to) navigate(to);
    else if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };
  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="outline"
      size="sm"
      className={`bg-background text-foreground rounded-none border-2 border-black font-black uppercase tracking-widest brutal-shadow brutal-press ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" /> {label}
    </Button>
  );
};

export default BackButton;
