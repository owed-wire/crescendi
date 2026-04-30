import { useEffect, useState } from 'react';

const EMOJI_MAP = {
  'Morning Routine': '🌅',
  'Breakfast': '🍳',
  'School': '🎓',
  'Lunch': '🍽️',
  'Afternoon Activity': '🎮',
  'Homework': '📚',
  'Dinner': '🍜',
  'Bedtime Routine': '😴',
  'Play Time': '🎨',
  'Exercise': '💪',
  'Reading': '📖',
  'Chores': '🧹'
};

export default function DailySchedule({ schedules, onTaskComplete, ageGroup, childName, points }) {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [celebratingTaskId, setCelebratingTaskId] = useState(null);

  useEffect(() => {
    // Get current day of week (0 = Sunday, 6 = Saturday)
    const today = new Date().getDay();

    // Filter schedules for today
    const todaysSchedules = schedules.filter(schedule => {
      const daysOfWeek = schedule.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]; // Default: every day
      return daysOfWeek.includes(today);
    });

    // Merge all tasks from today's schedules
    const allTasks = [];
    todaysSchedules.forEach(schedule => {
      if (schedule.tasks && Array.isArray(schedule.tasks)) {
        allTasks.push(...schedule.tasks.map(task => ({
          ...task,
          scheduleId: schedule.id,
          scheduleName: schedule.name
        })));
      }
    });

    // Sort by time
    allTasks.sort((a, b) => a.time.localeCompare(b.time));

    setTodaysTasks(allTasks);
    setCompletedCount(0);
  }, [schedules]);

  const handleTaskComplete = (taskIndex) => {
    const task = todaysTasks[taskIndex];
    setCelebratingTaskId(task.title);
    setCelebrating(true);

    // Play celebration sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not available');
    }

    setCompletedCount(prev => prev + 1);
    onTaskComplete();

    setTimeout(() => {
      setCelebrating(false);
      setCelebratingTaskId(null);
    }, 2000);
  };

  const progressPercent = todaysTasks.length > 0 ? Math.round((completedCount / todaysTasks.length) * 100) : 0;
  const isGraphicMode = ageGroup && ['2-4', '4-6'].includes(ageGroup);

  if (todaysTasks.length === 0) {
    return (
      <div className="schedule-container">
        <div className="no-tasks-message">
          <p>🎉 No tasks for today! Well done! 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Progress: {completedCount}/{todaysTasks.length}</span>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Tasks */}
      <div className="tasks-grid">
        {todaysTasks.map((task, index) => (
          <div
            key={index}
            className={`task-card ${celebratingTaskId === task.title ? 'celebrateCard' : ''}`}
            onClick={() => handleTaskComplete(index)}
          >
            {isGraphicMode ? (
              // Graphic mode for young kids (2-6)
              <div className="graphic-mode">
                <div className="task-emoji">{EMOJI_MAP[task.type] || '⭐'}</div>
                <div className="task-title">{task.title}</div>
                <div className="task-time">{task.time}</div>
              </div>
            ) : (
              // Text mode for older kids (6+)
              <div className="text-mode">
                <div className="task-header">
                  <span className="task-emoji">{EMOJI_MAP[task.type] || '⭐'}</span>
                  <span className="task-title">{task.title}</span>
                </div>
                <div className="task-meta">
                  <span className="task-type">{task.type}</span>
                  <span className="task-time">⏰ {task.time}</span>
                </div>
                <div className="task-schedule">{task.scheduleName}</div>
              </div>
            )}

            {celebrating && celebratingTaskId === task.title && (
              <div className="celebration-overlay">
                <div className="celebration-text">Great job! 🎉</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === todaysTasks.length && todaysTasks.length > 0 && (
        <div className="completion-message">
          <div className="completion-content">
            <h2>🌟 All Done! 🌟</h2>
            <p>Great job, {childName}! You completed all tasks!</p>
            <p className="points-earned">+{todaysTasks.length * 10} points earned!</p>
            <p className="total-points">Total: {points} points</p>
          </div>
        </div>
      )}
    </div>
  );
}
