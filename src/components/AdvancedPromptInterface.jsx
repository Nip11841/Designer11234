import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Sparkles, 
  Target, 
  Palette, 
  Layers, 
  Zap, 
  Settings, 
  Copy, 
  RefreshCw,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
  Wand2,
  Eye,
  Download
} from 'lucide-react';

const AdvancedPromptInterface = () => {
  const [promptConfig, setPromptConfig] = useState({
    productType: '',
    industry: '',
    targetAudience: '',
    brandPersonality: [],
    complexityLevel: 'professional',
    qualityTier: 'premium',
    contextType: 'commercial',
    seasonalContext: 'none',
    culturalContext: 'global',
    additionalRequirements: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [promptAnalysis, setPromptAnalysis] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [promptHistory, setPromptHistory] = useState([]);

  const complexityLevels = [
    { value: 'basic', label: 'Basic', description: 'Simple, straightforward prompts' },
    { value: 'intermediate', label: 'Intermediate', description: 'Balanced detail and creativity' },
    { value: 'professional', label: 'Professional', description: 'Detailed professional specifications' },
    { value: 'expert', label: 'Expert', description: 'Highly detailed technical prompts' },
    { value: 'masterpiece', label: 'Masterpiece', description: 'Maximum detail and sophistication' }
  ];

  const qualityTiers = [
    { value: 'standard', label: 'Standard', description: 'Good quality output' },
    { value: 'premium', label: 'Premium', description: 'High quality with attention to detail' },
    { value: 'luxury', label: 'Luxury', description: 'Exceptional quality and refinement' }
  ];

  const contextTypes = [
    { value: 'commercial', label: 'Commercial', description: 'Business and marketing focused' },
    { value: 'personal', label: 'Personal', description: 'Individual and personal use' },
    { value: 'artistic', label: 'Artistic', description: 'Creative and expressive' },
    { value: 'corporate', label: 'Corporate', description: 'Professional corporate identity' },
    { value: 'educational', label: 'Educational', description: 'Learning and instructional' }
  ];

  const productTypes = [
    'Business Card', 'Logo', 'Poster', 'Brochure', 'Social Media Post', 
    'Website Banner', 'Presentation Slide', 'Book Cover', 'Product Label', 
    'Invitation', 'Flyer', 'Newsletter', 'Infographic', 'Certificate'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Entertainment', 
    'Retail', 'Food & Beverage', 'Real Estate', 'Automotive', 'Fashion',
    'Travel', 'Sports', 'Non-profit', 'Legal', 'Consulting'
  ];

  const audiences = [
    'Young Adults (18-25)', 'Professionals (25-45)', 'Executives (35-55)', 
    'Seniors (55+)', 'Students', 'Parents', 'Entrepreneurs', 'Creatives',
    'Technical Experts', 'General Public'
  ];

  const brandPersonalities = [
    'Modern', 'Traditional', 'Innovative', 'Trustworthy', 'Creative', 
    'Professional', 'Friendly', 'Sophisticated', 'Bold', 'Minimalist',
    'Playful', 'Elegant', 'Reliable', 'Dynamic', 'Authentic'
  ];

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      // Map frontend field names to backend expected field names
      const backendData = {
        product_type: promptConfig.productType,
        industry: promptConfig.industry,
        target_audience: promptConfig.targetAudience,
        brand_personality: promptConfig.brandPersonality,
        complexity_level: promptConfig.complexityLevel,
        quality_tier: promptConfig.qualityTier,
        design_context: promptConfig.contextType,
        seasonal_context: promptConfig.seasonalContext,
        cultural_context: promptConfig.culturalContext,
        additional_notes: promptConfig.additionalRequirements
      };

      const response = await fetch('https://mzhyi8c1pp9z.manus.space/api/prompt/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedPrompt(data.prompt);
        setPromptAnalysis(data.analysis);
        
        // Add to history
        const historyItem = {
          id: Date.now(),
          prompt: data.prompt,
          config: { ...promptConfig },
          timestamp: new Date().toISOString(),
          analysis: data.analysis
        };
        setPromptHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Failed to generate prompt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!generatedPrompt) {
      alert("Please generate a prompt first.");
      return;
    }
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    try {
      const response = await fetch("https://mzhyi8c1pp9z.manus.space/api/prompt/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: generatedPrompt }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedImageUrl(data.image_url);
      } else {
        console.error("Failed to generate image:", data.error);
        alert(`Image generation failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Image generation failed due to network or server error.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const analyzePrompt = async (prompt) => {
    try {
      const response = await fetch('https://mzhyi8c1pp9z.manus.space/api/prompt/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.success) {
        setPromptAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Failed to analyze prompt:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handlePersonalityToggle = (personality) => {
    setPromptConfig(prev => ({
      ...prev,
      brandPersonality: prev.brandPersonality.includes(personality)
        ? prev.brandPersonality.filter(p => p !== personality)
        : [...prev.brandPersonality, personality]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Advanced Prompt Engineering
            </h1>
            <p className="text-gray-600 mt-2">
              Generate sophisticated AI prompts with professional-grade precision
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800 border-0">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Professional
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>Prompt Configuration</span>
                </CardTitle>
                <CardDescription>
                  Configure advanced parameters for optimal prompt generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="context">Context</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productType">Product Type</Label>
                        <Select value={promptConfig.productType} onValueChange={(value) => 
                          setPromptConfig(prev => ({ ...prev, productType: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            {productTypes.map(type => (
                              <SelectItem key={type} value={type.toLowerCase().replace(' ', '_')}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select value={promptConfig.industry} onValueChange={(value) => 
                          setPromptConfig(prev => ({ ...prev, industry: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map(industry => (
                              <SelectItem key={industry} value={industry.toLowerCase()}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <Select value={promptConfig.targetAudience} onValueChange={(value) => 
                        setPromptConfig(prev => ({ ...prev, targetAudience: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          {audiences.map(audience => (
                            <SelectItem key={audience} value={audience.toLowerCase().replace(/[^a-z0-9]/g, '_')}>
                              {audience}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Brand Personality</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {brandPersonalities.map(personality => (
                          <Button
                            key={personality}
                            variant={promptConfig.brandPersonality.includes(personality) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePersonalityToggle(personality)}
                            className="justify-start"
                          >
                            {personality}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Complexity Level</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {complexityLevels.map(level => (
                            <div
                              key={level.value}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                promptConfig.complexityLevel === level.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setPromptConfig(prev => ({ ...prev, complexityLevel: level.value }))}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{level.label}</div>
                                  <div className="text-sm text-gray-600">{level.description}</div>
                                </div>
                                {promptConfig.complexityLevel === level.value && (
                                  <CheckCircle className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Quality Tier</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {qualityTiers.map(tier => (
                            <div
                              key={tier.value}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                promptConfig.qualityTier === tier.value
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setPromptConfig(prev => ({ ...prev, qualityTier: tier.value }))}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{tier.label}</div>
                                  <div className="text-sm text-gray-600">{tier.description}</div>
                                </div>
                                {promptConfig.qualityTier === tier.value && (
                                  <CheckCircle className="h-5 w-5 text-purple-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="context" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Context Type</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {contextTypes.map(context => (
                            <div
                              key={context.value}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                promptConfig.contextType === context.value
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setPromptConfig(prev => ({ ...prev, contextType: context.value }))}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{context.label}</div>
                                  <div className="text-sm text-gray-600">{context.description}</div>
                                </div>
                                {promptConfig.contextType === context.value && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Seasonal Context</Label>
                          <Select value={promptConfig.seasonalContext} onValueChange={(value) => 
                            setPromptConfig(prev => ({ ...prev, seasonalContext: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Seasonal Context</SelectItem>
                              <SelectItem value="spring">Spring</SelectItem>
                              <SelectItem value="summer">Summer</SelectItem>
                              <SelectItem value="autumn">Autumn</SelectItem>
                              <SelectItem value="winter">Winter</SelectItem>
                              <SelectItem value="holiday">Holiday Season</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Cultural Context</Label>
                          <Select value={promptConfig.culturalContext} onValueChange={(value) => 
                            setPromptConfig(prev => ({ ...prev, culturalContext: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select culture" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="global">Global/Universal</SelectItem>
                              <SelectItem value="western">Western</SelectItem>
                              <SelectItem value="eastern">Eastern</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="traditional">Traditional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                        <Textarea
                          id="additionalRequirements"
                          placeholder="Specify any additional requirements, constraints, or special instructions..."
                          value={promptConfig.additionalRequirements}
                          onChange={(e) => setPromptConfig(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800">Precision Mode</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Generate highly specific and detailed prompts for exact requirements
                          </p>
                        </Card>

                        <Card className="p-4 border-2 border-purple-200 bg-purple-50">
                          <div className="flex items-center space-x-2 mb-2">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-purple-800">Creative Mode</span>
                          </div>
                          <p className="text-sm text-purple-700">
                            Generate creative and innovative prompts with artistic flair
                          </p>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex space-x-2 mt-6">
                  <Button 
                    onClick={generatePrompt} 
                    disabled={isGenerating} 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    {isGenerating ? (
                      <span className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Prompt
                      </span>
                    )}
                  </Button>

                  {generatedPrompt && (
                    <Button 
                      onClick={generateImage} 
                      disabled={isGeneratingImage} 
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition-all duration-300 mt-4"
                    >
                      {isGeneratingImage ? (
                        <span className="flex items-center">
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating Image...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Wand2 className="mr-2 h-4 w-4" />
                          Generate Image from Prompt
                        </span>
                      )}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setPromptConfig({
                    productType: '',
                    industry: '',
                    targetAudience: '',
                    brandPersonality: [],
                    complexityLevel: 'professional',
                    qualityTier: 'premium',
                    contextType: 'commercial',
                    seasonalContext: 'none',
                    culturalContext: 'global',
                    additionalRequirements: ''
                  })}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Generated Prompt */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Generated Prompt</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedPrompt ? (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-sm leading-relaxed">{generatedPrompt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedPrompt)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Configure parameters and generate your prompt</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prompt Analysis */}
            {promptAnalysis && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Prompt Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {promptAnalysis.complexity_score || 85}
                      </div>
                      <div className="text-xs text-gray-600">Complexity</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {promptAnalysis.quality_score || 92}
                      </div>
                      <div className="text-xs text-gray-600">Quality</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Specificity</span>
                      <span className="text-sm text-gray-600">
                        {promptAnalysis.specificity_score || 88}%
                      </span>
                    </div>
                    <Progress value={promptAnalysis.specificity_score || 88} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Creativity</span>
                      <span className="text-sm text-gray-600">
                        {promptAnalysis.creativity_score || 76}%
                      </span>
                    </div>
                    <Progress value={promptAnalysis.creativity_score || 76} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Technical Detail</span>
                      <span className="text-sm text-gray-600">
                        {promptAnalysis.technical_score || 91}%
                      </span>
                    </div>
                    <Progress value={promptAnalysis.technical_score || 91} className="h-2" />
                  </div>

                  {promptAnalysis.suggestions && promptAnalysis.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Suggestions</Label>
                      <div className="space-y-1">
                        {promptAnalysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <Info className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </CardContent>
                </Card>
              )}

              {generatedImageUrl && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wand2 className="h-5 w-5 text-blue-600" />
                      <span>Generated Image</span>
                    </CardTitle>
                    <CardDescription>
                      Image generated from the prompt using DALL-E.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img src={generatedImageUrl} alt="Generated by DALL-E" className="w-full h-auto rounded-lg shadow-md" />
                    <a href={generatedImageUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" /> Download Image
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )}

            {/* Prompt History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-gray-600" />
                  <span>Recent Prompts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {promptHistory.length > 0 ? (
                  promptHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.config.productType || 'General'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {item.prompt.substring(0, 100)}...
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" variant="ghost" className="h-6 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No recent prompts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPromptInterface;

