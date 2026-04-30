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
  const [points, setPoints] = useState(child?.points || 0);
  const [showPINModal, setShowPINModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!child?.id) {
      setLoading(false);
      return;
    }

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
  }, [child?.id, parentId]);

  const handleTaskComplete = async () => {
    try {
      const newPoints = points + 10;
      setPoints(newPoints);

      if (child?.id) {
        await updateDoc(doc(db, 'children', child.id), {
          points: newPoints
        });
      }
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

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
      <div className="child-header">
        <div className="child-info">
          <span className="child-avatar">{child?.avatar || '👧'}</span>
          <h2>{child?.name || 'Child'}</h2>
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

      <div className="view-content">
        {activeView === 'daily' && (
          <DailySchedule
            schedules={schedules}
            onTaskComplete={handleTaskComplete}
            ageGroup={child?.age}
            childName={child?.name || 'Child'}
            points={points}
          />
        )}
        {activeView === 'calendar' && (
          <CalendarView schedules={schedules} />
        )}
        {activeView === 'tracker' && (
          <TaskTracker schedules={schedules} ageGroup={child?.age} />
        )}
      </div>

      {showPINModal && (
        <PINProtection
          onSuccess={handlePINSuccess}
          onCancel={() => setShowPINModal(false)}
        />
      )}
    </div>
  );
}