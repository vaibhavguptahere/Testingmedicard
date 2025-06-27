import { authenticateToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;

    // Mock notifications based on user role
    let notifications = [];

    if (user.role === 'patient') {
      notifications = [
        {
          id: '1',
          type: 'access_request',
          title: 'New Access Request',
          message: 'Dr. Emily Rodriguez has requested access to your medical records',
          timestamp: new Date('2024-01-20T10:30:00'),
          read: false,
          data: {
            doctorName: 'Dr. Emily Rodriguez',
            requestId: '1',
          },
        },
        {
          id: '2',
          type: 'record_accessed',
          title: 'Record Accessed',
          message: 'Dr. Sarah Johnson accessed your lab results',
          timestamp: new Date('2024-01-19T14:15:00'),
          read: true,
          data: {
            doctorName: 'Dr. Sarah Johnson',
            recordType: 'Lab Results',
          },
        },
      ];
    } else if (user.role === 'doctor') {
      notifications = [
        {
          id: '1',
          type: 'access_granted',
          title: 'Access Granted',
          message: 'John Smith has granted you access to their medical records',
          timestamp: new Date('2024-01-20T09:00:00'),
          read: false,
          data: {
            patientName: 'John Smith',
            accessLevel: 'read',
          },
        },
      ];
    }

    return Response.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { notificationId, action } = body;

    // In production, this would update notification status
    console.log(`Marking notification ${notificationId} as ${action}`);

    return Response.json({
      message: 'Notification updated successfully',
    });
  } catch (error) {
    console.error('Update notification error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}