import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Wand2, 
  Download, 
  Copy, 
  Shuffle, 
  Settings, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [variations, setVariations] = useState([]);
  const [styles, setStyles] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);

  const API_BASE_URL = 'https://9yhyi3cpe161.manus.space';

  useEffect(() => {
    fetchStyles();
    fetchSizes();
  }, []);

  const fetchStyles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image/styles`);
      const data = await response.json();
      if (data.success) {
        setStyles(data.styles);
      }
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image/sizes`);
      const data = await response.json();
      if (data.success) {
        setSizes(data.sizes);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const response = await fetch(`${API_BASE_URL}/api/image/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          size: selectedSize,
          quality
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.placeholder) {
          setSuccess(data.message);
          setError('');
        } else {
          setGeneratedImage(data);
          setSuccess('Image generated successfully!');
        }
        setProgress(100);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const createVariations = async () => {
    if (!generatedImage) {
      setError('No image to create variations from');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/image/variations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: generatedImage.image_url,
          count: 3
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setVariations(data.variations);
        setSuccess(`Created ${data.count} variations!`);
      } else {
        setError(data.error || 'Failed to create variations');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl, filename = 'generated-image.png') => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Wand2 className="h-8 w-8 text-purple-600" />
          AI Image Generator
        </h1>
        <p className="text-gray-600">Create stunning images with AI-powered generation</p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button variant="ghost" size="sm" onClick={clearMessages} className="ml-auto">
            ×
          </Button>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
          <Button variant="ghost" size="sm" onClick={clearMessages} className="ml-auto">
            ×
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Generation Settings
            </CardTitle>
            <CardDescription>
              Configure your image generation parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Prompt</label>
              <Textarea
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Style</label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Quality</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="hd">HD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Generating image...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={generateImage} 
                disabled={isGenerating || !prompt.trim()}
                className="flex-1"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate Image
              </Button>
              
              {generatedImage && (
                <Button 
                  variant="outline" 
                  onClick={createVariations}
                  disabled={isGenerating}
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Variations
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Image Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Generated Image
            </CardTitle>
            <CardDescription>
              Your AI-generated image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedImage ? (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={generatedImage.image_base64}
                    alt="Generated image"
                    className="w-full h-auto rounded-lg border shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(generatedImage.image_base64)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(generatedImage.image_url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedStyle}</Badge>
                    <Badge variant="outline">{selectedSize}</Badge>
                    <Badge variant="outline">{quality}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Prompt:</strong> {generatedImage.prompt_used}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <ImageIcon className="h-12 w-12 mb-2" />
                <p>No image generated yet</p>
                <p className="text-sm">Enter a prompt and click generate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Variations */}
      {variations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              Image Variations
            </CardTitle>
            <CardDescription>
              Different variations of your generated image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {variations.map((variation, index) => (
                <div key={index} className="relative group">
                  <img
                    src={variation.base64}
                    alt={`Variation ${index + 1}`}
                    className="w-full h-auto rounded-lg border shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(variation.base64, `variation-${index + 1}.png`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(variation.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerator;
