
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useAuth';
import { testsApi, emailsApi } from '@/utils/api';
import Navbar from '@/components/Navbar';
import EmailList from '@/components/EmailList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import { ChevronLeft, Mail, Send } from 'lucide-react';

const CreateTest = () => {
  const { token } = useRequireAuth();
  const navigate = useNavigate();
  const [testName, setTestName] = useState('');
  const [testContent, setTestContent] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      if (!token) return;
      
      setIsLoadingEmails(true);
      try {
        const data = await emailsApi.getAll(token);
        setEmails(data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setIsLoadingEmails(false);
      }
    };

    fetchEmails();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmail) {
      toast.error('Please select an email account');
      return;
    }

    setIsCreating(true);
    try {
      const testData = {
        name: testName,
        emailAccountId: selectedEmail.id,
        content: testContent
      };
      
      const createdTest = await testsApi.create(testData, token!);
      
      toast.success('Test created successfully!');
      navigate(`/tests/${createdTest.id}`);
    } catch (error) {
      console.error('Error creating test:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <div className="glass rounded-xl p-6 md:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Create a New Test</h1>
              <p className="text-muted-foreground mt-1">
                Set up your email placement test
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="testName" className="text-sm font-medium">
                  Test Name
                </label>
                <input
                  id="testName"
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Enter a name for your test"
                  className="form-input"
                  required
                  disabled={isCreating}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="testContent" className="text-sm font-medium">
                  Email Content
                </label>
                <textarea
                  id="testContent"
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  placeholder="Enter the content for your test email"
                  className="form-input min-h-[120px]"
                  required
                  disabled={isCreating}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">
                    Select Email Account
                  </label>
                  {selectedEmail && (
                    <button 
                      type="button"
                      onClick={() => setSelectedEmail(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear selection
                    </button>
                  )}
                </div>
                
                <EmailList
                  emails={emails}
                  selectedEmailId={selectedEmail?.id || null}
                  onSelect={setSelectedEmail}
                  isLoading={isLoadingEmails}
                />
                
                {selectedEmail && (
                  <div className="text-sm p-3 bg-primary/5 border border-primary/20 rounded-md">
                    <p className="font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      Selected: {selectedEmail.address}
                    </p>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors btn-hover flex items-center justify-center"
                disabled={isCreating || !selectedEmail}
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Test...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Test
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTest;
