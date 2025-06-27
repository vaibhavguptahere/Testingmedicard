import { authenticateToken } from '@/middleware/auth';
import MedicalRecord from '@/models/MedicalRecord';
import AccessLog from '@/models/AccessLog';

export async function GET(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;

    if (user.role !== 'patient') {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // Mock data for demo - in production, these would be real database queries
    const stats = {
      totalRecords: 15,
      sharedDoctors: 3,
      recentActivity: 8,
      storageUsed: 65,
    };

    return Response.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}