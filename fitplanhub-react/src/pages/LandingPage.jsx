import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import planService from '../services/planService';
import MainLayout from '../components/Layout/MainLayout';
import Loader from '../components/Common/Loader';
import EmptyState from '../components/Common/EmptyState';
import Button from '../components/Common/Button';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading, error, request } = useApi();
  const [plans, setPlans] = useState([]);

  const loadPlans = useCallback(async () => {
    const result = await request(() => planService.getAllPlans());
    if (result?.success) {
      setPlans(result.data.plans || []);
    }
  }, [request]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return (
    <MainLayout>
      <div className="landing-hero">
        <h1 className="hero-title">Welcome to FitPlanHub</h1>
        <p className="hero-subtitle">Get personalized fitness plans from certified trainers</p>
        <div className="hero-buttons">
          <Button variant="primary" onClick={() => navigate('/login')}>
            Get Started
          </Button>
          <Button variant="secondary" onClick={() => window.scrollTo(0, 500)}>
            Browse Plans
          </Button>
        </div>
      </div>

      <h2 className="plans-section-title">Featured Fitness Plans</h2>

      <div className="plans-grid">
        {loading && <Loader />}
        {error && <EmptyState icon="⚠️" title="Error" description={error} />}
        {!loading && plans.length === 0 && (
          <EmptyState
            icon="📋"
            title="No Plans Available"
            description="No fitness plans exist yet. Create one as a trainer or check back later!"
          />
        )}
        {plans.map((plan) => (
          <div key={plan._id} className="plan-card">
            <div className="plan-header">
              <h3 className="plan-title">{plan.title}</h3>
              <span className="plan-badge">Popular</span>
            </div>
            <div className="plan-trainer">
              <div className="trainer-avatar-sm">{plan.trainer?.name?.charAt(0)}</div>
              <div>
                <div className="trainer-name-sm">{plan.trainer?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Certified Trainer</div>
              </div>
            </div>
            <p className="plan-description">{plan.description}</p>
            <div className="plan-meta">
              <div className="meta-item">
                <div className="meta-value">{plan.duration}</div>
                <div className="meta-label">Days Program</div>
              </div>
              <div className="meta-item">
                <div className="meta-value">⭐ 4.8</div>
                <div className="meta-label">Rating</div>
              </div>
            </div>
            <div className="plan-footer">
              <div>
                <div className="plan-price">${plan.price}</div>
                <div className="plan-price-label">one-time</div>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  user ? navigate(`/plan/${plan._id}`) : navigate('/login')
                }
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default LandingPage;
