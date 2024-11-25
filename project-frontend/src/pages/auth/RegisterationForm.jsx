import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Mail, Lock, Phone, User, AlertCircle } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.register(formData);
      login(response.data);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: 'name', type: 'text', placeholder: 'Full Name', icon: User },
    { name: 'email', type: 'email', placeholder: 'Email Address', icon: Mail },
    { name: 'password', type: 'password', placeholder: 'Create Password', icon: Lock },
    { name: 'phoneNumber', type: 'tel', placeholder: 'Phone Number', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <p className="text-sm text-gray-600">Join us today and start your journey</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-900 px-4 py-3 rounded-lg flex items-center gap-2 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {inputFields.map((field) => (
                <div key={field.name} className="relative group">
                  <field.icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 
                                       group-focus-within:text-blue-500 transition-colors duration-200" />
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                             transition-all duration-200 rounded-lg"
                  />
                  <div className="absolute inset-0 border border-transparent group-focus-within:border-blue-500 
                                rounded-lg pointer-events-none" />
                </div>
              ))}

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
                          transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                          disabled:opacity-70 disabled:cursor-not-allowed
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                
              </div>

              
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;