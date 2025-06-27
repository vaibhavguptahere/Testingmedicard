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

    // Mock shared access data
    const sharedAccess = [
      {
        id: '1',
        doctor: {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@hospital.com',
          specialization: 'Cardiology',
        },
        accessLevel: 'read',
        status: 'active',
        grantedAt: new Date('2024-01-15'),
        expiresAt: new Date('2024-02-15'),
        recordCategories: ['lab-results', 'imaging'],
      },
      {
        id: '2',
        doctor: {
          name: 'Dr. Michael Chen',
          email: 'michael.chen@clinic.com',
          specialization: 'General Practice',
        },
        accessLevel: 'write',
        status: 'active',
        grantedAt: new Date('2024-01-10'),
        expiresAt: new Date('2024-03-10'),
        recordCategories: ['all'],
      },
    ];

    return Response.json({ sharedAccess });
  } catch (error) {
    console.error('Get shared access error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;
    if (user.role !== 'patient') {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { doctorEmail, accessLevel, expiresIn, recordCategories } = body;

    // In production, this would create actual access permissions
    console.log('Creating access permission:', { doctorEmail, accessLevel, expiresIn, recordCategories });

    return Response.json({
      message: 'Access shared successfully',
      accessId: 'new_access_' + Date.now(),
    }, { status: 201 });
  } catch (error) {
    console.error('Share access error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}