import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  BarChart3, 
  Upload, 
  Eye, 
  Target, 
  Palette, 
  Type, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Award, 
  Zap,
  Download,
  Share,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  FileText,
  Star
} from 'lucide-react';

const EnhancedDesignAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const analysisCategories = [
    {
      key: 'composition',
      name: 'Composition',
      icon: Target,
      description: 'Rule of thirds, balance, focal points',
      color: 'blue'
    },
    {
      key: 'color_harmony',
      name: 'Color Harmony',
      icon: Palette,
      description: 'Color theory, contrast, accessibility',
      color: 'purple'
    },
    {
      key: 'typography',
      name: 'Typography',
      icon: Type,
      description: 'Font choices, hierarchy, readability',
      color: 'green'
    },
    {
      key: 'visual_hierarchy',
      name: 'Visual Hierarchy',
      icon: Layers,
      description: 'Information flow, emphasis, structure',
      color: 'orange'
    },
    {
      key: 'brand_consistency',
      name: 'Brand Consistency',
      icon: Award,
      description: 'Brand guidelines, style compliance',
      color: 'red'
    },
    {
      key: 'technical_quality',
      name: 'Technical Quality',
      icon: Zap,
      description: 'Resolution, compression, sharpness',
      color: 'indigo'
    }
  ];

  const mockAnalysisResult = {
    overall_score: 87.5,
    overall_grade: 'B+',
    category_scores: {
      composition: 92.0,
      color_harmony: 85.0,
      typography: 88.0,
      visual_hierarchy: 90.0,
      brand_consistency: 82.0,
      technical_quality: 89.0
    },
    strengths: [
      'Excellent use of rule of thirds in composition',
      'Strong visual hierarchy guides the eye effectively',
      'Professional typography choices enhance readability',
      'Good technical quality with sharp details'
    ],
    weaknesses: [
      'Color contrast could be improved for better accessibility',
      'Some brand elements could be more prominent',
      'Minor spacing inconsistencies in layout'
    ],
    recommendations: [
      'Increase contrast ratio to meet AA accessibility standards',
      'Consider making the logo 15% larger for better brand presence',
      'Adjust line spacing in body text for improved readability',
      'Add more whitespace around key elements'
    ],
    detailed_feedback: {
      composition: {
        score: 92.0,
        feedback: 'Excellent composition following the rule of thirds. The main focal point is well-positioned and creates strong visual interest.',
        suggestions: ['Consider adding a secondary focal point for balance']
      },
      color_harmony: {
        score: 85.0,
        feedback: 'Good color palette with complementary colors. Some contrast issues detected.',
        suggestions: ['Increase contrast between text and background', 'Consider using darker shades for better accessibility']
      },
      typography: {
        score: 88.0,
        feedback: 'Professional font choices with clear hierarchy. Good readability overall.',
        suggestions: ['Increase line height for body text', 'Consider using a bolder weight for headings']
      }
    },
    confidence_score: 0.94,
    processing_time: 2.3
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(prev => ({ ...prev, preview: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const analyzeDesign = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    


    // In real implementation:
    const formData = new FormData();
    formData.append('file', selectedFile);
    const response = await fetch('/api/analysis/analyze-design', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    setAnalysisResult(result);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getCategoryIcon = (category) => {
    const categoryData = analysisCategories.find(cat => cat.key === category);
    return categoryData ? categoryData.icon : BarChart3;
  };

  const getCategoryColor = (category) => {
    const categoryData = analysisCategories.find(cat => cat.key === category);
    return categoryData ? categoryData.color : 'gray';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Design Analysis
            </h1>
            <p className="text-gray-600 mt-2">
              Professional design evaluation with actionable insights and recommendations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-purple-100 text-purple-800 border-0">
              <BarChart3 className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-0">
              <Award className="h-3 w-3 mr-1" />
              Professional Grade
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span>Upload Design</span>
                </CardTitle>
                <CardDescription>
                  Upload your design for comprehensive AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-4">
                      {selectedFile.preview && (
                        <img 
                          src={selectedFile.preview} 
                          alt="Preview" 
                          className="max-w-full h-32 object-contain mx-auto rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600 mb-2">
                          Drop your design here or click to upload
                        </p>
                        <Button onClick={() => fileInputRef.current?.click()}>
                          Choose File
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supports JPG, PNG, SVG up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />

                <Button 
                  onClick={analyzeDesign}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analyze Design
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Categories */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Analysis Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <Icon className={`h-5 w-5 text-${category.color}-600 mt-0.5`} />
                      <div>
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-gray-600">{category.description}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {analysisResult ? (
              <>
                {/* Overall Score */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <span>Overall Analysis</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 px-4 py-2 rounded-lg ${getScoreColor(analysisResult.overall_score)}`}>
                          {analysisResult.overall_score}
                        </div>
                        <div className="text-sm text-gray-600">Overall Score</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 px-4 py-2 rounded-lg ${getGradeColor(analysisResult.overall_grade)}`}>
                          {analysisResult.overall_grade}
                        </div>
                        <div className="text-sm text-gray-600">Grade</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2 px-4 py-2 rounded-lg bg-blue-50">
                          {Math.round(analysisResult.confidence_score * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Confidence</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Analysis */}
                <Tabs defaultValue="scores" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="scores">Scores</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>

                  <TabsContent value="scores" className="space-y-4">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>Category Scores</CardTitle>
                        <CardDescription>
                          Detailed breakdown of design quality across all categories
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(analysisResult.category_scores).map(([category, score]) => {
                          const Icon = getCategoryIcon(category);
                          const color = getCategoryColor(category);
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Icon className={`h-4 w-4 text-${color}-600`} />
                                  <span className="font-medium capitalize">
                                    {category.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(score)}`}>
                                  {score}%
                                </div>
                              </div>
                              <Progress value={score} className="h-2" />
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span>Strengths</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {analysisResult.strengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{strength}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-orange-600">
                            <AlertTriangle className="h-5 w-5" />
                            <span>Areas for Improvement</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {analysisResult.weaknesses.map((weakness, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{weakness}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span>Actionable Recommendations</span>
                        </CardTitle>
                        <CardDescription>
                          Specific suggestions to improve your design quality
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {analysisResult.recommendations.map((recommendation, index) => (
                          <Alert key={index} className="border-blue-200 bg-blue-50">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              {recommendation}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="insights" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(analysisResult.detailed_feedback).map(([category, feedback]) => {
                        const Icon = getCategoryIcon(category);
                        const color = getCategoryColor(category);
                        return (
                          <Card key={category} className="border-0 shadow-lg">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Icon className={`h-5 w-5 text-${color}-600`} />
                                <span className="capitalize">{category.replace('_', ' ')}</span>
                                <Badge className={`${getScoreColor(feedback.score)} border-0`}>
                                  {feedback.score}%
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-gray-700">{feedback.feedback}</p>
                              {feedback.suggestions && feedback.suggestions.length > 0 && (
                                <div className="space-y-2">
                                  <div className="font-medium text-sm">Suggestions:</div>
                                  {feedback.suggestions.map((suggestion, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                      <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                                      <span className="text-sm text-gray-600">{suggestion}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-16">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Ready for Analysis
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Upload a design to get started with professional AI analysis
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
                      {analysisCategories.slice(0, 6).map((category) => {
                        const Icon = category.icon;
                        return (
                          <div key={category.key} className="text-center p-3 bg-gray-50 rounded-lg">
                            <Icon className={`h-6 w-6 text-${category.color}-500 mx-auto mb-1`} />
                            <div className="text-xs font-medium">{category.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDesignAnalysis;

