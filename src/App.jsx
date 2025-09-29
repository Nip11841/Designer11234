import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Wand2, 
  BarChart3, 
  Palette, 
  Brain, 
  Settings, 
  User, 
  Menu,
  X,
  Sparkles,
  Shield,
  TrendingUp
} from 'lucide-react';
import EnhancedDashboard from './components/EnhancedDashboard';
import AdvancedPromptInterface from './components/AdvancedPromptInterface';
import EnhancedDesignAnalysis from './components/EnhancedDesignAnalysis';
import AdvancedDesignEditor from './components/AdvancedDesignEditor';
import PhotoEditor from './components/PhotoEditor';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      component: EnhancedDashboard,
      description: 'Overview and quick actions'
    },
    {
      id: 'prompt',
      name: 'Prompt Engineering',
      icon: Brain,
      component: AdvancedPromptInterface,
      description: 'Advanced AI prompt generation',
      badge: 'Advanced'
    },
    {
      id: 'analysis',
      name: 'Design Analysis',
      icon: BarChart3,
      component: EnhancedDesignAnalysis,
      description: 'AI-powered design evaluation',
      badge: 'AI'
    },
    {
      id: 'design',
      name: 'Design Editor',
      icon: Wand2,
      component: AdvancedDesignEditor,
      description: 'Professional design creation'
    },
    {
      id: 'photo',
      name: 'Photo Editor',
      icon: Palette,
      component: PhotoEditor,
      description: 'Advanced photo editing tools'
    }
  ];

  const CurrentComponent = navigationItems.find(item => item.id === currentView)?.component || EnhancedDashboard;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Design Studio
                </h1>
                <p className="text-xs text-gray-500">Professional AI Platform</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${sidebarOpen ? 'px-3' : 'px-2'} ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon className={`h-4 w-4 ${sidebarOpen ? 'mr-3' : ''}`} />
                {sidebarOpen && (
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          isActive 
                            ? 'bg-white/20 text-white border-0' 
                            : 'bg-blue-100 text-blue-800 border-0'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">System Status</span>
                <Badge className="bg-green-100 text-green-800 border-0">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Healthy
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded">
                  <Sparkles className="h-3 w-3 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-blue-800">98.5%</div>
                  <div className="text-xs text-blue-600">Success</div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <TrendingUp className="h-3 w-3 text-purple-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-purple-800">94.2%</div>
                  <div className="text-xs text-purple-600">Quality</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <Shield className="h-3 w-3 text-green-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-green-800">91.0%</div>
                  <div className="text-xs text-green-600">Recovery</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <User className="h-3 w-3 mr-1" />
                  Profile
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full p-2">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-full p-2">
                <User className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <CurrentComponent />
      </div>
    </div>
  );
}

export default App;

