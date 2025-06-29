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
  Activity,
  Loader2,
  TrendingUp,
  BarChart3,
  Phone
} from 'lucide-react';

export default function EmergencyAccess() {
  const { user } = useAuth();
  const [accessLogs, setAccessLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAccess: 0,
    activeEmergencies: 0,
    weeklyAccess: 0,
    avgResponseTime: 0,
  });

  useEffect(() => {
    fetchAccessLogs();
    fetchStats();
  }, [timeFilter]);

  const fetchAccessLogs = async () => {
    try {
      // Mock enhanced data for demonstration
      const mockLogs = [
        {
          id: '1',
          patientName: 'John Smith',
          patientPhone: '+1-555-0123',
          accessTime: new Date('2024-01-20T14:30:00'),
          location: 'Emergency Room - General Hospital',
          status: 'completed',
          accessType: 'qr-scan',
          duration: '15 minutes',
          emergencyType: 'Cardiac Event',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          criticalInfo: ['Blood Type: O+', 'Allergic to Penicillin', 'Diabetes Type 2'],
          emergencyContact: {
            name: 'Jane Smith',
            phone: '+1-555-0124',
            relationship: 'Spouse'
          }
        },
        {
          id: '2',
          patientName: 'Sarah Johnson',
          patientPhone: '+1-555-0125',
          accessTime: new Date('2024-01-20T12:15:00'),
          location: 'Ambulance Unit 5',
          status: 'active',
          accessType: 'qr-scan',
          duration: 'Ongoing',
          emergencyType: 'Traffic Accident',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          criticalInfo: ['Blood Type: A+', 'No known allergies', 'Hypertension'],
          emergencyContact: {
            name: 'Mike Johnson',
            phone: '+1-555-0126',
            relationship: 'Husband'
          }
        },
        {
          id: '3',
          patientName: 'Michael Brown',
          patientPhone: '+1-555-0127',
          accessTime: new Date('2024-01-19T18:45:00'),
          location: 'Fire Station 12',
          status: 'completed',
          accessType: 'manual-entry',
          duration: '8 minutes',
          emergencyType: 'Allergic Reaction',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          criticalInfo: ['Blood Type: B+', 'Severe Shellfish Allergy', 'Asthma'],
          emergencyContact: {
            name: 'Lisa Brown',
            phone: '+1-555-0128',
            relationship: 'Wife'
          }
        },
        {
          id: '4',
          patientName: 'Emily Davis',
          patientPhone: '+1-555-0129',
          accessTime: new Date('2024-01-19T09:20:00'),
          location: 'Emergency Room - City Medical',
          status: 'completed',
          accessType: 'qr-scan',
          duration: '22 minutes',
          emergencyType: 'Respiratory Distress',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          criticalInfo: ['Blood Type: AB+', 'COPD', 'Multiple medications'],
          emergencyContact: {
            name: 'Robert Davis',
            phone: '+1-555-0130',
            relationship: 'Father'
          }
        },
      ];
      
      setAccessLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching access logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats data
      setStats({
        todayAccess: 3,
        activeEmergencies: 1,
        weeklyAccess: 8,
        avgResponseTime: 12,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const now = new Date();
      const logTime = new Date(log.accessTime);
      
      switch (timeFilter) {
        case 'today':
          matchesTime = logTime.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTime = logTime >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesTime = logTime >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesTime;
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

  const formatDuration = (timestamp) => {
    const now = new Date();
    const accessTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - accessTime) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
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

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Today's Access</p>
                <p className="text-2xl font-bold">{stats.todayAccess}</p>
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
                <p className="text-2xl font-bold">{stats.activeEmergencies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">{stats.weeklyAccess}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
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
          <SelectTrigger className="w-full sm:w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Access Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Access History</CardTitle>
          <CardDescription>
            Complete log of emergency patient data access ({filteredLogs.length} records)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground mt-2">Loading access logs...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getAccessTypeIcon(log.accessType)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{log.patientName}</h3>
                            <Badge className={getStatusColor(log.status)}>
                              {log.status}
                            </Badge>
                            {log.status === 'active' && (
                              <Badge className="bg-red-600 text-white animate-pulse">
                                Live
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-medium text-red-600">
                            {log.emergencyType}
                          </p>
                        </div>
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

                      {/* Critical Information */}
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 text-sm">
                          Critical Information Accessed:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {log.criticalInfo.map((info, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-red-700 border-red-300">
                              {info}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      {log.emergencyContact && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm flex items-center">
                            <Phone className="mr-1 h-3 w-3" />
                            Emergency Contact:
                          </h4>
                          <div className="text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-medium">{log.emergencyContact.name}</span>
                            <span className="mx-2">•</span>
                            <span>{log.emergencyContact.phone}</span>
                            <span className="mx-2">•</span>
                            <span>{log.emergencyContact.relationship}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-sm">
                        <span className="font-medium">Responder:</span> {log.responder}
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{formatDuration(log.accessTime)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                      {log.patientPhone && (
                        <Button variant="outline" size="sm" className="text-blue-600">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      )}
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
                {searchTerm || statusFilter !== 'all' || timeFilter !== 'all'
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