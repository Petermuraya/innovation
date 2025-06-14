
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type PositionType = 'chairman' | 'vice_chairman' | 'treasurer' | 'secretary' | 'vice_secretary' | 'organizing_secretary' | 'auditor';

interface ApplicationFormProps {
  availablePositions: any[];
  selectedPosition: PositionType | '';
  setSelectedPosition: (position: PositionType) => void;
  manifesto: string;
  setManifesto: (manifesto: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const ApplicationForm = ({
  availablePositions,
  selectedPosition,
  setSelectedPosition,
  manifesto,
  setManifesto,
  onSubmit,
  isSubmitting,
}: ApplicationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Apply for New Position</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Select value={selectedPosition} onValueChange={(value: PositionType) => setSelectedPosition(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a position to apply for" />
              </SelectTrigger>
              <SelectContent>
                {availablePositions.map((position: any) => (
                  <SelectItem key={position.id} value={position.position_type}>
                    {position.position_type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Write your manifesto and explain why you're the best candidate for this position..."
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !selectedPosition || !manifesto.trim()}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
