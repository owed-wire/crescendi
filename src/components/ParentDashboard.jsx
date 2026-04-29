import { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  writeBatch
} from 'firebase/firestore'
import { FiLogOut, FiPlus, FiEdit2, FiTrash2, FiPlay } from 'react-icons/fi'
import ChildManager from './ChildManager'
import ScheduleManager from './ScheduleManager'

export default function ParentDashboard({ user, onLogout, onSwitchToChild }) {
  const [activeTab, setActiveTab] = useState('children')
  const [children, setChildren] = useState([])
  const [schedules, setSchedules] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showChildForm, setShowChildForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  // Load children
  useEffect(() => {
    const loadChildren = async () => {
      try {
        const q = query(
          collection(db, 'children'),
          where('parentId', '==', user.uid)
        )
        const snapshot = await getDocs(q)
        const childrenData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setChildren(childrenData)
        if (childrenData.length > 0 && !selectedChild) {
          setSelectedChild(childrenData[0])
        }
      } catch (error) {
        console.error('Error loading children:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChildren()
  }, [user.uid])

  // Load schedules for selected child
  useEffect(() => {
    if (!selectedChild) return

    const loadSchedules = async () => {
      try {
        const q = query(
          collection(db, 'schedules'),
          where('childId', '==', selectedChild.id)
        )
        const snapshot = await getDocs(q)
        const schedulesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSchedules(schedulesData)
      } catch (error) {
        console.error('Error loading schedules:', error)
      }
    }

    loadSchedules()
  }, [selectedChild])

  const handleAddChild = async (childData) => {
    try {
      const docRef = await addDoc(collection(db, 'children'), {
        ...childData,
        parentId: user.uid,
        createdAt: new Date(),
        points: 0,
        avatar: childData.avatar || '😊'
      })
      setChildren([...children, { id: docRef.id, ...childData, parentId: user.uid, points: 0 }])
      setShowChildForm(false)
    } catch (error) {
      console.error('Error adding child:', error)
    }
  }

  const handleDeleteChild = async (childId) => {
    if (confirm('Are you sure? This will delete all schedules for this child.')) {
      try {
        // Delete child
        await deleteDoc(doc(db, 'children', childId))

        // Delete related schedules
        const q = query(collection(db, 'schedules'), where('childId', '==', childId))
        const snapshot = await getDocs(q)
        const batch = writeBatch(db)
        snapshot.docs.forEach(doc => batch.delete(doc.ref))
        await batch.commit()

        setChildren(children.filter(c => c.id !== childId))
        if (selectedChild?.id === childId) {
          setSelectedChild(children[0] || null)
        }
      } catch (error) {
        console.error('Error deleting child:', error)
      }
    }
  }

  const handleAddSchedule = async (scheduleData) => {
    try {
      const docRef = await addDoc(collection(db, 'schedules'), {
        ...scheduleData,
        childId: selectedChild.id,
        parentId: user.uid,
        createdAt: new Date(),
        tasks: scheduleData.tasks || []
      })
      setSchedules([...schedules, { id: docRef.id, ...scheduleData }])
      setShowScheduleForm(false)
    } catch (error) {
      console.error('Error adding schedule:', error)
    }
  }

  const handleDeleteSchedule = async (scheduleId) => {
    if (confirm('Delete this schedule?')) {
      try {
        await deleteDoc(doc(db, 'schedules', scheduleId))
        setSchedules(schedules.filter(s => s.id !== scheduleId))
      } catch (error) {
        console.error('Error deleting schedule:', error)
      }
    }
  }

  return (
    <div className="parent-dashboard">
      <header className="dashboard-header">
        <h1>📅 Parent Dashboard</h1>
        <div className="header-actions">
          <span className="user-email">{user.email}</span>
          <button onClick={onLogout} className="logout-button">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'children' ? 'active' : ''}`}
            onClick={() => setActiveTab('children')}
          >
            👨‍👩‍👧‍👦 Children
          </button>
          <button
            className={`tab-button ${activeTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedules')}
          >
            📅 Schedules
          </button>
        </div>

        {/* Children Tab */}
        {activeTab === 'children' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Your Children</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowChildForm(!showChildForm)}
              >
                <FiPlus /> Add Child
              </button>
            </div>

            {showChildForm && (
              <ChildManager onSave={handleAddChild} onCancel={() => setShowChildForm(false)} />
            )}

            <div className="children-grid">
              {children.length === 0 ? (
                <p className="empty-state">No children added yet. Create one to get started!</p>
              ) : (
                children.map(child => (
                  <div key={child.id} className="child-card">
                    <div className="child-avatar">{child.avatar}</div>
                    <h3>{child.name}</h3>
                    <p className="child-age">Age: {child.age}</p>
                    <p className="child-points">⭐ {child.points || 0} points</p>
                    <div className="child-actions">
                      <button
                        className="btn btn-small btn-success"
                        onClick={() => {
                          setSelectedChild(child)
                          onSwitchToChild(child)
                        }}
                      >
                        <FiPlay /> View
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteChild(child.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="tab-content">
            {children.length === 0 ? (
              <div className="empty-state">
                <p>Add a child first to create schedules.</p>
              </div>
            ) : (
              <>
                <div className="section-header">
                  <div>
                    <h2>Schedules for {selectedChild?.name}</h2>
                    <div className="child-selector">
                      <label>Switch child:</label>
                      <select
                        value={selectedChild?.id || ''}
                        onChange={(e) => {
                          const child = children.find(c => c.id === e.target.value)
                          setSelectedChild(child)
                        }}
                      >
                        {children.map(child => (
                          <option key={child.id} value={child.id}>{child.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowScheduleForm(!showScheduleForm)}
                  >
                    <FiPlus /> Add Schedule
                  </button>
                </div>

                {showScheduleForm && (
                  <ScheduleManager
                    childAge={selectedChild?.age}
                    onSave={handleAddSchedule}
                    onCancel={() => setShowScheduleForm(false)}
                  />
                )}

                <div className="schedules-list">
                  {schedules.length === 0 ? (
                    <p className="empty-state">No schedules yet. Create one to get started!</p>
                  ) : (
                    schedules.map(schedule => (
                      <div key={schedule.id} className="schedule-card">
                        <h3>{schedule.name}</h3>
                        <p>{schedule.description}</p>
                        <div className="schedule-tasks">
                          <strong>Tasks ({schedule.tasks?.length || 0}):</strong>
                          <ul>
                            {(schedule.tasks || []).map((task, idx) => (
                              <li key={idx}>{task.title}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="schedule-actions">
                          <button className="btn btn-small btn-danger" onClick={() => handleDeleteSchedule(schedule.id)}>
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
