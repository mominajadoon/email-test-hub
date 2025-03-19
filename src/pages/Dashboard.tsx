
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, RefreshCw } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import TestCard from '@/components/TestCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { testsApi } from '@/utils/api';

const Dashboard = () => {
  const { token, user } = useRequireAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTests = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const data = await testsApi.getAll(token);
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTests();
    }
  }, [token]);

  const filteredTests = tests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.emailAccount.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your email placement tests
            </p>
          </div>
          
          <Link
            to="/create-test"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-hover"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Test
          </Link>
        </div>
        
        <div className="glass rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            
            <button
              onClick={fetchTests}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {isLoading ? (
            <div className="py-20">
              <LoadingSpinner className="mx-auto" />
            </div>
          ) : filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <TestCard 
                  key={test.id} 
                  test={test} 
                  className="animate-fade-in"
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tests match your search criteria</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any tests yet</p>
              <Link
                to="/create-test"
                className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-hover"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create your first test
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
