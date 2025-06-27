'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  Users, 
  QrCode, 
  Activity,
  TrendingUp,
  Calendar,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecords: 0,
    sharedDoctors: 0,
    recentActivity: 0,
    storageUsed: 0,
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const statsResponse = await fetch('/api/patient/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent records
      const recordsResponse = await fetch('/api/patient/records?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (recordsResponse.ok) {
        const recordsData = await recordsResponse.json();
        setRecentRecords(recordsData.records || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload Records',
      description: 'Add new medical documents',
      icon: Upload,
      href: '/dashboard/patient/upload',
      color: 'bg-blue-500',
    },
    {
      title: 'View Records',
      description: 'Browse your medical history',
      icon: FileText,
      href: '/dashboard/patient/records',
      color: 'bg-green-500',
    },
    {
      title: 'Share Access',
      description: 'Manage doctor permissions',
      icon: Users,
      href: '/dashboard/patient/shared-access',
      color: 'bg-purple-500',
    },
    {
      title: 'Emergency QR',
      description: 'Generate emergency access code',
      icon: QrCode,
      href: '/dashboard/patient/emergency-qr',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.profile?.firstName}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your medical records securely and efficiently.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Shield className="mr-1 h-3 w-3" />
            Secure Account
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared with Doctors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sharedDoctors}</div>
            <p className="text-xs text-muted-foreground">
              Active access permissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Actions this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storageUsed}%</div>
            <Progress value={stats.storageUsed} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
            <CardDescription>Your latest uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecords.length > 0 ? (
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div key={record._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{record.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {record.category}
                    </Badge>
                  </div>
                ))}
                <Link href="/dashboard/patient/records">
                  <Button variant="outline" className="w-full">
                    View All Records
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No records yet</p>
                <Link href="/dashboard/patient/upload">
                  <Button className="mt-2">Upload Your First Record</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming appointments</p>
              <p className="text-sm text-muted-foreground mt-2">
                Appointment scheduling coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}