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
  const [points, setPoints] = useState(0);
  const [showPINModal, setShowPINModal] = useState(false);
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (child) {
      setChildData(child);
      if (child.points) {
        setPoints(child.points);
      }
    }
  }, [child]);

  useEffect(() => {
    if (!childData || !childData.id) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'schedules'),
      where('childId', '==', childData.id),
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
  }, [childData, parentId]);

  const handleTaskComplete = async () => {
    try {
      const newPoints = points + 10;
      setPoints(newPoints);

      if (childData && childData.id) {
        await updateDoc(doc(db, 'children', childData.id), {
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

  if (!childData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading child data...</p>
      </div>
    );
  }

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
          <span className="child-avatar">{childData?.avatar || '👧'}</span>
          <h2>{childData?.name || 'Child'}</h2>
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
            ageGroup={childData?.age}
            childName={childData?.name || 'Child'}
            points={points}
          />
        )}
        {activeView === 'calendar' && (
          <CalendarView schedules={schedules} />
        )}
        {activeView === 'tracker' && (
          <TaskTracker schedules={schedules} ageGroup={childData?.age} />
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