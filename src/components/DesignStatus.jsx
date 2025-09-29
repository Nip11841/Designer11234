import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { CheckCircle, Clock, Download, AlertCircle, RefreshCw } from 'lucide-react'

const DesignStatus = ({ requestId, onNewDesign }) => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!requestId) return

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/design/status/${requestId}`)
        const data = await response.json()
        setStatus(data)
        
        // Update progress based on status
        switch (data.status) {
          case 'pending':
            setProgress(25)
            break
          case 'in_progress':
            setProgress(75)
            break
          case 'completed':
            setProgress(100)
            break
          case 'failed':
            setProgress(0)
            break
          default:
            setProgress(0)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch status:', error)
        setLoading(false)
      }
    }

    // Initial check
    checkStatus()

    // Poll for updates if not completed
    const interval = setInterval(() => {
      if (status?.status === 'completed' || status?.status === 'failed') {
        clearInterval(interval)
        return
      }
      checkStatus()
    }, 2000)

    return () => clearInterval(interval)
  }, [requestId, status?.status])

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/design/download/${requestId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `design-${requestId}.png`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading status...</span>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Failed to load design status</p>
          <Button onClick={onNewDesign} className="mt-4">
            Create New Design
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.status)}
            <div>
              <CardTitle className="text-xl">Design Request</CardTitle>
              <CardDescription>Request ID: {status.request_id}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(status.status)}>
            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Design Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Product Type:</span>
            <p className="text-muted-foreground capitalize">{status.product_type}</p>
          </div>
          <div>
            <span className="font-medium">Created:</span>
            <p className="text-muted-foreground">
              {new Date(status.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {status.status === 'pending' && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">
              Your design request is in the queue. We'll start working on it shortly!
            </p>
          </div>
        )}

        {status.status === 'in_progress' && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              Our AI is creating your design right now. This usually takes a few minutes.
            </p>
          </div>
        )}

        {status.status === 'completed' && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 mb-3">
              🎉 Your design is ready! Click the button below to download it.
            </p>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Design
            </Button>
          </div>
        )}

        {status.status === 'failed' && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800 mb-2">
              Sorry, there was an error creating your design.
            </p>
            {status.error_message && (
              <p className="text-sm text-red-600 mb-3">
                Error: {status.error_message}
              </p>
            )}
            <Button onClick={onNewDesign} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onNewDesign} variant="outline" className="flex-1">
            Create Another Design
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DesignStatus

