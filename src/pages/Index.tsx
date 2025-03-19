
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, CheckCircle, Clock, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Mail className="h-10 w-10 text-primary" />,
      title: 'Streamlined Email Testing',
      description: 'Send test emails to designated accounts and track responses with ease.'
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'Real-time Response Tracking',
      description: 'Monitor test responses in real-time with detailed analytics and insights.'
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'Efficient Workflow',
      description: 'Create and manage multiple email tests simultaneously with our intuitive interface.'
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Secure Testing Environment',
      description: 'Protect your data with our secure, isolated testing environment.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="container px-4 py-20 md:py-32 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                Streamlined Email Placement Testing
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 animate-slide-up">
                Your Complete Email Testing Solution
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Create, manage, and analyze email placement tests with our intuitive platform. Send test emails, collect responses, and gain valuable insights.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors btn-hover"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Link>
                <Link
                  to={isAuthenticated ? "/create-test" : "/login"}
                  className="px-6 py-3 rounded-lg border border-input bg-card hover:bg-muted font-medium transition-colors"
                >
                  {isAuthenticated ? "Create New Test" : "Sign In"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform provides everything you need to run effective email placement tests.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all card-hover"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="bg-primary/10 rounded-full p-4 inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join our platform today and revolutionize your email placement testing workflow.
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors btn-hover group"
            >
              {isAuthenticated ? "Go to Dashboard" : "Create Your Account"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-semibold">EmailTest</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EmailTest. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
