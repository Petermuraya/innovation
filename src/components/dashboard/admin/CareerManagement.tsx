
import { useState } from 'react';
import CareerOpportunityForm from '@/components/careers/CareerOpportunityForm';
import { useCareerManagement } from './hooks/useCareerManagement';
import CareerManagementHeader from './components/CareerManagementHeader';
import CareerOpportunityCard from './components/CareerOpportunityCard';
import CareerOpportunitiesEmptyState from './components/CareerOpportunitiesEmptyState';

const CareerManagement = () => {
  const { 
    opportunities, 
    loading, 
    fetchOpportunities, 
    handleDeleteOpportunity, 
    handleStatusToggle 
  } = useCareerManagement();
  
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<any>(null);

  const handlePostNew = () => {
    setShowForm(true);
  };

  const handleEdit = (opportunity: any) => {
    setEditingOpportunity(opportunity);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOpportunity(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOpportunity(null);
    fetchOpportunities();
  };

  if (loading) {
    return <div>Loading career opportunities...</div>;
  }

  return (
    <div className="space-y-6">
      <CareerManagementHeader onPostNew={handlePostNew} />

      <div className="grid gap-4">
        {opportunities.map((opportunity) => (
          <CareerOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onEdit={handleEdit}
            onDelete={handleDeleteOpportunity}
            onStatusToggle={handleStatusToggle}
          />
        ))}

        {opportunities.length === 0 && <CareerOpportunitiesEmptyState />}
      </div>

      {/* Career Opportunity Form Modal */}
      {(showForm || editingOpportunity) && (
        <CareerOpportunityForm
          opportunity={editingOpportunity}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default CareerManagement;
