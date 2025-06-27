import { authenticateToken } from '@/middleware/auth';

export async function DELETE(request, { params }) {

  const { accessId } = params;
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;
    if (user.role !== 'patient') {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // In production, this would revoke actual access permissions
    console.log(`Revoking access ${accessId}`);

    return Response.json({
      message: 'Access revoked successfully',
    });
  } catch (error) {
    console.error('Revoke access error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}