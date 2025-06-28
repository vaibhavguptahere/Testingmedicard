'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  UserPlus, 
  Search, 
  Calendar,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

export default function SharedAccess() {
  const { user } = useAuth();
  const [sharedAccess, setSharedAccess] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [shareForm, setShareForm] = useState({
    doctorEmail: '',
    accessLevel: 'read',
    expiresIn: '30d',
    recordCategories: ['all'],
  });

  useEffect(() => {
    fetchSharedAccess();
    fetchAccessRequests();
  }, []);

  const fetchSharedAccess = async () => {
    try {
      const response = await fetch('/api/auth/patient/shared-access', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSharedAccess(data.sharedAccess || []);
      }
    } catch (error) {
      console.error('Error fetching shared access:', error);
    }
  };

  const fetchAccessRequests = async () => {
    try {
      const response = await fetch('/api/auth/patient/access-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccessRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching access requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareAccess = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/patient/shared-access', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shareForm),
      });

      if (response.ok) {
        toast.success('Access shared successfully');
        setShowShareDialog(false);
        setShareForm({
          doctorEmail: '',
          accessLevel: 'read',
          expiresIn: '30d',
          recordCategories: ['all'],
        });
        fetchSharedAccess();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to share access');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAccessRequest = async (requestId, action) => {
    try {
      const response = await fetch(`/api/auth/patient/access-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        toast.success(`Access request ${action}ed`);
        fetchAccessRequests();
        fetchSharedAccess();
      } else {
        throw new Error(`Failed to ${action} request`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const revokeAccess = async (accessId) => {
    try {
      const response = await fetch(`/api/auth/patient/shared-access/${accessId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Access revoked successfully');
        fetchSharedAccess();
      } else {
        throw new Error('Failed to revoke access');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAccessLevelColor = (level) => {
    const colors = {
      read: 'bg-blue-100 text-blue-800',
      write: 'bg-green-100 text-green-800',
      full: 'bg-purple-100 text-purple-800',
    };
    return colors[level] || colors.read;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      revoked: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shared Access</h1>
          <p className="text-muted-foreground">
            Manage doctor access to your medical records
          </p>
        </div>
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Share Access
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Share Medical Records Access</DialogTitle>
              <DialogDescription>
                Grant a doctor access to your medical records
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleShareAccess} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctorEmail">Doctor's Email</Label>
                <Input
                  id="doctorEmail"
                  type="email"
                  value={shareForm.doctorEmail}
                  onChange={(e) => setShareForm({ ...shareForm, doctorEmail: e.target.value })}
                  placeholder="doctor@hospital.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select
                  value={shareForm.accessLevel}
                  onValueChange={(value) => setShareForm({ ...shareForm, accessLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read Only</SelectItem>
                    <SelectItem value="write">Read & Write</SelectItem>
                    <SelectItem value="full">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresIn">Access Duration</Label>
                <Select
                  value={shareForm.expiresIn}
                  onValueChange={(value) => setShareForm({ ...shareForm, expiresIn: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Share Access</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Access Requests */}
      {accessRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Pending Access Requests
            </CardTitle>
            <CardDescription>
              Doctors requesting access to your medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accessRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{request.doctor.name}</h4>
                      <Badge variant="outline">{request.doctor.specialization}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.doctor.email}</p>
                    <p className="text-sm">{request.reason}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Requested: {request.requestedAt.toLocaleDateString()}</span>
                      <Badge className={getAccessLevelColor(request.accessLevel)}>
                        {request.accessLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccessRequest(request.id, 'approve')}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAccessRequest(request.id, 'deny')}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Deny
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Shared Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Current Shared Access
          </CardTitle>
          <CardDescription>
            Doctors who currently have access to your records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sharedAccess.length > 0 ? (
            <div className="space-y-4">
              {sharedAccess.map((access) => (
                <div key={access.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{access.doctor.name}</h4>
                      <Badge variant="outline">{access.doctor.specialization}</Badge>
                      <Badge className={getStatusColor(access.status)}>
                        {access.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{access.doctor.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Granted: {access.grantedAt.toLocaleDateString()}</span>
                      <span>Expires: {access.expiresAt.toLocaleDateString()}</span>
                      <Badge className={getAccessLevelColor(access.accessLevel)}>
                        {access.accessLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Categories:</span>
                      {access.recordCategories.includes('all') ? (
                        <Badge variant="outline" className="text-xs">All Records</Badge>
                      ) : (
                        access.recordCategories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category.replace('-', ' ')}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => revokeAccess(access.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No shared access</h3>
              <p className="text-muted-foreground mb-4">
                You haven't shared access with any doctors yet
              </p>
              <Button onClick={() => setShowShareDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Share Access
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Full Control</p>
              <p className="text-xs text-muted-foreground">
                You can revoke access at any time
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Audit Trail</p>
              <p className="text-xs text-muted-foreground">
                All access is logged and monitored
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Time-Limited</p>
              <p className="text-xs text-muted-foreground">
                Access automatically expires based on your settings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}