
import { useState, useMemo } from 'react';
import { Member, MemberStats } from '../types/members';

export const useMemberManagement = (members: Member[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Sort members by most recent first
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [members]);

  // Filter and search logic
  const filteredMembers = useMemo(() => {
    return sortedMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (member.phone && member.phone.includes(searchTerm));
      
      const matchesStatus = statusFilter === 'all' || member.registration_status === statusFilter;
      const matchesCourse = courseFilter === 'all' || member.course === courseFilter;
      
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [sortedMembers, searchTerm, statusFilter, courseFilter]);

  // Get unique courses for filter
  const courses = useMemo(() => {
    const uniqueCourses = Array.from(new Set(members.map(m => m.course).filter(Boolean)));
    return uniqueCourses;
  }, [members]);

  // Statistics
  const stats: MemberStats = useMemo(() => {
    const total = members.length;
    const pending = members.filter(m => m.registration_status === 'pending').length;
    const approved = members.filter(m => m.registration_status === 'approved').length;
    const rejected = members.filter(m => m.registration_status === 'rejected').length;
    const recent = members.filter(m => {
      const daysDiff = (new Date().getTime() - new Date(m.created_at).getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 7;
    }).length;
    
    return { total, pending, approved, rejected, recent };
  }, [members]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    courseFilter,
    setCourseFilter,
    selectedMember,
    setSelectedMember,
    filteredMembers,
    courses,
    stats
  };
};
