import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-3xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TechEval Platform</h1>
          <p className="text-gray-600 mt-2">AI-Powered Technical Assessment</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {children}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 TechEval. All rights reserved.
        </p>
      </div>
    </div>
  );
}
