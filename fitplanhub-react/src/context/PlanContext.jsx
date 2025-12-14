import React, { createContext, useState, useCallback } from 'react';
import planService from '../services/planService';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await planService.getAllPlans();
      if (result.success) {
        setPlans(result.data.plans || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PlanContext.Provider value={{ plans, loading, error, loadPlans }}>
      {children}
    </PlanContext.Provider>
  );
};
