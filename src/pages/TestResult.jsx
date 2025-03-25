
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Award, Star, Check, X, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { useRequireAuth } from '@/hooks/useAuth';
import { testsApi } from '@/utils/api';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';

const TestResult = () => {
  const { id } = useParams();
  const { token } = useRequireAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock result data (in a real app, this would come from the API)
  const [result, setResult] = useState({
    overallScore: 85,
    level: 'Intermediate (B2)',
    strengths: ['Reading comprehension', 'Vocabulary usage'],
    weaknesses: ['Grammar structure', 'Academic writing'],
    skillBreakdown: [
      { skill: 'Reading', score: 92, rating: 'Advanced' },
      { skill: 'Writing', score: 78, rating: 'Intermediate' },
      { skill: 'Listening', score: 88, rating: 'Upper Intermediate' },
      { skill: 'Speaking', score: 82, rating: 'Intermediate' },
      { skill: 'Grammar', score: 75, rating: 'Intermediate' },
      { skill: 'Vocabulary', score: 90, rating: 'Advanced' }
    ],
    recommendations: [
      'Intermediate grammar course',
      'Academic writing workshop',
      'Business English elective'
    ]
  });

  const fetchTestDetails = async () => {
    if (!token || !id) return;
    
    setIsLoading(true);
    try {
      const data = await testsApi.getById(id, token);
      setTest(data);
      // In a real implementation, you would fetch the actual test results here
      // and call setResult with the real data
    } catch (error) {
      console.error('Error fetching test details:', error);
      toast.error('Failed to load test results');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestDetails();
  }, [id, token]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(`/tests/${id}`)} 
          className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Test Details
        </button>
        
        <div className="glass rounded-xl p-6 md:p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                Test Results
                <Trophy className="h-6 w-6 text-yellow-500" />
              </h1>
              <p className="text-muted-foreground mt-1">
                {test.name} - {format(new Date(test.createdAt), 'PPP')}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  Overall Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
                    <span className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}%
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{result.level}</h3>
                  <p className="text-muted-foreground">Placement Level</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Skills Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Skill</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.skillBreakdown.map((skill, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{skill.skill}</TableCell>
                          <TableCell className={getScoreColor(skill.score)}>{skill.score}%</TableCell>
                          <TableCell>{skill.rating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                Recommendations
              </CardTitle>
              <CardDescription>
                Based on your performance, we recommend the following courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-5 w-5 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TestResult;
