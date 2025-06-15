import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Eye, RefreshCw, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  phone_number: string;
  payment_type: string;
  transaction_id: string;
  mpesa_receipt_number: string;
  created_at: string;
  status: string;
  user_id: string;
  checkout_request_id: string;
  merchant_request_id: string;
  result_desc?: string;
  members?: { name: string; email: string } | null;
}

interface PaymentsManagementProps {
  payments: Payment[];
}

const PaymentsManagement = ({ payments: initialPayments }: PaymentsManagementProps) => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchQuery, statusFilter, typeFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mpesa_payments')
        .select(`
          *,
          members!left (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure proper typing
      const transformedData: Payment[] = (data || []).map(payment => {
        // Check if members exists and has the expected structure
        const memberData = payment.members;
        const hasValidMember = memberData && 
                              typeof memberData === 'object' && 
                              'name' in memberData;
        
        return {
          ...payment,
          members: hasValidMember ? {
            name: memberData.name || 'N/A', 
            email: memberData.email || 'N/A'
          } : null
        };
      });
      
      setPayments(transformedData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.mpesa_receipt_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.phone_number?.includes(searchQuery) ||
        payment.members?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.members?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_type === typeFilter);
    }

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'membership':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const calculateStats = () => {
    const completedPayments = filteredPayments.filter(p => p.status === 'completed');
    const totalAmount = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalCount = completedPayments.length;
    const pendingCount = filteredPayments.filter(p => p.status === 'pending').length;
    const failedCount = filteredPayments.filter(p => p.status === 'failed').length;

    return { totalAmount, totalCount, pendingCount, failedCount };
  };

  const stats = calculateStats();

  const exportPayments = () => {
    const csvContent = [
      ['Date', 'Transaction ID', 'Amount', 'Phone', 'Type', 'Status', 'Member Name', 'Member Email'].join(','),
      ...filteredPayments.map(payment => [
        format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm:ss'),
        payment.transaction_id || 'N/A',
        payment.amount,
        payment.phone_number,
        payment.payment_type,
        payment.status,
        payment.members?.name || 'N/A',
        payment.members?.email || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  KSh {stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCount}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedCount}</p>
              </div>
              <Eye className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Tracking
              </CardTitle>
              <CardDescription>Monitor and manage all M-PESA payments</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPayments}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportPayments}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by transaction ID, phone, name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No payments found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {format(new Date(payment.created_at), 'MMM d, yyyy')}
                        <br />
                        <span className="text-xs text-gray-500">
                          {format(new Date(payment.created_at), 'h:mm a')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.members?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{payment.members?.email || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        KSh {Number(payment.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentTypeIcon(payment.payment_type)}
                          <span className="capitalize">{payment.payment_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono text-xs">{payment.transaction_id || 'N/A'}</p>
                          {payment.mpesa_receipt_number && (
                            <p className="font-mono text-xs text-gray-500">
                              {payment.mpesa_receipt_number}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{payment.phone_number}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          {filteredPayments.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManagement;
