'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  FileText,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

export default function EmergencyHistory() {
  const { user } = useAuth();
  const [accessHistory, setAccessHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAccess: 0,
    thisMonth: 0,
    avgResponseTime: 0,
    emergencyTypes: {}
  });

  useEffect(() => {
    fetchAccessHistory();
  }, []);

  const fetchAccessHistory = async () => {
    try {
      // Mock comprehensive history data
      const mockHistory = [
        {
          id: '1',
          patientName: 'John Smith',
          patientId: 'P001',
          accessTime: new Date('2024-01-20T14:30:00'),
          location: 'Emergency Room - General Hospital',
          emergencyType: 'Cardiac Event',
          responseTime: '12 minutes',
          outcome: 'Stabilized',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          accessMethod: 'QR Scan',
          criticalInfo: ['Blood Type: O+', 'Allergic to Penicillin', 'Diabetes Type 2'],
          duration: '45 minutes',
        },
        {
          id: '2',
          patientName: 'Sarah Johnson',
          patientId: 'P002',
          accessTime: new Date('2024-01-19T18:45:00'),
          location: 'Ambulance Unit 5',
          emergencyType: 'Traffic Accident',
          responseTime: '8 minutes',
          outcome: 'Transported to Hospital',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          accessMethod: 'QR Scan',
          criticalInfo: ['Blood Type: A+', 'No known allergies', 'Hypertension'],
          duration: '25 minutes',
        },
        {
          id: '3',
          patientName: 'Michael Brown',
          patientId: 'P003',
          accessTime: new Date('2024-01-18T09:20:00'),
          location: 'Fire Station 12',
          emergencyType: 'Allergic Reaction',
          responseTime: '15 minutes',
          outcome: 'Treated and Released',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          accessMethod: 'Manual Entry',
          criticalInfo: ['Blood Type: B+', 'Severe Shellfish Allergy', 'Asthma'],
          duration: '30 minutes',
        },
        {
          id: '4',
          patientName: 'Emily Davis',
          patientId: 'P004',
          accessTime: new Date('2024-01-17T16:10:00'),
          location: 'Emergency Room - City Medical',
          emergencyType: 'Respiratory Distress',
          responseTime: '10 minutes',
          outcome: 'Admitted for Observation',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          accessMethod: 'QR Scan',
          criticalInfo: ['Blood Type: AB+', 'COPD', 'Multiple medications'],
          duration: '60 minutes',
        },
        {
          id: '5',
          patientName: 'Robert Wilson',
          patientId: 'P005',
          accessTime: new Date('2024-01-15T22:30:00'),
          location: 'Ambulance Unit 3',
          emergencyType: 'Stroke Symptoms',
          responseTime: '6 minutes',
          outcome: 'Emergency Surgery',
          responder: user?.profile?.firstName + ' ' + user?.profile?.lastName,
          accessMethod: 'QR Scan',
          criticalInfo: ['Blood Type: O-', 'Blood thinners', 'Previous stroke'],
          duration: '90 minutes',
        },
      ];
      
      setAccessHistory(mockHistory);
      
      // Calculate stats
      const totalAccess = mockHistory.length;
      const thisMonth = mockHistory.filter(h => 
        new Date(h.accessTime).getMonth() === new Date().getMonth()
      ).length;
      
      const emergencyTypes = mockHistory.reduce((acc, h) => {
        acc[h.emergencyType] = (acc[h.emergencyType] || 0) + 1;
        return acc;
      }, {});
      
      setStats({
        totalAccess,
        thisMonth,
        avgResponseTime: 10.2,
        emergencyTypes
      });
      
    } catch (error) {
      console.error('Error fetching access history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = accessHistory.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || record.emergencyType === typeFilter;
    
    const matchesDate = !dateRange.from || !dateRange.to || 
                       (new Date(record.accessTime) >= dateRange.from && 
                        new Date(record.accessTime) <= dateRange.to);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const exportHistory = () => {
    // In a real implementation, this would generate and download a CSV/PDF report
    const csvContent = filteredHistory.map(record => 
      `${record.patientName},${record.emergencyType},${record.accessTime},${record.location},${record.outcome}`
    ).join('\n');
    
    console.log('Exporting history:', csvContent);
    alert('Export functionality would be implemented here');
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome.toLowerCase()) {
      case 'stabilized':
      case 'treated and released':
        return 'bg-green-100 text-green-800';
      case 'transported to hospital':
      case 'admitted for observation':
        return 'bg-yellow-100 text-yellow-800';
      case 'emergency surgery':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Access History</h1>
          <p className="text-muted-foreground">
            Complete history of emergency patient data access
          </p>
        </div>
        <Button onClick={exportHistory} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Access</p>
                <p className="text-2xl font-bold">{stats.totalAccess}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Emergency Types</p>
                <p className="text-2xl font-bold">{Object.keys(stats.emergencyTypes).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by patient name, emergency type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full lg:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Emergency Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.keys(stats.emergencyTypes).map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full lg:w-[200px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Access Records</CardTitle>
          <CardDescription>
            Detailed history of all emergency patient data access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading history...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{record.patientName}</h3>
                        <Badge variant="outline">ID: {record.patientId}</Badge>
                        <Badge className={getOutcomeColor(record.outcome)}>
                          {record.outcome}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-red-600">{record.emergencyType}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{record.accessTime.toLocaleDateString()}</p>
                      <p>{record.accessTime.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{record.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>Response: {record.responseTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>Duration: {record.duration}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Critical Information Accessed:</p>
                    <div className="flex flex-wrap gap-1">
                      {record.criticalInfo.map((info, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {info}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Access Method: {record.accessMethod}</span>
                    <span>Responder: {record.responder}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No records found</h3>
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== 'all' || dateRange.from 
                  ? 'Try adjusting your search criteria'
                  : 'No emergency access history available'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}