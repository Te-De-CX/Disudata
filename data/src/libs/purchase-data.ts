import { NextApiRequest, NextApiResponse } from 'next';
import { purchaseData } from './vtuApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, networkId, planId } = req.body;

  if (!phone || !networkId || !planId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const result = await purchaseData(phone, networkId, planId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}