import { authenticateToken } from '@/middleware/auth';
import MedicalRecord from '@/models/MedicalRecord';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function GET(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;
    if (user.role !== 'doctor') {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    await connectDB();

    // Get patients who have granted access to this doctor
    const records = await MedicalRecord.find({
      'accessPermissions.doctorId': user._id,
      'accessPermissions.granted': true,
    }).populate('patientId', 'profile.firstName profile.lastName profile.phone profile.dateOfBirth');

    // Extract unique patients
    const patientsMap = new Map();
    records.forEach(record => {
      if (record.patientId) {
        const patientId = record.patientId._id.toString();
        if (!patientsMap.has(patientId)) {
          patientsMap.set(patientId, {
            id: record.patientId._id,
            profile: record.patientId.profile,
            recordCount: 0,
            lastAccess: null,
          });
        }
        patientsMap.get(patientId).recordCount++;
      }
    });

    const patients = Array.from(patientsMap.values());

    return Response.json({ patients });
  } catch (error) {
    console.error('Get patients error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}