import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, ClipboardCopy, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  timestamp?: string;
}

class ErrorBoundary extends Component<Props, Readonly<State>> {
  public readonly state: Readonly<State> = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): Readonly<State> {
    return {
      hasError: true,
      error,
      timestamp: new Date().toLocaleString(),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorToClipboard = () => {
    if (this.state.error?.stack) {
      navigator.clipboard.writeText(this.state.error.stack).then(() => {
        alert('Error details copied to clipboard.');
      });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="text-red-500 w-16 h-16" />
            </div>

            <Alert variant="destructive" className="text-center">
              <AlertTitle className="text-lg font-bold">
                Oops! Something went wrong.
              </AlertTitle>
              <AlertDescription>
                We're sorry for the inconvenience. Please try refreshing the page or return home.
              </AlertDescription>
              <p className="text-sm mt-2 text-gray-500">
                Error occurred at: {this.state.timestamp}
              </p>
            </Alert>

            <div className="flex gap-3">
              <Button onClick={this.handleRefresh} className="flex-1" aria-label="Refresh Page">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="flex-1" aria-label="Go Home">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 bg-gray-100 rounded space-y-2">
                <details open className="cursor-pointer">
                  <summary className="font-semibold">Error Details (dev only)</summary>
                  <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>
                <Button
                  onClick={this.copyErrorToClipboard}
                  size="sm"
                  variant="secondary"
                  className="w-full"
                >
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copy Error Details
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
