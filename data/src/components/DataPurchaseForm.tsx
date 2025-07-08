'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

const schema = z.object({
  phone: z.string().min(11, 'Phone number must be 11 digits').max(11),
  network: z.string().min(1, 'Network is required'),
  plan: z.string().min(1, 'Data plan is required'),
});

type FormData = z.infer<typeof schema>;

const networks = [
  { id: 'mtn', name: 'MTN' },
  { id: 'glo', name: 'Glo' },
  { id: 'airtel', name: 'Airtel' },
  { id: 'etisalat', name: '9mobile' },
];

interface DataPlan {
  id: number;
  plan: string;
  amount: string;
  validity: string;
}

export const DataPurchaseForm = () => {
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedNetwork = watch('network');

  React.useEffect(() => {
    if (selectedNetwork) {
      setLoadingPlans(true);
      setApiError(null);
      
      fetch(`/api/data-plans?networkId=${selectedNetwork}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(await response.text());
          }
          return response.json();
        })
        .then((data) => {
          if (!data || data.length === 0) {
            setApiError('No data plans available');
          }
          setPlans(data);
        })
        .catch((error) => {
          console.error('Error:', error);
          setApiError(error.message || 'Failed to load plans');
        })
        .finally(() => {
          setLoadingPlans(false);
        });
    }
  }, [selectedNetwork]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setPurchaseResult(null);
    
    try {
      const response = await fetch('/api/purchase-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: data.phone,
          networkId: data.network,
          planId: data.plan,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Purchase failed');
      }

      setPurchaseResult({
        success: true,
        message: result.message || 'Purchase successful',
      });
    } catch (error: any) {
      setPurchaseResult({
        success: false,
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Data Purchase
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Phone Number"
        variant="outlined"
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />

      <FormControl fullWidth margin="normal" error={!!errors.network}>
        <InputLabel>Network</InputLabel>
        <Select
          label="Network"
          {...register('network')}
          value={watch('network') || ''}
          onChange={(e) => {
            setValue('network', e.target.value);
            setValue('plan', '');
          }}
        >
          {networks.map((network) => (
            <MenuItem key={network.id} value={network.id}>
              {network.name}
            </MenuItem>
          ))}
        </Select>
        {errors.network && (
          <Typography color="error" variant="caption">
            {errors.network.message}
          </Typography>
        )}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.plan}>
        <InputLabel>Data Plan</InputLabel>
        <Select
          label="Data Plan"
          {...register('plan')}
          value={watch('plan') || ''}
          disabled={!selectedNetwork || loadingPlans}
        >
          {loadingPlans ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
              Loading plans...
            </MenuItem>
          ) : plans.length > 0 ? (
            plans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id.toString()}>
                {plan.plan} - ₦{plan.amount} ({plan.validity})
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No plans available</MenuItem>
          )}
        </Select>
        {errors.plan && (
          <Typography color="error" variant="caption">
            {errors.plan.message}
          </Typography>
        )}
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Purchase Data'}
      </Button>

      {purchaseResult && (
        <Alert
          severity={purchaseResult.success ? 'success' : 'error'}
          sx={{ mt: 2 }}
        >
          {purchaseResult.message}
        </Alert>
      )}
    </Box>
  );
};