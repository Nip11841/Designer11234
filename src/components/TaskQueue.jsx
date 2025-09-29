import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Clock, CheckCircle, XCircle, AlertCircle, Download, RefreshCw, Eye, Users } from 'lucide-react'

const TaskQueue = () => {
  const [history, setHistory] = useState([])
  const [queueStatus, setQueueStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHistory()
    const interval = setInterval(fetchHistory, 3000) // Refresh every 3 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/design/history')
      const data = await response.json()
      
      if (data.success) {
        setHistory(data.history)
        setQueueStatus(data.queue_status)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch history')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
      case 'queued':
        return <Clock className="h-5 w-5 text-orange-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'failed':
        return 'destructive'
      case 'in_progress':
        return 'secondary'
      case 'queued':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.round(seconds / 60)
      return `${minutes}m`
    } else {
      const hours = Math.round(seconds / 3600 * 10) / 10
      return `${hours}h`
    }
  }

  const downloadDesign = async (requestId) => {
    try {
      const response = await fetch(`/api/design/download/${requestId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `design_${requestId}.png`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Download failed')
      }
    } catch (err) {
      alert('Download error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading task queue...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Queue Status */}
      {queueStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span>Queue Length: <strong>{queueStatus.queue_length}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className={`h-4 w-4 ${queueStatus.is_processing ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
                <span>Status: <strong>{queueStatus.is_processing ? 'Processing' : 'Idle'}</strong></span>
              </div>
              {queueStatus.current_job && (
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>Current: <strong>{queueStatus.current_job}</strong></span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Design History</CardTitle>
              <CardDescription>Your recent design requests and their status</CardDescription>
            </div>
            <Button
              onClick={fetchHistory}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No design requests yet. Create your first design to see it here!
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((request) => (
                <div key={request.request_id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <div className="font-medium text-gray-900">
                          {request.product_type.charAt(0).toUpperCase() + request.product_type.slice(1)} Design
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {formatTime(request.created_at)}
                        </div>
                        {request.specifications?.text_content && (
                          <div className="text-sm text-gray-600 mt-1 truncate max-w-md">
                            "{request.specifications.text_content}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Progress Bar for Active Requests */}
                      {request.status === 'in_progress' && (
                        <div className="w-32">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{request.progress}%</span>
                          </div>
                          <Progress value={request.progress} className="h-2" />
                        </div>
                      )}

                      {/* Queue Position */}
                      {request.status === 'queued' && request.queue_position > 0 && (
                        <Badge variant="outline">
                          Position #{request.queue_position}
                        </Badge>
                      )}

                      {/* Estimated Time */}
                      {request.estimated_time_seconds && (
                        <div className="text-sm text-gray-500">
                          ~{formatDuration(request.estimated_time_seconds)}
                        </div>
                      )}

                      {/* Status Badge */}
                      <Badge variant={getStatusVariant(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>

                      {/* Download Button */}
                      {request.status === 'completed' && (
                        <Button
                          onClick={() => downloadDesign(request.request_id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}

                      {/* Error Message */}
                      {request.status === 'failed' && request.error_message && (
                        <div className="text-xs text-red-600 max-w-xs truncate" title={request.error_message}>
                          Error: {request.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TaskQueue

