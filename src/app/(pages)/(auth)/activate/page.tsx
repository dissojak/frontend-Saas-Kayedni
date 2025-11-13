"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { activateAccountAPI } from '../../api/auth.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No activation token provided');
      return;
    }

    // Call activation API
    activateAccountAPI(token)
      .then((response) => {
        setStatus('success');
        setMessage(response.message || 'Your account has been successfully activated!');
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error.message || 'Failed to activate account');
      });
  }, [searchParams]);

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Account Activation
          </CardTitle>
          <CardDescription>
            Activating your Bookify account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <p className="text-center text-gray-600">
                Activating your account...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Activation Successful!
                </h3>
                <p className="text-gray-600 mb-4">
                  {message}
                </p>
                <Button onClick={handleGoToLogin} className="w-full">
                  Go to Login
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  Activation Failed
                </h3>
                <p className="text-gray-600 mb-4">
                  {message}
                </p>
                <div className="space-y-2 w-full">
                  <Button onClick={handleGoToLogin} variant="outline" className="w-full">
                    Back to Login
                  </Button>
                  <Button 
                    onClick={() => router.push('/register')} 
                    variant="outline" 
                    className="w-full"
                  >
                    Register Again
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
