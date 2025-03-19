
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Calendar, RefreshCw, Send } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useRequireAuth } from '@/hooks/useAuth';
import { testsApi } from '@/utils/api';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import ResponseCard from '@/components/ResponseCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { cn } from '@/lib/utils';

const getStatusConfig = (status: string) => {
  const statusConfigs = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-700'
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-700'
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-700'
    }
  };
  
  return statusConfigs[status as keyof typeof statusConfigs] || {
    label: status,
    color: 'bg-gray-100 text-gray-700'
  };
};

const TestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useRequireAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTestDetails = async () => {
    if (!token || !id) return;
    
    setIsLoading(true);
    try {
      const data = await testsApi.getById(id, token);
      setTest(data);
    } catch (error) {
      console.error('Error fetching test details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing || !token || !id) return;
    
    setIsRefreshing(true);
    try {
      const data = await testsApi.getById(id, token);
      setTest(data);
      toast.success('Test information updated');
    } catch (error) {
      console.error('Error refreshing test details:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTestDetails();
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 flex justify-center items-center">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Test Not Found</h2>
            <p className="text-muted-foreground mb-6">The test you're looking for doesn't exist or you don't have permission to view it.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const statusConfig = getStatusConfig(test.status);
  const createdDate = new Date(test.createdAt);
  const formattedDate = format(createdDate, 'PPP');
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="glass rounded-xl p-6 md:p-8 mb-8 animate-fade-in">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">{test.name}</h1>
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusConfig.color)}>
                  {statusConfig.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {test.emailAccount.address}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span title={formattedDate}>{timeAgo}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-1.5 text-sm border border-input rounded-md hover:bg-muted transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 mb-8">
            <h3 className="font-medium mb-2">Test Details</h3>
            <div>
              <p className="text-sm mb-2">
                <span className="font-medium">Email ID:</span> {test.emailAccount.uuid}
              </p>
              <p className="text-sm">
                <span className="font-medium">Created on:</span> {formattedDate}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Email Responses</h2>
              <span className="text-sm text-muted-foreground">
                {test.responses?.length || 0} responses
              </span>
            </div>
            
            {!test.responses?.length ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No responses received yet</p>
                <p className="text-sm text-muted-foreground mt-1">Responses will appear here once received</p>
              </div>
            ) : (
              <div className="space-y-4">
                {test.responses.map((response: any, index: number) => (
                  <ResponseCard 
                    key={response.id || index} 
                    response={response} 
                    className="animate-fade-in"
                    // Remove the style prop that caused the TypeScript error
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestDetails;
