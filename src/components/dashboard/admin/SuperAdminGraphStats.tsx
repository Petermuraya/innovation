
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Calendar, FolderOpen, Award, Activity, Eye, EyeOff } from 'lucide-react';

interface SuperAdminGraphStatsProps {
  stats: {
    totalMembers: number;
    pendingMembers: number;
    totalEvents: number;
    pendingProjects: number;
    totalPayments: number;
    totalCertificates: number;
    pendingAdminRequests: number;
  };
}

const SuperAdminGraphStats = ({ stats }: SuperAdminGraphStatsProps) => {
  const [activeChart, setActiveChart] = useState<'monthly' | 'category' | 'trends' | 'engagement'>('monthly');

  // Sample data - in real implementation, this would come from your API
  const monthlyData = [
    { month: 'Jan', members: 45, events: 8, projects: 12, payments: 15000 },
    { month: 'Feb', members: 52, events: 12, projects: 18, payments: 18500 },
    { month: 'Mar', members: 68, events: 15, projects: 24, payments: 22000 },
    { month: 'Apr', members: 78, events: 18, projects: 28, payments: 26500 },
    { month: 'May', members: 89, events: 22, projects: 35, payments: 31000 },
    { month: 'Jun', members: 95, events: 25, projects: 42, payments: 35500 },
  ];

  const categoryData = [
    { name: 'Active Members', value: stats.totalMembers - stats.pendingMembers, color: '#22c55e' },
    { name: 'Pending Members', value: stats.pendingMembers, color: '#eab308' },
    { name: 'Events', value: stats.totalEvents, color: '#3b82f6' },
    { name: 'Projects', value: stats.pendingProjects, color: '#f97316' },
  ];

  const trendsData = [
    { week: 'Week 1', engagement: 78, satisfaction: 85, retention: 92 },
    { week: 'Week 2', engagement: 82, satisfaction: 88, retention: 89 },
    { week: 'Week 3', engagement: 85, satisfaction: 91, retention: 94 },
    { week: 'Week 4', engagement: 88, satisfaction: 89, retention: 96 },
  ];

  const engagementData = [
    { activity: 'Dashboard Views', count: 1250, growth: 12 },
    { activity: 'Project Submissions', count: 340, growth: 8 },
    { activity: 'Event Registrations', count: 580, growth: 15 },
    { activity: 'Blog Posts', count: 120, growth: 22 },
    { activity: 'Community Visits', count: 890, growth: 18 },
  ];

  const chartConfig = {
    members: { label: 'Members', color: '#22c55e' },
    events: { label: 'Events', color: '#3b82f6' },
    projects: { label: 'Projects', color: '#f97316' },
    payments: { label: 'Payments', color: '#a855f7' },
    engagement: { label: 'Engagement', color: '#22c55e' },
    satisfaction: { label: 'Satisfaction', color: '#3b82f6' },
    retention: { label: 'Retention', color: '#f97316' },
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'monthly':
        return (
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="members" fill="var(--color-members)" radius={4} />
              <Bar dataKey="events" fill="var(--color-events)" radius={4} />
              <Bar dataKey="projects" fill="var(--color-projects)" radius={4} />
            </BarChart>
          </ChartContainer>
        );
      case 'category':
        return (
          <ChartContainer config={chartConfig} className="h-80">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        );
      case 'trends':
        return (
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stackId="1" 
                stroke="var(--color-engagement)" 
                fill="var(--color-engagement)" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="satisfaction" 
                stackId="1" 
                stroke="var(--color-satisfaction)" 
                fill="var(--color-satisfaction)" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="retention" 
                stackId="1" 
                stroke="var(--color-retention)" 
                fill="var(--color-retention)" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        );
      case 'engagement':
        return (
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={engagementData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" />
              <YAxis dataKey="activity" type="category" width={120} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-members)" radius={4} />
            </BarChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-6 w-6 text-blue-600" />
                Super Admin Analytics Dashboard
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive system insights and performance metrics
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Real-time Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart Type Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeChart === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart('monthly')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Monthly Growth
            </Button>
            <Button
              variant={activeChart === 'category' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart('category')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Category Distribution
            </Button>
            <Button
              variant={activeChart === 'trends' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart('trends')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Performance Trends
            </Button>
            <Button
              variant={activeChart === 'engagement' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart('engagement')}
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              User Engagement
            </Button>
          </div>

          {/* Chart Display */}
          {renderChart()}

          {/* Chart Description */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              {activeChart === 'monthly' && (
                <p>Monthly growth metrics showing member registration, event participation, and project submissions over the last 6 months.</p>
              )}
              {activeChart === 'category' && (
                <p>Distribution breakdown of active vs pending members, total events, and project submissions.</p>
              )}
              {activeChart === 'trends' && (
                <p>Weekly performance trends including user engagement scores, satisfaction ratings, and retention metrics.</p>
              )}
              {activeChart === 'engagement' && (
                <p>User engagement metrics across different platform activities with growth percentages.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database Performance</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">98.5%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Response Time</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">120ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uptime</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">99.9%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Active Users</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weekly Active Users</span>
                <span className="font-semibold">562</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Active Users</span>
                <span className="font-semibold">1,234</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Growth</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">+12%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Event Participation</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">+18%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Project Submissions</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">+25%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminGraphStats;
