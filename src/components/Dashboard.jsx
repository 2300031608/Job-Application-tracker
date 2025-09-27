import { useState, useEffect } from 'react'
import './Dashboard.css'
import { api } from '../api.js'
import JobApplications from './JobApplications'
import InterviewScheduler from './InterviewScheduler'
import UserManagement from './UserManagement'
import Notifications from './Notifications'

const Dashboard = ({ user, onLogout }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [editingApplication, setEditingApplication] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('date')
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    location: '',
    jobType: 'FULL_TIME',
    status: 'APPLIED',
    priority: 'MEDIUM',
    source: '',
    jobUrl: '',
    contactPerson: '',
    contactEmail: '',
    appliedDate: '',
    interviewDate: '',
    followUpDate: '',
    notes: '',
    salaryRange: ''
  })

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const data = await api.listJobApplications()
      setApplications(data)
      setError(null)
    } catch (err) {
      setError('Failed to load job applications. Please check if the backend is running.')
      console.error('Error loading applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingApplication) {
        await api.updateJobApplication(editingApplication.id, formData)
        setSuccess('Job application updated successfully!')
      } else {
        await api.createJobApplication(formData)
        setSuccess('Job application added successfully!')
      }
      setFormData({ 
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        location: '',
        jobType: 'FULL_TIME',
        status: 'APPLIED',
        priority: 'MEDIUM',
        source: '',
        jobUrl: '',
        contactPerson: '',
        contactEmail: '',
        appliedDate: '',
        interviewDate: '',
        followUpDate: '',
        notes: '',
        salaryRange: ''
      })
      setEditingApplication(null)
      setShowForm(false)
      loadApplications()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to save job application')
      console.error('Error saving application:', err)
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleEdit = (application) => {
    setEditingApplication(application)
    setFormData({
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      jobDescription: application.jobDescription || '',
      location: application.location || '',
      jobType: application.jobType || 'FULL_TIME',
      status: application.status || 'APPLIED',
      priority: application.priority || 'MEDIUM',
      source: application.source || '',
      jobUrl: application.jobUrl || '',
      contactPerson: application.contactPerson || '',
      contactEmail: application.contactEmail || '',
      appliedDate: application.appliedDate ? new Date(application.appliedDate).toISOString().split('T')[0] : '',
      interviewDate: application.interviewDate ? new Date(application.interviewDate).toISOString().split('T')[0] : '',
      followUpDate: application.followUpDate ? new Date(application.followUpDate).toISOString().split('T')[0] : '',
      notes: application.notes || '',
      salaryRange: application.salaryRange || ''
    })
    setShowForm(true)
    setError(null)
    setSuccess(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await api.deleteJobApplication(id)
        setSuccess('Job application deleted successfully!')
        loadApplications()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        setError('Failed to delete job application')
        console.error('Error deleting application:', err)
        setTimeout(() => setError(null), 5000)
      }
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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'CRITICAL': return '🚨'
      case 'HIGH': return '⚠️'
      case 'MEDIUM': return '⚡'
      case 'LOW': return 'ℹ️'
      default: return '⚡'
    }
  }

  const getJobTypeIcon = (jobType) => {
    switch (jobType) {
      case 'FULL_TIME': return '💼'
      case 'PART_TIME': return '⏰'
      case 'CONTRACT': return '📋'
      case 'INTERNSHIP': return '🎓'
      case 'FREELANCE': return '🆓'
      case 'TEMPORARY': return '⏳'
      default: return '💼'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPLIED': return 'status-applied'
      case 'UNDER_REVIEW': return 'status-under-review'
      case 'PHONE_SCREEN': return 'status-phone-screen'
      case 'TECHNICAL_INTERVIEW': return 'status-technical-interview'
      case 'ON_SITE_INTERVIEW': return 'status-on-site-interview'
      case 'FINAL_INTERVIEW': return 'status-final-interview'
      case 'OFFER_RECEIVED': return 'status-offer-received'
      case 'OFFER_ACCEPTED': return 'status-offer-accepted'
      case 'OFFER_DECLINED': return 'status-offer-declined'
      case 'REJECTED': return 'status-rejected'
      case 'WITHDRAWN': return 'status-withdrawn'
      case 'NO_RESPONSE': return 'status-no-response'
      default: return 'status-applied'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter and sort applications
  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || application.status === statusFilter
    const matchesPriority = priorityFilter === 'ALL' || application.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  }).sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'date':
        return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
      case 'company':
        return a.companyName.localeCompare(b.companyName)
      default:
        return 0
    }
  })

  // Calculate statistics
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'APPLIED').length,
    underReview: applications.filter(a => a.status === 'UNDER_REVIEW').length,
    interviews: applications.filter(a => ['PHONE_SCREEN', 'TECHNICAL_INTERVIEW', 'ON_SITE_INTERVIEW', 'FINAL_INTERVIEW'].includes(a.status)).length,
    offers: applications.filter(a => a.status === 'OFFER_RECEIVED').length,
    accepted: applications.filter(a => a.status === 'OFFER_ACCEPTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading job application data...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">💼</div>
            <div className="logo-text">
              <h1>Job Application Tracker</h1>
              <span>Organize Your Job Search</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="username">{user.username}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          💼 Job Applications
        </button>
        <button 
          className={`nav-tab ${activeTab === 'interviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          🎯 Interviews
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
        <button 
          className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notifications
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📋 Reports
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-icon">💼</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total Applications</div>
                  <div className="stat-trend">All time</div>
                </div>
              </div>
              <div className="stat-card applied">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.applied}</div>
                  <div className="stat-label">Applied</div>
                  <div className="stat-trend">Waiting for response</div>
                </div>
              </div>
              <div className="stat-card under-review">
                <div className="stat-icon">👀</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.underReview}</div>
                  <div className="stat-label">Under Review</div>
                  <div className="stat-trend">Being considered</div>
                </div>
              </div>
              <div className="stat-card interviews">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.interviews}</div>
                  <div className="stat-label">Interviews</div>
                  <div className="stat-trend">Scheduled</div>
                </div>
              </div>
              <div className="stat-card offers">
                <div className="stat-icon">🎉</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.offers}</div>
                  <div className="stat-label">Offers</div>
                  <div className="stat-trend">Received</div>
                </div>
              </div>
              <div className="stat-card accepted">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.accepted}</div>
                  <div className="stat-label">Accepted</div>
                  <div className="stat-trend">Congratulations!</div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="recent-applications">
              <h3>Recent Job Applications</h3>
              <div className="application-list">
                {applications.slice(0, 5).map(application => (
                  <div key={application.id} className="application-item">
                    <div className="application-icon">
                      {getJobTypeIcon(application.jobType)}
                    </div>
                    <div className="application-info">
                      <div className="application-title">{application.jobTitle} at {application.companyName}</div>
                      <div className="application-meta">
                        <span className={`priority-badge ${getPriorityClass(application.priority)}`}>
                          {getPriorityIcon(application.priority)} {application.priority}
                        </span>
                        <span className={`status-badge ${getStatusClass(application.status)}`}>
                          {application.status.replace('_', ' ')}
                        </span>
                        <span className="application-location">{application.location}</span>
                        <span className="application-date">{formatDate(application.createdAt || application.created_at)}</span>
                      </div>
                    </div>
                    <div className="application-actions">
                      <button onClick={() => handleEdit(application)} className="btn-icon">✏️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <JobApplications />
        )}

        {activeTab === 'interviews' && (
          <InterviewScheduler />
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <h3>Job Search Analytics</h3>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Application Success Rate</h4>
                <div className="success-rate">
                  <span className="rate-number">{Math.round((stats.accepted / Math.max(stats.total, 1)) * 100)}%</span>
                  <span className="rate-label">Success Rate</span>
                </div>
              </div>
              <div className="analytics-card">
                <h4>Interview Conversion</h4>
                <div className="conversion-rate">
                  <span className="rate-number">{Math.round((stats.offers / Math.max(stats.interviews, 1)) * 100)}%</span>
                  <span className="rate-label">Interview to Offer</span>
                </div>
              </div>
              <div className="analytics-card">
                <h4>Response Rate</h4>
                <div className="response-rate">
                  <span className="rate-number">{Math.round(((stats.total - stats.applied) / Math.max(stats.total, 1)) * 100)}%</span>
                  <span className="rate-label">Applications with Response</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagement />
        )}

        {activeTab === 'notifications' && (
          <Notifications />
        )}

        {activeTab === 'reports' && (
          <div className="reports-tab">
            <h3>Security Reports</h3>
            <div className="reports-grid">
              <div className="report-card">
                <h4>Threat Summary Report</h4>
                <div className="report-stats">
                  <div className="report-stat">
                    <span className="stat-label">Total Threats</span>
                    <span className="stat-value">{stats.total}</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Critical</span>
                    <span className="stat-value critical">{stats.critical}</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">High</span>
                    <span className="stat-value high">{stats.high}</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Resolved</span>
                    <span className="stat-value resolved">{stats.resolved}</span>
                  </div>
                </div>
                <button className="download-btn">📥 Download Report</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Job Application Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingApplication ? '✏️ Edit Job Application' : '➕ Add New Job Application'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false)
                  setEditingApplication(null)
                  setFormData({ 
                    companyName: '',
                    jobTitle: '',
                    jobDescription: '',
                    location: '',
                    jobType: 'FULL_TIME',
                    status: 'APPLIED',
                    priority: 'MEDIUM',
                    source: '',
                    jobUrl: '',
                    contactPerson: '',
                    contactEmail: '',
                    appliedDate: '',
                    interviewDate: '',
                    followUpDate: '',
                    notes: '',
                    salaryRange: ''
                  })
                  setError(null)
                  setSuccess(null)
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="application-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="e.g., Google, Microsoft, Amazon"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                  placeholder="Describe the job role, responsibilities, and requirements..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>
                <div className="form-group">
                  <label>Job Type</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                  >
                    <option value="FULL_TIME">💼 Full-time</option>
                    <option value="PART_TIME">⏰ Part-time</option>
                    <option value="CONTRACT">📋 Contract</option>
                    <option value="INTERNSHIP">🎓 Internship</option>
                    <option value="FREELANCE">🆓 Freelance</option>
                    <option value="TEMPORARY">⏳ Temporary</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="APPLIED">📝 Applied</option>
                    <option value="UNDER_REVIEW">👀 Under Review</option>
                    <option value="PHONE_SCREEN">📞 Phone Screen</option>
                    <option value="TECHNICAL_INTERVIEW">💻 Technical Interview</option>
                    <option value="ON_SITE_INTERVIEW">🏢 On Site Interview</option>
                    <option value="FINAL_INTERVIEW">🎯 Final Interview</option>
                    <option value="OFFER_RECEIVED">🎉 Offer Received</option>
                    <option value="OFFER_ACCEPTED">✅ Offer Accepted</option>
                    <option value="OFFER_DECLINED">❌ Offer Declined</option>
                    <option value="REJECTED">🚫 Rejected</option>
                    <option value="WITHDRAWN">↩️ Withdrawn</option>
                    <option value="NO_RESPONSE">⏰ No Response</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="LOW">🟢 Low</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HIGH">🟠 High</option>
                    <option value="CRITICAL">🔴 Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    placeholder="e.g., LinkedIn, Indeed, Company Website"
                  />
                </div>
                <div className="form-group">
                  <label>Job URL</label>
                  <input
                    type="url"
                    value={formData.jobUrl}
                    onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
                    placeholder="https://company.com/jobs/123"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    placeholder="john.smith@company.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Applied Date</label>
                  <input
                    type="date"
                    value={formData.appliedDate}
                    onChange={(e) => setFormData({...formData, appliedDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Interview Date</label>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Follow-up Date</label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salary Range</label>
                  <input
                    type="text"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any additional notes about this application..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingApplication ? '🔄 Update Application' : '➕ Add Application'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false)
                    setEditingApplication(null)
                    setFormData({ 
                      companyName: '',
                      jobTitle: '',
                      jobDescription: '',
                      location: '',
                      jobType: 'FULL_TIME',
                      status: 'APPLIED',
                      priority: 'MEDIUM',
                      source: '',
                      jobUrl: '',
                      contactPerson: '',
                      contactEmail: '',
                      appliedDate: '',
                      interviewDate: '',
                      followUpDate: '',
                      notes: '',
                      salaryRange: ''
                    })
                    setError(null)
                    setSuccess(null)
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
