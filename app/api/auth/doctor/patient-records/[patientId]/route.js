import { authenticateToken } from '@/middleware/auth';
import MedicalRecord from '@/models/MedicalRecord';
import AccessLog from '@/models/AccessLog';
import connectDB from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;
    if (user.role !== 'doctor') {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    const { patientId } = params;

    await connectDB();

    // Check if doctor has access to this patient's records
    const records = await MedicalRecord.find({
      patientId,
      'accessPermissions.doctorId': user._id,
      'accessPermissions.granted': true,
    }).sort({ createdAt: -1 });

    if (records.length === 0) {
      return Response.json({ error: 'No access to patient records' }, { status: 403 });
    }

    // Log the access
    const accessLog = new AccessLog({
      patientId,
      accessorId: user._id,
      accessType: 'view',
      accessReason: 'Doctor accessing patient records',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    await accessLog.save();

    return Response.json({ records });
  } catch (error) {
    console.error('Get patient records error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}