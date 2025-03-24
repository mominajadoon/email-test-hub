
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { testsApi } from '@/utils/api';

const SendEmailForm = ({ testId, token, onSent, senderEmailId, defaultEmail }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content) {
      toast.error('Please provide email content');
      return;
    }
    
    setIsSending(true);
    try {
      await testsApi.sendEmail(testId, {
        recipient: recipient || defaultEmail,
        subject,
        content,
        sender_email_id: senderEmailId // Added for EmailBison API
      }, token);
      
      toast.success('Email sent successfully');
      setRecipient('');
      setSubject('');
      setContent('');
      
      if (onSent) onSent();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 mt-6">
      <h3 className="text-lg font-medium mb-4">Send Follow-up Email</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium mb-1">
              Recipient (optional)
            </label>
            <input
              id="recipient"
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Defaults to test email if empty"
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject (optional)
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Email Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your email message here..."
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSending}
            className="w-full flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Send Email
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendEmailForm;
