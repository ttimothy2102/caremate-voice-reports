
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Eye, Download } from 'lucide-react';

interface SecurityEvent {
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  userEmail?: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

export function SecurityDashboard() {
  const [criticalLogs, setCriticalLogs] = useState<SecurityEvent[]>([]);
  const [showAllLogs, setShowAllLogs] = useState(false);

  useEffect(() => {
    // Load critical security logs from localStorage
    const logs = JSON.parse(localStorage.getItem('criticalSecurityLogs') || '[]');
    setCriticalLogs(logs);
  }, []);

  const handleExportLogs = () => {
    const logsData = JSON.stringify(criticalLogs, null, 2);
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    localStorage.removeItem('criticalSecurityLogs');
    setCriticalLogs([]);
  };

  const recentLogs = showAllLogs ? criticalLogs : criticalLogs.slice(0, 10);
  const failedAttempts = criticalLogs.filter(log => !log.success).length;
  const authFailures = criticalLogs.filter(log => log.action.includes('AUTH') && !log.success).length;
  const dataFailures = criticalLogs.filter(log => log.action.includes('DATA') && !log.success).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          Security Dashboard
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleExportLogs} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button onClick={handleClearLogs} variant="outline" size="sm">
            Clear Logs
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalLogs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedAttempts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auth Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{authFailures}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Recent Security Events
            </CardTitle>
            <Button 
              onClick={() => setShowAllLogs(!showAllLogs)} 
              variant="outline" 
              size="sm"
            >
              {showAllLogs ? 'Show Recent' : 'Show All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No security events recorded</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    log.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {log.success ? (
                        <Shield className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-medium">{log.action}</span>
                      <span className="text-gray-600">on {log.resource}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {log.errorMessage && (
                    <div className="mt-2 text-sm text-red-600">
                      Error: {log.errorMessage}
                    </div>
                  )}
                  {log.userEmail && (
                    <div className="mt-1 text-xs text-gray-600">
                      User: {log.userEmail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
