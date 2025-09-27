const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  async listJobApplications() {
    return http('GET', '/api/job-applications')
  },
  async createJobApplication(application) {
    return http('POST', '/api/job-applications', application)
  },
  async updateJobApplication(id, application) {
    return http('PUT', `/api/job-applications/${id}`, application)
  },
  async deleteJobApplication(id) {
    return http('DELETE', `/api/job-applications/${id}`)
  },
  async getJobApplication(id) {
    return http('GET', `/api/job-applications/${id}`)
  },
  async getApplicationsByStatus(status) {
    return http('GET', `/api/job-applications/status/${status}`)
  },
  async getApplicationsByPriority(priority) {
    return http('GET', `/api/job-applications/priority/${priority}`)
  },
  async searchApplications(company, title, location) {
    const params = new URLSearchParams()
    if (company) params.append('company', company)
    if (title) params.append('title', title)
    if (location) params.append('location', location)
    return http('GET', `/api/job-applications/search?${params}`)
  },
  async getApplicationsNeedingFollowUp() {
    return http('GET', '/api/job-applications/follow-up')
  },
  async getUpcomingInterviews(days = 7) {
    return http('GET', `/api/job-applications/upcoming-interviews?days=${days}`)
  },
  async getStatistics() {
    return http('GET', '/api/job-applications/statistics')
  }
}

