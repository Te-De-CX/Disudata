import axios, { AxiosError } from 'axios';

interface DataPlan {
  id: number;
  plan: string;
  amount: string;
  validity: string;
}

interface ApiResponse<T> {
  status: 'success' | 'failed';
  message: string;
  data?: T;
}

const vtuApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VTU_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeader = () => {
  const username = process.env.NEXT_PUBLIC_VTU_API_USERNAME;
  const password = process.env.NEXT_PUBLIC_VTU_API_PASSWORD;
  
  if (!username || !password) {
    throw new Error('VTU API credentials not configured');
  }

  const token = Buffer.from(`${username}:${password}`).toString('base64');
  return { Authorization: `Basic ${token}` };
};

export const getDataPlans = async (networkId: string): Promise<DataPlan[]> => {
  try {
    const response = await vtuApi.get<ApiResponse<DataPlan[]>>('/data', {
      params: { network_id: networkId },
      headers: getAuthHeader(),
    });

    if (!response.data.data) {
      throw new Error('No data plans available');
    }

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    console.error('VTU API Error:', {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
    });
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch data plans');
  }
};

export const purchaseData = async (
  phone: string,
  networkId: string,
  planId: string
): Promise<ApiResponse<{ reference: string }>> => {
  try {
    const response = await vtuApi.get<ApiResponse<{ reference: string }>>('/data', {
      params: {
        phone,
        network_id: networkId,
        plan_id: planId,
      },
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    console.error('Purchase Error:', axiosError.response?.data);
    throw new Error(axiosError.response?.data?.message || 'Purchase failed');
  }
};