
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponseProps {
  response: {
    id: string;
    subject: string;
    content: string;
    receivedAt: string;
  };
  className?: string;
}

const ResponseCard: React.FC<ResponseProps> = ({ response, className }) => {
  const [expanded, setExpanded] = useState(false);
  const receivedDate = new Date(response.receivedAt);
  const timeAgo = formatDistanceToNow(receivedDate, { addSuffix: true });

  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden bg-card transition-all duration-300",
        expanded ? "shadow-md" : "",
        className
      )}
    >
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 rounded-full p-2">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{response.subject}</h4>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 border-t border-border mt-1 animate-slide-down">
          <div className="text-sm text-foreground whitespace-pre-line">
            {response.content}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseCard;
