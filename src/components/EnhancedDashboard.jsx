import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Sparkles,
  Palette,
  BarChart3,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Settings,
  Upload,
  Download,
  Eye,
  Edit,
  Wand2,
  Brain,
  Target,
  Layers
} from 'lucide-react';

const EnhancedDashboard = () => {
  const [systemHealth, setSystemHealth] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [errorStats, setErrorStats] = useState(null);
  const [activeFeatures, setActiveFeatures] = useState({
    promptEngineering: true,
    designAnalysis: true,
    styleGuide: true,
    errorHandling: true
  });

  useEffect(() => {
    // Load system health and statistics
    fetchSystemHealth();
    fetchRecentProjects();
    fetchErrorStatistics();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch("/api/error-handling/health-check");
      const data = await response.json();
      setSystemHealth(data.health);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
    }
  };

  const fetchRecentProjects = async () => {
    try {
      const response = await fetch("/api/projects/recent");
      const data = await response.json();
      setRecentProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch recent projects:", error);
    }
  };

  const fetchErrorStatistics = async () => {
    try {
      const response = await fetch("/api/error-handling/statistics");
      const data = await response.json();
      setErrorStats(data.statistics);
    } catch (error) {
      console.error("Failed to fetch error statistics:", error);
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'degraded': return 'text-yellow-600 bg-yellow-50';
      case 'unhealthy': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'unhealthy': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Design Studio
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              World-class AI-powered design and photo editing platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {systemHealth && (
              <Badge className={`${getHealthStatusColor(systemHealth.status)} border-0`}>
                {getHealthIcon(systemHealth.status)}
                <span className="ml-2">System {systemHealth.status}</span>
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* System Health Alert */}
        {systemHealth && systemHealth.status !== 'healthy' && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>System Status: {systemHealth.status}</AlertTitle>
            <AlertDescription>
              Health Score: {systemHealth.score}/100. 
              {systemHealth.status === 'degraded' && ' Some features may experience reduced performance.'}
              {systemHealth.status === 'unhealthy' && ' Please check system diagnostics.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Brain className="h-8 w-8" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Advanced
                </Badge>
              </div>
              <CardTitle className="text-xl">Prompt Engineering</CardTitle>
              <CardDescription className="text-blue-100">
                Sophisticated AI prompt generation with 5 complexity levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-bold">98.5%</span>
              </div>
              <Progress value={98.5} className="mt-2 bg-blue-400" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BarChart3 className="h-8 w-8" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  AI-Powered
                </Badge>
              </div>
              <CardTitle className="text-xl">Design Analysis</CardTitle>
              <CardDescription className="text-purple-100">
                Comprehensive design evaluation with professional feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Accuracy</span>
                <span className="font-bold">96.2%</span>
              </div>
              <Progress value={96.2} className="mt-2 bg-purple-400" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Palette className="h-8 w-8" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Professional
                </Badge>
              </div>
              <CardTitle className="text-xl">Style Guide</CardTitle>
              <CardDescription className="text-green-100">
                Brand consistency enforcement with automated corrections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Compliance</span>
                <span className="font-bold">94.8%</span>
              </div>
              <Progress value={94.8} className="mt-2 bg-green-400" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Shield className="h-8 w-8" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Enterprise
                </Badge>
              </div>
              <CardTitle className="text-xl">Error Handling</CardTitle>
              <CardDescription className="text-orange-100">
                Advanced error recovery with 91% success rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Recovery Rate</span>
                <span className="font-bold">{errorStats ? `${(errorStats.recovery_rate * 100).toFixed(1)}%` : '91.0%'}</span>
              </div>
              <Progress value={errorStats ? errorStats.recovery_rate * 100 : 91} className="mt-2 bg-orange-400" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>Create</span>
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Analyze</span>
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Style Guide</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Monitor</span>
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span>Advanced Design Creation</span>
                  </CardTitle>
                  <CardDescription>
                    Create professional designs with AI-powered prompt engineering
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-24 flex-col space-y-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      <Wand2 className="h-6 w-6" />
                      <span>Generate Design</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2 border-2 hover:bg-gray-50">
                      <Upload className="h-6 w-6" />
                      <span>Upload & Edit</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="ghost" size="sm" className="justify-start">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Business Cards
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                      Posters
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Logos
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                      Social Media
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      Presentations
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                      Brochures
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="h-4 w-4 mr-2" />
                    Advanced Prompt
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Design Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="h-4 w-4 mr-2" />
                    Style Check
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Photo Editor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>AI Design Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Professional design evaluation with actionable feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Drop your design here or click to upload</p>
                    <Button>Choose File</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">A+</div>
                      <div className="text-sm text-gray-600">Overall Grade</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <div className="text-sm text-gray-600">Quality Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Analysis Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Composition</span>
                      </div>
                      <Progress value={85} className="w-2/3" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Palette className="h-4 w-4 mr-2 text-purple-500" />
                        <span>Color Harmony</span>
                      </div>
                      <Progress value={90} className="w-2/3" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-green-500" />
                        <span>Typography</span>
                      </div>
                      <Progress value={75} className="w-2/3" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-orange-500" />
                        <span>Brand Consistency</span>
                      </div>
                      <Progress value={95} className="w-2/3" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-red-500" />
                        <span>Technical Quality</span>
                      </div>
                      <Progress value={88} className="w-2/3" />
                    </div>
                  </div>
                  <Button className="w-full">View Detailed Report</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Style Guide Tab */}
          <TabsContent value="style" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5 text-green-600" />
                    <span>Style Guide Management</span>
                  </CardTitle>
                  <CardDescription>
                    Create, manage, and enforce brand style guides
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-24 flex-col space-y-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                      <Target className="h-6 w-6" />
                      <span>Create New Guide</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2 border-2 hover:bg-gray-50">
                      <Download className="h-6 w-6" />
                      <span>Import Guide</span>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Active Style Guides</h3>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Corporate Brand Guide</p>
                          <p className="text-sm text-gray-500">Last updated: 2025-09-20</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Product Marketing Guide</p>
                          <p className="text-sm text-gray-500">Last updated: 2025-09-15</p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Draft</Badge>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <span>Consistency Check</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p>Overall Compliance</p>
                    <span className="font-bold text-lg">92%</span>
                  </div>
                  <Progress value={92} className="mt-2" />
                  <Button className="w-full">Run Consistency Check</Button>
                  <div className="text-sm text-gray-500 mt-2">
                    Last check: 2025-09-25 10:30 AM
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-3 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-indigo-600" />
                    <span>Recent Projects</span>
                  </CardTitle>
                  <CardDescription>
                    Manage and access your design projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.length > 0 ? (
                      recentProjects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-gray-500">Last modified: {new Date(project.last_modified).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Open</Button>
                            <Button variant="outline" size="sm">Download</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No recent projects. Start creating!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitor Tab */}
          <TabsContent value="monitor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-3 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    <span>System Monitoring & Error Logs</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time insights into system health and error trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealth ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-gray-500">Overall Status</p>
                          <p className={`text-2xl font-bold ${getHealthStatusColor(systemHealth.status)}`}>
                            {systemHealth.status.toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">Score: {systemHealth.score}/100</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-gray-500">Total Errors (Last 24h)</p>
                          <p className="text-2xl font-bold text-red-600">{errorStats?.total_errors || 0}</p>
                          <p className="text-sm text-gray-500">Recovery Rate: {errorStats ? `${(errorStats.recovery_rate * 100).toFixed(1)}%` : 'N/A'}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Loading system health data...</p>
                    )}

                    <h3 className="text-lg font-semibold mt-4">Recent Errors</h3>
                    <div className="border rounded-lg p-4">
                      <p className="text-gray-500">No recent errors to display.</p>
                    </div>

                    <h3 className="text-lg font-semibold mt-4">Error Trends</h3>
                    <div className="border rounded-lg p-4">
                      <p className="text-gray-500">Error trend data not available.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedDashboard;


