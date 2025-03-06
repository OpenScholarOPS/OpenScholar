import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, MessageSquare, Award, Layers, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { ResearchField } from '@/types';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Featured research fields
  const researchFields = Object.values(ResearchField).map(field => ({
    name: field,
    href: `/fields/${field.toLowerCase().replace(/\s+/g, '-')}`,
    icon: Layers,
    color: getFieldColor(field),
  }));

  // Helper function to get a color based on the field
  function getFieldColor(field: string): string {
    switch (field) {
      case ResearchField.COMPUTER_SCIENCE:
        return 'bg-blue-500';
      case ResearchField.BIOLOGY:
        return 'bg-green-500';
      case ResearchField.PHYSICS:
        return 'bg-violet-500';
      case ResearchField.CHEMISTRY:
        return 'bg-yellow-500';
      case ResearchField.MATHEMATICS:
        return 'bg-red-500';
      case ResearchField.SOCIAL_SCIENCES:
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  }

  return (
    <div className="space-y-16 py-8">
      {/* Hero section */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Decentralized Academic <br />
          <span className="text-primary">Research Collaboration</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          OpenScholar is a platform that democratizes research by removing traditional publishing barriers
          and rewarding high-quality contributions with $OPS tokens.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Button size="lg" as={Link} to="/discussions/create">
                Start a Discussion
              </Button>
              <Button size="lg" variant="outline" as={Link} to="/discussions">
                Browse Discussions
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" as={Link} to="/auth/signup">
                Join OpenScholar
              </Button>
              <Button size="lg" variant="outline" as={Link} to="/auth/signin">
                Sign In
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Revolutionizing Academic Collaboration
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Open Discussions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and participate in academic discussions, organized by field and topic.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Research Papers
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share, discuss and version-control your research papers with DOI integration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Token Rewards
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn $OPS tokens for valuable contributions, reviews, and active participation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Community Governance
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Platform decisions are made collectively by the research community via token voting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Open Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All content is freely accessible, promoting knowledge sharing without paywalls.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Multiple Fields
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organized by major research disciplines with specialized features for each field.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Research Fields section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Explore Research Fields
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {researchFields.map((field) => (
            <Link
              key={field.name}
              to={field.href}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`h-12 w-12 rounded-full ${field.color} flex items-center justify-center mb-2`}>
                <field.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-center font-medium text-gray-900 dark:text-white">
                {field.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to contribute to academic research?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join the OpenScholar community today and be part of the future of decentralized academic collaboration.
        </p>
        <Button size="lg" rightIcon={<ArrowRight />} as={Link} to="/auth/signup">
          Get Started
        </Button>
      </section>
    </div>
  );
};

export default HomePage; 