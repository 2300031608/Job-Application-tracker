import { useState, useEffect } from 'react'
import './JobApplications.css'
import { api } from '../api.js'

const JobApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('date')
  const [showForm, setShowForm] = useState(false)
  const [editingApplication, setEditingApplication] = useState(null)
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
      setError('Failed to load job applications')
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
      } else {
        await api.createJobApplication(formData)
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
    } catch (err) {
      setError('Failed to save job application')
      console.error('Error saving application:', err)
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
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await api.deleteJobApplication(id)
        loadApplications()
      } catch (err) {
        setError('Failed to delete job application')
        console.error('Error deleting application:', err)
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
      day: 'numeric'
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

  if (loading) {
    return (
      <div className="job-applications-loading">
        <div className="loading-spinner"></div>
        <p>Loading job applications...</p>
      </div>
    )
  }

  return (
    <div className="job-applications">
      <div className="job-applications-header">
        <h2>Job Applications</h2>
        <button 
          className="add-application-btn"
          onClick={() => {
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
            setShowForm(true)
          }}
        >
          ➕ Add New Application
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search and Filter Controls */}
      <div className="controls-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search applications by company, job title, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-controls">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="PHONE_SCREEN">Phone Screen</option>
            <option value="TECHNICAL_INTERVIEW">Technical Interview</option>
            <option value="ON_SITE_INTERVIEW">On Site Interview</option>
            <option value="FINAL_INTERVIEW">Final Interview</option>
            <option value="OFFER_RECEIVED">Offer Received</option>
            <option value="OFFER_ACCEPTED">Offer Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="company">Sort by Company</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="applications-table-container">
        <div className="table-header">
          <h3>Job Applications</h3>
          <span className="application-count">{filteredApplications.length} applications found</span>
        </div>
        
        <div className="table-wrapper">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Job Information</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Location</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-state-icon">💼</div>
                    <div>No applications found</div>
                    <div className="empty-state-subtitle">
                      {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first job application'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map(application => (
                  <tr key={application.id} className="application-row">
                    <td>
                      <div className="application-title">{application.jobTitle}</div>
                      <div className="application-company">{application.companyName}</div>
                      <div className="application-description">{application.jobDescription}</div>
                    </td>
                    <td>
                      <div className="application-type">
                        <span className="type-icon">{getJobTypeIcon(application.jobType || 'FULL_TIME')}</span>
                        <span>{application.jobType || 'FULL_TIME'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(application.priority)}`}>
                        {getPriorityIcon(application.priority)} {application.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(application.status || 'APPLIED')}`}>
                        {application.status || 'APPLIED'}
                      </span>
                    </td>
                    <td>
                      <span className="application-location">{application.location || 'Remote'}</span>
                    </td>
                    <td>
                      <div className="application-date">
                        {formatDate(application.appliedDate || application.createdAt || Date.now())}
                      </div>
                    </td>
                    <td>
                      <div className="application-actions">
                        <button 
                          className="btn-icon edit-btn"
                          onClick={() => handleEdit(application)}
                          title="Edit application"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon delete-btn"
                          onClick={() => handleDelete(application.id)}
                          title="Delete application"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Form Modal */}
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

export default JobApplications
