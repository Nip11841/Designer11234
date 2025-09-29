import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  MousePointer2, 
  Move, 
  RotateCw, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Layers,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Save,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Settings
} from 'lucide-react';

const AdvancedDesignEditor = ({ designId, initialDesign }) => {
  const canvasRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [editMode, setEditMode] = useState('select'); // select, move, text, image
  const [zoom, setZoom] = useState(100);
  const [layers, setLayers] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  // Design elements state
  const [elements, setElements] = useState([
    {
      id: 'text-1',
      type: 'text',
      content: 'Happy Birthday!',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      rotation: 0,
      visible: true,
      locked: false
    },
    {
      id: 'bg-1',
      type: 'background',
      color: '#ffffff',
      x: 0,
      y: 0,
      width: 600,
      height: 400,
      visible: true,
      locked: false
    }
  ]);

  // Canvas interaction handlers
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (600 / rect.width);
    const y = (e.clientY - rect.top) * (400 / rect.height);

    // Find clicked element
    const clickedElement = elements.find(el => 
      x >= el.x && x <= el.x + el.width &&
      y >= el.y && y <= el.y + el.height &&
      el.visible && !el.locked
    );

    setSelectedElement(clickedElement);
  };

  // Element manipulation functions
  const updateElement = (id, updates) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    saveToHistory();
  };

  const moveElement = (id, deltaX, deltaY) => {
    updateElement(id, {
      x: Math.max(0, elements.find(el => el.id === id).x + deltaX),
      y: Math.max(0, elements.find(el => el.id === id).y + deltaY)
    });
  };

  const duplicateElement = (id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20
      };
      setElements(prev => [...prev, newElement]);
      saveToHistory();
    }
  };

  const deleteElement = (id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(null);
    saveToHistory();
  };

  // History management
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(elements));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(JSON.parse(history[historyIndex - 1]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(JSON.parse(history[historyIndex + 1]));
    }
  };

  // AI-powered editing functions
  const applyAIEdit = async (instruction) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/design/ai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId,
          instruction,
          elements,
          selectedElement: selectedElement?.id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setElements(result.elements);
        saveToHistory();
      }
    } catch (error) {
      console.error('AI edit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Precision movement controls
  const precisionMove = (direction, amount = 1) => {
    if (!selectedElement) return;
    
    const movements = {
      up: [0, -amount],
      down: [0, amount],
      left: [-amount, 0],
      right: [amount, 0]
    };
    
    const [deltaX, deltaY] = movements[direction];
    moveElement(selectedElement.id, deltaX, deltaY);
  };

  // Export functions
  const exportDesign = async (format = 'png', quality = 'high') => {
    const qualitySettings = {
      low: { width: 600, height: 400, dpi: 72 },
      medium: { width: 1200, height: 800, dpi: 150 },
      high: { width: 2400, height: 1600, dpi: 300 },
      ultra: { width: 4800, height: 3200, dpi: 600 }
    };

    try {
      const response = await fetch('/api/design/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId,
          elements,
          format,
          quality: qualitySettings[quality]
        })
      });
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `design-${designId}.${format}`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-4">
        <Button
          variant={editMode === 'select' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setEditMode('select')}
          className="w-10 h-10"
        >
          <MousePointer2 className="w-4 h-4" />
        </Button>
        <Button
          variant={editMode === 'move' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setEditMode('move')}
          className="w-10 h-10"
        >
          <Move className="w-4 h-4" />
        </Button>
        <Button
          variant={editMode === 'text' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setEditMode('text')}
          className="w-10 h-10"
        >
          <Type className="w-4 h-4" />
        </Button>
        <Button
          variant={editMode === 'image' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setEditMode('image')}
          className="w-10 h-10"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        
        <div className="border-t border-gray-700 w-8 my-2"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={historyIndex <= 0}
          className="w-10 h-10"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="w-10 h-10"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(400, zoom + 25))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportDesign('png', 'high')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {selectedElement && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {selectedElement.type} selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => duplicateElement(selectedElement.id)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteElement(selectedElement.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
          <div 
            className="relative bg-white shadow-lg"
            style={{ 
              width: `${600 * (zoom / 100)}px`, 
              height: `${400 * (zoom / 100)}px`,
              transform: `scale(${zoom / 100})`
            }}
          >
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="absolute inset-0 cursor-crosshair"
              onClick={handleCanvasClick}
            />
            
            {/* Render elements */}
            {elements.map(element => (
              <div
                key={element.id}
                className={`absolute border-2 ${
                  selectedElement?.id === element.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent hover:border-gray-300'
                } ${element.visible ? '' : 'opacity-50'}`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  backgroundColor: element.type === 'background' ? element.color : 'transparent'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement(element);
                }}
              >
                {element.type === 'text' && (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      fontSize: element.fontSize,
                      fontFamily: element.fontFamily,
                      color: element.color
                    }}
                  >
                    {element.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-white border-l flex flex-col">
        {/* Properties Panel */}
        {selectedElement && (
          <Card className="m-4">
            <CardHeader>
              <CardTitle className="text-sm">Element Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedElement.type === 'text' && (
                <>
                  <div>
                    <label className="text-xs font-medium">Content</label>
                    <Textarea
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Font Size</label>
                    <Slider
                      value={[selectedElement.fontSize]}
                      onValueChange={([value]) => updateElement(selectedElement.id, { fontSize: value })}
                      min={8}
                      max={72}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Color</label>
                    <Input
                      type="color"
                      value={selectedElement.color}
                      onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                      className="mt-1 h-8"
                    />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium">X Position</label>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Y Position</label>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => precisionMove('up')}
                  className="text-xs"
                >
                  ↑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => precisionMove('down')}
                  className="text-xs"
                >
                  ↓
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => precisionMove('left')}
                  className="text-xs"
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => precisionMove('right')}
                  className="text-xs"
                >
                  →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Assistant Panel */}
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-sm">AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tell me what you want to change... e.g., 'Make the text bigger', 'Move the title to the center', 'Change colors to blue and gold'"
              className="mb-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  applyAIEdit(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <Button 
              size="sm" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Apply Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Layers Panel */}
        <Card className="m-4 flex-1">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Layers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {elements.map((element, index) => (
                <div
                  key={element.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    selectedElement?.id === element.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedElement(element)}
                >
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateElement(element.id, { visible: !element.visible });
                      }}
                      className="w-6 h-6 p-0"
                    >
                      {element.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <span className="text-sm">
                      {element.type === 'text' ? element.content.substring(0, 15) : element.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedDesignEditor;
