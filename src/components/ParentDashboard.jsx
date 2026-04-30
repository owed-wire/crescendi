import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import ChildManager from './ChildManager';
import ScheduleManager from './ScheduleManager';

export default function ParentDashboard({ user, onSwitchToChild, onLogout }) {
  const [children, setChildren] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeTab, setActiveTab] = useState('children');
  const [showAddChild, setShowAddChild] = useState(false);

  // Load children
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'children'),
      where('parentId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const childrenData = [];
      snapshot.forEach((doc) => {
        childrenData.push({ id: doc.id, ...doc.data() });
      });
      setChildren(childrenData);
      
      // Auto-select first child if none selected
      if (childrenData.length > 0 && !selectedChildId) {
        setSelectedChildId(childrenData[0].id);
        setSelectedChild(childrenData[0]);
      }
    });

    return () => unsubscribe();
  }, [user?.uid, selectedChildId]);

  // Load schedules for selected child
  useEffect(() => {
    if (!selectedChildId || !user?.uid) {
      setSchedules([]);
      return;
    }

    const q = query(
      collection(db, 'schedules'),
      where('childId', '==', selectedChildId),
      where('parentId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const schedulesData = [];
      snapshot.forEach((doc) => {
        schedulesData.push({ id: doc.id, ...doc.data() });
      });
      setSchedules(schedulesData);
    });

    return () => unsubscribe();
  }, [selectedChildId, user?.uid]);

  // Update selected child when dropdown changes
  const handleChildChange = (childId) => {
    setSelectedChildId(childId);
    const child = children.find(c => c.id === childId);
    setSelectedChild(child);
  };

  const handleDeleteChild = async (childId) => {
    if (window.confirm('Are you sure you want to delete this child?')) {
      try {
        await deleteDoc(doc(db, 'children', childId));
        if (selectedChildId === childId) {
          setSelectedChildId(null);
          setSelectedChild(null);
        }
      } catch (error) {
        console.error('Error deleting child:', error);
      }
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteDoc(doc(db, 'schedules', scheduleId));
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>👨‍👩‍👧‍👦 Parent Dashboard</h1>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'children' ? 'active' : ''}`}
          onClick={() => setActiveTab('children')}
        >
          👨‍👩‍👧‍👦 Children
        </button>
        <button
          className={`tab-btn ${activeTab === 'schedules' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedules')}
        >
          📅 Schedules
        </button>
      </div>

      {/* Children Tab */}
      {activeTab === 'children' && (
        <div className="tab-content">
          <h2>Your Children</h2>
          
          {children.length === 0 ? (
            <div className="empty-message">
              <p>No children yet. Create one to get started!</p>
              <button 
                className="btn-primary" 
                onClick={() => setShowAddChild(true)}
              >
                + Add Child
              </button>
            </div>
          ) : (
            <>
              <div className="children-grid">
                {children.map(child => (
                  <div key={child.id} className="child-card">
                    <div className="child-avatar">{child.avatar}</div>
                    <h3>{child.name}</h3>
                    <p className="child-age">{child.age} years old</p>
                    <p className="child-points">⭐ {child.points || 0} points</p>
                    <div className="child-actions">
                      <button
                        className="btn-primary"
                        onClick={() => onSwitchToChild(child)}
                      >
                        View
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteChild(child.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => setShowAddChild(true)}
                >
                  + Add Another Child
                </button>
              </div>
            </>
          )}

          {/* Add Child Modal */}
          {showAddChild && (
            <div className="modal-overlay" onClick={() => setShowAddChild(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button 
                  className="modal-close" 
                  onClick={() => setShowAddChild(false)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                >
                  ✕
                </button>
                <ChildManager parentId={user.uid} onChildAdded={() => setShowAddChild(false)} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div className="tab-content">
          {children.length === 0 ? (
            <p className="empty-message">Create a child first to manage schedules.</p>
          ) : (
            <>
              <div className="schedule-selector">
                <label>Select child: </label>
                <select
                  value={selectedChildId || ''}
                  onChange={(e) => handleChildChange(e.target.value)}
                  className="schedule-select"
                >
                  <option value="">-- Select a child --</option>
                  {children.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedChildId && (
                <>
                  <h2>Schedules for {selectedChild?.name}</h2>
                  <ScheduleManager
                    childId={selectedChildId}
                    parentId={user.uid}
                    onScheduleAdded={() => {}}
                  />

                  {schedules.length === 0 ? (
                    <p className="empty-message">No schedules yet. Create one to get started!</p>
                  ) : (
                    <div className="schedules-list">
                      {schedules.map(schedule => (
                        <div key={schedule.id} className="schedule-item">
                          <div>
                            <h3>{schedule.name}</h3>
                            <p>{schedule.description}</p>
                            <p className="schedule-days">
                              Days: {schedule.daysOfWeek ? getDayNames(schedule.daysOfWeek).join(', ') : 'Every day'}
                            </p>
                            <p className="schedule-tasks">
                              Tasks: {schedule.tasks?.length || 0}
                            </p>
                          </div>
                          <button
                            className="btn-danger"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function getDayNames(dayIds) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayIds.map(id => days[id]).sort();
}