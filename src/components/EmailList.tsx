
import React from 'react';
import { CheckCircle, Mail, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailAccount {
  id: string;
  address: string;
  uuid: string;
  available: boolean;
}

interface EmailListProps {
  emails: EmailAccount[];
  selectedEmailId: string | null;
  onSelect: (email: EmailAccount) => void;
  isLoading?: boolean;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmailId,
  onSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div 
              key={index} 
              className="h-16 bg-muted animate-pulse rounded-lg"
            />
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {emails.map((email) => (
        <button
          key={email.id}
          onClick={() => email.available && onSelect(email)}
          className={cn(
            "w-full p-3 border rounded-lg flex items-center justify-between transition-all",
            selectedEmailId === email.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30",
            !email.available && "opacity-50 cursor-not-allowed"
          )}
          disabled={!email.available}
        >
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-2 mr-3">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">{email.address}</div>
              <div className="text-xs text-muted-foreground truncate">ID: {email.uuid}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            {email.available ? (
              <span className="text-xs flex items-center text-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Available
              </span>
            ) : (
              <span className="text-xs flex items-center text-destructive">
                <XCircle className="h-3 w-3 mr-1" />
                In use
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default EmailList;
