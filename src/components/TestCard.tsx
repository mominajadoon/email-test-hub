
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TestCardProps {
  test: {
    id: string;
    name: string;
    emailAccount: {
      address: string;
    };
    createdAt: string;
    status: 'pending' | 'in_progress' | 'completed';
  };
  className?: string;
}

const statusConfig = {
  pending: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Pending',
    color: 'text-yellow-500 bg-yellow-100'
  },
  in_progress: {
    icon: <Clock className="h-4 w-4" />,
    label: 'In Progress',
    color: 'text-blue-500 bg-blue-100'
  },
  completed: {
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Completed',
    color: 'text-green-500 bg-green-100'
  }
};

const TestCard: React.FC<TestCardProps> = ({ test, className }) => {
  const status = statusConfig[test.status];
  const createdDate = new Date(test.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-border overflow-hidden card-hover",
        className
      )}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg truncate">{test.name}</h3>
          <div className={cn("flex items-center px-2 py-1 rounded-full text-xs", status.color)}>
            {status.icon}
            <span className="ml-1">{status.label}</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{test.emailAccount.address}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{timeAgo}</span>
          </div>
        </div>
        
        <Link
          to={`/tests/${test.id}`}
          className="flex items-center text-sm font-medium text-primary hover:underline mt-2 group"
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default TestCard;
