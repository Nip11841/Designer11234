import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Undo, 
  Redo, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical,
  Crop,
  Scissors,
  Brush,
  Eraser,
  Pipette,
  Palette,
  Contrast,
  Sun,
  Moon,
  Zap,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  Layers,
  Filter,
  Wand2,
  Target,
  Move,
  Square,
  Circle,
  Type,
  Zap as Blur,
  Eye as Focus,
  Droplets,
  Paintbrush,
  PaintBucket,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Grid,
  Save,
  Settings,
  Wand2 as Magic,
  Settings as Sliders,
  Camera,
  ImageIcon as Film,
  Circle as Aperture
} from 'lucide-react';

const AdvancedImageEditor = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [canvasContext, setCanvasContext] = useState(null);
  const [tool, setTool] = useState('select');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('basic');
  const [layers, setLayers] = useState([]);
  const [activeLayer, setActiveLayer] = useState(0);

  // Image adjustments state
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    clarity: 0,
    vibrance: 0,
    temperature: 0,
    tint: 0
  });

  // Filters and effects
  const filters = [
    { name: 'None', value: 'none', preview: 'Original' },
    { name: 'Vintage', value: 'vintage', preview: 'Warm, aged look' },
    { name: 'Black & White', value: 'bw', preview: 'Classic monochrome' },
    { name: 'Sepia', value: 'sepia', preview: 'Warm brown tones' },
    { name: 'Cool', value: 'cool', preview: 'Blue-tinted cool tones' },
    { name: 'Warm', value: 'warm', preview: 'Orange-tinted warm tones' },
    { name: 'High Contrast', value: 'high-contrast', preview: 'Enhanced contrast' },
    { name: 'Soft', value: 'soft', preview: 'Gentle, dreamy effect' },
    { name: 'Dramatic', value: 'dramatic', preview: 'Bold, intense look' },
    { name: 'Film', value: 'film', preview: 'Classic film emulation' },
    { name: 'Polaroid', value: 'polaroid', preview: 'Instant camera style' },
    { name: 'Cross Process', value: 'cross-process', preview: 'Color-shifted effect' }
  ];

  const [selectedFilter, setSelectedFilter] = useState('none');

  // Tools configuration
  const tools = [
    { id: 'select', name: 'Select', icon: Target, cursor: 'default' },
    { id: 'move', name: 'Move', icon: Move, cursor: 'move' },
    { id: 'crop', name: 'Crop', icon: Crop, cursor: 'crosshair' },
    { id: 'brush', name: 'Brush', icon: Brush, cursor: 'crosshair' },
    { id: 'eraser', name: 'Eraser', icon: Eraser, cursor: 'crosshair' },
    { id: 'clone', name: 'Clone', icon: Copy, cursor: 'crosshair' },
    { id: 'heal', name: 'Heal', icon: Wand2, cursor: 'crosshair' },
    { id: 'blur', name: 'Blur', icon: Blur, cursor: 'crosshair' },
    { id: 'sharpen', name: 'Sharpen', icon: Focus, cursor: 'crosshair' },
    { id: 'dodge', name: 'Dodge', icon: Sun, cursor: 'crosshair' },
    { id: 'burn', name: 'Burn', icon: Moon, cursor: 'crosshair' },
    { id: 'smudge', name: 'Smudge', icon: Droplets, cursor: 'crosshair' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setCanvasContext(ctx);
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setOriginalImage(img);
          drawImageToCanvas(img);
          saveToHistory();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImageToCanvas = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvasContext;
    if (canvas && ctx && img) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  };

  const applyAdjustments = useCallback(() => {
    if (!originalImage || !canvasContext) return;

    const canvas = canvasRef.current;
    const ctx = canvasContext;
    
    // Reset to original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply adjustments
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Brightness
      r += adjustments.brightness * 2.55;
      g += adjustments.brightness * 2.55;
      b += adjustments.brightness * 2.55;
      
      // Contrast
      const contrast = (adjustments.contrast + 100) / 100;
      r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrast + 0.5) * 255;
      
      // Saturation
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const saturation = (adjustments.saturation + 100) / 100;
      r = gray + (r - gray) * saturation;
      g = gray + (g - gray) * saturation;
      b = gray + (b - gray) * saturation;
      
      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [originalImage, canvasContext, adjustments]);

  useEffect(() => {
    if (originalImage) {
      applyAdjustments();
    }
  }, [adjustments, applyAdjustments, originalImage]);

  const applyFilter = (filterName) => {
    if (!canvasContext || !originalImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvasContext;
    
    // Reset to original
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0);
    
    // Apply filter using CSS filters (simplified approach)
    switch (filterName) {
      case 'bw':
        ctx.filter = 'grayscale(100%)';
        break;
      case 'sepia':
        ctx.filter = 'sepia(100%)';
        break;
      case 'vintage':
        ctx.filter = 'sepia(50%) contrast(1.2) brightness(1.1)';
        break;
      case 'cool':
        ctx.filter = 'hue-rotate(180deg) saturate(1.2)';
        break;
      case 'warm':
        ctx.filter = 'hue-rotate(30deg) saturate(1.1)';
        break;
      case 'high-contrast':
        ctx.filter = 'contrast(1.5)';
        break;
      case 'soft':
        ctx.filter = 'blur(0.5px) brightness(1.1)';
        break;
      case 'dramatic':
        ctx.filter = 'contrast(1.3) saturate(1.2) brightness(0.9)';
        break;
      default:
        ctx.filter = 'none';
    }
    
    if (filterName !== 'none') {
      ctx.drawImage(originalImage, 0, 0);
      ctx.filter = 'none';
    }
    
    setSelectedFilter(filterName);
    saveToHistory();
  };

  const saveToHistory = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataURL);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const img = new Image();
      img.onload = () => {
        drawImageToCanvas(img);
        setHistoryIndex(prevIndex);
      };
      img.src = history[prevIndex];
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const img = new Image();
      img.onload = () => {
        drawImageToCanvas(img);
        setHistoryIndex(nextIndex);
      };
      img.src = history[nextIndex];
    }
  };

  const handleMouseDown = (e) => {
    if (!canvasContext || tool === 'select') return;
    
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLastPos({ x, y });
    
    if (tool === 'brush') {
      canvasContext.beginPath();
      canvasContext.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
      canvasContext.fillStyle = '#000000';
      canvasContext.globalAlpha = brushOpacity / 100;
      canvasContext.fill();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !canvasContext || tool === 'select') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'brush') {
      canvasContext.beginPath();
      canvasContext.moveTo(lastPos.x, lastPos.y);
      canvasContext.lineTo(x, y);
      canvasContext.strokeStyle = '#000000';
      canvasContext.lineWidth = brushSize;
      canvasContext.lineCap = 'round';
      canvasContext.globalAlpha = brushOpacity / 100;
      canvasContext.stroke();
    }
    
    setLastPos({ x, y });
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      clarity: 0,
      vibrance: 0,
      temperature: 0,
      tint: 0
    });
  };

  const updateAdjustment = (key, value) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar - Tools */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            Image Editor
          </h2>
        </div>

        {/* File Upload */}
        <div className="p-4 border-b border-gray-200">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>

        {/* Tools */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium mb-3">Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            {tools.slice(0, 8).map((toolItem) => {
              const Icon = toolItem.icon;
              return (
                <Button
                  key={toolItem.id}
                  variant={tool === toolItem.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTool(toolItem.id)}
                  className="flex flex-col items-center gap-1 h-12"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{toolItem.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tool Options */}
        {(tool === 'brush' || tool === 'eraser') && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium mb-3">Brush Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Size: {brushSize}px</label>
                <Slider
                  value={[brushSize]}
                  onValueChange={(value) => setBrushSize(value[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Opacity: {brushOpacity}%</label>
                <Slider
                  value={[brushOpacity]}
                  onValueChange={(value) => setBrushOpacity(value[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* History Controls */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium mb-3">History</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex-1"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="flex-1"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="p-4">
          <h3 className="font-medium mb-3">Zoom</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium flex-1 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(400, zoom + 25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {tool.charAt(0).toUpperCase() + tool.slice(1)} Tool
            </Badge>
            {image && (
              <Badge variant="outline">
                {image.width} × {image.height}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadImage} disabled={!image}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" disabled={!image}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className="flex justify-center">
            {image ? (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="max-w-full max-h-full cursor-crosshair"
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left'
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 w-96 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No image loaded</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Adjustments */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="p-4 border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            {/* Basic Adjustments */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Basic Adjustments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Brightness: {adjustments.brightness}</label>
                    <Slider
                      value={[adjustments.brightness]}
                      onValueChange={(value) => updateAdjustment('brightness', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Contrast: {adjustments.contrast}</label>
                    <Slider
                      value={[adjustments.contrast]}
                      onValueChange={(value) => updateAdjustment('contrast', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Saturation: {adjustments.saturation}</label>
                    <Slider
                      value={[adjustments.saturation]}
                      onValueChange={(value) => updateAdjustment('saturation', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Hue: {adjustments.hue}</label>
                    <Slider
                      value={[adjustments.hue]}
                      onValueChange={(value) => updateAdjustment('hue', value)}
                      min={-180}
                      max={180}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button onClick={resetAdjustments} variant="outline" className="w-full">
                    Reset All
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Filters */}
            <TabsContent value="filters" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Photo Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {filters.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedFilter === filter.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => applyFilter(filter.value)}
                        className="h-auto p-2 flex flex-col items-center gap-1"
                      >
                        <span className="text-xs font-medium">{filter.name}</span>
                        <span className="text-xs text-gray-500">{filter.preview}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Adjustments */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Advanced Adjustments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Exposure: {adjustments.exposure}</label>
                    <Slider
                      value={[adjustments.exposure]}
                      onValueChange={(value) => updateAdjustment('exposure', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Highlights: {adjustments.highlights}</label>
                    <Slider
                      value={[adjustments.highlights]}
                      onValueChange={(value) => updateAdjustment('highlights', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Shadows: {adjustments.shadows}</label>
                    <Slider
                      value={[adjustments.shadows]}
                      onValueChange={(value) => updateAdjustment('shadows', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Clarity: {adjustments.clarity}</label>
                    <Slider
                      value={[adjustments.clarity]}
                      onValueChange={(value) => updateAdjustment('clarity', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Vibrance: {adjustments.vibrance}</label>
                    <Slider
                      value={[adjustments.vibrance]}
                      onValueChange={(value) => updateAdjustment('vibrance', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedImageEditor;
