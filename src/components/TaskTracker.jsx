import { useMemo } from 'react';

export default function TaskTracker({ schedules, ageGroup }) {
  const stats = useMemo(() => {
    if (!schedules || !Array.isArray(schedules)) {
      return { completed: 0, remaining: 0, percentage: 0, tasks: [] };
    }

    const allTasks = [];
    schedules.forEach(schedule => {
      if (schedule?.tasks && Array.isArray(schedule.tasks)) {
        allTasks.push(...schedule.tasks.map(task => ({
          ...task,
          scheduleId: schedule.id,
          scheduleName: schedule.name
        })));
      }
    });

    const completed = 0;
    const total = allTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      remaining: total - completed,
      percentage,
      tasks: allTasks
    };
  }, [schedules]);

  const circleRadius = 45;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="task-tracker">
      {/* Stats Cards */}
      <div className="tracker-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.remaining}</div>
          <div className="stat-label">Remaining</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.percentage}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="tracker-progress">
        <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="75"
            cy="75"
            r={circleRadius}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="4"
          />
          <circle
            cx="75"
            cy="75"
            r={circleRadius}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div className="progress-inner">{stats.percentage}%</div>
      </div>

      {/* Task List */}
      {stats.tasks.length > 0 ? (
        <div className="tracker-list">
          <h3>All Tasks</h3>
          {stats.tasks.map((task, index) => (
            <div key={index} className="tracker-item">
              <div className="checkbox">☐</div>
              <div className="tracker-item-content">
                <div className="tracker-item-title">{task.title}</div>
                <div className="tracker-item-meta">
                  <span className="tracker-time">⏰ {task.time}</span>
                  <span className="tracker-type">{task.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
          <p>No tasks scheduled</p>
        </div>
      )}
    </div>
  );
}