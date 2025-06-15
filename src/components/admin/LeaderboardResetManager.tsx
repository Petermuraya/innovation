
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, RotateCcw, AlertTriangle, Calendar, Users } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const LeaderboardResetManager = () => {
  const [loading, setLoading] = useState(false);
  const [resetReason, setResetReason] = useState('Academic year end reset');
  const { toast } = useToast();

  const handleResetLeaderboard = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('reset_leaderboard_for_academic_year', {
        reset_reason: resetReason
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Leaderboard Reset Successful",
          description: `${data.points_reset} member points and ${data.visits_reset} visit records have been reset.`,
        });
        setResetReason('Academic year end reset');
      } else {
        toast({
          title: "Reset Failed",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error resetting leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to reset leaderboard. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const currentAcademicYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Trophy className="h-5 w-5" />
            Leaderboard Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Academic Year Info */}
          <div className="bg-white/80 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-700">Current Academic Year</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                {currentAcademicYear}/{currentAcademicYear + 1}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-blue-600">
                <Users className="h-4 w-4" />
                <span>Active Members Competing</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Trophy className="h-4 w-4" />
                <span>Points System Active</span>
              </div>
            </div>
          </div>

          {/* Reset Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Reset Reason
              </label>
              <Input
                value={resetReason}
                onChange={(e) => setResetReason(e.target.value)}
                placeholder="Enter reason for leaderboard reset..."
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-blue-600 mt-1">
                This reason will be logged for audit purposes
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  disabled={loading || !resetReason.trim()}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {loading ? 'Resetting...' : 'Reset Leaderboard'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-blue-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-blue-700">
                    <AlertTriangle className="h-5 w-5" />
                    Confirm Leaderboard Reset
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-blue-600">
                    This action will permanently delete all member points, visit records, and reset the entire leaderboard. 
                    This action cannot be undone. Are you sure you want to proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetLeaderboard}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Yes, Reset Leaderboard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Warning Notice */}
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Important Notice:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>This will reset ALL member points across the system</li>
                  <li>All website and community visit records will be cleared</li>
                  <li>The action is logged and cannot be reversed</li>
                  <li>Only Super Admins can perform this operation</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardResetManager;
