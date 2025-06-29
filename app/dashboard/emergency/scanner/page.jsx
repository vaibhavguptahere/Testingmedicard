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
  Heart,
  Camera,
  Loader2,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

export default function EmergencyScanner() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      const response = await fetch('/api/auth/emergency/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setScanHistory(data.recentAccess?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Error fetching scan history:', error);
    }
  };

  const handleQRScan = async (e) => {
    e.preventDefault();
    if (!qrCode.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/emergency/access', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrToken: qrCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to access patient data');
      }

      setPatientData(data.patient);
      
      // Add to scan history
      const newScan = {
        id: Date.now(),
        patientName: `${data.patient.profile.firstName} ${data.patient.profile.lastName}`,
        accessTime: new Date(),
        accessId: data.accessId,
      };
      setScanHistory(prev => [newScan, ...prev.slice(0, 4)]);
      
      toast.success('Patient data accessed successfully');
      setQrCode('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startCameraScanning = () => {
    setIsScanning(true);
    // In a real implementation, you would integrate with a camera library
    toast.info('Camera scanning would be implemented here with a QR code library');
    setTimeout(() => setIsScanning(false), 3000);
  };

  const downloadFile = async (recordId, fileIndex, fileName) => {
    try {
      // This would be implemented to download files from emergency records
      toast.success(`Download initiated for ${fileName}`);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Emergency QR Scanner</h1>
        <p className="text-muted-foreground">
          Scan patient QR codes for immediate access to critical medical information
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5 text-red-600" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Scan or manually enter patient emergency QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleQRScan} className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="Scan QR code or enter manually"
                  className="font-mono"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accessing...
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Access Patient Data
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={startCameraScanning}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Emergency Access
            </CardTitle>
            <CardDescription>
              Your recent patient data access history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanHistory.length > 0 ? (
              <div className="space-y-3">
                {scanHistory.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{scan.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(scan.accessTime).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Completed
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

      {/* Patient Information Display */}
      {patientData && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-red-900 dark:text-red-100">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Emergency Patient Information
            </CardTitle>
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                This access has been logged for security and compliance purposes.
              </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Patient Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p>{patientData.profile.firstName} {patientData.profile.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>
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
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-red-600" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p>{patientData.profile.emergencyContact.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p>{patientData.profile.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium">Relationship:</span>
                      <p>{patientData.profile.emergencyContact.relationship}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Critical Medical Information */}
            {patientData.emergencyRecords && patientData.emergencyRecords.length > 0 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-red-600" />
                  Critical Medical Information
                </h3>
                <div className="grid md:grid-cols-1 gap-4">
                  {patientData.emergencyRecords.map((record, index) => (
                    <div key={index} className="p-3 border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20">
                      <p className="font-medium text-red-900 dark:text-red-100">{record.title}</p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{record.description}</p>
                      
                      {/* Files in emergency records */}
                      {record.files && record.files.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium text-red-900 dark:text-red-100">Attached Files:</p>
                          {record.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded text-xs">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 text-blue-600" />
                                <span>{file.originalName}</span>
                                <span className="text-muted-foreground">
                                  ({file.size ? `${Math.round(file.size / 1024)} KB` : 'Unknown size'})
                                </span>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadFile(record._id, fileIndex, file.originalName)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Download className="h-2 w-2" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                                  <Eye className="h-2 w-2" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Print Summary
              </Button>
              <Button variant="outline" className="flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Call Emergency Contact
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setPatientData(null)}
                className="flex-1"
              >
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              <p className="text-sm font-medium">Review Critical Information</p>
              <p className="text-xs text-muted-foreground">Focus on allergies, medications, and emergency contacts</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <div>
              <p className="text-sm font-medium">Document Access</p>
              <p className="text-xs text-muted-foreground">All emergency access is automatically logged and audited</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}