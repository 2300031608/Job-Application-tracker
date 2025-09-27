import { useState, useEffect } from 'react'
import './IncidentResponse.css'

const IncidentResponse = () => {
  const [incidents, setIncidents] = useState([])
  const [activeIncident, setActiveIncident] = useState(null)
  const [showPlaybook, setShowPlaybook] = useState(false)
  const [playbookStep, setPlaybookStep] = useState(0)

  const playbooks = {
    MALWARE: [
      { step: 1, action: "Isolate affected systems", priority: "CRITICAL", time: "0-15 min" },
      { step: 2, action: "Preserve evidence and memory dumps", priority: "HIGH", time: "15-30 min" },
      { step: 3, action: "Identify malware family and IOCs", priority: "HIGH", time: "30-60 min" },
      { step: 4, action: "Deploy detection rules", priority: "MEDIUM", time: "1-2 hours" },
      { step: 5, action: "Clean and restore systems", priority: "MEDIUM", time: "2-4 hours" },
      { step: 6, action: "Update security controls", priority: "LOW", time: "4-8 hours" }
    ],
    PHISHING: [
      { step: 1, action: "Block malicious URLs and domains", priority: "CRITICAL", time: "0-5 min" },
      { step: 2, action: "Quarantine affected email accounts", priority: "HIGH", time: "5-15 min" },
      { step: 3, action: "Analyze phishing campaign scope", priority: "HIGH", time: "15-30 min" },
      { step: 4, action: "Notify affected users", priority: "MEDIUM", time: "30-60 min" },
      { step: 5, action: "Enhance email security filters", priority: "MEDIUM", time: "1-2 hours" },
      { step: 6, action: "Conduct security awareness training", priority: "LOW", time: "1-3 days" }
    ],
    RANSOMWARE: [
      { step: 1, action: "Immediately isolate infected systems", priority: "CRITICAL", time: "0-5 min" },
      { step: 2, action: "Assess scope and impact", priority: "CRITICAL", time: "5-15 min" },
      { step: 3, action: "Preserve evidence and snapshots", priority: "HIGH", time: "15-30 min" },
      { step: 4, action: "Activate incident response team", priority: "HIGH", time: "30-60 min" },
      { step: 5, action: "Restore from clean backups", priority: "MEDIUM", time: "1-4 hours" },
      { step: 6, action: "Implement additional security measures", priority: "MEDIUM", time: "4-8 hours" }
    ]
  }

  const sampleIncidents = [
    {
      id: 1,
      title: "Suspicious Network Activity Detected",
      severity: "HIGH",
      status: "INVESTIGATING",
      category: "MALWARE",
      detected: "2024-01-15T10:30:00Z",
      description: "Unusual network traffic patterns detected from multiple endpoints",
      affectedSystems: ["Workstation-001", "Workstation-045", "Server-DB-02"],
      assignedTo: "Security Team Alpha",
      iocs: ["192.168.1.100", "malware-sample.exe", "suspicious-domain.com"]
    },
    {
      id: 2,
      title: "Phishing Campaign Targeting Finance Department",
      severity: "MEDIUM",
      status: "ACTIVE",
      category: "PHISHING",
      detected: "2024-01-15T09:15:00Z",
      description: "Multiple phishing emails targeting finance team with fake invoice attachments",
      affectedSystems: ["Email-Server-01"],
      assignedTo: "SOC Analyst Beta",
      iocs: ["phishing-site.com", "fake-invoice.pdf", "suspicious-sender@fake.com"]
    },
    {
      id: 3,
      title: "Ransomware Detection on Critical Server",
      severity: "CRITICAL",
      status: "CONTAINED",
      category: "RANSOMWARE",
      detected: "2024-01-15T08:45:00Z",
      description: "Ransomware detected on production database server",
      affectedSystems: ["DB-Server-Prod", "Backup-Server-01"],
      assignedTo: "Incident Commander",
      iocs: ["ransom-note.txt", "encrypted-files", "attacker-ip-address"]
    }
  ]

  useEffect(() => {
    setIncidents(sampleIncidents)
  }, [])

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'severity-critical'
      case 'HIGH': return 'severity-high'
      case 'MEDIUM': return 'severity-medium'
      case 'LOW': return 'severity-low'
      default: return 'severity-medium'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-active'
      case 'INVESTIGATING': return 'status-investigating'
      case 'CONTAINED': return 'status-contained'
      case 'RESOLVED': return 'status-resolved'
      default: return 'status-active'
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'priority-critical'
      case 'HIGH': return 'priority-high'
      case 'MEDIUM': return 'priority-medium'
      case 'LOW': return 'priority-low'
      default: return 'priority-medium'
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

  const handleStartPlaybook = (incident) => {
    setActiveIncident(incident)
    setShowPlaybook(true)
    setPlaybookStep(0)
  }

  const handleNextStep = () => {
    if (playbookStep < playbooks[activeIncident.category].length - 1) {
      setPlaybookStep(playbookStep + 1)
    } else {
      setShowPlaybook(false)
      setActiveIncident(null)
      setPlaybookStep(0)
    }
  }

  const handleCompleteIncident = (incidentId) => {
    setIncidents(incidents.map(incident => 
      incident.id === incidentId 
        ? { ...incident, status: 'RESOLVED' }
        : incident
    ))
  }

  return (
    <div className="incident-response">
      <div className="incident-header">
        <h2>🚨 Incident Response Center</h2>
        <div className="incident-stats">
          <div className="stat-item">
            <span className="stat-number">{incidents.length}</span>
            <span className="stat-label">Total Incidents</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{incidents.filter(i => i.status === 'ACTIVE').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{incidents.filter(i => i.severity === 'CRITICAL').length}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
      </div>

      <div className="incident-grid">
        {incidents.map(incident => (
          <div key={incident.id} className="incident-card">
            <div className="incident-header-card">
              <h3>{incident.title}</h3>
              <div className="incident-badges">
                <span className={`severity-badge ${getSeverityClass(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className={`status-badge ${getStatusClass(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
            </div>

            <div className="incident-details">
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{incident.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Detected:</span>
                <span className="detail-value">{formatDate(incident.detected)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Assigned to:</span>
                <span className="detail-value">{incident.assignedTo}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Affected Systems:</span>
                <span className="detail-value">{incident.affectedSystems.length} systems</span>
              </div>
            </div>

            <div className="incident-description">
              <p>{incident.description}</p>
            </div>

            <div className="incident-iocs">
              <h4>Indicators of Compromise (IOCs):</h4>
              <div className="ioc-list">
                {incident.iocs.map((ioc, index) => (
                  <span key={index} className="ioc-item">{ioc}</span>
                ))}
              </div>
            </div>

            <div className="incident-actions">
              <button 
                className="btn btn-primary"
                onClick={() => handleStartPlaybook(incident)}
              >
                📋 Start Response Playbook
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveIncident(incident)}
              >
                🔍 View Details
              </button>
              {incident.status !== 'RESOLVED' && (
                <button 
                  className="btn btn-success"
                  onClick={() => handleCompleteIncident(incident.id)}
                >
                  ✅ Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Response Playbook Modal */}
      {showPlaybook && activeIncident && (
        <div className="playbook-modal">
          <div className="playbook-content">
            <div className="playbook-header">
              <h3>📋 Response Playbook: {activeIncident.category}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPlaybook(false)}
              >
                ✕
              </button>
            </div>

            <div className="playbook-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((playbookStep + 1) / playbooks[activeIncident.category].length) * 100}%` }}
                ></div>
              </div>
              <span>Step {playbookStep + 1} of {playbooks[activeIncident.category].length}</span>
            </div>

            <div className="playbook-step">
              <div className="step-header">
                <h4>Step {playbookStep + 1}: {playbooks[activeIncident.category][playbookStep].action}</h4>
                <div className="step-meta">
                  <span className={`priority-badge ${getPriorityClass(playbooks[activeIncident.category][playbookStep].priority)}`}>
                    {playbooks[activeIncident.category][playbookStep].priority}
                  </span>
                  <span className="time-estimate">
                    ⏱️ {playbooks[activeIncident.category][playbookStep].time}
                  </span>
                </div>
              </div>

              <div className="step-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleNextStep}
                >
                  {playbookStep === playbooks[activeIncident.category].length - 1 ? 'Complete Response' : 'Next Step'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowPlaybook(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IncidentResponse
