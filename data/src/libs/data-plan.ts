// import { NextApiRequest, NextApiResponse } from 'next';
// import { getDataPlans } from './vtuApi';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { networkId } = req.query;

//   if (typeof networkId !== 'string') {
//     return res.status(400).json({ error: 'Invalid network ID' });
//   }

//   try {
//     const plans = await getDataPlans(networkId);
//     res.status(200).json(plans);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// }