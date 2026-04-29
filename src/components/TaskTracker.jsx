import { FiCheckSquare, FiSquare } from 'react-icons/fi'

export default function TaskTracker({ schedule, completedTasks, onTaskComplete }) {
  const sortedTasks = [...(schedule.tasks || [])].sort((a, b) => {
    const timeA = a.time.split(':').join('')
    const timeB = b.time.split(':').join('')
    return timeA.localeCompare(timeB)
  })

  const completedCount = Object.values(completedTasks).filter(Boolean).length
  const percentComplete = Math.round((completedCount / sortedTasks.length) * 100)

  return (
    <div className="task-tracker">
      <div className="tracker-stats">
        <div className="stat-card">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sortedTasks.length - completedCount}</div>
          <div className="stat-label">Remaining</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{percentComplete}%</div>
          <div className="stat-label">Done</div>
        </div>
      </div>

      <div className="tracker-progress">
        <div className="progress-circle" style={{
          background: `conic-gradient(#4CAF50 ${percentComplete}%, #e0e0e0 ${percentComplete}%)`
        }}>
          <div className="progress-inner">
            <span>{percentComplete}%</span>
          </div>
        </div>
      </div>

      <div className="tracker-list">
        <h3>Tasks for {schedule.name}</h3>
        {sortedTasks.map((task) => {
          const isCompleted = completedTasks[`${schedule.id}-${task.id}`]

          return (
            <div
              key={task.id}
              className={`tracker-item ${isCompleted ? 'completed' : ''}`}
              onClick={() => onTaskComplete(task.id)}
            >
              <div className="checkbox">
                {isCompleted ? (
                  <FiCheckSquare className="checked-icon" />
                ) : (
                  <FiSquare className="unchecked-icon" />
                )}
              </div>
              <div className="tracker-item-content">
                <div className="tracker-item-title">{task.title}</div>
                <div className="tracker-item-meta">
                  <span className="tracker-time">{task.time}</span>
                  <span className="tracker-type">{task.type}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
