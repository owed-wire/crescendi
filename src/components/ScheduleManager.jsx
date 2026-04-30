import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TASK_TYPES = [
  'Morning Routine',
  'Breakfast',
  'School',
  'Lunch',
  'Afternoon Activity',
  'Homework',
  'Dinner',
  'Bedtime Routine',
  'Play Time',
  'Exercise',
  'Reading',
  'Chores'
];

const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' }
];

export default function ScheduleManager({ childId, parentId, onScheduleAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Default: Mon-Fri
  const [tasks, setTasks] = useState([
    { id: Date.now(), title: '', time: '09:00', type: 'Morning Routine', image: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const toggleDay = (dayId) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId].sort()
    );
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      { id: Date.now(), title: '', time: '09:00', type: 'Morning Routine', image: '' }
    ]);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!childId) {
      alert('Please select a child first');
      return;
    }

    if (!scheduleName.trim() || tasks.length === 0 || selectedDays.length === 0) {
      alert('Please fill in all fields and select at least one day');
      return;
    }

    if (tasks.some(t => !t.title.trim())) {
      alert('Please fill in all task titles');
      return;
    }

    setLoading(true);

    try {
      const schedule = {
        childId,
        parentId,
        name: scheduleName,
        description,
        daysOfWeek: selectedDays,
        tasks: tasks.map(({ id, ...rest }) => rest),
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'schedules'), schedule);

      setScheduleName('');
      setDescription('');
      setSelectedDays([1, 2, 3, 4, 5]);
      setTasks([{ id: Date.now(), title: '', time: '09:00', type: 'Morning Routine', image: '' }]);
      setShowForm(false);

      if (onScheduleAdded) onScheduleAdded();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="btn-primary"
      >
        + Add Schedule
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setShowForm(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Create New Schedule</h3>

        <form onSubmit={handleSubmit}>
          {/* Schedule Name */}
          <div className="form-group">
            <label>Schedule Name *</label>
            <input
              type="text"
              placeholder="e.g., Morning Routine"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description (optional)</label>
            <input
              type="text"
              placeholder="e.g., Get ready for school"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Days of Week Selection */}
          <div className="form-group">
            <label>Repeat on Days *</label>
            <div className="days-selection">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day.id}
                  type="button"
                  className={`day-btn ${selectedDays.includes(day.id) ? 'selected' : ''}`}
                  onClick={() => toggleDay(day.id)}
                  title={day.name}
                >
                  {day.name.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="form-group">
            <label>Tasks *</label>
            {tasks.map((task, index) => (
              <div key={task.id} className="task-input-group">
                <input
                  type="text"
                  placeholder="Task title"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                  required
                />
                <input
                  type="time"
                  value={task.time}
                  onChange={(e) => updateTask(task.id, 'time', e.target.value)}
                />
                <select
                  value={task.type}
                  onChange={(e) => updateTask(task.id, 'type', e.target.value)}
                >
                  {TASK_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {tasks.length > 1 && (
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => removeTask(task.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-secondary"
              onClick={addTask}
            >
              + Add Task
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
