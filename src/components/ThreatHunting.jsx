import { useState, useEffect } from 'react'
import './ThreatHunting.css'

const ThreatHunting = () => {
  const [huntingQueries, setHuntingQueries] = useState([])
  const [iocs, setIocs] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [activeQuery, setActiveQuery] = useState(null)
  const [showQueryBuilder, setShowQueryBuilder] = useState(false)
  const [newQuery, setNewQuery] = useState({
    name: '',
    description: '',
    query: '',
    category: 'NETWORK',
    severity: 'MEDIUM'
  })

  const huntingCategories = {
    NETWORK: '🌐 Network Traffic',
    PROCESS: '⚙️ Process Analysis',
    FILE: '📁 File System',
    REGISTRY: '🔧 Registry',
    MEMORY: '🧠 Memory',
    LOG: '📋 Log Analysis'
  }

  const sampleQueries = [
    {
      id: 1,
      name: 'Suspicious PowerShell Execution',
      description: 'Detect PowerShell commands with encoded or obfuscated content',
      query: 'process_name:powershell.exe AND (command_line:*encoded* OR command_line:*base64*)',
      category: 'PROCESS',
      severity: 'HIGH',
      lastRun: '2024-01-15T10:30:00Z',
      results: 12,
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'Lateral Movement via RDP',
      description: 'Identify potential lateral movement through RDP connections',
      query: 'event_type:rdp AND (source_ip:192.168.* OR source_ip:10.*) AND success:true',
      category: 'NETWORK',
      severity: 'MEDIUM',
      lastRun: '2024-01-15T09:15:00Z',
      results: 3,
      status: 'ACTIVE'
    },
    {
      id: 3,
      name: 'Suspicious File Creation',
      description: 'Detect creation of suspicious file types in temp directories',
      query: 'file_path:*temp* AND (file_extension:exe OR file_extension:bat OR file_extension:scr)',
      category: 'FILE',
      severity: 'MEDIUM',
      lastRun: '2024-01-15T08:45:00Z',
      results: 7,
      status: 'ACTIVE'
    },
    {
      id: 4,
      name: 'Registry Persistence Mechanisms',
      description: 'Find potential persistence mechanisms in Windows registry',
      query: 'registry_path:*Run* AND (value_name:* OR value_data:*exe*)',
      category: 'REGISTRY',
      severity: 'HIGH',
      lastRun: '2024-01-14T16:20:00Z',
      results: 0,
      status: 'ACTIVE'
    }
  ]

  const sampleIocs = [
    {
      id: 1,
      type: 'IP_ADDRESS',
      value: '192.168.1.100',
      description: 'Suspicious IP address from recent malware campaign',
      confidence: 'HIGH',
      source: 'Threat Intelligence Feed',
      firstSeen: '2024-01-15T08:00:00Z',
      lastSeen: '2024-01-15T10:30:00Z',
      tags: ['malware', 'c2', 'apt29']
    },
    {
      id: 2,
      type: 'DOMAIN',
      value: 'suspicious-domain.com',
      description: 'Domain used in phishing campaign',
      confidence: 'HIGH',
      source: 'Email Security',
      firstSeen: '2024-01-15T09:15:00Z',
      lastSeen: '2024-01-15T09:15:00Z',
      tags: ['phishing', 'malware', 'apt28']
    },
    {
      id: 3,
      type: 'HASH',
      value: 'a1b2c3d4e5f6789012345678901234567890abcd',
      description: 'SHA256 hash of malicious executable',
      confidence: 'CRITICAL',
      source: 'Sandbox Analysis',
      firstSeen: '2024-01-15T07:30:00Z',
      lastSeen: '2024-01-15T10:45:00Z',
      tags: ['ransomware', 'cryptolocker', 'apt29']
    },
    {
      id: 4,
      type: 'EMAIL',
      value: 'attacker@fake-company.com',
      description: 'Email address used in spear phishing attack',
      confidence: 'MEDIUM',
      source: 'User Report',
      firstSeen: '2024-01-15T11:00:00Z',
      lastSeen: '2024-01-15T11:00:00Z',
      tags: ['phishing', 'social-engineering']
    }
  ]

  const sampleResults = [
    {
      id: 1,
      queryId: 1,
      timestamp: '2024-01-15T10:30:00Z',
      hostname: 'WORKSTATION-001',
      username: 'john.doe',
      details: {
        process: 'powershell.exe',
        command: 'powershell -enc aW52b2tlLWV4cHJlc3Npb24...',
        pid: 1234,
        parent_pid: 5678
      },
      severity: 'HIGH',
      status: 'NEW'
    },
    {
      id: 2,
      queryId: 2,
      timestamp: '2024-01-15T09:15:00Z',
      hostname: 'SERVER-002',
      username: 'admin',
      details: {
        source_ip: '192.168.1.50',
        dest_ip: '192.168.1.100',
        port: 3389,
        duration: '00:15:30'
      },
      severity: 'MEDIUM',
      status: 'INVESTIGATING'
    },
    {
      id: 3,
      queryId: 3,
      timestamp: '2024-01-15T08:45:00Z',
      hostname: 'LAPTOP-003',
      username: 'jane.smith',
      details: {
        file_path: 'C:\\Windows\\Temp\\suspicious.exe',
        file_size: '2.5MB',
        file_hash: 'a1b2c3d4e5f6789012345678901234567890abcd'
      },
      severity: 'HIGH',
      status: 'CONTAINED'
    }
  ]

  useEffect(() => {
    setHuntingQueries(sampleQueries)
    setIocs(sampleIocs)
    setSearchResults(sampleResults)
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

  const getConfidenceClass = (confidence) => {
    switch (confidence) {
      case 'CRITICAL': return 'confidence-critical'
      case 'HIGH': return 'confidence-high'
      case 'MEDIUM': return 'confidence-medium'
      case 'LOW': return 'confidence-low'
      default: return 'confidence-medium'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'NEW': return 'status-new'
      case 'INVESTIGATING': return 'status-investigating'
      case 'CONTAINED': return 'status-contained'
      case 'RESOLVED': return 'status-resolved'
      case 'ACTIVE': return 'status-active'
      default: return 'status-new'
    }
  }

  const getIocTypeIcon = (type) => {
    switch (type) {
      case 'IP_ADDRESS': return '🌐'
      case 'DOMAIN': return '🌍'
      case 'HASH': return '🔐'
      case 'EMAIL': return '📧'
      case 'URL': return '🔗'
      case 'FILE': return '📁'
      default: return '🔍'
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

  const handleRunQuery = (queryId) => {
    // Simulate running a hunting query
    console.log(`Running hunting query ${queryId}`)
    // In a real app, this would call the backend API
  }

  const handleCreateQuery = () => {
    if (newQuery.name && newQuery.query) {
      const query = {
        ...newQuery,
        id: Date.now(),
        lastRun: new Date().toISOString(),
        results: 0,
        status: 'ACTIVE'
      }
      setHuntingQueries([...huntingQueries, query])
      setNewQuery({ name: '', description: '', query: '', category: 'NETWORK', severity: 'MEDIUM' })
      setShowQueryBuilder(false)
    }
  }

  const handleIocSearch = (iocValue) => {
    // Simulate IOC search across logs
    console.log(`Searching for IOC: ${iocValue}`)
    // In a real app, this would call the backend API
  }

  return (
    <div className="threat-hunting">
      <div className="hunting-header">
        <h2>🎯 Threat Hunting Center</h2>
        <div className="hunting-stats">
          <div className="stat-item">
            <span className="stat-number">{huntingQueries.length}</span>
            <span className="stat-label">Active Queries</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{iocs.length}</span>
            <span className="stat-label">IOCs Tracked</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{searchResults.length}</span>
            <span className="stat-label">Hits Found</span>
          </div>
        </div>
      </div>

      <div className="hunting-tabs">
        <button className="tab-btn active">🔍 Hunting Queries</button>
        <button className="tab-btn">🎯 IOCs</button>
        <button className="tab-btn">📊 Results</button>
        <button className="tab-btn">📈 Analytics</button>
      </div>

      <div className="hunting-content">
        {/* Hunting Queries Section */}
        <div className="queries-section">
          <div className="section-header">
            <h3>Hunting Queries</h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowQueryBuilder(true)}
            >
              ➕ New Query
            </button>
          </div>

          <div className="queries-grid">
            {huntingQueries.map(query => (
              <div key={query.id} className="query-card">
                <div className="query-header">
                  <h4>{query.name}</h4>
                  <div className="query-badges">
                    <span className={`severity-badge ${getSeverityClass(query.severity)}`}>
                      {query.severity}
                    </span>
                    <span className="category-badge">
                      {huntingCategories[query.category]}
                    </span>
                  </div>
                </div>

                <div className="query-description">
                  <p>{query.description}</p>
                </div>

                <div className="query-details">
                  <div className="query-meta">
                    <span>Last Run: {formatDate(query.lastRun)}</span>
                    <span>Results: {query.results}</span>
                    <span className={`status-badge ${getStatusClass(query.status)}`}>
                      {query.status}
                    </span>
                  </div>
                </div>

                <div className="query-query">
                  <code>{query.query}</code>
                </div>

                <div className="query-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleRunQuery(query.id)}
                  >
                    ▶️ Run Query
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setActiveQuery(query)}
                  >
                    🔍 View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IOCs Section */}
        <div className="iocs-section">
          <div className="section-header">
            <h3>Indicators of Compromise (IOCs)</h3>
            <button className="btn btn-primary">➕ Add IOC</button>
          </div>

          <div className="iocs-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Description</th>
                  <th>Confidence</th>
                  <th>Source</th>
                  <th>Last Seen</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {iocs.map(ioc => (
                  <tr key={ioc.id}>
                    <td>
                      <div className="ioc-type">
                        <span className="ioc-icon">{getIocTypeIcon(ioc.type)}</span>
                        <span>{ioc.type}</span>
                      </div>
                    </td>
                    <td>
                      <code className="ioc-value">{ioc.value}</code>
                    </td>
                    <td>{ioc.description}</td>
                    <td>
                      <span className={`confidence-badge ${getConfidenceClass(ioc.confidence)}`}>
                        {ioc.confidence}
                      </span>
                    </td>
                    <td>{ioc.source}</td>
                    <td>{formatDate(ioc.lastSeen)}</td>
                    <td>
                      <div className="ioc-actions">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleIocSearch(ioc.value)}
                        >
                          🔍 Search
                        </button>
                        <button className="btn btn-sm btn-secondary">
                          📋 Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Search Results Section */}
        <div className="results-section">
          <div className="section-header">
            <h3>Hunting Results</h3>
            <div className="results-filters">
              <select className="filter-select">
                <option value="all">All Results</option>
                <option value="new">New</option>
                <option value="investigating">Investigating</option>
                <option value="contained">Contained</option>
              </select>
            </div>
          </div>

          <div className="results-list">
            {searchResults.map(result => (
              <div key={result.id} className="result-card">
                <div className="result-header">
                  <h4>Hit #{result.id}</h4>
                  <div className="result-badges">
                    <span className={`severity-badge ${getSeverityClass(result.severity)}`}>
                      {result.severity}
                    </span>
                    <span className={`status-badge ${getStatusClass(result.status)}`}>
                      {result.status}
                    </span>
                  </div>
                </div>

                <div className="result-details">
                  <div className="detail-row">
                    <span className="detail-label">Hostname:</span>
                    <span className="detail-value">{result.hostname}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Username:</span>
                    <span className="detail-value">{result.username}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Timestamp:</span>
                    <span className="detail-value">{formatDate(result.timestamp)}</span>
                  </div>
                </div>

                <div className="result-data">
                  <h5>Details:</h5>
                  <pre>{JSON.stringify(result.details, null, 2)}</pre>
                </div>

                <div className="result-actions">
                  <button className="btn btn-primary">🔍 Investigate</button>
                  <button className="btn btn-secondary">📋 Add to Case</button>
                  <button className="btn btn-danger">❌ False Positive</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Query Builder Modal */}
      {showQueryBuilder && (
        <div className="query-builder-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🔧 Query Builder</h3>
              <button 
                className="close-btn"
                onClick={() => setShowQueryBuilder(false)}
              >
                ✕
              </button>
            </div>

            <div className="query-form">
              <div className="form-group">
                <label>Query Name</label>
                <input
                  type="text"
                  value={newQuery.name}
                  onChange={(e) => setNewQuery({...newQuery, name: e.target.value})}
                  placeholder="e.g., Suspicious PowerShell Activity"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newQuery.description}
                  onChange={(e) => setNewQuery({...newQuery, description: e.target.value})}
                  placeholder="Describe what this query is looking for..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newQuery.category}
                    onChange={(e) => setNewQuery({...newQuery, category: e.target.value})}
                  >
                    {Object.entries(huntingCategories).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Severity</label>
                  <select
                    value={newQuery.severity}
                    onChange={(e) => setNewQuery({...newQuery, severity: e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Query</label>
                <textarea
                  value={newQuery.query}
                  onChange={(e) => setNewQuery({...newQuery, query: e.target.value})}
                  placeholder="Enter your hunting query (e.g., process_name:powershell.exe AND command_line:*encoded*)"
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateQuery}
                >
                  ➕ Create Query
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowQueryBuilder(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreatHunting
