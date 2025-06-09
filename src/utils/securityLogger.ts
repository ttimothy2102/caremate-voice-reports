// Security logging utility for audit trails
interface SecurityEvent {
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  userEmail?: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

export const logSecurityEvent = (event: Omit<SecurityEvent, 'timestamp'>) => {
  const securityLog: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  
  // In a production environment, this would be sent to a secure logging service
  // For now, we'll use a structured console log that can be monitored
  console.log('[SECURITY_AUDIT]', JSON.stringify(securityLog));
  
  // Store critical security events in localStorage for immediate review
  // In production, this would be sent to a centralized logging system
  if (!event.success || event.action.includes('DELETE') || event.action.includes('UNAUTHORIZED')) {
    const criticalLogs = JSON.parse(localStorage.getItem('criticalSecurityLogs') || '[]');
    criticalLogs.push(securityLog);
    
    // Keep only the last 100 critical events
    if (criticalLogs.length > 100) {
      criticalLogs.splice(0, criticalLogs.length - 100);
    }
    
    localStorage.setItem('criticalSecurityLogs', JSON.stringify(criticalLogs));
  }
};

export const logDataAccess = (action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE', resource: string, resourceId?: string, success: boolean = true, errorMessage?: string) => {
  logSecurityEvent({
    action: `DATA_${action}`,
    resource,
    resourceId,
    success,
    errorMessage,
  });
};

export const logAuthEvent = (action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'UNAUTHORIZED_ACCESS', userEmail?: string, success: boolean = true, errorMessage?: string) => {
  logSecurityEvent({
    action: `AUTH_${action}`,
    resource: 'authentication',
    userEmail,
    success,
    errorMessage,
  });
};
