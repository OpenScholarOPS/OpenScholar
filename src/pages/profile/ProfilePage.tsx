import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, Award, FileText, MessageSquare, Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { discussionService } from '@/services/supabase';
import { ResearchField } from '@/types';

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading, updateProfile } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userDiscussions, setUserDiscussions] = useState([]);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
    institution: '',
    researchFields: []
  });
  const navigate = useNavigate();
  
  // Set form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        bio: user.bio || '',
        institution: user.institution || '',
        researchFields: user.researchFields || []
      });
      
      // Fetch user discussions
      fetchUserDiscussions();
    }
  }, [user]);
  
  const fetchUserDiscussions = async () => {
    if (!user) return;
    
    try {
      setIsLoadingDiscussions(true);
      // This is a mock function for MVP, in a real app you would have a proper endpoint
      // Just showing the structure for now
      // const { discussions } = await discussionService.getUserDiscussions(user.id);
      // setUserDiscussions(discussions);
      setUserDiscussions([]);
    } catch (err) {
      console.error('Error fetching user discussions:', err);
    } finally {
      setIsLoadingDiscussions(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleResearchFieldChange = (field: ResearchField) => {
    setFormData(prev => {
      const currentFields = [...prev.researchFields];
      
      if (currentFields.includes(field)) {
        return {
          ...prev,
          researchFields: currentFields.filter(f => f !== field)
        };
      } else {
        return {
          ...prev,
          researchFields: [...currentFields, field]
        };
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSaving(true);
      await updateProfile({
        fullName: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        institution: formData.institution,
        researchFields: formData.researchFields
      });
      setIsEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={36} />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You need to be signed in to view your profile
            </p>
            <Button
              onClick={() => navigate('/auth/signin')}
              leftIcon={<User className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        
        {!isEditMode ? (
          <Button
            onClick={() => setIsEditMode(true)}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditMode(false)}
            variant="outline"
          >
            Cancel
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {isEditMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  
                  <Input
                    label="Institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="University, Research Center, etc."
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell others about your research interests and expertise"
                      className="flex min-h-[100px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Research Fields
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(ResearchField).map((field) => (
                        <div
                          key={field}
                          className={`p-2 rounded-md cursor-pointer flex items-center ${
                            formData.researchFields.includes(field)
                              ? 'bg-primary-50 border-primary border dark:bg-primary-900/30 dark:border-primary-700'
                              : 'bg-gray-50 border-gray-200 border dark:bg-gray-800 dark:border-gray-700'
                          }`}
                          onClick={() => handleResearchFieldChange(field)}
                        >
                          {formData.researchFields.includes(field) && (
                            <CheckCircle className="w-4 h-4 text-primary mr-2" />
                          )}
                          <span className="text-sm">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <CardFooter className="px-0 pt-4">
                    <Button
                      type="submit"
                      leftIcon={<Save className="w-4 h-4" />}
                      isLoading={isSaving}
                    >
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{user.username}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{user.fullName || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Institution</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{user.institution || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</h3>
                    <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                      {user.bio || 'No bio provided'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Research Fields</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {user.researchFields && user.researchFields.length > 0 ? (
                        user.researchFields.map((field) => (
                          <span
                            key={field}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                          >
                            {field}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No research fields selected</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Stats Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Stats & Achievements
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reputation</h3>
                  <p className="mt-1 text-2xl font-bold text-primary">{user.reputation || 0}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Token Balance</h3>
                  <p className="mt-1 text-2xl font-bold text-primary">{user.tokenBalance || 0} $OPS</p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Activity Summary</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Discussions</span>
                    </div>
                    <span className="font-medium">{userDiscussions.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Papers</span>
                    </div>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* User Discussions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            My Discussions
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {isLoadingDiscussions ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size={24} />
            </div>
          ) : userDiscussions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't created any discussions yet
              </p>
              <Button
                onClick={() => navigate('/discussions/create')}
                leftIcon={<MessageSquare className="w-4 h-4" />}
              >
                Start a Discussion
              </Button>
            </div>
          ) : (
            <div>
              {/* This would be a list of the user's discussions */}
              <p>Display user discussions here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage; 