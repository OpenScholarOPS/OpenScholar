import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ResearchField } from '@/types';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.fullName || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setError(null);
      setIsLoading(true);
      await signUp(formData.email, formData.password, formData.username, formData.fullName);
      navigate('/auth/signin?registered=true');
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Create your account
      </h2>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          label="Email address"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail className="h-4 w-4 text-gray-400" />}
          placeholder="you@example.com"
          required
        />
        
        <Input
          type="text"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          icon={<User className="h-4 w-4 text-gray-400" />}
          placeholder="johndoe"
          required
        />
        
        <Input
          type="text"
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          icon={<UserCheck className="h-4 w-4 text-gray-400" />}
          placeholder="John Doe"
          required
        />
        
        <Input
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock className="h-4 w-4 text-gray-400" />}
          placeholder="••••••••"
          required
        />
        
        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock className="h-4 w-4 text-gray-400" />}
          placeholder="••••••••"
          required
        />
        
        <div className="mt-6">
          <Button 
            type="submit" 
            className="w-full py-2" 
            isLoading={isLoading}
          >
            Sign up
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/auth/signin" className="font-medium text-primary hover:text-primary-600">
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage; 