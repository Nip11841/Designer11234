import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Loader2, Palette, Sparkles, Clock, Users, AlertCircle, Folder } from 'lucide-react'
import ProjectManager from './ProjectManager.jsx'
import BaseSettingsManager from './BaseSettingsManager.jsx'

const TimeEstimate = ({ productType, specifications }) => {
  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (productType && (specifications.text_content || specifications.style_preferences || specifications.color_preferences)) {
      fetchEstimate()
    }
  }, [productType, specifications])

  const fetchEstimate = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/design/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_type: productType, specifications })
      })

      const data = await response.json()
      
      if (data.success) {
        setEstimate(data)
      } else {
        setError(data.error || 'Failed to get estimate')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`
    const minutes = Math.round(seconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600 animate-spin" />
          <span className="text-blue-800">Calculating estimate...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    )
  }

  if (!estimate) return null

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-green-800">Time Estimate</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Design Generation:</span>
            <span className="font-medium text-green-800">{estimate.estimate.human_readable}</span>
          </div>
          
          {estimate.queue.queue_position > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Queue Wait:</span>
              <span className="font-medium text-orange-600">{formatTime(estimate.queue.estimated_wait_seconds)}</span>
            </div>
          )}
          
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium text-gray-700">Total Time:</span>
            <span className="font-bold text-green-800">{formatTime(estimate.total_estimated_time)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {estimate.queue.queue_position > 0 && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600">Position {estimate.queue.queue_position} in queue</span>
            </div>
          )}
          
          {estimate.queue.queue_position === 0 && (
            <div className="text-xs text-green-600 font-medium">✓ Starting immediately</div>
          )}
        </div>
      </div>
    </div>
  )
}

const DesignForm = ({ onSubmit, isLoading }) => {
  const [productTypes, setProductTypes] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [showProjectManager, setShowProjectManager] = useState(false)
  const [showBaseSettings, setShowBaseSettings] = useState(false)
  const [formData, setFormData] = useState({
    product_type: '',
    project_id: null,
    specifications: {
      dimensions: '',
      text_content: '',
      style_preferences: '',
      target_audience: '',
      marketing_keywords: '',
      color_preferences: '',
      additional_notes: ''
    }
  })

  useEffect(() => {
    // Fetch product types from API
    fetch('/api/design/types')
      .then(res => res.json())
      .then(data => setProductTypes(data || []))
      .catch(err => console.error('Failed to fetch product types:', err))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      project_id: selectedProjectId
    }
    onSubmit(submitData)
  }

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId)
    setFormData(prev => ({ ...prev, project_id: projectId }))
  }

  const handleLoadSettings = (settings) => {
    setFormData(prev => ({
      ...prev,
      product_type: settings.product_type,
      specifications: { ...prev.specifications, ...settings.specifications }
    }))
    setShowBaseSettings(false)
  }

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          specifications: {
            ...prev.specifications,
            reference_image_path: data.filepath
          }
        }));
      } else {
        alert("Image upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Network error during image upload.");
    }
  };

  const selectedProductType = productTypes.find(type => type.id === formData.product_type)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Palette className="h-6 w-6 text-purple-600" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Your Design
          </CardTitle>
        </div>
        <CardDescription>
          Tell us what you want to create and we'll generate a stunning design for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project and Settings Management */}
          <div className="flex gap-2 mb-4">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowProjectManager(!showProjectManager)}
            >
              <Folder className="mr-2 h-4 w-4" />
              {showProjectManager ? 'Hide' : 'Manage'} Projects
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowBaseSettings(!showBaseSettings)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {showBaseSettings ? 'Hide' : 'Load'} Settings
            </Button>
          </div>

          {/* Project Manager */}
          {showProjectManager && (
            <div className="mb-6">
              <ProjectManager 
                onSelectProject={handleProjectSelect}
                selectedProjectId={selectedProjectId}
              />
            </div>
          )}

          {/* Base Settings Manager */}
          {showBaseSettings && (
            <div className="mb-6">
              <BaseSettingsManager 
                onLoadSettings={handleLoadSettings}
                currentFormData={formData}
              />
            </div>
          )}

          {/* Selected Project Display */}
          {selectedProjectId && (
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-sm text-purple-800">
                <Folder className="h-4 w-4" />
                <span>Creating in selected project</span>
              </div>
            </div>
          )}

          {/* Product Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="product-type">Product Type *</Label>
            <Select 
              value={formData.product_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, product_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose what you want to create" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{type.name}</span>
                      <span className="text-sm text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Type Info */}
          {selectedProductType && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Estimated Time Range</h4>
              <Badge variant="secondary">{selectedProductType.estimated_time_range}</Badge>
            </div>
          )}

          {/* Dimensions */}
          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              placeholder="e.g., 5x7 inches, 1080x1080 pixels, or leave blank for standard"
              value={formData.specifications.dimensions}
              onChange={(e) => handleSpecificationChange('dimensions', e.target.value)}
            />
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <Label htmlFor="text-content">Text Content</Label>
            <Textarea
              id="text-content"
              placeholder="What text should appear on your design? Include titles, messages, quotes, etc."
              value={formData.specifications.text_content}
              onChange={(e) => handleSpecificationChange('text_content', e.target.value)}
              rows={3}
            />
          </div>

          {/* Style Preferences */}
          <div className="space-y-2">
            <Label htmlFor="style">Style Preferences</Label>
            <Input
              id="style"
              placeholder="e.g., minimalist, vintage, modern, hand-drawn, elegant"
              value={formData.specifications.style_preferences}
              onChange={(e) => handleSpecificationChange('style_preferences', e.target.value)}
            />
          </div>

          {/* Color Preferences */}
          <div className="space-y-2">
            <Label htmlFor="colors">Color Preferences</Label>
            <Input
              id="colors"
              placeholder="e.g., pastel colors, black and gold, rainbow, earth tones"
              value={formData.specifications.color_preferences}
              onChange={(e) => handleSpecificationChange('color_preferences', e.target.value)}
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input
              id="audience"
              placeholder="e.g., young adults, professionals, children, wedding guests"
              value={formData.specifications.target_audience}
              onChange={(e) => handleSpecificationChange('target_audience', e.target.value)}
            />
          </div>

          {/* Marketing Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Marketing Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g., birthday, celebration, love, motivation, business"
              value={formData.specifications.marketing_keywords}
              onChange={(e) => handleSpecificationChange('marketing_keywords', e.target.value)}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any other specific requirements or ideas you have in mind?"
              value={formData.specifications.additional_notes}
              onChange={(e) => handleSpecificationChange("additional_notes", e.target.value)}
              rows={2}
            />
          </div>

          {/* Upload Reference Image */}
          <div className="space-y-2">
            <Label htmlFor="reference-image">Upload Reference Image (Optional)</Label>
            <Input
              id="reference-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.specifications.reference_image_path && (
              <p className="text-sm text-gray-500">Image uploaded: {formData.specifications.reference_image_path.split('/').pop()}</p>
            )}
          </div>

          {/* Time Estimate */}
          {formData.product_type && (formData.specifications.text_content || formData.specifications.style_preferences || formData.specifications.color_preferences) && (
            <TimeEstimate
              productType={formData.product_type}
              specifications={formData.specifications}
            />
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={!formData.product_type || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Your Design...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Design
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default DesignForm

