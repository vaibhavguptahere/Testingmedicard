import { authenticateToken } from '@/middleware/auth';

export async function PATCH(request, { params }) {
  const { requestId } = params;
  const body = await request.json();
  const { action } = body;
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;
    if (user.role !== 'patient') {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // In production, this would update the actual request status
    console.log(`${action}ing access request ${requestId}`);

    return Response.json({
      message: `Access request ${action}ed successfully`,
    });
  } catch (error) {
    console.error('Update access request error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}