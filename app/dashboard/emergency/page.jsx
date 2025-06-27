'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  QrCode, 
  Scan, 
  Activity, 
  Clock, 
  AlertTriangle,
  User,
  FileText,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

export default function EmergencyDashboard() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentAccess, setRecentAccess] = useState([]);
  const [stats, setStats] = useState({
    totalAccess: 0,
    todayAccess: 0,
    activeEmergencies: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Mock data for emergency dashboard
    setStats({
      totalAccess: 47,
      todayAccess: 3,
      activeEmergencies: 1,
    });

    setRecentAccess([
      {
        id: '1',
        patientName: 'John Smith',
        accessTime: new Date('2024-01-20T14:30:00'),
        location: 'Emergency Room',
        status: 'completed',
      },
      {
        id: '2',
        patientName: 'Sarah Johnson',
        accessTime: new Date('2024-01-20T12:15:00'),
        location: 'Ambulance Unit 5',
        status: 'active',
      },
    ]);
  };

  const handleQRScan = async (e) => {
    e.preventDefault();
    if (!qrCode.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/emergency/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrToken: qrCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to access patient data');
      }

      setPatientData(data.patient);
      toast.success('Patient data accessed successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Emergency Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            {user?.profile?.department} • Badge #{user?.profile?.badgeNumber}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-red-600 border-red-600">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Emergency Access
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Access Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAccess}</div>
            <p className="text-xs text-muted-foreground">
              Emergency records accessed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Emergencies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.activeEmergencies}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Access</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAccess}</div>
            <p className="text-xs text-muted-foreground">
              All time emergency access
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scan className="mr-2 h-5 w-5 text-red-600" />
              Emergency QR Scanner
            </CardTitle>
            <CardDescription>
              Scan patient QR code for immediate medical access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQRScan} className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="Scan or enter emergency QR code"
                  className="font-mono"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Scan className="mr-2 h-4 w-4 animate-pulse" />
                    Accessing Patient Data...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-4 w-4" />
                    Access Emergency Data
                  </>
                )}
              </Button>
            </form>

            {patientData && (
              <div className="mt-6 space-y-4">
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <AlertTriangle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Emergency access granted. All access is logged for security.
                  </AlertDescription>
                </Alert>

                {/* Patient Basic Info */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p>{patientData.profile.firstName} {patientData.profile.lastName}</p>
                    </div>
                    <div>
                      <span className="font-medium">DOB:</span>
                      <p>{patientData.profile.dateOfBirth ? 
                        new Date(patientData.profile.dateOfBirth).toLocaleDateString() : 
                        'Not provided'
                      }</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {patientData.profile.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {patientData.profile.address || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {patientData.profile.emergencyContact && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Emergency Contact
                    </h3>
                    <div className="text-sm">
                      <p><span className="font-medium">Name:</span> {patientData.profile.emergencyContact.name}</p>
                      <p><span className="font-medium">Phone:</span> {patientData.profile.emergencyContact.phone}</p>
                      <p><span className="font-medium">Relationship:</span> {patientData.profile.emergencyContact.relationship}</p>
                    </div>
                  </div>
                )}

                {/* Medical Records */}
                {patientData.emergencyRecords && patientData.emergencyRecords.length > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      Critical Medical Information
                    </h3>
                    <div className="space-y-2">
                      {patientData.emergencyRecords.map((record, index) => (
                        <div key={index} className="text-sm border-l-2 border-green-400 pl-3">
                          <p className="font-medium">{record.title}</p>
                          <p className="text-gray-600 dark:text-gray-400">{record.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Emergency Access
            </CardTitle>
            <CardDescription>
              Recent patient data access logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAccess.length > 0 ? (
              <div className="space-y-4">
                {recentAccess.map((access) => (
                  <div key={access.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{access.patientName}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {access.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {access.accessTime.toLocaleString()}
                      </p>
                    </div>
                    <Badge 
                      variant={access.status === 'active' ? 'destructive' : 'outline'}
                      className={access.status === 'active' ? 'bg-red-100 text-red-800' : ''}
                    >
                      {access.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent emergency access</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
            Emergency Access Protocols
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <div>
              <p className="text-sm font-medium">Verify Emergency Situation</p>
              <p className="text-xs text-muted-foreground">Ensure legitimate medical emergency before accessing patient data</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <div>
              <p className="text-sm font-medium">Scan QR Code</p>
              <p className="text-xs text-muted-foreground">Use patient's emergency QR code for immediate access</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <div>
              <p className="text-sm font-medium">Document Access</p>
              <p className="text-xs text-muted-foreground">All emergency access is automatically logged and audited</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <div>
              <p className="text-sm font-medium">Contact Emergency Contact</p>
              <p className="text-xs text-muted-foreground">Notify patient's emergency contact when appropriate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}