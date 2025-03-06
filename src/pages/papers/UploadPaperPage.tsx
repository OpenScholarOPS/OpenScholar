import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, Tag, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { mockDataService } from '@/services/mockData';
import { ResearchField } from '@/types';

const UploadPaperPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    researchField: '',
    doi: '',
    tags: '',
    publicationDate: '',
    content: '',
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.abstract || !formData.researchField || !file) {
      setError('Please fill in all required fields and upload a PDF file');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // In a real application, this would upload the file to storage
      // and create a database entry
      
      // For MVP, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success and navigate to papers page
      alert('Paper uploaded successfully!');
      navigate('/papers');
    } catch (err: any) {
      console.error('Error uploading paper:', err);
      setError(err.message || 'Failed to upload paper. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center mb-6">
        <Button 
          onClick={() => navigate('/papers')}
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mr-2"
        >
          Back to Papers
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Research Paper</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Paper Information
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title *"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter the title of your paper"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Abstract *
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                placeholder="Provide a brief summary of your research"
                className="flex min-h-[150px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Research Field *
                </label>
                <select
                  name="researchField"
                  value={formData.researchField}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Research Field</option>
                  {Object.values(ResearchField).map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
              
              <Input
                label="DOI (if available)"
                name="doi"
                value={formData.doi}
                onChange={handleInputChange}
                placeholder="e.g., 10.1234/journal.2023.01"
                icon={<Tag className="h-4 w-4 text-gray-400" />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Tags (comma separated)"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., machine learning, neural networks"
                icon={<Tag className="h-4 w-4 text-gray-400" />}
              />
              
              <Input
                type="date"
                label="Publication Date (if published)"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleInputChange}
                icon={<Calendar className="h-4 w-4 text-gray-400" />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Paper PDF *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF only (MAX. 10MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    required 
                  />
                </label>
              </div>
              {file && (
                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span>Selected file: {file.name}</span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Additional content or notes (optional)"
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          
            <CardFooter className="px-0 pt-4 flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/papers')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isUploading}
              >
                Upload Paper
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPaperPage;