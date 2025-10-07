import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { 
  FileText, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Heart, 
  Share2, 
  Copy, 
  Edit3, 
  Plus,
  Grid3X3,
  List,
  Sparkles,
  Palette,
  Type,
  Image as ImageIcon,
  Layout,
  Layers,
  Settings,
  Save,
  Eye,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Users,
  Crown,
  Zap,
  Tag,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  ChevronDown,
  X,
  Check,
  Wand2
} from 'lucide-react';

const TemplateStudio = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState({});
  const [styles, setStyles] = useState({});
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizations, setCustomizations] = useState({});
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'personal',
    style: 'modern',
    tags: []
  });

  const API_BASE_URL = 'https://vgh0i1c19lg9.manus.space';

  useEffect(() => {
    fetchTemplateData();
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'all' || selectedStyle !== 'all' || searchQuery || sortBy !== 'popular') {
      fetchFilteredTemplates();
    }
  }, [selectedCategory, selectedStyle, searchQuery, sortBy]);

  const fetchTemplateData = async () => {
    try {
      const [categoriesRes, stylesRes, featuredRes, templatesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/templates/categories`),
        fetch(`${API_BASE_URL}/api/templates/styles`),
        fetch(`${API_BASE_URL}/api/templates/featured`),
        fetch(`${API_BASE_URL}/api/templates/browse?limit=20`)
      ]);

      const [categoriesData, stylesData, featuredData, templatesData] = await Promise.all([
        categoriesRes.json(),
        stylesRes.json(),
        featuredRes.json(),
        templatesRes.json()
      ]);

      if (categoriesData.success) setCategories(categoriesData.categories);
      if (stylesData.success) setStyles(stylesData.styles);
      if (featuredData.success) setFeaturedTemplates(featuredData.featured_templates);
      if (templatesData.success) setTemplates(templatesData.templates);
    } catch (error) {
      console.error('Error fetching template data:', error);
    }
  };

  const fetchFilteredTemplates = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedStyle !== 'all') params.append('style', selectedStyle);
      if (searchQuery) params.append('search', searchQuery);
      params.append('sort_by', sortBy);
      params.append('limit', '20');

      const response = await fetch(`${API_BASE_URL}/api/templates/browse?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching filtered templates:', error);
    }
  };

  const handleTemplateSelect = async (templateId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/templates/${templateId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedTemplate(data.template);
        setActiveTab('customize');
      }
    } catch (error) {
      console.error('Error fetching template details:', error);
    }
  };

  const handleCustomize = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/templates/${selectedTemplate.id}/customize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customizations: customizations
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Template customized:', data.customized_template);
        // Handle successful customization
      }
    } catch (error) {
      console.error('Error customizing template:', error);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/templates/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Template created:', data.template);
        setIsCreating(false);
        setNewTemplate({
          name: '',
          description: '',
          category: 'personal',
          style: 'modern',
          tags: []
        });
        fetchTemplateData(); // Refresh templates
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleDuplicateTemplate = async (templateId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/templates/${templateId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${selectedTemplate?.name} (Copy)`
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Template duplicated:', data.duplicate_template);
        fetchTemplateData(); // Refresh templates
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const TemplateCard = ({ template, size = 'normal' }) => {
    const cardClass = size === 'small' ? 'w-48' : 'w-full';
    const imageClass = size === 'small' ? 'h-32' : 'h-48';

    return (
      <Card className={`${cardClass} hover:shadow-lg transition-shadow cursor-pointer group`}>
        <div className="relative">
          <img
            src={template.preview_url}
            alt={template.name}
            className={`w-full ${imageClass} object-cover rounded-t-lg`}
            onClick={() => handleTemplateSelect(template.id)}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {template.is_premium && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm line-clamp-2">{template.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {template.rating}
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {template.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Download className="h-3 w-3" />
              {template.downloads}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => handleTemplateSelect(template.id)}
            >
              Use Template
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleDuplicateTemplate(template.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-7 w-7 text-purple-600" />
                Template Studio
              </h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Professional Templates
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
              <Button variant="outline">
                <Bookmark className="h-4 w-4 mr-2" />
                Saved
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="my-templates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Templates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Browse Tab */}
          <TabsContent value="browse" className="h-full">
            <div className="flex h-full">
              {/* Sidebar Filters */}
              <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-auto">
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Templates</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(categories).map(([key, category]) => (
                          <SelectItem key={key} value={key}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Styles */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Style</label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Styles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Styles</SelectItem>
                        {Object.entries(styles).map(([key, style]) => (
                          <SelectItem key={key} value={key}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="downloads">Most Downloaded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quick Filters</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="free" />
                        <label htmlFor="free" className="text-sm">Free Templates</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="premium" />
                        <label htmlFor="premium" className="text-sm">Premium Templates</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="new" />
                        <label htmlFor="new" className="text-sm">New This Week</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6">
                {/* Featured Templates */}
                {featuredTemplates.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Featured Templates</h2>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        >
                          {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {featuredTemplates.map((template) => (
                        <TemplateCard key={template.id} template={template} size="small" />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Templates */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      All Templates ({templates.length})
                    </h2>
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {templates.map((template) => (
                        <TemplateCard key={template.id} template={template} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {templates.map((template) => (
                        <Card key={template.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={template.thumbnail_url}
                                alt={template.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold">{template.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      {template.rating}
                                    </div>
                                    <Badge variant="outline">{template.style}</Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex gap-1">
                                    {template.tags.slice(0, 3).map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleTemplateSelect(template.id)}>
                                      Use Template
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Heart className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="h-full p-6">
            {selectedTemplate ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Template Preview */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={selectedTemplate.preview_url}
                      alt={selectedTemplate.name}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleCustomize} className="flex-1">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Apply Customizations
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Customization Panel */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Customize Template</h3>
                  <div className="space-y-4">
                    {selectedTemplate.customizable_fields?.map((field) => (
                      <div key={field}>
                        <label className="text-sm font-medium mb-2 block capitalize">
                          {field.replace('_', ' ')}
                        </label>
                        {field === 'color_scheme' ? (
                          <div className="flex gap-2">
                            {selectedTemplate.color_scheme.map((color, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded border cursor-pointer"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        ) : (
                          <Input
                            placeholder={`Enter ${field.replace('_', ' ')}`}
                            value={customizations[field] || ''}
                            onChange={(e) => setCustomizations(prev => ({
                              ...prev,
                              [field]: e.target.value
                            }))}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Template Selected</h3>
                  <p className="text-gray-600 mb-4">Choose a template from the Browse tab to customize it</p>
                  <Button onClick={() => setActiveTab('browse')}>
                    Browse Templates
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Create Tab */}
          <TabsContent value="create" className="h-full p-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Template
                  </CardTitle>
                  <CardDescription>
                    Design a custom template from scratch
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Template Name</label>
                    <Input
                      placeholder="Enter template name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe your template"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select 
                        value={newTemplate.category} 
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categories).map(([key, category]) => (
                            <SelectItem key={key} value={key}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Style</label>
                      <Select 
                        value={newTemplate.style} 
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, style: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(styles).map(([key, style]) => (
                            <SelectItem key={key} value={key}>
                              {style.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateTemplate} className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Templates Tab */}
          <TabsContent value="my-templates" className="h-full p-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Your Templates</h3>
              <p className="text-gray-600 mb-4">Templates you've created and customized will appear here</p>
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TemplateStudio;
