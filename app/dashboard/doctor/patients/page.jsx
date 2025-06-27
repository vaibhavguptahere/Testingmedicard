'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Eye, 
  Calendar,
  FileText,
  Bot,
  Loader2,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

export default function DoctorPatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // Mock data for demonstration
      setPatients([
        {
          id: '1',
          profile: {
            firstName: 'John',
            lastName: 'Smith',
            phone: '+1-555-0123',
            dateOfBirth: '1985-03-15',
          },
          recordCount: 8,
          lastAccess: new Date('2024-01-20'),
        },
        {
          id: '2',
          profile: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            phone: '+1-555-0124',
            dateOfBirth: '1990-07-22',
          },
          recordCount: 12,
          lastAccess: new Date('2024-01-19'),
        },
        {
          id: '3',
          profile: {
            firstName: 'Michael',
            lastName: 'Brown',
            phone: '+1-555-0125',
            dateOfBirth: '1978-11-08',
          },
          recordCount: 6,
          lastAccess: new Date('2024-01-18'),
        },
        {
          id: '4',
          profile: {
            firstName: 'Emily',
            lastName: 'Davis',
            phone: '+1-555-0126',
            dateOfBirth: '1992-05-30',
          },
          recordCount: 15,
          lastAccess: new Date('2024-01-17'),
        },
      ]);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecords = async (patientId) => {
    setLoadingRecords(true);
    try {
      // Mock patient records
      const mockRecords = [
        {
          id: '1',
          title: 'Blood Test Results',
          category: 'lab-results',
          createdAt: new Date('2024-01-15'),
          description: 'Complete blood count and metabolic panel',
        },
        {
          id: '2',
          title: 'Chest X-Ray',
          category: 'imaging',
          createdAt: new Date('2024-01-10'),
          description: 'Routine chest imaging for annual checkup',
        },
        {
          id: '3',
          title: 'Prescription - Lisinopril',
          category: 'prescription',
          createdAt: new Date('2024-01-08'),
          description: 'Blood pressure medication prescription',
        },
      ];
      
      setPatientRecords(mockRecords);
    } catch (error) {
      toast.error('Failed to fetch patient records');
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    fetchPatientRecords(patient.id);
  };

  const analyzePatientWithAI = async (patient) => {
    toast.info('AI analysis started...');
    // Simulate AI analysis
    setTimeout(() => {
      toast.success('AI analysis completed - check the AI Assistant tab for detailed insights');
    }, 2000);
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.profile.firstName} ${patient.profile.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    const colors = {
      'lab-results': 'bg-blue-100 text-blue-800',
      'imaging': 'bg-purple-100 text-purple-800',
      'prescription': 'bg-green-100 text-green-800',
      'consultation': 'bg-yellow-100 text-yellow-800',
      'emergency': 'bg-red-100 text-red-800',
      'general': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Patients</h1>
        <p className="text-muted-foreground">
          Patients who have granted you access to their medical records
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patients Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredPatients.length > 0 ? (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {patient.profile.firstName} {patient.profile.lastName}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Age: {calculateAge(patient.profile.dateOfBirth)}</span>
                      <span className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {patient.profile.phone}
                      </span>
                      <span>{patient.recordCount} records</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => analyzePatientWithAI(patient)}
                    >
                      <Bot className="h-4 w-4 mr-1" />
                      AI Analyze
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Records
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedPatient?.profile.firstName} {selectedPatient?.profile.lastName} - Medical Records
                          </DialogTitle>
                          <DialogDescription>
                            Patient medical history and records
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedPatient && (
                          <div className="space-y-6">
                            {/* Patient Info */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Patient Information</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Name:</span>
                                    <p>{selectedPatient.profile.firstName} {selectedPatient.profile.lastName}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Age:</span>
                                    <p>{calculateAge(selectedPatient.profile.dateOfBirth)} years</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Date of Birth:</span>
                                    <p>{new Date(selectedPatient.profile.dateOfBirth).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Phone:</span>
                                    <p>{selectedPatient.profile.phone}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Medical Records */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Medical Records</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {loadingRecords ? (
                                  <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                  </div>
                                ) : patientRecords.length > 0 ? (
                                  <div className="space-y-4">
                                    {patientRecords.map((record) => (
                                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="space-y-1">
                                          <div className="flex items-center space-x-2">
                                            <h4 className="font-medium">{record.title}</h4>
                                            <Badge className={getCategoryColor(record.category)}>
                                              {record.category.replace('-', ' ')}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-muted-foreground">{record.description}</p>
                                          <div className="flex items-center text-xs text-muted-foreground">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {record.createdAt.toLocaleDateString()}
                                          </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                          <FileText className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No records available</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Last accessed: {patient.lastAccess.toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active Access
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No patients found</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'No patients have granted you access yet'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}