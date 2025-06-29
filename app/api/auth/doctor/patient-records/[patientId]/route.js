import { authenticateToken } from '@/middleware/auth';
import MedicalRecord from '@/models/MedicalRecord';
import AccessLog from '@/models/AccessLog';
import User from '@/models/User';
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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;

    await connectDB();

    // Verify doctor has access to this patient's records
    const query = {
      patientId,
      'accessPermissions.doctorId': user._id,
      'accessPermissions.granted': true,
    };

    // Add category filter if specified
    if (category && category !== 'all') {
      query.category = category;
    }

    // Check if doctor has valid access
    const accessCheck = await MedicalRecord.findOne({
      patientId,
      'accessPermissions.doctorId': user._id,
      'accessPermissions.granted': true,
    });

    if (!accessCheck) {
      return Response.json({ error: 'No access to patient records' }, { status: 403 });
    }

    // Verify access hasn't expired
    const doctorPermission = accessCheck.accessPermissions.find(
      perm => perm.doctorId.toString() === user._id.toString() && perm.granted
    );

    if (doctorPermission?.expiresAt && new Date(doctorPermission.expiresAt) < new Date()) {
      return Response.json({ error: 'Access has expired' }, { status: 403 });
    }

    // Get patient information
    const patient = await User.findById(patientId).select('profile email');
    if (!patient) {
      return Response.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Get records with pagination
    const records = await MedicalRecord.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('metadata.doctorId', 'profile.firstName profile.lastName profile.specialization');

    const total = await MedicalRecord.countDocuments(query);

    // Log the access
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const accessLog = new AccessLog({
      patientId,
      accessorId: user._id,
      accessType: 'view',
      accessReason: 'Doctor accessing patient records',
      ipAddress: clientIp,
      userAgent: userAgent,
    });

    await accessLog.save();

    return Response.json({
      patient: {
        id: patient._id,
        profile: patient.profile,
        email: patient.email,
        accessLevel: doctorPermission?.accessLevel || 'read',
        accessGrantedAt: doctorPermission?.grantedAt,
        accessExpiresAt: doctorPermission?.expiresAt,
      },
      records,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get patient records error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}