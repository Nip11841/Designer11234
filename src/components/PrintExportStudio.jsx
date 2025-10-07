import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { 
  Printer, 
  Download, 
  FileText, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Palette,
  Ruler,
  Layers,
  Image as ImageIcon,
  FileImage,
  Package,
  Zap,
  Eye,
  RotateCw,
  Scissors,
  Target,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Archive,
  Clock,
  DollarSign,
  Info,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

const PrintExportStudio = () => {
  const [printFormats, setPrintFormats] = useState({});
  const [exportFormats, setExportFormats] = useState({});
  const [colorProfiles, setColorProfiles] = useState({});
  const [selectedFormat, setSelectedFormat] = useState('business_card');
  const [selectedExportFormat, setSelectedExportFormat] = useState('pdf_print');
  const [selectedColorProfile, setSelectedColorProfile] = useState('cmyk_coated');
  const [includeBleed, setIncludeBleed] = useState(true);
  const [includeCropMarks, setIncludeCropMarks] = useState(true);
  const [filename, setFilename] = useState('design');
  const [preflightResult, setPreflightResult] = useState(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('prepare');
  const [batchExportFormats, setBatchExportFormats] = useState(['pdf_print', 'png_high']);

  const API_BASE_URL = 'https://ogh5izc6nmjk.manus.space';

  useEffect(() => {
    fetchPrintData();
  }, []);

  const fetchPrintData = async () => {
    try {
      const [formatsRes, exportRes, profilesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/print-export/formats`),
        fetch(`${API_BASE_URL}/api/print-export/export-formats`),
        fetch(`${API_BASE_URL}/api/print-export/color-profiles`)
      ]);

      const [formatsData, exportData, profilesData] = await Promise.all([
        formatsRes.json(),
        exportRes.json(),
        profilesRes.json()
      ]);

      if (formatsData.success) setPrintFormats(formatsData.formats);
      if (exportData.success) setExportFormats(exportData.formats);
      if (profilesData.success) setColorProfiles(profilesData.profiles);
    } catch (error) {
      console.error('Error fetching print data:', error);
    }
  };

  const runPreflightCheck = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/print-export/preflight-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          design_data: { /* current design data */ },
          print_format: selectedFormat
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPreflightResult(data.preflight);
      }
    } catch (error) {
      console.error('Error running preflight check:', error);
    }
  };

  const prepareForPrint = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/print-export/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          design_data: { /* current design data */ },
          print_format: selectedFormat,
          color_profile: selectedColorProfile,
          include_bleed: includeBleed,
          include_crop_marks: includeCropMarks
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Print preparation completed:', data.preparation);
      }
    } catch (error) {
      console.error('Error preparing for print:', error);
    }
  };

  const exportDesign = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_BASE_URL}/api/print-export/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          design_data: { /* current design data */ },
          export_format: selectedExportFormat,
          filename: filename
        }),
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      if (data.success) {
        console.log('Export completed:', data.export);
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error('Error exporting design:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const batchExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 300);

      const response = await fetch(`${API_BASE_URL}/api/print-export/batch-export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          design_data: { /* current design data */ },
          export_formats: batchExportFormats,
          filename: filename
        }),
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      if (data.success) {
        console.log('Batch export completed:', data.batch_export);
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error('Error in batch export:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentFormat = printFormats[selectedFormat];
  const currentExportFormat = exportFormats[selectedExportFormat];
  const currentColorProfile = colorProfiles[selectedColorProfile];

  return (
    <div className="h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Printer className="h-7 w-7 text-blue-600" />
                Print & Export Studio
              </h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Professional
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={runPreflightCheck}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Preflight Check
              </Button>
              <Button onClick={exportDesign} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prepare" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Prepare
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="preflight" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Preflight
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center gap-3">
              <RotateCw className="h-4 w-4 text-blue-600 animate-spin" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-800">Exporting design...</span>
                  <span className="text-sm text-blue-600">{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Prepare Tab */}
          <TabsContent value="prepare" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Print Format Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Print Format
                  </CardTitle>
                  <CardDescription>
                    Choose the format for your print output
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select print format" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(printFormats).map(([key, format]) => (
                        <SelectItem key={key} value={key}>
                          {format.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {currentFormat && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h4 className="font-medium">Specifications</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Dimensions:</span>
                          <p className="font-medium">
                            {currentFormat.dimensions.width}" × {currentFormat.dimensions.height}"
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">DPI:</span>
                          <p className="font-medium">{currentFormat.dpi}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Color Mode:</span>
                          <p className="font-medium">{currentFormat.color_mode}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bleed:</span>
                          <p className="font-medium">{currentFormat.bleed}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Color Profile Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Color Profile
                  </CardTitle>
                  <CardDescription>
                    Select the appropriate color profile for your output
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedColorProfile} onValueChange={setSelectedColorProfile}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(colorProfiles).map(([key, profile]) => (
                        <SelectItem key={key} value={key}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {currentColorProfile && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">{currentColorProfile.description}</p>
                      <p className="text-sm font-medium">Best for: {currentColorProfile.use_case}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Print Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Print Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bleed" 
                        checked={includeBleed} 
                        onCheckedChange={setIncludeBleed}
                      />
                      <label htmlFor="bleed" className="text-sm font-medium">
                        Include Bleed Area
                      </label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">
                      Extends design beyond trim line to prevent white edges
                    </p>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="crop-marks" 
                        checked={includeCropMarks} 
                        onCheckedChange={setIncludeCropMarks}
                      />
                      <label htmlFor="crop-marks" className="text-sm font-medium">
                        Include Crop Marks
                      </label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">
                      Adds trim marks for precise cutting
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button onClick={prepareForPrint} className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Prepare for Print
                    </Button>
                    <p className="text-xs text-gray-600 text-center">
                      Optimizes design settings for print production
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Single Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5" />
                    Single Export
                  </CardTitle>
                  <CardDescription>
                    Export your design in a specific format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Filename</label>
                    <Input
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      placeholder="Enter filename"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Export Format</label>
                    <Select value={selectedExportFormat} onValueChange={setSelectedExportFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(exportFormats).map(([key, format]) => (
                          <SelectItem key={key} value={key}>
                            {format.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentExportFormat && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-600">Format:</span>
                          <p className="font-medium">{currentExportFormat.extension.toUpperCase()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Color Mode:</span>
                          <p className="font-medium">{currentExportFormat.color_mode}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button onClick={exportDesign} className="w-full" disabled={isExporting}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Design
                  </Button>
                </CardContent>
              </Card>

              {/* Batch Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Batch Export
                  </CardTitle>
                  <CardDescription>
                    Export your design in multiple formats simultaneously
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Export Formats</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {Object.entries(exportFormats).map(([key, format]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`batch-${key}`}
                            checked={batchExportFormats.includes(key)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setBatchExportFormats(prev => [...prev, key]);
                              } else {
                                setBatchExportFormats(prev => prev.filter(f => f !== key));
                              }
                            }}
                          />
                          <label htmlFor={`batch-${key}`} className="text-sm">
                            {format.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>{batchExportFormats.length}</strong> formats selected
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      All files will be packaged in a ZIP archive
                    </p>
                  </div>

                  <Button onClick={batchExport} className="w-full" disabled={isExporting}>
                    <Archive className="h-4 w-4 mr-2" />
                    Batch Export
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Export Presets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Export Presets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                    <Monitor className="h-6 w-6" />
                    <span className="text-xs">Web Ready</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                    <Printer className="h-6 w-6" />
                    <span className="text-xs">Print Ready</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                    <Smartphone className="h-6 w-6" />
                    <span className="text-xs">Mobile</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                    <Globe className="h-6 w-6" />
                    <span className="text-xs">Social Media</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preflight Tab */}
          <TabsContent value="preflight" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Preflight Check
                </CardTitle>
                <CardDescription>
                  Verify your design is ready for professional printing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={runPreflightCheck} className="mb-6">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Run Preflight Check
                </Button>

                {preflightResult && (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Print Readiness Score</h3>
                        <Badge className={getStatusColor(preflightResult.status)}>
                          {preflightResult.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={preflightResult.score} className="flex-1" />
                        <span className="font-bold text-lg">{preflightResult.score}/100</span>
                      </div>
                    </div>

                    {/* Detailed Checks */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">Detailed Checks</h3>
                      {preflightResult.checks.map((check, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {getStatusIcon(check.status)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium">{check.name}</h4>
                                  <Badge variant="outline" className={getStatusColor(check.status)}>
                                    {check.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{check.message}</p>
                                <p className="text-xs text-gray-500">{check.details}</p>
                                {check.affected_elements && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-700">Affected elements:</p>
                                    <div className="flex gap-1 mt-1">
                                      {check.affected_elements.map((element, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {element}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Recommendations */}
                    {preflightResult.recommendations.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Recommendations</h3>
                        {preflightResult.recommendations.map((rec, index) => (
                          <Alert key={index}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-center justify-between">
                                <span>{rec.message}</span>
                                <Badge variant="outline" className={
                                  rec.priority === 'high' ? 'border-red-200 text-red-800' :
                                  rec.priority === 'medium' ? 'border-yellow-200 text-yellow-800' :
                                  'border-gray-200 text-gray-800'
                                }>
                                  {rec.priority}
                                </Badge>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}

                    {/* Estimated Costs */}
                    {preflightResult.estimated_print_cost && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Estimated Print Costs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-sm text-gray-600">100 copies</p>
                              <p className="text-lg font-bold">{preflightResult.estimated_print_cost.quantity_100}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">500 copies</p>
                              <p className="text-lg font-bold">{preflightResult.estimated_print_cost.quantity_500}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">1000 copies</p>
                              <p className="text-lg font-bold">{preflightResult.estimated_print_cost.quantity_1000}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Print-Ready Templates</h3>
              <p className="text-gray-600 mb-4">Professional templates optimized for print production</p>
              <Button>
                Browse Templates
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PrintExportStudio;
