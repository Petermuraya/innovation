
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Shield, UserPlus, Search, Crown } from 'lucide-react';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

interface User {
  id: string;
  email: string;
  name: string;
  roles: ComprehensiveRole[];
  registration_status: string;
}

const ROLE_LABELS: Record<ComprehensiveRole, string> = {
  member: 'Member',
  super_admin: 'Super Admin',
  general_admin: 'General Admin',
  community_admin: 'Community Admin',
  events_admin: 'Events Admin',
  projects_admin: 'Projects Admin',
  finance_admin: 'Finance Admin',
  content_admin: 'Content Admin',
  technical_admin: 'Technical Admin',
  marketing_admin: 'Marketing Admin',
  chairman: 'Chairman',
  vice_chairman: 'Vice Chairman'
};

const UserManagement = () => {
  const { toast } = useToast();
  const { isSuperAdmin, roleInfo } = useRolePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<ComprehensiveRole>('general_admin');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: members, error } = await supabase
        .from('member_management_view')
        .select('user_id, email, name, registration_status, roles')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = (members || []).map(member => ({
        id: member.user_id || '',
        email: member.email,
        name: member.name,
        roles: member.roles || [],
        registration_status: member.registration_status,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const grantRole = async (email: string, role: ComprehensiveRole) => {
    try {
      setLoading(true);

      const user = users.find(u => u.email === email);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      // Assign the role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: role
        });

      if (roleError) throw roleError;

      // Update member registration status to approved
      const { error: memberError } = await supabase
        .from('members')
        .update({ 
          registration_status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: `${ROLE_LABELS[role]} role granted to ${email}`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error granting role:', error);
      toast({
        title: "Error",
        description: "Failed to grant role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    user.name.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const canManageUsers = isSuperAdmin || roleInfo?.assignedRole === 'chairman';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Management
            {isSuperAdmin && <Crown className="w-4 h-4 text-yellow-500" title="Super Admin Access" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isSuperAdmin && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Super Admin Mode</span>
                </div>
                <p className="text-sm text-yellow-700">
                  You have full system access and can manage all users and roles.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by email or name..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={user.registration_status === 'approved' ? 'default' : 'secondary'}>
                          {user.registration_status}
                        </Badge>
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge 
                              key={role} 
                              variant={role === 'super_admin' ? 'destructive' : 'outline'} 
                              className={role === 'super_admin' ? 'text-yellow-600 border-yellow-600' : 'text-blue-600 border-blue-600'}
                            >
                              {ROLE_LABELS[role]}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">Member</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canManageUsers && (
                        <div className="flex gap-2 items-center">
                          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as ComprehensiveRole)}>
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ROLE_LABELS).filter(([key]) => key !== 'member').map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={() => grantRole(user.email, selectedRole)}
                            disabled={loading}
                          >
                            Grant Role
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-gray-500">No users found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
