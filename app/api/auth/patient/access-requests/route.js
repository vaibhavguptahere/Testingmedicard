import { authenticateToken } from '@/middleware/auth';

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

    // Mock access requests
    const requests = [
      {
        id: '1',
        doctor: {
          name: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@hospital.com',
          specialization: 'Dermatology',
        },
        requestedAt: new Date('2024-01-20'),
        reason: 'Follow-up consultation for skin condition',
        accessLevel: 'read',
        recordCategories: ['imaging', 'consultation'],
        status: 'pending',
      },
    ];

    return Response.json({ requests });
  } catch (error) {
    console.error('Get access requests error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}