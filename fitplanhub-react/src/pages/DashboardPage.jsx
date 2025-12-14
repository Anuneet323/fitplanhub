import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import planService from '../services/planService';
import MainLayout from '../components/Layout/MainLayout';
import Button from '../components/Common/Button';
import Loader from '../components/Common/Loader';
import EmptyState from '../components/Common/EmptyState';
import Message from '../components/Common/Message';
import Modal from '../components/Common/Modal';

const DashboardPage = () => {
  const { user } = useAuth();
  const { loading, request } = useApi();
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: ''
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const result = await request(() => planService.getAllPlans());
    if (result?.success) {
      const trainerPlans = result.data.plans.filter(p => p.trainer._id === user._id);
      setPlans(trainerPlans);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const planData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };

    let result;
    if (editingPlan) {
      result = await request(() => planService.updatePlan(editingPlan._id, planData));
    } else {
      result = await request(() => planService.createPlan(planData));
    }

    if (result.success) {
      setMessage({ type: 'success', text: editingPlan ? 'Plan updated!' : 'Plan created!' });
      setShowModal(false);
      setFormData({ title: '', description: '', price: '', duration: '' });
      setEditingPlan(null);
      loadPlans();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save plan' });
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Delete this plan?')) return;
    
    const result = await request(() => planService.deletePlan(planId));
    if (result.success) {
      setMessage({ type: 'success', text: 'Plan deleted!' });
      loadPlans();
    }
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({ title: '', description: '', price: '', duration: '' });
  };

  return (
    <MainLayout>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Trainer Dashboard</h1>
        <Button onClick={() => setShowModal(true)}>+ Create New Plan</Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Plans</div>
          <div className="stat-value">{plans.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Subscribers</div>
          <div className="stat-value">{Math.max(0, plans.length * 2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Followers</div>
          <div className="stat-value">{Math.max(0, plans.length * 3)}</div>
        </div>
      </div>

      <h2 className="plans-section-title">Your Fitness Plans</h2>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="4"><Loader /></td>
              </tr>
            )}
            {!loading && plans.length === 0 && (
              <tr>
                <td colSpan="4">
                  <EmptyState 
                    icon="📋" 
                    title="No Plans" 
                    description="Create your first plan!"
                  />
                </td>
              </tr>
            )}
            {plans.map(plan => (
              <tr key={plan._id}>
                <td><strong>{plan.title}</strong></td>
                <td>{plan.duration} days</td>
                <td>${plan.price}</td>
                <td>
                  <div className="action-buttons">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(plan)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(plan._id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} title={editingPlan ? 'Edit Plan' : 'Create New Plan'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Plan Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g., Fat Loss Beginner Plan"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Describe your fitness plan..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                name="price"
                className="form-input"
                placeholder="99"
                value={formData.price}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <input
                type="number"
                name="duration"
                className="form-input"
                placeholder="30"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={loading}>Save Plan</Button>
          </div>
        </form>
      </Modal>

      {message && (
        <Message 
          type={message.type} 
          text={message.text}
          onClose={() => setMessage(null)}
        />
      )}
    </MainLayout>
  );
};

export default DashboardPage;
