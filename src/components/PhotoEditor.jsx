import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  Wand2, 
  Palette, 
  Contrast, 
  Sun, 
  Zap,
  Eye,
  Camera,
  Sparkles,
  RotateCw,
  Crop,
  Filter,
  Image as ImageIcon,
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react';

const PhotoEditor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editInstruction, setEditInstruction] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [presetIntensity, setPresetIntensity] = useState([1.0]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [availablePresets, setAvailablePresets] = useState({});
  const fileInputRef = useRef(null);

  // Professional editing presets
  const presetDescriptions = {
    'retro': 'Vintage film look with warm tones and grain',
    'cinematic': 'Movie-like color grading with dramatic contrast',
    'portrait': 'Professional portrait enhancement',
    'landscape': 'Nature photography enhancement',
    'black_white': 'Professional black and white conversion',
    'hdr': 'High dynamic range effect'
  };

  // Load available presets on component mount
  React.useEffect(() => {
    fetchAvailablePresets();
  }, []);

  const fetchAvailablePresets = async () => {
    try {
      const response = await fetch('/api/photo/presets');
      const data = await response.json();
      if (data.success) {
        setAvailablePresets(data.presets);
      }
    } catch (error) {
      console.error('Failed to fetch presets:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file: file,
          preview: e.target.result,
          name: file.name
        });
        setEditedImage(null);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage.file);

      const response = await fetch('/api/photo/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
      } else {
        console.error('Analysis failed:', data.error);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyAIEdit = async () => {
    if (!selectedImage || !editInstruction.trim()) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage.file);
      formData.append('edit_instruction', editInstruction);

      const response = await fetch('/api/photo/edit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        // Load the edited image
        const imageResponse = await fetch(`/api/photo/download/${data.output_path.split('/').pop()}`);
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        setEditedImage({
          url: imageUrl,
          path: data.output_path
        });
      } else {
        console.error('Edit failed:', data.error);
      }
    } catch (error) {
      console.error('Edit error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyPreset = async (presetName) => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage.file);
      formData.append('intensity', presetIntensity[0].toString());

      const response = await fetch(`/api/photo/preset/${presetName}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        // Load the edited image
        const imageResponse = await fetch(`/api/photo/download/${data.output_path.split('/').pop()}`);
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        setEditedImage({
          url: imageUrl,
          path: data.output_path
        });
        setSelectedPreset(presetName);
      } else {
        console.error('Preset application failed:', data.error);
      }
    } catch (error) {
      console.error('Preset error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyProfessionalEnhancement = async (enhancementType) => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage.file);
      formData.append('enhancement_type', enhancementType);

      const response = await fetch('/api/photo/professional-enhance', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        // Load the enhanced image
        const imageResponse = await fetch(`/api/photo/download/${data.output_path.split('/').pop()}`);
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        setEditedImage({
          url: imageUrl,
          path: data.output_path
        });
      } else {
        console.error('Enhancement failed:', data.error);
      }
    } catch (error) {
      console.error('Enhancement error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage.url;
      link.download = `edited_${selectedImage.name}`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Photo Editor</h1>
          <p className="text-gray-600">World-class photo editing with AI-powered enhancements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload and Image Display */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Photo Workspace
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedImage ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Upload a photo to edit</p>
                    <p className="text-gray-500">Drag and drop or click to select</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Original vs Edited</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={analyzePhoto}
                          disabled={isProcessing}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Analyze
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          New Photo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Original</p>
                        <img
                          src={selectedImage.preview}
                          alt="Original"
                          className="w-full h-64 object-cover rounded-lg border"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Edited</p>
                        {editedImage ? (
                          <div className="relative">
                            <img
                              src={editedImage.url}
                              alt="Edited"
                              className="w-full h-64 object-cover rounded-lg border"
                            />
                            <Button
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={downloadImage}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <p className="text-gray-500">No edits applied yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Photo Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Resolution</p>
                      <p className="font-medium">{analysisResult.resolution[0]} × {analysisResult.resolution[1]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Format</p>
                      <p className="font-medium">{analysisResult.format}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aspect Ratio</p>
                      <p className="font-medium">{analysisResult.aspect_ratio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">File Size</p>
                      <p className="font-medium">{Math.round(analysisResult.file_size / 1024)} KB</p>
                    </div>
                  </div>
                  
                  {analysisResult.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
                      <ul className="space-y-1">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Editing Controls */}
          <div className="space-y-6">
            {/* Professional Enhancement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Professional Enhancement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => applyProfessionalEnhancement('auto')}
                  disabled={!selectedImage || isProcessing}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Auto Enhance
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyProfessionalEnhancement('portrait')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Portrait
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyProfessionalEnhancement('landscape')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Landscape
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyProfessionalEnhancement('product')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Product
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyProfessionalEnhancement('artistic')}
                    disabled={!selectedImage || isProcessing}
                  >
                    Artistic
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Editing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="w-5 h-5 mr-2" />
                  AI Photo Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe what you want to change... e.g., 'Make it look vintage', 'Brighten the image', 'Apply retro style to this car photo'"
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  className="min-h-[80px]"
                />
                
                <Button
                  className="w-full"
                  onClick={applyAIEdit}
                  disabled={!selectedImage || !editInstruction.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Apply AI Edit
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Examples:</strong></p>
                  <p>• "Make this photo look professional"</p>
                  <p>• "Apply vintage film effect"</p>
                  <p>• "Enhance colors and contrast"</p>
                  <p>• "Make it black and white"</p>
                </div>
              </CardContent>
            </Card>

            {/* Professional Presets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Professional Presets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Intensity: {presetIntensity[0].toFixed(1)}
                  </label>
                  <Slider
                    value={presetIntensity}
                    onValueChange={setPresetIntensity}
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    className="mb-4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(presetDescriptions).map(([preset, description]) => (
                    <Button
                      key={preset}
                      variant={selectedPreset === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      disabled={!selectedImage || isProcessing}
                      className="text-xs"
                    >
                      {preset.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setEditInstruction('Increase brightness and contrast')}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Brighten
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setEditInstruction('Enhance colors and saturation')}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Enhance Colors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setEditInstruction('Sharpen image details')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Sharpen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setEditInstruction('Remove noise and smooth image')}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Denoise
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
