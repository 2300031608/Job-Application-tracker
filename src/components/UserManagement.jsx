import { useState, useEffect } from 'react'
import './UserManagement.css'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'ANALYST',
    department: '',
    status: 'ACTIVE'
  })

  const userRoles = [
    { id: 'ADMIN', name: 'Administrator', description: 'Full system access', permissions: ['ALL'] },
    { id: 'MANAGER', name: 'Security Manager', description: 'Team management and oversight', permissions: ['MANAGE_TEAM', 'VIEW_REPORTS', 'MANAGE_INCIDENTS'] },
    { id: 'ANALYST', name: 'Security Analyst', description: 'Threat analysis and investigation', permissions: ['VIEW_THREATS', 'MANAGE_INCIDENTS', 'CREATE_REPORTS'] },
    { id: 'HUNTER', name: 'Threat Hunter', description: 'Advanced threat hunting capabilities', permissions: ['THREAT_HUNTING', 'VIEW_THREATS', 'MANAGE_IOCS'] },
    { id: 'VIEWER', name: 'Viewer', description: 'Read-only access', permissions: ['VIEW_THREATS', 'VIEW_REPORTS'] }
  ]

  const departments = [
    'Security Operations Center (SOC)',
    'Incident Response Team',
    'Threat Intelligence',
    'Security Engineering',
    'Compliance & Risk',
    'Executive Leadership'
  ]

  const sampleUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@company.com',
      firstName: 'John',
      lastName: 'Administrator',
      role: 'ADMIN',
      department: 'Executive Leadership',
      status: 'ACTIVE',
      lastLogin: '2024-01-15T10:30:00Z',
      created: '2024-01-01T00:00:00Z',
      permissions: ['ALL']
    },
    {
      id: 2,
      username: 'sarah.manager',
      email: 'sarah.manager@company.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'MANAGER',
      department: 'Security Operations Center (SOC)',
      status: 'ACTIVE',
      lastLogin: '2024-01-15T09:15:00Z',
      created: '2024-01-05T00:00:00Z',
      permissions: ['MANAGE_TEAM', 'VIEW_REPORTS', 'MANAGE_INCIDENTS']
    },
    {
      id: 3,
      username: 'mike.analyst',
      email: 'mike.analyst@company.com',
      firstName: 'Mike',
      lastName: 'Chen',
      role: 'ANALYST',
      department: 'Security Operations Center (SOC)',
      status: 'ACTIVE',
      lastLogin: '2024-01-15T08:45:00Z',
      created: '2024-01-10T00:00:00Z',
      permissions: ['VIEW_THREATS', 'MANAGE_INCIDENTS', 'CREATE_REPORTS']
    },
    {
      id: 4,
      username: 'lisa.hunter',
      email: 'lisa.hunter@company.com',
      firstName: 'Lisa',
      lastName: 'Rodriguez',
      role: 'HUNTER',
      department: 'Threat Intelligence',
      status: 'ACTIVE',
      lastLogin: '2024-01-15T07:30:00Z',
      created: '2024-01-12T00:00:00Z',
      permissions: ['THREAT_HUNTING', 'VIEW_THREATS', 'MANAGE_IOCS']
    },
    {
      id: 5,
      username: 'tom.viewer',
      email: 'tom.viewer@company.com',
      firstName: 'Tom',
      lastName: 'Wilson',
      role: 'VIEWER',
      department: 'Compliance & Risk',
      status: 'INACTIVE',
      lastLogin: '2024-01-10T16:20:00Z',
      created: '2024-01-08T00:00:00Z',
      permissions: ['VIEW_THREATS', 'VIEW_REPORTS']
    }
  ]

  useEffect(() => {
    setUsers(sampleUsers)
    setRoles(userRoles)
  }, [])

  const getRoleInfo = (roleId) => {
    return roles.find(role => role.id === roleId) || { name: 'Unknown', description: '', permissions: [] }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-active'
      case 'INACTIVE': return 'status-inactive'
      case 'SUSPENDED': return 'status-suspended'
      case 'PENDING': return 'status-pending'
      default: return 'status-inactive'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return '🟢'
      case 'INACTIVE': return '🔴'
      case 'SUSPENDED': return '🟡'
      case 'PENDING': return '🟠'
      default: return '🔴'
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

  const handleCreateUser = () => {
    setEditingUser(null)
    setUserForm({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'ANALYST',
      department: '',
      status: 'ACTIVE'
    })
    setShowUserForm(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setUserForm({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      status: user.status
    })
    setShowUserForm(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userForm, permissions: getRoleInfo(userForm.role).permissions }
          : user
      ))
    } else {
      // Create new user
      const newUser = {
        id: Date.now(),
        ...userForm,
        permissions: getRoleInfo(userForm.role).permissions,
        lastLogin: null,
        created: new Date().toISOString()
      }
      setUsers([...users, newUser])
    }
    setShowUserForm(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
        : user
    ))
  }

  const getPermissionCount = (permissions) => {
    if (permissions.includes('ALL')) return 'All Permissions'
    return `${permissions.length} permissions`
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>👥 User Management</h2>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{users.filter(u => u.status === 'ACTIVE').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{roles.length}</span>
            <span className="stat-label">Roles</span>
          </div>
        </div>
      </div>

      <div className="user-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search users by name, email, or department..."
            />
          </div>
        </div>
        <div className="filter-controls">
          <select className="filter-select">
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <select className="filter-select">
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button className="btn btn-primary" onClick={handleCreateUser}>
            ➕ Add User
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const roleInfo = getRoleInfo(user.role)
              return (
                <tr key={user.id} className="user-row">
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.firstName} {user.lastName}</div>
                        <div className="user-email">{user.email}</div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="role-info">
                      <div className="role-name">{roleInfo.name}</div>
                      <div className="role-description">{roleInfo.description}</div>
                    </div>
                  </td>
                  <td>
                    <span className="department">{user.department}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(user.status)}`}>
                      {getStatusIcon(user.status)} {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="last-login">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </div>
                  </td>
                  <td>
                    <div className="permissions">
                      <span className="permission-count">
                        {getPermissionCount(user.permissions)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="user-actions">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEditUser(user)}
                        title="Edit user"
                      >
                        ✏️
                      </button>
                      <button 
                        className={`btn btn-sm ${user.status === 'ACTIVE' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleUserStatus(user.id)}
                        title={user.status === 'ACTIVE' ? 'Deactivate user' : 'Activate user'}
                      >
                        {user.status === 'ACTIVE' ? '⏸️' : '▶️'}
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingUser ? '✏️ Edit User' : '➕ Add New User'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUserForm(false)}
              >
                ✕
              </button>
            </div>

            <form className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={userForm.department}
                    onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                >
                  <option value="ACTIVE">🟢 Active</option>
                  <option value="INACTIVE">🔴 Inactive</option>
                  <option value="SUSPENDED">🟡 Suspended</option>
                  <option value="PENDING">🟠 Pending</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSaveUser}
                >
                  {editingUser ? '🔄 Update User' : '➕ Create User'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowUserForm(false)}
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

export default UserManagement
