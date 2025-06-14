
'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FolderOpen, 
  CreditCard, 
  Award, 
  UserPlus,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardStatsProps {
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboardStats = ({ stats }: AdminDashboardStatsProps) => {
  const [showAll, setShowAll] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'doughnut'>('bar');

  const primaryStats = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'bg-kic-green-500',
      textColor: 'text-kic-green-700',
      bgColor: 'bg-kic-green-50',
      borderColor: 'border-kic-green-200'
    },
    {
      title: 'Pending Members',
      value: stats.pendingMembers,
      icon: UserCheck,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      alert: stats.pendingMembers > 0
    },
    {
      title: 'Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Payments',
      value: stats.totalPayments,
      icon: CreditCard,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const secondaryStats = [
    {
      title: 'Pending Projects',
      value: stats.pendingProjects,
      icon: FolderOpen,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      alert: stats.pendingProjects > 0
    },
    {
      title: 'Certificates',
      value: stats.totalCertificates,
      icon: Award,
      color: 'bg-kic-gold',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Admin Requests',
      value: stats.pendingAdminRequests,
      icon: UserPlus,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      alert: stats.pendingAdminRequests > 0
    }
  ];

  const allStats = [...primaryStats, ...secondaryStats];
  const displayStats = showAll ? allStats : primaryStats;

  const chartData = {
    labels: allStats.map(stat => stat.title),
    datasets: [
      {
        label: 'Count',
        data: allStats.map(stat => stat.value),
        backgroundColor: [
          '#22c55e', // kic-green-500
          '#eab308', // yellow-500
          '#3b82f6', // blue-500
          '#a855f7', // purple-500
          '#f97316', // orange-500
          '#b28d49', // kic-gold
          '#ef4444', // red-500
        ],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['Active Members', 'Pending Members', 'Events', 'Projects'],
    datasets: [
      {
        data: [
          stats.totalMembers - stats.pendingMembers,
          stats.pendingMembers,
          stats.totalEvents,
          stats.pendingProjects
        ],
        backgroundColor: ['#22c55e', '#eab308', '#3b82f6', '#f97316'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: chartType === 'doughnut',
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Dashboard Overview',
        color: '#22c55e',
        font: { size: 16, weight: 'bold' },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#22c55e',
        borderWidth: 1,
      }
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        ticks: { 
          color: '#374151',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: { 
          color: '#374151',
          font: { size: 11 },
          maxRotation: 45
        },
        grid: {
          display: false
        }
      },
    } : {},
  };

  const StatCard = ({ stat }: { stat: typeof primaryStats[0] }) => (
    <Card className={`
      hover:shadow-lg transition-all duration-300 hover:-translate-y-1 
      ${stat.bgColor} ${stat.borderColor} border-2 relative overflow-hidden
    `}>
      {stat.alert && (
        <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-pulse text-xs px-1 py-0.5">
          Action Needed
        </Badge>
      )}
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={`text-xs sm:text-sm font-medium ${stat.textColor}`}>
              {stat.title}
            </p>
            <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
              {stat.value.toLocaleString()}
            </p>
          </div>
          <div className={`p-3 rounded-full ${stat.color} bg-opacity-20`}>
            <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color.replace('bg-', 'text-')}`} />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-green-600" />
          <span className="text-xs text-green-600 font-medium">
            {stat.value > 0 ? 'Active' : 'No data'}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayStats.map((stat, index) => (
          <div key={stat.title} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowAll(!showAll)}
          variant="outline"
          className="hover:bg-kic-green-50 hover:border-kic-green-500 hover:text-kic-green-700 transition-colors"
        >
          {showAll ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showAll ? 'Show Less Stats' : 'Show All Stats'}
        </Button>
      </div>

      {/* Enhanced Chart Section */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl font-bold text-kic-gray">
              Analytics Overview
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="text-xs"
              >
                Bar Chart
              </Button>
              <Button
                variant={chartType === 'doughnut' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('doughnut')}
                className="text-xs"
              >
                Doughnut
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80 w-full">
            {chartType === 'bar' ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Doughnut data={doughnutData} options={chartOptions} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardStats;
