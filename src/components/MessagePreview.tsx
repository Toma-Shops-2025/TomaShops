
import { Link } from 'react-router-dom';
import { Message } from '@/data/products';
import { format, isToday, isYesterday } from 'date-fns';

interface MessagePreviewProps {
  message: Message;
}

const MessagePreview = ({ message }: MessagePreviewProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'p'); // Displays time like "3:43 PM"
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d'); // Displays like "May 10"
    }
  };
  
  return (
    <Link to={`/messages/${message.senderId}`}>
      <div className={`p-4 border-b hover:bg-muted/50 transition-colors ${message.isRead ? '' : 'message-unread'}`}>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img 
              src={message.senderAvatar} 
              alt={message.senderName}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <h3 className="font-semibold truncate">{message.senderName}</h3>
              <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-1">{message.message}</p>
            
            {message.productTitle && (
              <div className="mt-1 bg-muted text-primary rounded px-2 py-0.5 text-xs">
                Re: {message.productTitle}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MessagePreview;
