import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import planService from '../services/planService';
import MainLayout from '../components/Layout/MainLayout';
import Button from '../components/Common/Button';
import Loader from '../components/Common/Loader';
import Message from '../components/Common/Message';
import Modal from '../components/Common/Modal';

const PlanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, request } = useApi();
  const [plan, setPlan] = useState(null);
  const [message, setMessage] = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    const result = await request(() => planService.getPlanById(id));
    if (result?.success) {
      setPlan(result.data.plan);
    }
  };

  const handleSubscribe = async () => {
    const result = await request(() => planService.subscribePlan(id));
    if (result.success) {
      setMessage({ type: 'success', text: 'Subscribed successfully!' });
      setShowSubscribeModal(false);
      setTimeout(() => navigate('/feed'), 1500);
    } else {
      setMessage({ type: 'error', text: 'Subscription failed' });
    }
  };

  if (loading && !plan) return <MainLayout><Loader /></MainLayout>;

  if (!plan) return <MainLayout><div>Plan not found</div></MainLayout>;

  const isSubscribed = user?.subscriptions?.some(s => s.plan === plan._id);

  return (
    <MainLayout>
      <Button variant="outline" size="sm" onClick={() => navigate('/')} style={{marginBottom: '2rem'}}>
        ← Back
      </Button>

      {message && (
        <Message 
          type={message.type} 
          text={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="plan-details-header">
        <h1 className="plan-details-title">{plan.title}</h1>
        <div className="plan-details-trainer">
          <div className="plan-details-trainer-avatar">{plan.trainer?.name?.charAt(0)}</div>
          <div>
            <div className="plan-details-trainer-name">{plan.trainer?.name}</div>
            <div style={{fontSize: '0.9rem', opacity: 0.9}}>Certified Fitness Trainer</div>
          </div>
        </div>
      </div>

      <div className="plan-details-content">
        <div className="plan-details-main">
          <div className="details-section">
            <h3 className="details-section-title">About This Plan</h3>
            <p className="details-section-content">{plan.description}</p>
          </div>

          <div className="details-section">
            <h3 className="details-section-title">What You'll Get</h3>
            <ul className="sidebar-features">
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>{plan.duration}-day comprehensive workout program</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Personalized daily exercise routines</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Nutrition and meal planning guidance</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Progress tracking and achievements</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="plan-details-sidebar">
          <div className="sidebar-price">${plan.price}</div>
          <div className="sidebar-price-label">One-time payment</div>

          {isSubscribed ? (
            <div style={{background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#065f46'}}>
              ✓ You own this plan and have full access
            </div>
          ) : (
            <Button fullWidth onClick={() => setShowSubscribeModal(true)}>
              Subscribe Now - ${plan.price}
            </Button>
          )}
        </div>
      </div>

      <Modal 
        isOpen={showSubscribeModal} 
        onClose={() => setShowSubscribeModal(false)}
        title="Confirm Subscription"
      >
        <div style={{marginBottom: '2rem'}}>
          <p style={{color: 'var(--gray)', marginBottom: '1rem'}}>You are about to subscribe to:</p>
          <div style={{background: 'var(--light)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
            <h3 style={{marginBottom: '0.5rem'}}>{plan.title}</h3>
            <p style={{fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '700'}}>${plan.price}</p>
          </div>
          <p style={{color: 'var(--gray)', fontSize: '0.9rem'}}>Payment is simulated for demo purposes.</p>
        </div>

        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <Button variant="outline" onClick={() => setShowSubscribeModal(false)}>Cancel</Button>
          <Button loading={loading} onClick={handleSubscribe}>Proceed to Payment</Button>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default PlanDetailsPage;
