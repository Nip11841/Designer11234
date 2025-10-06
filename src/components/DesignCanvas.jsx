import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Layers, 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  Move, 
  RotateCw, 
  Palette, 
  Download, 
  Save, 
  Undo, 
  Redo,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  ZoomIn,
  ZoomOut,
  Grid,
  Ruler,
  MousePointer
} from 'lucide-react';

const DesignCanvas = () => {
  const canvasRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [tool, setTool] = useState('select');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dragState, setDragState] = useState({ isDragging: false, element: null, offset: { x: 0, y: 0 } });

  // Canvas presets
  const canvasPresets = [
    { name: 'Business Card', width: 350, height: 200 },
    { name: 'Poster (A4)', width: 595, height: 842 },
    { name: 'Social Media Post', width: 400, height: 400 },
    { name: 'Banner', width: 728, height: 90 },
    { name: 'Flyer', width: 400, height: 600 },
    { name: 'Logo', width: 300, height: 300 },
    { name: 'Custom', width: 800, height: 600 }
  ];

  // Element types
  const elementTypes = [
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'image', icon: ImageIcon, label: 'Image' }
  ];

  // Add element to canvas
  const addElement = useCallback((type) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 40 : 100,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: elements.length,
      ...getDefaultProperties(type)
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    saveToHistory();
  }, [elements.length]);

  // Get default properties based on element type
  const getDefaultProperties = (type) => {
    switch (type) {
      case 'text':
        return {
          text: 'Sample Text',
          fontSize: 18,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          color: '#000000',
          textAlign: 'left'
        };
      case 'rectangle':
        return {
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2,
          borderRadius: 0
        };
      case 'circle':
        return {
          fill: '#ef4444',
          stroke: '#dc2626',
          strokeWidth: 2
        };
      case 'image':
        return {
          src: null,
          fit: 'cover'
        };
      default:
        return {};
    }
  };

  // Update element properties
  const updateElement = useCallback((id, updates) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  }, []);

  // Delete element
  const deleteElement = useCallback((id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    saveToHistory();
  }, [selectedElement]);

  // Duplicate element
  const duplicateElement = useCallback((id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: elements.length
      };
      setElements(prev => [...prev, newElement]);
      setSelectedElement(newElement.id);
      saveToHistory();
    }
  }, [elements]);

  // Layer management
  const moveLayer = useCallback((id, direction) => {
    setElements(prev => {
      const element = prev.find(el => el.id === id);
      if (!element) return prev;

      const newZIndex = direction === 'up' 
        ? Math.min(element.zIndex + 1, prev.length - 1)
        : Math.max(element.zIndex - 1, 0);

      return prev.map(el => {
        if (el.id === id) {
          return { ...el, zIndex: newZIndex };
        }
        if (direction === 'up' && el.zIndex === newZIndex && el.id !== id) {
          return { ...el, zIndex: el.zIndex - 1 };
        }
        if (direction === 'down' && el.zIndex === newZIndex && el.id !== id) {
          return { ...el, zIndex: el.zIndex + 1 };
        }
        return el;
      });
    });
    saveToHistory();
  }, []);

  // History management
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(elements));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = JSON.parse(history[historyIndex - 1]);
      setElements(prevState);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = JSON.parse(history[historyIndex + 1]);
      setElements(nextState);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e, elementId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (tool === 'select') {
      const element = elements.find(el => el.id === elementId);
      if (element && !element.locked) {
        setSelectedElement(elementId);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setDragState({
          isDragging: true,
          element: elementId,
          offset: {
            x: x - element.x,
            y: y - element.y
          }
        });
      }
    }
  }, [tool, elements]);

  const handleMouseMove = useCallback((e) => {
    if (dragState.isDragging && dragState.element) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragState.offset.x;
      const y = e.clientY - rect.top - dragState.offset.y;
      
      updateElement(dragState.element, { x, y });
    }
  }, [dragState, updateElement]);

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({ isDragging: false, element: null, offset: { x: 0, y: 0 } });
      saveToHistory();
    }
  }, [dragState, saveToHistory]);

  // Canvas click handler
  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'c':
            if (selectedElement) {
              e.preventDefault();
              duplicateElement(selectedElement);
            }
            break;
          case 'd':
            if (selectedElement) {
              e.preventDefault();
              duplicateElement(selectedElement);
            }
            break;
        }
      } else if (e.key === 'Delete' && selectedElement) {
        deleteElement(selectedElement);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, undo, redo, duplicateElement, deleteElement]);

  const selectedElementData = elements.find(el => el.id === selectedElement);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Tools */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={tool === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('select')}
              className="flex items-center gap-2"
            >
              <MousePointer className="h-4 w-4" />
              Select
            </Button>
            <Button
              variant={tool === 'move' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('move')}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Move
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            {elementTypes.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addElement(type)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Canvas</h3>
          <div className="space-y-2">
            <Select
              value={`${canvasSize.width}x${canvasSize.height}`}
              onValueChange={(value) => {
                const preset = canvasPresets.find(p => `${p.width}x${p.height}` === value);
                if (preset) {
                  setCanvasSize({ width: preset.width, height: preset.height });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {canvasPresets.map((preset) => (
                  <SelectItem key={preset.name} value={`${preset.width}x${preset.height}`}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRulers(!showRulers)}
              >
                <Ruler className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Zoom</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
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
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 overflow-auto p-8 bg-gray-100">
          <div className="flex justify-center">
            <div
              className="relative bg-white shadow-lg"
              style={{
                width: canvasSize.width * (zoom / 100),
                height: canvasSize.height * (zoom / 100),
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left'
              }}
            >
              {/* Grid */}
              {showGrid && (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {/* Canvas */}
              <div
                ref={canvasRef}
                className="relative w-full h-full cursor-crosshair"
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ width: canvasSize.width, height: canvasSize.height }}
              >
                {/* Render Elements */}
                {elements
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((element) => (
                    <CanvasElement
                      key={element.id}
                      element={element}
                      isSelected={selectedElement === element.id}
                      onMouseDown={(e) => handleMouseDown(e, element.id)}
                      onUpdate={(updates) => updateElement(element.id, updates)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-80 bg-white border-l border-gray-200 p-4 space-y-4">
        {/* Layers Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {elements
              .sort((a, b) => b.zIndex - a.zIndex)
              .map((element) => (
                <div
                  key={element.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    selectedElement === element.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(element.id, { visible: !element.visible });
                    }}
                  >
                    {element.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(element.id, { locked: !element.locked });
                    }}
                  >
                    {element.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                  </Button>
                  <span className="flex-1 text-sm capitalize">
                    {element.type} {element.type === 'text' ? `"${element.text?.slice(0, 10)}..."` : ''}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteElement(element.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Properties Panel */}
        {selectedElementData && (
          <ElementProperties
            element={selectedElementData}
            onUpdate={(updates) => updateElement(selectedElementData.id, updates)}
            onDuplicate={() => duplicateElement(selectedElementData.id)}
            onDelete={() => deleteElement(selectedElementData.id)}
            onMoveLayer={(direction) => moveLayer(selectedElementData.id, direction)}
          />
        )}
      </div>
    </div>
  );
};

// Canvas Element Component
const CanvasElement = ({ element, isSelected, onMouseDown, onUpdate }) => {
  const elementStyle = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    display: element.visible ? 'block' : 'none',
    zIndex: element.zIndex,
    cursor: element.locked ? 'not-allowed' : 'move'
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              ...elementStyle,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              color: element.color,
              textAlign: element.textAlign,
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            onMouseDown={onMouseDown}
          >
            {element.text}
          </div>
        );
      case 'rectangle':
        return (
          <div
            style={{
              ...elementStyle,
              backgroundColor: element.fill,
              border: `${element.strokeWidth}px solid ${element.stroke}`,
              borderRadius: element.borderRadius
            }}
            onMouseDown={onMouseDown}
          />
        );
      case 'circle':
        return (
          <div
            style={{
              ...elementStyle,
              backgroundColor: element.fill,
              border: `${element.strokeWidth}px solid ${element.stroke}`,
              borderRadius: '50%'
            }}
            onMouseDown={onMouseDown}
          />
        );
      case 'image':
        return (
          <div
            style={{
              ...elementStyle,
              backgroundImage: element.src ? `url(${element.src})` : 'none',
              backgroundSize: element.fit,
              backgroundPosition: 'center',
              backgroundColor: '#f3f4f6',
              border: '2px dashed #d1d5db'
            }}
            onMouseDown={onMouseDown}
          >
            {!element.src && (
              <div className="flex items-center justify-center h-full text-gray-400">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {renderElement()}
      {isSelected && (
        <div
          className="absolute border-2 border-blue-500 pointer-events-none"
          style={{
            left: element.x - 2,
            top: element.y - 2,
            width: element.width + 4,
            height: element.height + 4,
            transform: `rotate(${element.rotation}deg)`
          }}
        >
          {/* Selection handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

// Element Properties Component
const ElementProperties = ({ element, onUpdate, onDuplicate, onDelete, onMoveLayer }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm capitalize">
          {element.type} Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common Properties */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Position & Size</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="X"
              value={element.x}
              onChange={(e) => onUpdate({ x: parseInt(e.target.value) || 0 })}
              className="text-xs"
            />
            <Input
              type="number"
              placeholder="Y"
              value={element.y}
              onChange={(e) => onUpdate({ y: parseInt(e.target.value) || 0 })}
              className="text-xs"
            />
            <Input
              type="number"
              placeholder="Width"
              value={element.width}
              onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 0 })}
              className="text-xs"
            />
            <Input
              type="number"
              placeholder="Height"
              value={element.height}
              onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 0 })}
              className="text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium">Rotation</label>
          <Slider
            value={[element.rotation]}
            onValueChange={([value]) => onUpdate({ rotation: value })}
            min={-180}
            max={180}
            step={1}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{element.rotation}°</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium">Opacity</label>
          <Slider
            value={[element.opacity * 100]}
            onValueChange={([value]) => onUpdate({ opacity: value / 100 })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{Math.round(element.opacity * 100)}%</span>
        </div>

        {/* Type-specific Properties */}
        {element.type === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Text</label>
              <Input
                value={element.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Font Size</label>
              <Input
                type="number"
                value={element.fontSize}
                onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 12 })}
                className="text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Color</label>
              <Input
                type="color"
                value={element.color}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="text-xs mt-1 h-8"
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant={element.fontWeight === 'bold' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({ fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
              >
                <Bold className="h-3 w-3" />
              </Button>
              <Button
                variant={element.fontStyle === 'italic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
              >
                <Italic className="h-3 w-3" />
              </Button>
              <Button
                variant={element.textDecoration === 'underline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({ textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' })}
              >
                <Underline className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {(element.type === 'rectangle' || element.type === 'circle') && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Fill Color</label>
              <Input
                type="color"
                value={element.fill}
                onChange={(e) => onUpdate({ fill: e.target.value })}
                className="text-xs mt-1 h-8"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Stroke Color</label>
              <Input
                type="color"
                value={element.stroke}
                onChange={(e) => onUpdate({ stroke: e.target.value })}
                className="text-xs mt-1 h-8"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Stroke Width</label>
              <Input
                type="number"
                value={element.strokeWidth}
                onChange={(e) => onUpdate({ strokeWidth: parseInt(e.target.value) || 0 })}
                className="text-xs mt-1"
              />
            </div>
            {element.type === 'rectangle' && (
              <div>
                <label className="text-xs font-medium">Border Radius</label>
                <Input
                  type="number"
                  value={element.borderRadius}
                  onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) || 0 })}
                  className="text-xs mt-1"
                />
              </div>
            )}
          </div>
        )}

        {element.type === 'image' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Image URL</label>
              <Input
                value={element.src || ''}
                onChange={(e) => onUpdate({ src: e.target.value })}
                placeholder="Enter image URL"
                className="text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Fit</label>
              <Select value={element.fit} onValueChange={(value) => onUpdate({ fit: value })}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={onDuplicate}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMoveLayer('up')}>
            ↑
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMoveLayer('down')}>
            ↓
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignCanvas;
