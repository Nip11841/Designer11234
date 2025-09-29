import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Settings, Save, Trash2, Calendar, Copy } from 'lucide-react'

const BaseSettingsManager = ({ onLoadSettings, currentFormData }) => {
  const [savedSettings, setSavedSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [settingsName, setSettingsName] = useState('')

  useEffect(() => {
    fetchSavedSettings()
  }, [])

  const fetchSavedSettings = async () => {
    try {
      const response = await fetch('/api/base-settings')
      const data = await response.json()
      if (data.success) {
        setSavedSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch saved settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    if (!currentFormData.product_type) {
      alert('Please select a product type first')
      return
    }

    try {
      const response = await fetch('/api/base-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: settingsName,
          product_type: currentFormData.product_type,
          settings: currentFormData.specifications
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setSavedSettings([data.settings, ...savedSettings])
        setSettingsName('')
        setShowSaveDialog(false)
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    }
  }

  const handleLoadSettings = (settings) => {
    onLoadSettings({
      product_type: settings.product_type,
      specifications: settings.settings
    })
  }

  const handleDeleteSettings = async (settingsId) => {
    if (!confirm('Are you sure you want to delete these saved settings?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/base-settings/${settingsId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setSavedSettings(savedSettings.filter(s => s.id !== settingsId))
      }
    } catch (error) {
      console.error('Failed to delete settings:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">Loading saved settings...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Base Settings
        </h3>
        
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Current Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Base Settings</DialogTitle>
              <DialogDescription>
                Save your current form settings as a template for future use.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <Label htmlFor="settings-name">Template Name</Label>
                <Input
                  id="settings-name"
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  placeholder="e.g., Birthday Card Template"
                  required
                />
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Product Type:</strong> {currentFormData.product_type || 'None selected'}</p>
                <p><strong>Will save:</strong> All current form specifications</p>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Settings</Button>
                <Button type="button" variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {savedSettings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No saved settings yet</p>
            <p className="text-sm text-gray-400">Save your current form settings to reuse them later</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {savedSettings.map((settings) => (
            <Card key={settings.id} className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{settings.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {settings.product_type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Saved {new Date(settings.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadSettings(settings)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSettings(settings.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Preview of saved settings */}
                <div className="mt-2 text-xs text-gray-500">
                  {settings.settings.text_content && (
                    <div className="truncate">Text: {settings.settings.text_content}</div>
                  )}
                  {settings.settings.style_preferences && (
                    <div className="truncate">Style: {settings.settings.style_preferences}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default BaseSettingsManager

