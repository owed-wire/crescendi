import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiList } from 'react-icons/fi'
import CalendarView from './CalendarView'
import DailySchedule from './DailySchedule'
import TaskTracker from './TaskTracker'

export default function ChildInterface({ profile, onBack }) {
  const [view, setView] = useState('daily') // 'daily', 'calendar', 'tasks'
  const [schedules, setSchedules] = useState([])
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completedTasks, setCompletedTasks] = useState({})
  const [points, setPoints] = useState(profile?.points || 0)

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const q = query(
          collection(db, 'schedules'),
          where('childId', '==', profile.id)
        )
        const snapshot = await getDocs(q)
        const schedulesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSchedules(schedulesData)
        if (schedulesData.length > 0) {
          setSelectedSchedule(schedulesData[0])
        }
      } catch (error) {
        console.error('Error loading schedules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSchedules()
  }, [profile.id])

  const handleTaskComplete = async (taskId) => {
    // Add celebration animation
    const key = `${selectedSchedule.id}-${taskId}`
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }))

    // Update points
    if (!completedTasks[key]) {
      const newPoints = points + 10
      setPoints(newPoints)

      // Update in database
      try {
        await updateDoc(doc(db, 'children', profile.id), {
          points: newPoints
        })
      } catch (error) {
        console.error('Error updating points:', error)
      }
    }

    // Play celebration sound
    playCelebration()
  }

  const playCelebration = () => {
    // Create a fun beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  if (loading) {
    return <div className="loading-screen"><p>Loading...</p></div>
  }

  return (
    <div className="child-interface">
      {/* Header with back button and points */}
      <header className="child-header">
        <button className="back-button" onClick={onBack}>
          <FiArrowLeft /> Back
        </button>
        <div className="header-content">
          <h1 className="child-greeting">
            {profile.avatar} {profile.name}'s Schedule
          </h1>
        </div>
        <div className="points-display">
          <div className="points-badge">⭐ {points} points</div>
        </div>
      </header>

      {/* View selector */}
      <div className="view-tabs">
        <button
          className={`view-button ${view === 'daily' ? 'active' : ''}`}
          onClick={() => setView('daily')}
        >
          <FiCheckCircle /> Today's Tasks
        </button>
        <button
          className={`view-button ${view === 'calendar' ? 'active' : ''}`}
          onClick={() => setView('calendar')}
        >
          <FiCalendar /> Calendar
        </button>
        <button
          className={`view-button ${view === 'tasks' ? 'active' : ''}`}
          onClick={() => setView('tasks')}
        >
          <FiList /> Task Tracker
        </button>
      </div>

      {/* Schedule selector */}
      {schedules.length > 0 && (
        <div className="schedule-selector">
          <select
            value={selectedSchedule?.id || ''}
            onChange={(e) => {
              const schedule = schedules.find(s => s.id === e.target.value)
              setSelectedSchedule(schedule)
            }}
            className="schedule-select"
          >
            {schedules.map(schedule => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content Views */}
      <div className="child-content">
        {schedules.length === 0 ? (
          <div className="empty-state">
            <p>No schedules yet! Ask your parent to create one.</p>
          </div>
        ) : (
          <>
            {view === 'daily' && selectedSchedule && (
              <DailySchedule
                schedule={selectedSchedule}
                childAge={profile.age}
                completedTasks={completedTasks}
                onTaskComplete={handleTaskComplete}
              />
            )}
            {view === 'calendar' && selectedSchedule && (
              <CalendarView schedules={schedules} />
            )}
            {view === 'tasks' && selectedSchedule && (
              <TaskTracker
                schedule={selectedSchedule}
                completedTasks={completedTasks}
                onTaskComplete={handleTaskComplete}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
