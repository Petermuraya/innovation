
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MembershipPayment from '@/components/payments/MembershipPayment';
import PaymentStatus from '@/components/payments/PaymentStatus';
import DashboardPayments from '@/components/dashboard/user/DashboardPayments';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Payments = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-kic-green-500" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-kic-gray mb-6">Payments</h1>
        
        <Tabs defaultValue="membership" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="status">Payment Status</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="membership">
            <MembershipPayment />
          </TabsContent>

          <TabsContent value="status">
            <PaymentStatus />
          </TabsContent>

          <TabsContent value="history">
            <DashboardPayments payments={[]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Payments;
