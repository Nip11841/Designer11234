import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Avatar } from './ui/avatar';
import { 
  Users, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Share2, 
  Eye, 
  Edit, 
  Send, 
  Plus, 
  X,
  ThumbsUp,
  ThumbsDown,
  Download,
  Link,
  Mail,
  Calendar,
  Activity,
  FileText,
  Settings,
  UserPlus,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  History,
  GitBranch,
  Zap
} from 'lucide-react';

const CollaborationHub = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [approvals, setApprovals] = useState([]);
  const [activity, setActivity] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const commentInputRef = useRef(null);

  const API_BASE_URL = 'https://lnh8imcwoyzq.manus.space';

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectDetails(selectedProject.id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/collaboration/projects?user_id=current_user`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
        if (data.projects.length > 0 && !selectedProject) {
          setSelectedProject(data.projects[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchProjectDetails = async (projectId) => {
    try {
      const [projectResponse, activityResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/collaboration/projects/${projectId}`),
        fetch(`${API_BASE_URL}/api/collaboration/projects/${projectId}/activity`)
      ]);

      const projectData = await projectResponse.json();
      const activityData = await activityResponse.json();

      if (projectData.success) {
        setComments(projectData.comments || []);
        setApprovals(projectData.approvals || []);
      }

      if (activityData.success) {
        setActivity(activityData.activities || []);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const createProject = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/collaboration/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Collaboration Project',
          description: 'A new project for team collaboration',
          owner_id: 'current_user'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProjects(prev => [...prev, data.project]);
        setSelectedProject(data.project);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedProject) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/collaboration/projects/${selectedProject.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment,
          author_id: 'current_user',
          author_name: 'Current User'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setComments(prev => [...prev, data.comment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addCollaborator = async () => {
    if (!newCollaboratorEmail.trim() || !selectedProject) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/collaboration/projects/${selectedProject.id}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newCollaboratorEmail,
          role: 'editor'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCollaborators(prev => [...prev, data.collaborator]);
        setNewCollaboratorEmail('');
      }
    } catch (error) {
      console.error('Error adding collaborator:', error);
    }
  };

  const requestApproval = async () => {
    if (!selectedProject) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/collaboration/projects/${selectedProject.id}/approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requester_id: 'current_user',
          approver_email: 'client@example.com',
          message: 'Please review and approve this design'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setApprovals(prev => [...prev, data.approval]);
      }
    } catch (error) {
      console.error('Error requesting approval:', error);
    }
  };

  const generateShareLink = async () => {
    if (!selectedProject) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/collaboration/projects/${selectedProject.id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissions: 'comment'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShareLink(`${window.location.origin}${data.share_link.url}`);
      }
    } catch (error) {
      console.error('Error generating share link:', error);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment': return MessageCircle;
      case 'edit': return Edit;
      case 'approval': return CheckCircle;
      case 'share': return Share2;
      default: return Activity;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Project List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Collaboration Hub
            </h1>
            <Button size="sm" onClick={createProject}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-3">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className={`cursor-pointer transition-all ${
                  selectedProject?.id === project.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{project.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {project.collaborators?.length || 0} collaborators
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedProject ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={generateShareLink}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" onClick={requestApproval}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Request Approval
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="approvals">Approvals</TabsTrigger>
                  <TabsTrigger value="collaborators">Team</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-6">
              <Tabs value={activeTab} className="h-full">
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Comments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{comments.length}</div>
                        <p className="text-xs text-gray-500">
                          {comments.filter(c => !c.resolved).length} unresolved
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Approvals
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{approvals.length}</div>
                        <p className="text-xs text-gray-500">
                          {approvals.filter(a => a.status === 'pending').length} pending
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Team
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedProject.collaborators?.length || 0}</div>
                        <p className="text-xs text-gray-500">active members</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Share Link */}
                  {shareLink && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Link className="h-5 w-5" />
                          Share Link
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Input value={shareLink} readOnly className="flex-1" />
                          <Button onClick={copyShareLink}>
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activity.slice(0, 5).map((item) => {
                          const Icon = getActivityIcon(item.type);
                          return (
                            <div key={item.id} className="flex items-start gap-3">
                              <div className="p-2 bg-gray-100 rounded-full">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <strong>{item.user}</strong> {item.action}
                                </p>
                                <p className="text-xs text-gray-500">{item.details}</p>
                                <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Add Comment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Textarea
                          ref={commentInputRef}
                          placeholder="Share your feedback..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <Button onClick={addComment} disabled={!newComment.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                {comment.author_name.charAt(0)}
                              </div>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">{comment.author_name}</span>
                                <span className="text-xs text-gray-500">{comment.created_at}</span>
                                {comment.resolved && (
                                  <Badge variant="outline" className="text-xs">
                                    Resolved
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{comment.text}</p>
                              
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-2">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex items-start gap-2">
                                      <Avatar className="w-6 h-6">
                                        <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                                          {reply.author_name.charAt(0)}
                                        </div>
                                      </Avatar>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-xs">{reply.author_name}</span>
                                          <span className="text-xs text-gray-500">{reply.created_at}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{reply.text}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Approvals Tab */}
                <TabsContent value="approvals" className="space-y-6">
                  <div className="space-y-4">
                    {approvals.map((approval) => (
                      <Card key={approval.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">Approval Request</span>
                                <Badge className={getStatusColor(approval.status)}>
                                  {approval.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{approval.message}</p>
                              <div className="text-xs text-gray-500">
                                <p>Requested: {approval.requested_at}</p>
                                <p>Approver: {approval.approver_email}</p>
                                {approval.approved_at && (
                                  <p>Responded: {approval.approved_at}</p>
                                )}
                              </div>
                              {approval.feedback && (
                                <div className="mt-3 p-3 bg-gray-50 rounded">
                                  <p className="text-sm font-medium">Feedback:</p>
                                  <p className="text-sm text-gray-600">{approval.feedback}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {approval.status === 'pending' && (
                                <>
                                  <Button size="sm" variant="outline">
                                    <ThumbsUp className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <ThumbsDown className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Collaborators Tab */}
                <TabsContent value="collaborators" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Invite Collaborator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter email address"
                          value={newCollaboratorEmail}
                          onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={addCollaborator} disabled={!newCollaboratorEmail.trim()}>
                          <Mail className="h-4 w-4 mr-2" />
                          Invite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {collaborators.map((collaborator) => (
                          <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <div className="w-full h-full bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                                  {collaborator.email.charAt(0).toUpperCase()}
                                </div>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{collaborator.email}</p>
                                <p className="text-xs text-gray-500">Role: {collaborator.role}</p>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {collaborator.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-6">
                  <div className="space-y-4">
                    {activity.map((item) => {
                      const Icon = getActivityIcon(item.type);
                      return (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-gray-100 rounded-full">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <strong>{item.user}</strong> {item.action}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                                <p className="text-xs text-gray-400 mt-2">{item.timestamp}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Project Selected</h3>
              <p className="text-gray-600 mb-4">Select a project from the sidebar or create a new one</p>
              <Button onClick={createProject}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationHub;
