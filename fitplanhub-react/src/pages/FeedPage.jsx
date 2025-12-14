import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import trainerService from '../services/trainerService';
import MainLayout from '../components/Layout/MainLayout';
import Loader from '../components/Common/Loader';
import EmptyState from '../components/Common/EmptyState';
import Button from '../components/Common/Button';

const FeedPage = () => {
  const navigate = useNavigate();
  const { loading, request } = useApi();
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    const result = await request(() => trainerService.getFeed());
    if (result?.success) {
      setFeed(result.data.feed || []);
    }
  };

  return (
    <MainLayout>
      <h1 className="dashboard-title" style={{marginBottom: '2rem'}}>Your Personalized Feed</h1>

      <div className="feed-container">
        {loading && <Loader />}
        {!loading && feed.length === 0 && (
          <EmptyState 
            icon="📭" 
            title="Your Feed is Empty" 
            description="Follow some trainers to see their latest plans"
            action={<Button onClick={() => navigate('/trainers')}>Discover Trainers</Button>}
          />
        )}
        {feed.map(item => (
          <div key={item._id} className="feed-item">
            <div className="feed-item-header">
              <h3 className="feed-item-title">{item.title}</h3>
              <span className={`feed-status-badge ${item.isPurchased ? 'badge-purchased' : 'badge-not-purchased'}`}>
                {item.isPurchased ? '✓ Purchased' : 'Not Purchased'}
              </span>
            </div>

            <div className="feed-item-trainer">
              <div className="feed-trainer-avatar">{item.trainer?.name?.charAt(0)}</div>
              <div className="feed-trainer-info">
                <div className="feed-trainer-name">{item.trainer?.name}</div>
                <div className="feed-trainer-role">Certified Trainer</div>
              </div>
            </div>

            <p className="feed-item-description">{item.description}</p>

            <div className="feed-item-meta">
              <div className="feed-meta-item">
                <div className="feed-meta-value">{item.duration}</div>
                <div className="feed-meta-label">Days</div>
              </div>
              <div className="feed-meta-item">
                <div className="feed-meta-value">${item.price}</div>
                <div className="feed-meta-label">Price</div>
              </div>
            </div>

            <div className="feed-item-actions">
              <Button onClick={() => navigate(`/plan/${item._id}`)}>
                {item.isPurchased ? 'View Full Plan' : 'Subscribe'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default FeedPage;
