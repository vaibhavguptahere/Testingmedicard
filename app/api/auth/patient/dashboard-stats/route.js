import { authenticateToken } from '@/middleware/auth';
import MedicalRecord from '@/models/MedicalRecord';
import AccessLog from '@/models/AccessLog';
import AccessRequest from '@/models/AccessRequest';
import connectDB from '@/lib/mongodb';

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

    await connectDB();

    // Get total records count
    const totalRecords = await MedicalRecord.countDocuments({ patientId: user._id });

    // Get shared doctors count (unique doctors with active access)
    const sharedDoctors = await MedicalRecord.aggregate([
      { $match: { patientId: user._id } },
      { $unwind: '$accessPermissions' },
      { $match: { 'accessPermissions.granted': true } },
      { $group: { _id: '$accessPermissions.doctorId' } },
      { $count: 'count' }
    ]);

    // Get recent activity count (last 7 days)
    const recentActivity = await AccessLog.countDocuments({
      patientId: user._id,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Calculate storage used (simplified calculation)
    const records = await MedicalRecord.find({ patientId: user._id });
    let totalSize = 0;
    records.forEach(record => {
      if (record.files) {
        record.files.forEach(file => {
          totalSize += file.size || 0;
        });
      }
    });

    // Convert to percentage (assuming 1GB limit)
    const storageUsed = Math.min(Math.round((totalSize / (1024 * 1024 * 1024)) * 100), 100);

    const stats = {
      totalRecords,
      sharedDoctors: sharedDoctors[0]?.count || 0,
      recentActivity,
      storageUsed,
    };

    return Response.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}