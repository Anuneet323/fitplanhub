import { useState, useCallback } from 'react';
import planService from '../services/planService';
import { useApi } from './useApi';

export const usePlans = () => {
  const { loading, error, request } = useApi();
  const [plans, setPlans] = useState([]);

  const getAllPlans = useCallback(async () => {
    const result = await request(() => planService.getAllPlans());
    if (result?.success) {
      setPlans(result.data.plans || []);
    }
    return result;
  }, [request]);

  const getPlanById = useCallback(
    async (planId) => {
      const result = await request(() => planService.getPlanById(planId));
      return result;
    },
    [request]
  );

  const createPlan = useCallback(
    async (planData) => {
      const result = await request(() => planService.createPlan(planData));
      if (result?.success) {
        setPlans((prev) => [...prev, result.data.plan]);
      }
      return result;
    },
    [request]
  );

  const updatePlan = useCallback(
    async (planId, planData) => {
      const result = await request(() => planService.updatePlan(planId, planData));
      if (result?.success) {
        setPlans((prev) =>
          prev.map((p) => (p._id === planId ? result.data.plan : p))
        );
      }
      return result;
    },
    [request]
  );

  const deletePlan = useCallback(
    async (planId) => {
      const result = await request(() => planService.deletePlan(planId));
      if (result?.success) {
        setPlans((prev) => prev.filter((p) => p._id !== planId));
      }
      return result;
    },
    [request]
  );

  const subscribePlan = useCallback(
    async (planId) => {
      const result = await request(() => planService.subscribePlan(planId));
      return result;
    },
    [request]
  );

  return {
    plans,
    loading,
    error,
    getAllPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    subscribePlan,
  };
};
