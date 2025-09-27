import { useState, useEffect } from 'react'
import './Notifications.css'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [alerts, setAlerts] = useState([])
  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    criticalOnly: false,
    threatUpdates: true,
    incidentUpdates: true,
    systemUpdates: false
  })

  const notificationTypes = {
    THREAT: { icon: '🎯', color: '#ff6b6b', name: 'Threat Alert' },
    INCIDENT: { icon: '🚨', color: '#feca57', name: 'Incident Update' },
    SYSTEM: { icon: '⚙️', color: '#48dbfb', name: 'System Update' },
    SECURITY: { icon: '🛡️', color: '#ff9ff3', name: 'Security Alert' },
    MAINTENANCE: { icon: '🔧', color: '#54a0ff', name: 'Maintenance' }
  }

  const sampleNotifications = [
    {
      id: 1,
      type: 'THREAT',
      title: 'New Critical Threat Detected',
      message: 'APT29 campaign targeting financial institutions detected in your network',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      priority: 'CRITICAL',
      source: 'Threat Intelligence Feed',
      action: 'Investigate'
    },
    {
      id: 2,
      type: 'INCIDENT',
      title: 'Incident Response Team Activated',
      message: 'Ransomware incident on Server-DB-02 requires immediate attention',
      timestamp: '2024-01-15T09:15:00Z',
      read: false,
      priority: 'HIGH',
      source: 'SOC Team',
      action: 'Join Response'
    },
    {
      id: 3,
      type: 'SECURITY',
      title: 'Suspicious Login Attempt',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: '2024-01-15T08:45:00Z',
      read: true,
      priority: 'MEDIUM',
      source: 'Authentication System',
      action: 'Review'
    },
    {
      id: 4,
      type: 'SYSTEM',
      title: 'System Maintenance Scheduled',
      message: 'Planned maintenance window: 2024-01-16 02:00-04:00 UTC',
      timestamp: '2024-01-15T07:30:00Z',
      read: true,
      priority: 'LOW',
      source: 'System Administrator',
      action: 'Acknowledge'
    },
    {
      id: 5,
      type: 'THREAT',
      title: 'IOC Match Found',
      message: 'Known malicious IP address 203.0.113.42 detected in network traffic',
      timestamp: '2024-01-15T06:20:00Z',
      read: true,
      priority: 'HIGH',
      source: 'Threat Hunting',
      action: 'Investigate'
    }
  ]

  const sampleAlerts = [
    {
      id: 1,
      title: 'High Severity Threats',
      description: '3 new high-severity threats require immediate attention',
      count: 3,
      type: 'THREAT',
      timestamp: '2024-01-15T10:30:00Z',
      acknowledged: false
    },
    {
      id: 2,
      title: 'Active Incidents',
      description: '2 active security incidents in progress',
      count: 2,
      type: 'INCIDENT',
      timestamp: '2024-01-15T09:15:00Z',
      acknowledged: false
    },
    {
      id: 3,
      title: 'System Health',
      description: 'All systems operational, no issues detected',
      count: 0,
      type: 'SYSTEM',
      timestamp: '2024-01-15T08:00:00Z',
      acknowledged: true
    }
  ]

  useEffect(() => {
    setNotifications(sampleNotifications)
    setAlerts(sampleAlerts)
  }, [])

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'priority-critical'
      case 'HIGH': return 'priority-high'
      case 'MEDIUM': return 'priority-medium'
      case 'LOW': return 'priority-low'
      default: return 'priority-medium'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'CRITICAL': return '🚨'
      case 'HIGH': return '⚠️'
      case 'MEDIUM': return '⚡'
      case 'LOW': return 'ℹ️'
      default: return '⚡'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInMinutes = Math.floor((now - past) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
  }

  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ))
  }

  const handleSettingsChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value })
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h2>🔔 Notifications & Alerts</h2>
        <div className="notification-stats">
          <div className="stat-item">
            <span className="stat-number">{unreadCount}</span>
            <span className="stat-label">Unread</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{unacknowledgedAlerts}</span>
            <span className="stat-label">Active Alerts</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{notifications.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      <div className="notifications-tabs">
        <button className="tab-btn active">📬 Notifications</button>
        <button className="tab-btn">🚨 Alerts</button>
        <button className="tab-btn">⚙️ Settings</button>
      </div>

      <div className="notifications-content">
        {/* Notifications Tab */}
        <div className="notifications-tab">
          <div className="notifications-controls">
            <div className="notifications-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                ✅ Mark All Read
              </button>
              <button className="btn btn-primary">
                🔄 Refresh
              </button>
            </div>
            <div className="notifications-filters">
              <select className="filter-select">
                <option value="all">All Types</option>
                <option value="THREAT">Threat Alerts</option>
                <option value="INCIDENT">Incidents</option>
                <option value="SECURITY">Security</option>
                <option value="SYSTEM">System</option>
              </select>
              <select className="filter-select">
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔔</div>
                <div>No notifications</div>
                <div className="empty-state-subtitle">You're all caught up!</div>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="notification-icon">
                    <span style={{ color: notificationTypes[notification.type].color }}>
                      {notificationTypes[notification.type].icon}
                    </span>
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4 className="notification-title">{notification.title}</h4>
                      <div className="notification-meta">
                        <span className={`priority-badge ${getPriorityClass(notification.priority)}`}>
                          {getPriorityIcon(notification.priority)} {notification.priority}
                        </span>
                        <span className="notification-time">
                          {getTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    
                    <div className="notification-footer">
                      <div className="notification-source">
                        Source: {notification.source}
                      </div>
                      <div className="notification-actions">
                        {!notification.read && (
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            ✅ Mark Read
                          </button>
                        )}
                        <button className="btn btn-sm btn-primary">
                          {notification.action}
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts Tab */}
        <div className="alerts-tab">
          <div className="alerts-grid">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`alert-card ${!alert.acknowledged ? 'unacknowledged' : ''}`}
              >
                <div className="alert-header">
                  <div className="alert-icon">
                    <span style={{ color: notificationTypes[alert.type].color }}>
                      {notificationTypes[alert.type].icon}
                    </span>
                  </div>
                  <div className="alert-title">
                    <h4>{alert.title}</h4>
                    <span className="alert-count">{alert.count}</span>
                  </div>
                </div>
                
                <div className="alert-description">
                  {alert.description}
                </div>
                
                <div className="alert-footer">
                  <div className="alert-timestamp">
                    {getTimeAgo(alert.timestamp)}
                  </div>
                  <div className="alert-actions">
                    {!alert.acknowledged && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        ✅ Acknowledge
                      </button>
                    )}
                    <button className="btn btn-sm btn-secondary">
                      🔍 View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Tab */}
        <div className="settings-tab">
          <div className="settings-section">
            <h3>Notification Preferences</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Email Alerts</h4>
                  <p>Receive notifications via email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => handleSettingsChange('emailAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Push Notifications</h4>
                  <p>Receive browser push notifications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Critical Only</h4>
                  <p>Only receive critical priority notifications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.criticalOnly}
                    onChange={(e) => handleSettingsChange('criticalOnly', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Threat Updates</h4>
                  <p>Notifications for new threats and IOCs</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.threatUpdates}
                    onChange={(e) => handleSettingsChange('threatUpdates', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Incident Updates</h4>
                  <p>Notifications for incident response activities</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.incidentUpdates}
                    onChange={(e) => handleSettingsChange('incidentUpdates', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>System Updates</h4>
                  <p>Notifications for system maintenance and updates</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.systemUpdates}
                    onChange={(e) => handleSettingsChange('systemUpdates', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Alert Thresholds</h3>
            <div className="threshold-settings">
              <div className="threshold-item">
                <label>Critical Threat Threshold</label>
                <select className="threshold-select">
                  <option value="immediate">Immediate</option>
                  <option value="5min">5 minutes</option>
                  <option value="15min">15 minutes</option>
                </select>
              </div>
              <div className="threshold-item">
                <label>High Priority Threshold</label>
                <select className="threshold-select">
                  <option value="5min">5 minutes</option>
                  <option value="15min">15 minutes</option>
                  <option value="30min">30 minutes</option>
                </select>
              </div>
              <div className="threshold-item">
                <label>Medium Priority Threshold</label>
                <select className="threshold-select">
                  <option value="15min">15 minutes</option>
                  <option value="30min">30 minutes</option>
                  <option value="1hour">1 hour</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
