'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  User,
  FileText,
  Activity
} from 'lucide-react';

export default function EmergencyAccess() {
  const { user } = useAuth();
  const [accessLogs, setAccessLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccessLogs();
  }, []);

  const fetchAccessLogs = async () => {
    try {
      // Mock data for demonstration
      const mockLogs = [
        {
          id: '1',
          patientName: 'John Smith',
          accessTime: new Date('2024-01-20T14:30:00'),
          location: 'Emergency Room - General Hospital',
          status: 'completed',
          accessType: 'qr-scan',
          duration: '15 minutes',
          emergencyType: 'Cardiac Event',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
        },
        {
          id: '2',
          patientName: 'Sarah Johnson',
          accessTime: new Date('2024-01-20T12:15:00'),
          location: 'Ambulance Unit 5',
          status: 'active',
          accessType: 'qr-scan',
          duration: 'Ongoing',
          emergencyType: 'Traffic Accident',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
        },
        {
          id: '3',
          patientName: 'Michael Brown',
          accessTime: new Date('2024-01-19T18:45:00'),
          location: 'Fire Station 12',
          status: 'completed',
          accessType: 'manual-entry',
          duration: '8 minutes',
          emergencyType: 'Allergic Reaction',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
        },
        {
          id: '4',
          patientName: 'Emily Davis',
          accessTime: new Date('2024-01-19T09:20:00'),
          location: 'Emergency Room - City Medical',
          status: 'completed',
          accessType: 'qr-scan',
          duration: '22 minutes',
          emergencyType: 'Respiratory Distress',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
        },
      ];
      
      setAccessLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching access logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccessTypeIcon = (type) => {
    switch (type) {
      case 'qr-scan':
        return '📱';
      case 'manual-entry':
        return '⌨️';
      default:
        return '🔍';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Emergency Access Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage emergency patient data access
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by patient name, emergency type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Today's Access</p>
                <p className="text-2xl font-bold">
                  {filteredLogs.filter(log => 
                    new Date(log.accessTime).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Active Cases</p>
                <p className="text-2xl font-bold">
                  {filteredLogs.filter(log => log.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">{filteredLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold">12m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Access History</CardTitle>
          <CardDescription>
            Complete log of emergency patient data access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading access logs...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getAccessTypeIcon(log.accessType)}</span>
                        <div>
                          <h3 className="font-semibold">{log.patientName}</h3>
                          <p className="text-sm text-muted-foreground">{log.emergencyType}</p>
                        </div>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{log.accessTime.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{log.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Duration: {log.duration}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">Responder:</span> {log.responder}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No access logs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No emergency access has been recorded yet'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}