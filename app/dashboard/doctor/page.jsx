'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Clock, 
  Activity,
  TrendingUp,
  Calendar,
  UserCheck,
  Bot
} from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingRequests: 0,
    recentActivity: 0,
    recordsAccessed: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for demonstration
      setStats({
        totalPatients: 12,
        pendingRequests: 3,
        recentActivity: 8,
        recordsAccessed: 45,
      });

      setRecentPatients([
        {
          id: '1',
          name: 'John Smith',
          lastAccess: new Date('2024-01-20'),
          recordCount: 8,
          status: 'active',
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          lastAccess: new Date('2024-01-19'),
          recordCount: 12,
          status: 'active',
        },
        {
          id: '3',
          name: 'Michael Brown',
          lastAccess: new Date('2024-01-18'),
          recordCount: 6,
          status: 'active',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'View Patients',
      description: 'Access patient records',
      icon: Users,
      href: '/dashboard/doctor/patients',
      color: 'bg-blue-500',
    },
    {
      title: 'Access Requests',
      description: 'Review pending requests',
      icon: UserCheck,
      href: '/dashboard/doctor/access-requests',
      color: 'bg-green-500',
    },
    {
      title: 'AI Assistant',
      description: 'Get AI-powered insights',
      icon: Bot,
      href: '/dashboard/doctor/ai-assistant',
      color: 'bg-purple-500',
    },
    {
      title: 'Profile Settings',
      description: 'Update your information',
      icon: Calendar,
      href: '/dashboard/doctor/profile',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, Dr. {user?.profile?.firstName}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {user?.profile?.specialization} • {user?.profile?.hospital}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <UserCheck className="mr-1 h-3 w-3" />
            {user?.profile?.verified ? 'Verified' : 'Pending Verification'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your review
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
            <CardTitle className="text-sm font-medium">Records Accessed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recordsAccessed}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
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

      {/* Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Patients you've recently accessed</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPatients.length > 0 ? (
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.recordCount} records • Last accessed {patient.lastAccess.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {patient.status}
                    </Badge>
                  </div>
                ))}
                <Link href="/dashboard/doctor/patients">
                  <Button variant="outline" className="w-full">
                    View All Patients
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent patient access</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Get AI-powered medical insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900 dark:text-purple-100">
                    AI Medical Assistant
                  </span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Analyze patient records, get diagnostic suggestions, and receive treatment recommendations.
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="mr-2 h-4 w-4" />
                  Analyze Patient Records
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Medical Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Treatment Recommendations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}