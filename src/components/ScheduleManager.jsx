import { useState } from 'react'
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi'

const TASK_TYPES = ['Morning Routine', 'Breakfast', 'Activity', 'Snack', 'Lunch', 'Nap', 'Play', 'Learning', 'Chore', 'Dinner', 'Bedtime']

export default function ScheduleManager({ childAge, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tasks: []
  })
  const [newTask, setNewTask] = useState({ title: '', time: '09:00', type: 'Activity', image: '' })

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setFormData({
        ...formData,
        tasks: [...formData.tasks, { ...newTask, id: Date.now() }]
      })
      setNewTask({ title: '', time: '09:00', type: 'Activity', image: '' })
    }
  }

  const handleRemoveTask = (taskId) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter(t => t.id !== taskId)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim() && formData.tasks.length > 0) {
      onSave(formData)
      setFormData({ name: '', description: '', tasks: [] })
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-large">
        <div className="modal-header">
          <h3>Create Schedule</h3>
          <button className="close-button" onClick={onCancel}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Schedule Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Routine"
                autoFocus
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Everything to do before school"
              />
            </div>
          </div>

          {/* Add Task Section */}
          <div className="section">
            <h4>Add Tasks</h4>
            <div className="task-input-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g., Brush teeth"
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                  >
                    {TASK_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {['2-4', '4-6'].includes(childAge) && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Image Search Query (optional)</label>
                    <input
                      type="text"
                      value={newTask.image}
                      onChange={(e) => setNewTask({ ...newTask, image: e.target.value })}
                      placeholder="e.g., brush teeth, eating breakfast"
                    />
                    <small>This will find images matching the task</small>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn btn-success"
                onClick={handleAddTask}
              >
                <FiPlus /> Add Task
              </button>
            </div>
          </div>

          {/* Tasks List */}
          {formData.tasks.length > 0 && (
            <div className="section">
              <h4>Tasks ({formData.tasks.length})</h4>
              <div className="tasks-list">
                {formData.tasks.map((task, idx) => (
                  <div key={task.id} className="task-item">
                    <div className="task-info">
                      <span className="task-time">{task.time}</span>
                      <span className="task-title">{task.title}</span>
                      <span className="task-type">{task.type}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => handleRemoveTask(task.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formData.name.trim() || formData.tasks.length === 0}
            >
              Create Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
