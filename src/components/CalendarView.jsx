import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function CalendarView({ schedules }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="nav-button" onClick={previousMonth}>
          <FiChevronLeft />
        </button>
        <h2>{getMonthName(currentDate)}</h2>
        <button className="nav-button" onClick={nextMonth}>
          <FiChevronRight />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekday-header">Sun</div>
        <div className="weekday-header">Mon</div>
        <div className="weekday-header">Tue</div>
        <div className="weekday-header">Wed</div>
        <div className="weekday-header">Thu</div>
        <div className="weekday-header">Fri</div>
        <div className="weekday-header">Sat</div>

        {days.map((day, idx) => (
          <div
            key={idx}
            className={`calendar-day ${day ? '' : 'empty'} ${isToday(day) ? 'today' : ''}`}
          >
            {day && (
              <>
                <div className="day-number">{day}</div>
                <div className="schedule-indicator">
                  {schedules.length > 0 && <span className="dot">•</span>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <p>📅 Days with dots have schedules assigned</p>
      </div>
    </div>
  )
}
