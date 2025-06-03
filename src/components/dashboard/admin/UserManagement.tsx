
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserPlus, Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  registration_status: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch members with their roles
      const { data: members, error } = await supabase
        .from('members')
        .select(`
          id,
          user_id,
          email,
          name,
          registration_status
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For each member, fetch their roles separately to avoid relation issues
      const formattedUsers = await Promise.all(
        (members || []).map(async (member) => {
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', member.user_id);

          // Handle the case where user_roles query might fail
          const roles = rolesError ? [] : (userRoles?.map(ur => ur.role) || []);

          return {
            id: member.user_id || '',
            email: member.email,
            name: member.name,
            roles,
            registration_status: member.registration_status,
          };
        })
      );

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

  const grantAdminRole = async (email: string) => {
    try {
      setLoading(true);

      // Find the user by email
      const user = users.find(u => u.email === email);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      // Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'admin'
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
        description: `Admin privileges granted to ${email}`,
      });

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error granting admin role:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin privileges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAdminToSpecificUser = async () => {
    await grantAdminRole('sammypeter1944@gmail.com');
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    user.name.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleGrantAdminToSpecificUser}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Grant Super Admin to sammypeter1944@gmail.com
            </Button>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search">Search Users</Label>
                <Input
                  id="search"
                  placeholder="Search by email or name..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
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
                        {user.roles.map((role) => (
                          <Badge key={role} variant="outline" className="text-red-600 border-red-600">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!user.roles.includes('admin') && (
                        <Button
                          size="sm"
                          onClick={() => grantAdminRole(user.email)}
                          disabled={loading}
                        >
                          Grant Admin
                        </Button>
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
