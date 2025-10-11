import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Palette, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Shapes, 
  Layers, 
  Wand,
  Download,
  Save,
  Share2,
  Settings,
  Sparkles,
  Wand2,
  Brush,
  Pipette,
  Grid,
  AlignCenter,
  Copy,
  Scissors,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Eye,
  Maximize,
  Minimize,
  Eraser

} from 'lucide-react';
import DesignCanvas from './DesignCanvas';

const VisualDesignStudio = () => {
  const [activeTab, setActiveTab] = useState('canvas');
  const [templates, setTemplates] = useState([]);
  const [colorPalette, setColorPalette] = useState(['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']);
  const [recentColors, setRecentColors] = useState(['#000000', '#ffffff', '#6b7280']);
  const [designMode, setDesignMode] = useState('freeform'); // freeform, template, guided

  // Template categories
  const templateCategories = [
    {
      name: 'Business',
      templates: [
        { id: 1, name: 'Business Card', preview: '/api/placeholder/200/120', category: 'business' },
        { id: 2, name: 'Letterhead', preview: '/api/placeholder/200/260', category: 'business' },
        { id: 3, name: 'Invoice', preview: '/api/placeholder/200/260', category: 'business' }
      ]
    },
    {
      name: 'Marketing',
      templates: [
        { id: 4, name: 'Flyer', preview: '/api/placeholder/200/260', category: 'marketing' },
        { id: 5, name: 'Poster', preview: '/api/placeholder/200/280', category: 'marketing' },
        { id: 6, name: 'Banner', preview: '/api/placeholder/200/80', category: 'marketing' }
      ]
    },
    {
      name: 'Social Media',
      templates: [
        { id: 7, name: 'Instagram Post', preview: '/api/placeholder/200/200', category: 'social' },
        { id: 8, name: 'Facebook Cover', preview: '/api/placeholder/200/80', category: 'social' },
        { id: 9, name: 'Twitter Header', preview: '/api/placeholder/200/80', category: 'social' }
      ]
    },
    {
      name: 'Print',
      templates: [
        { id: 10, name: 'Brochure', preview: '/api/placeholder/200/140', category: 'print' },
        { id: 11, name: 'Menu', preview: '/api/placeholder/200/280', category: 'print' },
        { id: 12, name: 'Invitation', preview: '/api/placeholder/200/140', category: 'print' }
      ]
    }
  ];

  // Design assets
  const designAssets = {
    shapes: [
      { name: 'Rectangle', icon: '⬜', type: 'rectangle' },
      { name: 'Circle', icon: '⭕', type: 'circle' },
      { name: 'Triangle', icon: '🔺', type: 'triangle' },
      { name: 'Star', icon: '⭐', type: 'star' },
      { name: 'Arrow', icon: '➡️', type: 'arrow' },
      { name: 'Heart', icon: '❤️', type: 'heart' }
    ],
    icons: [
      { name: 'Home', icon: '🏠', category: 'general' },
      { name: 'Phone', icon: '📱', category: 'contact' },
      { name: 'Email', icon: '📧', category: 'contact' },
      { name: 'Location', icon: '📍', category: 'contact' },
      { name: 'Star', icon: '⭐', category: 'rating' },
      { name: 'Check', icon: '✅', category: 'status' }
    ],
    illustrations: [
      { name: 'Abstract 1', preview: '/api/placeholder/100/100', category: 'abstract' },
      { name: 'Abstract 2', preview: '/api/placeholder/100/100', category: 'abstract' },
      { name: 'Nature 1', preview: '/api/placeholder/100/100', category: 'nature' },
      { name: 'Business 1', preview: '/api/placeholder/100/100', category: 'business' }
    ]
  };

  const addColorToPalette = (color) => {
    if (!colorPalette.includes(color)) {
      setColorPalette(prev => [...prev.slice(0, 9), color]);
    }
    if (!recentColors.includes(color)) {
      setRecentColors(prev => [color, ...prev.slice(0, 7)]);
    }
  };

  const loadTemplate = (template) => {
    // This would load the template into the canvas
  console.log('Loading template:', template);
  };

  const handleRemoveBackground = async () => {
    // Placeholder for background removal logic
   console.log("Removing background...");    // In a real scenario, this would call the backend API
    // const response = await fetch(`${API_BASE_URL}/api/ai-tools/remove-background`, { ... });
  };

  const handleGeneratePalette = async () => {
    // Placeholder for color palette generation logic
    console.log("Generating color palette...");
    // const response = await fetch(`${API_BASE_URL}/api/ai-tools/generate-palette`, { ... });
  };

  return (
    <div className="h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Palette className="h-6 w-6 text-purple-600" />
                Visual Design Studio
              </h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Professional
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5 mt-4 bg-gray-100">
            <TabsTrigger value="canvas" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Canvas
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Shapes className="h-4 w-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="ai-tools" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              AI Tools
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Canvas Tab */}
          <TabsContent value="canvas" className="h-full m-0">
            <DesignCanvas />
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="h-full m-0 p-6">
            <div className="h-full overflow-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Design Templates</h2>
                <p className="text-gray-600">Choose from professionally designed templates to get started quickly</p>
              </div>

              <div className="space-y-8">
                {templateCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {category.templates.map((template) => (
                        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="aspect-[4/3] bg-gray-100 rounded mb-2 flex items-center justify-center">
                              <Layout className="h-8 w-8 text-gray-400" />
                            </div>
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <Button 
                              size="sm" 
                              className="w-full mt-2"
                              onClick={() => loadTemplate(template)}
                            >
                              Use Template
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="h-full m-0 p-6">
            <div className="h-full overflow-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Design Assets</h2>
                <p className="text-gray-600">Add shapes, icons, and illustrations to your design</p>
              </div>

              <Tabs defaultValue="shapes" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="shapes">Shapes</TabsTrigger>
                  <TabsTrigger value="icons">Icons</TabsTrigger>
                  <TabsTrigger value="illustrations">Illustrations</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                </TabsList>

                <TabsContent value="shapes">
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {designAssets.shapes.map((shape) => (
                      <Card key={shape.name} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{shape.icon}</div>
                          <p className="text-xs font-medium">{shape.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="icons">
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {designAssets.icons.map((icon) => (
                      <Card key={icon.name} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3 text-center">
                          <div className="text-xl mb-1">{icon.icon}</div>
                          <p className="text-xs font-medium">{icon.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="illustrations">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {designAssets.illustrations.map((illustration) => (
                      <Card key={illustration.name} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium">{illustration.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="photos">
                  <div className="text-center py-12">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Stock Photos</h3>
                    <p className="text-gray-600 mb-4">Access millions of high-quality stock photos</p>
                    <Button>
                      Browse Photos
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="h-full m-0 p-6">
            <div className="h-full overflow-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Color Palette</h2>
                <p className="text-gray-600">Manage colors for your design</p>
              </div>

              {/* Color Picker */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pipette className="h-5 w-5" />
                    Color Picker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      type="color"
                      className="w-full h-12"
                      onChange={(e) => addColorToPalette(e.target.value)}
                    />
                    <div className="grid grid-cols-8 gap-2">
                      <div className="col-span-8">
                        <label className="text-sm font-medium">Recent Colors</label>
                        <div className="flex gap-2 mt-2">
                          {recentColors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded cursor-pointer border-2 border-gray-200"
                              style={{ backgroundColor: color }}
                              onClick={() => addColorToPalette(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Palette */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Palette</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-3">
                    {colorPalette.map((color, index) => (
                      <div key={index} className="text-center">
                        <div
                          className="w-full aspect-square rounded-lg cursor-pointer border-2 border-gray-200 mb-2"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-xs font-mono">{color}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Preset Palettes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preset Palettes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Modern Blue', colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'] },
                      { name: 'Warm Sunset', colors: ['#dc2626', '#ea580c', '#f59e0b', '#fbbf24', '#fde047'] },
                      { name: 'Nature Green', colors: ['#166534', '#16a34a', '#22c55e', '#4ade80', '#bbf7d0'] },
                      { name: 'Purple Gradient', colors: ['#581c87', '#7c3aed', '#a855f7', '#c084fc', '#e9d5ff'] }
                    ].map((palette) => (
                      <div key={palette.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{palette.name}</h4>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setColorPalette(palette.colors)}
                          >
                            Use Palette
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          {palette.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai-tools" className="h-full m-0 p-6">
            <div className="h-full overflow-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">AI-Powered Design Tools</h2>
                <p className="text-gray-600">Enhance your designs with artificial intelligence</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* AI Image Generation */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-purple-600" />
                      Image Generation
                    </CardTitle>
                    <CardDescription>
                      Generate custom images from text descriptions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Generate Images
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Background Removal */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scissors className="h-5 w-5 text-blue-600" />
                      Background Removal
                    </CardTitle>
                    <CardDescription>
                      Automatically remove backgrounds from images
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Remove Background
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Color Palette */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-green-600" />
                      Smart Colors
                    </CardTitle>
                    <CardDescription>
                      Generate harmonious color palettes automatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Generate Palette
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Layout Suggestions */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="h-5 w-5 text-orange-600" />
                      Layout Assistant
                    </CardTitle>
                    <CardDescription>
                      Get intelligent layout and composition suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Suggest Layouts
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Text Enhancement */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5 text-red-600" />
                      Text Enhancement
                    </CardTitle>
                    <CardDescription>
                      Improve typography and text formatting automatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Enhance Text
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Style Transfer */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brush className="h-5 w-5 text-indigo-600" />
                      Style Transfer
                    </CardTitle>
                    <CardDescription>
                      Apply artistic styles to your designs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Apply Style
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* AI Assistant */}
              <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand className="h-5 w-5 text-purple-600" />
                  AI Design Assistant
                </CardTitle>
                  <CardDescription>
                    Get personalized design suggestions and feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">💡 <strong>Suggestion:</strong></p>
                    <p className="text-sm">Consider adding more contrast between your text and background for better readability.</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-2">🎨 <strong>Tip:</strong></p>
                    <p className="text-sm">Your color palette works well! Try using the complementary color #f59e0b for accent elements.</p>
                  </div>
                  <Button className="w-full">
                    Get More Suggestions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default VisualDesignStudio;
