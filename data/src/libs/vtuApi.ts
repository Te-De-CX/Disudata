// libs/vtuApi.ts
import axios, { AxiosError, AxiosResponse } from 'axios';

// Type definitions
export interface DataPlan {
  id: number;
  plan: string;
  amount: string;
  validity: string;
}

export interface PurchaseResponse {
  status: 'success' | 'failed';
  message: string;
  data?: {
    reference: string;
    amount: string;
  };
}

export interface VTUErrorResponse {
  code: string;
  message: string;
  data: null;
  additional_errors?: Array<{
    code: string;
    message: string;
    data: null;
  }>;
}

// Create axios instance with proper types
const vtuApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VTU_API_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_VTU_API_USERNAME || '',
    password: process.env.NEXT_PUBLIC_VTU_API_PASSWORD || '',
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response data type for data plans
interface DataPlansResponse {
  data: DataPlan[];
}

// Enhanced getDataPlans with proper error handling
export const getDataPlans = async (networkId: string): Promise<DataPlan[]> => {
  try {
    const response: AxiosResponse<DataPlansResponse> = await vtuApi.get('/data', {
      params: {
        network_id: networkId,
      },
    });

    if (!response.data?.data) {
      throw new Error('Invalid data structure from API');
    }

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<VTUErrorResponse>;
    
    console.error('VTU API Error:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      config: axiosError.config,
    });

    throw new Error(
      axiosError.response?.data?.message || 
      'Failed to fetch data plans. Please try again.'
    );
  }
};

// Enhanced purchaseData with proper typing
export const purchaseData = async (
  phone: string,
  networkId: string,
  planId: string
): Promise<PurchaseResponse> => {
  try {
    const response: AxiosResponse<PurchaseResponse> = await vtuApi.get('/data', {
      params: {
        phone,
        network_id: networkId,
        plan_id: planId,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<VTUErrorResponse>;
    
    console.error('Purchase Error:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    });

    throw new Error(
      axiosError.response?.data?.message ||
      'Failed to complete purchase. Please try again.'
    );
  }
};

export default vtuApi;