
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, User } from 'lucide-react';

interface ViewSwitcherProps {
  currentView: 'admin' | 'user';
  onViewChange: (newView: 'admin' | 'user') => void;
}

const ViewSwitcher = ({ currentView, onViewChange }: ViewSwitcherProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={currentView === 'user' ? 'default' : 'outline'}
            onClick={() => onViewChange('user')}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Member View
          </Button>
          <Button
            variant={currentView === 'admin' ? 'default' : 'outline'}
            onClick={() => onViewChange('admin')}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Admin View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewSwitcher;
