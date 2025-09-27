import { useState, useEffect } from 'react'
import './InterviewScheduler.css'
import { api } from '../api.js'

const InterviewScheduler = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingInterview, setEditingInterview] = useState(null)
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    interviewType: 'PHONE_SCREEN',
    interviewDate: '',
    interviewTime: '',
    location: '',
    interviewer: '',
    interviewerEmail: '',
    notes: '',
    preparation: ''
  })

  useEffect(() => {
    loadInterviews()
  }, [])

  const loadInterviews = async () => {
    try {
      setLoading(true)
      const data = await api.getUpcomingInterviews(30) // Next 30 days
      setInterviews(data)
      setError(null)
    } catch (err) {
      setError('Failed to load interviews')
      console.error('Error loading interviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingInterview) {
        await api.updateJobApplication(editingInterview.id, {
          ...editingInterview,
          interviewDate: formData.interviewDate,
          notes: formData.notes
        })
      }
      setFormData({
        companyName: '',
        jobTitle: '',
        interviewType: 'PHONE_SCREEN',
        interviewDate: '',
        interviewTime: '',
        location: '',
        interviewer: '',
        interviewerEmail: '',
        notes: '',
        preparation: ''
      })
      setEditingInterview(null)
      setShowForm(false)
      loadInterviews()
    } catch (err) {
      setError('Failed to save interview')
      console.error('Error saving interview:', err)
    }
  }

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'PHONE_SCREEN': return '📞'
      case 'TECHNICAL_INTERVIEW': return '💻'
      case 'ON_SITE_INTERVIEW': return '🏢'
      case 'FINAL_INTERVIEW': return '🎯'
      default: return '📞'
    }
  }

  const getInterviewTypeClass = (type) => {
    switch (type) {
      case 'PHONE_SCREEN': return 'interview-phone'
      case 'TECHNICAL_INTERVIEW': return 'interview-technical'
      case 'ON_SITE_INTERVIEW': return 'interview-onsite'
      case 'FINAL_INTERVIEW': return 'interview-final'
      default: return 'interview-phone'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysUntilInterview = (dateString) => {
    const interviewDate = new Date(dateString)
    const today = new Date()
    const diffTime = interviewDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="interview-scheduler-loading">
        <div className="loading-spinner"></div>
        <p>Loading interview schedule...</p>
      </div>
    )
  }

  return (
    <div className="interview-scheduler">
      <div className="interview-scheduler-header">
        <h2>Interview Scheduler</h2>
        <button 
          className="add-interview-btn"
          onClick={() => setShowForm(true)}
        >
          ➕ Schedule Interview
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="interviews-grid">
        {interviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No Upcoming Interviews</h3>
            <p>You don't have any interviews scheduled for the next 30 days.</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Schedule Your First Interview
            </button>
          </div>
        ) : (
          interviews.map(interview => {
            const daysUntil = getDaysUntilInterview(interview.interviewDate)
            return (
              <div key={interview.id} className="interview-card">
                <div className="interview-header">
                  <div className="interview-type">
                    <span className={`interview-type-badge ${getInterviewTypeClass(interview.status)}`}>
                      {getInterviewTypeIcon(interview.status)} {interview.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="interview-countdown">
                    {daysUntil > 0 ? (
                      <span className="countdown-positive">{daysUntil} days</span>
                    ) : daysUntil === 0 ? (
                      <span className="countdown-today">Today!</span>
                    ) : (
                      <span className="countdown-past">Past due</span>
                    )}
                  </div>
                </div>

                <div className="interview-content">
                  <h3 className="interview-title">{interview.jobTitle}</h3>
                  <p className="interview-company">{interview.companyName}</p>
                  
                  <div className="interview-details">
                    <div className="detail-item">
                      <span className="detail-label">📅 Date:</span>
                      <span className="detail-value">{formatDate(interview.interviewDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🕐 Time:</span>
                      <span className="detail-value">{formatTime(interview.interviewDate)}</span>
                    </div>
                    {interview.location && (
                      <div className="detail-item">
                        <span className="detail-label">📍 Location:</span>
                        <span className="detail-value">{interview.location}</span>
                      </div>
                    )}
                    {interview.contactPerson && (
                      <div className="detail-item">
                        <span className="detail-label">👤 Interviewer:</span>
                        <span className="detail-value">{interview.contactPerson}</span>
                      </div>
                    )}
                  </div>

                  {interview.notes && (
                    <div className="interview-notes">
                      <h4>Notes:</h4>
                      <p>{interview.notes}</p>
                    </div>
                  )}

                  <div className="interview-actions">
                    <button 
                      className="btn-icon edit-btn"
                      onClick={() => {
                        setEditingInterview(interview)
                        setFormData({
                          companyName: interview.companyName,
                          jobTitle: interview.jobTitle,
                          interviewType: interview.status,
                          interviewDate: interview.interviewDate ? new Date(interview.interviewDate).toISOString().split('T')[0] : '',
                          interviewTime: interview.interviewDate ? new Date(interview.interviewDate).toTimeString().slice(0, 5) : '',
                          location: interview.location || '',
                          interviewer: interview.contactPerson || '',
                          interviewerEmail: interview.contactEmail || '',
                          notes: interview.notes || '',
                          preparation: ''
                        })
                        setShowForm(true)
                      }}
                      title="Edit interview"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Interview Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingInterview ? '✏️ Edit Interview' : '📅 Schedule Interview'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false)
                  setEditingInterview(null)
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="interview-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="e.g., Google, Microsoft"
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

              <div className="form-row">
                <div className="form-group">
                  <label>Interview Type</label>
                  <select
                    value={formData.interviewType}
                    onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
                  >
                    <option value="PHONE_SCREEN">📞 Phone Screen</option>
                    <option value="TECHNICAL_INTERVIEW">💻 Technical Interview</option>
                    <option value="ON_SITE_INTERVIEW">🏢 On Site Interview</option>
                    <option value="FINAL_INTERVIEW">🎯 Final Interview</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Interview Date</label>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Interview Time</label>
                  <input
                    type="time"
                    value={formData.interviewTime}
                    onChange={(e) => setFormData({...formData, interviewTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Interviewer Name</label>
                  <input
                    type="text"
                    value={formData.interviewer}
                    onChange={(e) => setFormData({...formData, interviewer: e.target.value})}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="form-group">
                  <label>Interviewer Email</label>
                  <input
                    type="email"
                    value={formData.interviewerEmail}
                    onChange={(e) => setFormData({...formData, interviewerEmail: e.target.value})}
                    placeholder="john.smith@company.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Interview Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any notes about this interview..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Preparation Checklist</label>
                <textarea
                  value={formData.preparation}
                  onChange={(e) => setFormData({...formData, preparation: e.target.value})}
                  placeholder="List your preparation items..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingInterview ? '🔄 Update Interview' : '📅 Schedule Interview'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false)
                    setEditingInterview(null)
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

export default InterviewScheduler
