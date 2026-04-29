import { useState, useEffect } from 'react'
import { FiCheck } from 'react-icons/fi'

const EMOJI_MAP = {
  'Breakfast': '🥞',
  'Lunch': '🍎',
  'Dinner': '🍝',
  'Snack': '🍪',
  'Activity': '🎨',
  'Play': '⚽',
  'Learning': '📚',
  'Chore': '🧹',
  'Nap': '😴',
  'Morning Routine': '🌅',
  'Bedtime': '🌙'
}

export default function DailySchedule({ schedule, childAge, completedTasks, onTaskComplete }) {
  const [celebration, setCelebration] = useState(null)

  const isYoungChild = ['2-4', '4-6'].includes(childAge)

  const handleTaskClick = (taskId) => {
    onTaskComplete(taskId)

    // Show celebration
    setCelebration(taskId)
    setTimeout(() => setCelebration(null), 1500)
  }

  const sortedTasks = [...(schedule.tasks || [])].sort((a, b) => {
    const timeA = a.time.split(':').join('')
    const timeB = b.time.split(':').join('')
    return timeA.localeCompare(timeB)
  })

  const getTaskEmoji = (task) => {
    return EMOJI_MAP[task.type] || '⭐'
  }

  const completedCount = Object.values(completedTasks).filter(Boolean).length

  return (
    <div className="daily-schedule">
      <div className="schedule-info">
        <h2>{schedule.name}</h2>
        <p>{schedule.description}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completedCount / sortedTasks.length) * 100}%` }}></div>
          <span className="progress-text">{completedCount} of {sortedTasks.length} completed</span>
        </div>
      </div>

      <div className={`tasks-container ${isYoungChild ? 'graphic-mode' : 'text-mode'}`}>
        {sortedTasks.map((task) => {
          const isCompleted = completedTasks[`${schedule.id}-${task.id}`]
          const isCelebrating = celebration === task.id

          return (
            <div
              key={task.id}
              className={`task-card ${isCompleted ? 'completed' : ''} ${isCelebrating ? 'celebrating' : ''}`}
              onClick={() => handleTaskClick(task.id)}
            >
              {isYoungChild ? (
                // Graphic mode for young children
                <div className="task-graphic">
                  <div className="task-emoji">{getTaskEmoji(task)}</div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-time">{task.time}</div>
                </div>
              ) : (
                // Text mode for older children
                <div className="task-text">
                  <div className="task-header">
                    <span className="task-emoji">{getTaskEmoji(task)}</span>
                    <span className="task-title">{task.title}</span>
                  </div>
                  <div className="task-meta">
                    <span className="task-type">{task.type}</span>
                    <span className="task-time">{task.time}</span>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="checkmark-overlay">
                  <FiCheck className="checkmark-icon" />
                </div>
              )}

              {isCelebrating && (
                <div className="celebration-animation">
                  <div className="celebration-text">Great job! 🎉</div>
                  <div className="confetti">🎊🎉🌟✨</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {completedCount === sortedTasks.length && sortedTasks.length > 0 && (
        <div className="completion-celebration">
          <div className="big-celebration">
            <h3>🎊 All Done! 🎊</h3>
            <p>You completed everything!</p>
            <div className="celebration-emojis">🌟 ⭐ 🎉 👏 🏆</div>
          </div>
        </div>
      )}
    </div>
  )
}
