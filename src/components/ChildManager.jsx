import { useState } from 'react'
import { FiX } from 'react-icons/fi'

const AVATARS = ['😊', '🥰', '😎', '🤗', '😄', '🌟', '🎉', '🦁', '🐶', '🦊', '🐼', '🐸']
const AGE_GROUPS = [
  { value: '2-4', label: '2-4 years (Graphic-heavy)' },
  { value: '4-6', label: '4-6 years (Mixed)' },
  { value: '6-8', label: '6-8 years (Text-light)' },
  { value: '8-12', label: '8-12 years (Text-based)' },
  { value: '12+', label: '12+ years (Full features)' }
]

export default function ChildManager({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '4-6',
    avatar: '😊'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSave(formData)
      setFormData({ name: '', age: '4-6', avatar: '😊' })
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Child</h3>
          <button className="close-button" onClick={onCancel}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Child's Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Age Group</label>
            <select
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            >
              {AGE_GROUPS.map(group => (
                <option key={group.value} value={group.value}>{group.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Choose Avatar</label>
            <div className="avatar-grid">
              {AVATARS.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  className={`avatar-button ${formData.avatar === avatar ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, avatar })}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Child Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
