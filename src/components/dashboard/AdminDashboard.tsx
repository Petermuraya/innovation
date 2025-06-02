import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useHotkeys } from 'react-hotkeys-hook'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, PieChart, Activity, Users, Calendar, FileText, CreditCard, Settings, Bell } from 'react-feather'

// Components
import { 
  DashboardHeader, 
  StatsGrid, 
  DataTable, 
  SearchBar, 
  FilterDropdown, 
  DateRangePicker,
  NotificationCenter,
  QuickActionsMenu,
  DarkModeToggle
} from '@/components/admin'

// Sections
import { 
  MembersSection, 
  EventsSection, 
  ProjectsSection, 
  PaymentsSection,
  CertificatesSection,
  MpesaSection,
  UsersSection,
  CommunityAdminsSection,
  AdminRequestsSection
} from '@/components/admin/sections'

// Types
interface DashboardStats {
  totalMembers: number
  activeMembers: number
  pendingMembers: number
  totalEvents: number
  upcomingEvents: number
  pendingProjects: number
  completedProjects: number
  totalPayments: number
  recentPayments: number
  totalCertificates: number
  pendingAdminRequests: number
  revenue: number
}

const AdminDashboard = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    pendingProjects: 0,
    completedProjects: 0,
    totalPayments: 0,
    recentPayments: 0,
    totalCertificates: 0,
    pendingAdminRequests: 0,
    revenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ 
    start: new Date(new Date().setDate(new Date().getDate() - 30)), 
    end: new Date() 
  })

  // Hotkeys
  useHotkeys('ctrl+k', () => {
    const searchInput = document.getElementById('global-search')
    searchInput?.focus()
    return false
  })

  useHotkeys('ctrl+n', () => {
    setShowNotifications(prev => !prev)
    return false
  })

  useHotkeys('ctrl+q', () => {
    setShowQuickActions(prev => !prev)
    return false
  })

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Parallel fetching for better performance
      const [
        membersResponse,
        eventsResponse,
        projectsResponse,
        paymentsResponse,
        certificatesResponse,
        adminRequestsResponse,
        revenueResponse
      ] = await Promise.all([
        supabase.from('members').select('id, registration_status, created_at'),
        supabase.from('events').select('id, start_date, end_date'),
        supabase.from('project_submissions').select('id, status, created_at'),
        supabase.from('mpesa_payments').select('id, amount, created_at'),
        supabase.from('certificates').select('id'),
        supabase.from('admin_requests').select('id, status').eq('status', 'pending'),
        supabase.rpc('calculate_revenue', { days: 30 })
      ])

      // Calculate stats
      const members = membersResponse.data || []
      const events = eventsResponse.data || []
      const projects = projectsResponse.data || []
      const payments = paymentsResponse.data || []
      const certificates = certificatesResponse.data || []
      const adminRequests = adminRequestsResponse.data || []
      const revenue = revenueResponse.data || 0

      const now = new Date()
      const recentPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at)
        return paymentDate > new Date(now.setDate(now.getDate() - 7))
      }).length

      const upcomingEvents = events.filter(e => {
        const startDate = new Date(e.start_date)
        return startDate > now && startDate < new Date(now.setDate(now.getDate() + 30))
      }).length

      setStats({
        totalMembers: members.length,
        activeMembers: members.filter(m => m.registration_status === 'approved').length,
        pendingMembers: members.filter(m => m.registration_status === 'pending').length,
        totalEvents: events.length,
        upcomingEvents,
        pendingProjects: projects.filter(p => p.status === 'pending').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        totalPayments: payments.length,
        recentPayments,
        totalCertificates: certificates.length,
        pendingAdminRequests: adminRequests.length,
        revenue
      })

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setNotifications(notificationsData || [])
      setUnreadNotifications(notificationsData?.filter(n => !n.read).length || 0)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchDashboardData()

    // Set up realtime subscription
    const subscription = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: '*' }, () => {
        fetchDashboardData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [fetchDashboardData])

  // Tab content with smooth transitions
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <StatsGrid stats={stats} loading={isLoading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                {/* Activity timeline component would go here */}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                {/* Revenue chart component would go here */}
              </div>
            </div>
          </div>
        )
      case 'members':
        return <MembersSection searchQuery={searchQuery} dateRange={dateRange} />
      case 'events':
        return <EventsSection searchQuery={searchQuery} dateRange={dateRange} />
      case 'projects':
        return <ProjectsSection searchQuery={searchQuery} dateRange={dateRange} />
      case 'payments':
        return <PaymentsSection searchQuery={searchQuery} dateRange={dateRange} />
      case 'certificates':
        return <CertificatesSection searchQuery={searchQuery} dateRange={dateRange} />
      case 'mpesa':
        return <MpesaSection />
      case 'users':
        return <UsersSection />
      case 'community-admins':
        return <CommunityAdminsSection />
      case 'admin-requests':
        return <AdminRequestsSection />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-10">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="p-4 space-y-1">
          {[
            { id: 'dashboard', icon: <BarChart size={18} />, label: 'Dashboard' },
            { id: 'members', icon: <Users size={18} />, label: 'Members' },
            { id: 'events', icon: <Calendar size={18} />, label: 'Events' },
            { id: 'projects', icon: <FileText size={18} />, label: 'Projects' },
            { id: 'payments', icon: <CreditCard size={18} />, label: 'Payments' },
            { id: 'certificates', icon: <FileText size={18} />, label: 'Certificates' },
            { id: 'mpesa', icon: <CreditCard size={18} />, label: 'M-Pesa' },
            { id: 'users', icon: <Users size={18} />, label: 'Users' },
            { id: 'community-admins', icon: <Users size={18} />, label: 'Community Admins' },
            { id: 'admin-requests', icon: <Activity size={18} />, label: 'Admin Requests' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
              {item.id === 'admin-requests' && stats.pendingAdminRequests > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {stats.pendingAdminRequests}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <DashboardHeader>
          <div className="flex items-center space-x-4">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search across dashboard..."
            />
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <FilterDropdown />
            
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <button 
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings size={20} />
            </button>

            <DarkModeToggle />
          </div>
        </DashboardHeader>

        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications(nots => nots.map(n => n.id === id ? {...n, read: true} : n))
          setUnreadNotifications(prev => prev - 1)
        }}
      />

      {/* Quick Actions Menu */}
      <QuickActionsMenu 
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        actions={[
          { label: 'Create New Member', onClick: () => router.push('/admin/members/new') },
          { label: 'Schedule Event', onClick: () => router.push('/admin/events/new') },
          { label: 'Process Payment', onClick: () => router.push('/admin/payments/process') },
          { label: 'Generate Report', onClick: () => router.push('/admin/reports') },
        ]}
      />
    </div>
  )
}

export default AdminDashboard