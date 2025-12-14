import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import trainerService from '../services/trainerService';
import MainLayout from '../components/Layout/MainLayout';
import Loader from '../components/Common/Loader';
import EmptyState from '../components/Common/EmptyState';
import Button from '../components/Common/Button';
import Message from '../components/Common/Message.jsx';
const TrainersPage = () => {
  const { loading, request } = useApi();
  const [trainers, setTrainers] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    const result = await request(() => trainerService.getAllTrainers());
    if (result?.success) {
      setTrainers(result.data.trainers || []);
    }
  };

  const handleFollow = async (trainerId) => {
    const result = await request(() => trainerService.followTrainer(trainerId));
    if (result.success) {
      loadTrainers();
      setMessage({ type: 'success', text: 'Following trainer!' });
    }
  };

  const handleUnfollow = async (trainerId) => {
    const result = await request(() => trainerService.unfollowTrainer(trainerId));
    if (result.success) {
      loadTrainers();
      setMessage({ type: 'success', text: 'Unfollowed trainer' });
    }
  };

  return (
    <MainLayout>
      <h1 className="dashboard-title" style={{marginBottom: '2rem'}}>Discover Trainers</h1>

      {message && (
        <Message 
          type={message.type} 
          text={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="trainers-grid">
        {loading && <Loader />}
        {!loading && trainers.length === 0 && (
          <EmptyState 
            icon="👥" 
            title="No Trainers Yet" 
            description="Check back soon!"
          />
        )}
        {trainers.map(trainer => (
          <div key={trainer.id} className="trainer-card">
            <div className="trainer-card-avatar">{trainer.name?.charAt(0)}</div>
            <h3 className="trainer-card-name">{trainer.name}</h3>
            <p className="trainer-card-email">{trainer.email}</p>

            <div className="trainer-card-stats">
              <div className="trainer-stat">
                <div className="trainer-stat-value">5</div>
                <div className="trainer-stat-label">Plans</div>
              </div>
              <div className="trainer-stat">
                <div className="trainer-stat-value">42</div>
                <div className="trainer-stat-label">Followers</div>
              </div>
            </div>

            {trainer.isFollowing ? (
              <Button variant="outline" fullWidth onClick={() => handleUnfollow(trainer.id)}>
                ✓ Following
              </Button>
            ) : (
              <Button fullWidth onClick={() => handleFollow(trainer.id)}>
                Follow Trainer
              </Button>
            )}
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default TrainersPage;
