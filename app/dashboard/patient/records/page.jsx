'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  Download,
  Eye,
  Bot,
  Loader2,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingRecord, setAnalyzingRecord] = useState(null);

  const [newRecord, setNewRecord] = useState({
    title: '',
    description: '',
    category: 'general',
    recordDate: new Date().toISOString().split('T')[0],
    isEmergencyVisible: false,
  });

  useEffect(() => {
    fetchRecords();
  }, [categoryFilter]);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`/api/auth/patient/records?category=${categoryFilter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/patient/records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        toast.success('Record added successfully');
        setShowAddDialog(false);
        setNewRecord({
          title: '',
          description: '',
          category: 'general',
          recordDate: new Date().toISOString().split('T')[0],
          isEmergencyVisible: false,
        });
        fetchRecords();
      } else {
        throw new Error('Failed to add record');
      }
    } catch (error) {
      toast.error('Failed to add record');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/patient/records/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Record deleted successfully');
        fetchRecords();
      } else {
        throw new Error('Failed to delete record');
      }
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const analyzeWithAI = async (record) => {
    setAnalyzingRecord(record._id);
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentText: record.description,
          documentType: record.category,
          symptoms: record.title,
        }),
      });

      if (response.ok) {
        const analysis = await response.json();
        setAiAnalysis(analysis);
        toast.success('AI analysis completed');
      } else {
        throw new Error('AI analysis failed');
      }
    } catch (error) {
      toast.error('AI analysis failed');
    } finally {
      setAnalyzingRecord(null);
    }
  };

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      'lab-results': 'bg-blue-100 text-blue-800',
      prescription: 'bg-green-100 text-green-800',
      imaging: 'bg-purple-100 text-purple-800',
      emergency: 'bg-red-100 text-red-800',
      consultation: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">Manage your medical documents and history</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Medical Record</DialogTitle>
              <DialogDescription>
                Create a new medical record entry
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  placeholder="Record title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newRecord.category}
                  onValueChange={(value) => setNewRecord({ ...newRecord, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="lab-results">Lab Results</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recordDate">Record Date</Label>
                <Input
                  id="recordDate"
                  type="date"
                  value={newRecord.recordDate}
                  onChange={(e) => setNewRecord({ ...newRecord, recordDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  placeholder="Record description or notes"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="emergency"
                  checked={newRecord.isEmergencyVisible}
                  onCheckedChange={(checked) => setNewRecord({ ...newRecord, isEmergencyVisible: checked })}
                />
                <Label htmlFor="emergency">Visible in emergency situations</Label>
              </div>
              <Button type="submit" className="w-full">Add Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="lab-results">Lab Results</SelectItem>
            <SelectItem value="prescription">Prescription</SelectItem>
            <SelectItem value="imaging">Imaging</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Records Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{record.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(record.category)}>
                        {record.category.replace('-', ' ')}
                      </Badge>
                      {record.metadata?.isEmergencyVisible && (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Emergency Visible
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => analyzeWithAI(record)}
                      disabled={analyzingRecord === record._id}
                    >
                      {analyzingRecord === record._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      AI Analyze
                    </Button>
                    <Link href={`/dashboard/patient/records/edit/${record._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteRecord(record._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{record.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(record.metadata?.recordDate || record.createdAt).toLocaleDateString()}
                    </div>
                    {record.files && record.files.length > 0 && (
                      <div className="flex items-center">
                        <FileText className="mr-1 h-4 w-4" />
                        {record.files.length} file(s)
                      </div>
                    )}
                  </div>
                  {record.metadata?.doctorId && (
                    <div>
                      Added by Dr. {record.metadata.doctorId.profile?.firstName}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No records found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first medical record'
              }
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Record
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
              <Bot className="mr-2 h-5 w-5" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Summary</h4>
              <p className="text-sm">{aiAnalysis.analysis.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Findings</h4>
              <ul className="list-disc list-inside space-y-1">
                {aiAnalysis.analysis.findings.map((finding, index) => (
                  <li key={index} className="text-sm">{finding}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1">
                {aiAnalysis.analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Confidence: {Math.round(aiAnalysis.analysis.confidence * 100)}%</span>
              <span>Severity: {aiAnalysis.analysis.severity}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}