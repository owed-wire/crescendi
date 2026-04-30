import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import DailySchedule from './DailySchedule';
import CalendarView from './CalendarView';
import TaskTracker from './TaskTracker';
import PINProtection from './PINProtection';

export default function ChildInterface({ child, onBack, parentId }) {
  const [schedules, setSchedules] = useState([]);
  const [activeView, setActiveView] = useState('daily');
  const [points, setPoints] = useState((child && child.points) || 0);
  const [showPINModal, setShowPINModal] = useState(false);
  const [childData, setChildData] = useState(child || {});
  const [loading, setLoading] = useState(true);

  // Load schedules from Firestore
  useEffect(() => {
    if (!child || !child.id) return;

    const q = query(
      collection(db, 'schedules'),
      where('childId', '==', child.id),
      where('parentId', '==', parentId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const schedulesData = [];
      snapshot.forEach((doc) => {
        schedulesData.push({ id: doc.id, ...doc.data() });
      });
      setSchedules(schedulesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [child.id, parentId]);

  // Handle task completion
  const handleTaskComplete = async () => {
    try {
      const newPoints = points + 10;
      setPoints(newPoints);

      // Update in Firestore
      await updateDoc(doc(db, 'children', child.id), {
        points: newPoints
      });
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  // Handle exit with PIN protection
  const handleExit = () => {
    setShowPINModal(true);
  };

  const handlePINSuccess = () => {
    setShowPINModal(false);
    onBack();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="child-interface">
      {/* Header */}
      <div className="child-header">
        <div className="child-info">
          <span className="child-avatar">{childData.avatar}</span>
          <h2>{childData.name}</h2>
          <div className="points-display">
            <span className="points-label">Points:</span>
            <span className="points-value">{points}</span>
          </div>
        </div>
        <button
          className="btn-exit"
          onClick={handleExit}
          title="Exit to parent view (PIN required)"
        >
          👋 Exit
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="view-tabs">
        <button
          className={`tab ${activeView === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveView('daily')}
        >
          📅 Daily Tasks
        </button>
        <button
          className={`tab ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveView('calendar')}
        >
          📆 Calendar
        </button>
        <button
          className={`tab ${activeView === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveView('tracker')}
        >
          📊 Progress
        </button>
      </div>

      {/* View Content */}
      <div className="view-content">
        {activeView === 'daily' && (
          <DailySchedule
            schedules={schedules}
            onTaskComplete={handleTaskComplete}
            ageGroup={childData.age}
            childName={childData.name}
            points={points}
          />
        )}
        {activeView === 'calendar' && (
          <CalendarView schedules={schedules} />
        )}
        {activeView === 'tracker' && (
          <TaskTracker schedules={schedules} ageGroup={childData.age} />
        )}
      </div>

      {/* PIN Protection Modal */}
      {showPINModal && (
        <PINProtection
          onSuccess={handlePINSuccess}
          onCancel={() => setShowPINModal(false)}
        />
      )}
    </div>
  );
}
