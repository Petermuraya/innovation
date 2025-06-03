'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState } from 'react';
import AdminStatCard from './AdminStatCard';

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboardStats = ({ stats }: AdminDashboardStatsProps) => {
  const [showAll, setShowAll] = useState(false);

  const chartData = {
    labels: [
      'Members',
      'Pending Members',
      'Events',
      'Pending Projects',
      'Payments',
      'Certificates',
      'Admin Requests',
    ],
    datasets: [
      {
        label: 'Dashboard Stats',
        data: [
          stats.totalMembers,
          stats.pendingMembers,
          stats.totalEvents,
          stats.pendingProjects,
          stats.totalPayments,
          stats.totalCertificates,
          stats.pendingAdminRequests,
        ],
        backgroundColor: '#10B981', // green-500
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Dashboard Overview',
        color: '#10B981',
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        ticks: { color: '#374151' },
      },
      x: {
        ticks: { color: '#374151' },
      },
    },
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard title="Total Members" value={stats.totalMembers} />
        <AdminStatCard title="Pending Members" value={stats.pendingMembers} />
        <AdminStatCard title="Events" value={stats.totalEvents} />
        <AdminStatCard title="Payments" value={stats.totalPayments} />

        {showAll && (
          <>
            <AdminStatCard title="Projects Pending" value={stats.pendingProjects} />
            <AdminStatCard title="Certificates" value={stats.totalCertificates} />
            <AdminStatCard
              title="Admin Requests"
              value={stats.pendingAdminRequests}
              highlight={stats.pendingAdminRequests > 0}
            />
          </>
        )}
      </div>

      {/* View More / View Less Toggle */}
      <div className="text-right">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-green-600 font-medium hover:underline"
        >
          {showAll ? 'View Less' : 'View More'}
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminDashboardStats;
