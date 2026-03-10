'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Users,
  Bell,
  Repeat,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  CalendarDays,
  List,
  Grid,
  Filter,
  Search,
  DollarSign,
  Home,
  Car,
  Heart,
  Briefcase,
  GraduationCap,
  Gift,
  Plane,
  Shield,
  Target,
  PiggyBank,
  CreditCard,
  FileText
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  eventType: string
  start: string
  end?: string
  allDay: boolean
  location?: string
  color: string
  repeatType: string
  repeatInterval?: number
  repeatEndDate?: string
  reminderTime?: number
  status: string
  metadata?: any
}

export default function CalendarPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventType: 'reminder',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    location: '',
    color: '#3b82f6',
    repeatType: 'none',
    repeatInterval: 1,
    reminderTime: 30
  })

  useEffect(() => {
    fetchEvents()
  }, [currentDate, filterType])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const params = new URLSearchParams({
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString(),
        type: filterType
      })
      
      const response = await fetch(`/api/calendar?${params.toString()}`)
      const data = await response.json()
      
      setEvents(data.events || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setEventForm({
      title: '',
      description: '',
      eventType: 'reminder',
      startDate: date.toISOString().split('T')[0],
      startTime: '09:00',
      endDate: date.toISOString().split('T')[0],
      endTime: '10:00',
      allDay: false,
      location: '',
      color: '#3b82f6',
      repeatType: 'none',
      repeatInterval: 1,
      reminderTime: 30
    })
    setShowEventModal(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    const startDate = new Date(event.start)
    const endDate = event.end ? new Date(event.end) : new Date(event.start)
    
    setEventForm({
      title: event.title,
      description: event.description || '',
      eventType: event.eventType,
      startDate: startDate.toISOString().split('T')[0],
      startTime: event.allDay ? '00:00' : startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split('T')[0],
      endTime: event.allDay ? '23:59' : endDate.toTimeString().slice(0, 5),
      allDay: event.allDay,
      location: event.location || '',
      color: event.color,
      repeatType: event.repeatType,
      repeatInterval: event.repeatInterval || 1,
      reminderTime: event.reminderTime || 30
    })
    setShowEventModal(true)
  }

  const handleSaveEvent = async () => {
    try {
      const startDateTime = eventForm.allDay 
        ? new Date(eventForm.startDate).toISOString()
        : new Date(`${eventForm.startDate}T${eventForm.startTime}`).toISOString()
      
      const endDateTime = eventForm.allDay
        ? new Date(eventForm.endDate).toISOString()
        : new Date(`${eventForm.endDate}T${eventForm.endTime}`).toISOString()

      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        eventType: eventForm.eventType,
        start: startDateTime,
        end: endDateTime,
        allDay: eventForm.allDay,
        location: eventForm.location,
        color: eventForm.color,
        repeatType: eventForm.repeatType,
        repeatInterval: eventForm.repeatInterval,
        reminderTime: eventForm.reminderTime
      }

      const url = selectedEvent 
        ? `/api/calendar?id=${selectedEvent.id}`
        : '/api/calendar'
      
      const method = selectedEvent ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedEvent ? { id: selectedEvent.id, ...eventData } : eventData)
      })

      if (response.ok) {
        setShowEventModal(false)
        fetchEvents()
      }
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      const response = await fetch(`/api/calendar?id=${selectedEvent.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShowEventModal(false)
        fetchEvents()
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-4 h-4" />
      case 'bill':
        return <FileText className="w-4 h-4" />
      case 'goal':
        return <Target className="w-4 h-4" />
      case 'savings':
        return <PiggyBank className="w-4 h-4" />
      case 'appointment':
        return <Users className="w-4 h-4" />
      case 'reminder':
        return <Bell className="w-4 h-4" />
      default:
        return <CalendarIcon className="w-4 h-4" />
    }
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() // 0 = Sunday
    
    const days = []
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }
    
    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'bill':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'goal':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'savings':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'appointment':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const days = getDaysInMonth()
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading && events.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your events and reminders</p>
        </div>
        <button
          onClick={() => handleDateClick(new Date())}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-sage/20 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-deep-teal">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ml-2"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="payment">Payments</option>
              <option value="bill">Bills</option>
              <option value="goal">Goals</option>
              <option value="savings">Savings</option>
              <option value="appointment">Appointments</option>
              <option value="reminder">Reminders</option>
            </select>

            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 text-sm ${
                  view === 'month' 
                    ? 'bg-deep-teal text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 text-sm ${
                  view === 'week' 
                    ? 'bg-deep-teal text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1 text-sm ${
                  view === 'day' 
                    ? 'bg-deep-teal text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {weekdays.map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isToday = day.date.toDateString() === new Date().toDateString()
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day.date)}
                className={`min-h-[120px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !day.isCurrentMonth ? 'bg-gray-50/50' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs bg-soft-gold/10 text-soft-gold px-1.5 py-0.5 rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${getEventTypeColor(event.eventType)}`}
                      style={{ borderLeftColor: event.color }}
                    >
                      <div className="flex items-center gap-1">
                        {getEventTypeIcon(event.eventType)}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-deep-teal">
                  {selectedEvent ? 'Edit Event' : 'New Event'}
                </h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select
                  value={eventForm.eventType}
                  onChange={(e) => setEventForm({...eventForm, eventType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="reminder">Reminder</option>
                  <option value="payment">Payment</option>
                  <option value="bill">Bill</option>
                  <option value="goal">Goal</option>
                  <option value="savings">Savings</option>
                  <option value="appointment">Appointment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="Event description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={eventForm.allDay}
                  onChange={(e) => setEventForm({...eventForm, allDay: e.target.checked})}
                  className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                />
                <label htmlFor="allDay" className="text-sm text-gray-700">All day</label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({...eventForm, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                </div>
                {!eventForm.allDay && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm({...eventForm, startTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({...eventForm, endDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                </div>
                {!eventForm.allDay && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  value={eventForm.color}
                  onChange={(e) => setEventForm({...eventForm, color: e.target.value})}
                  className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>
                <select
                  value={eventForm.repeatType}
                  onChange={(e) => setEventForm({...eventForm, repeatType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {eventForm.repeatType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repeat Every</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={eventForm.repeatInterval}
                      onChange={(e) => setEventForm({...eventForm, repeatInterval: parseInt(e.target.value) || 1})}
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600">
                      {eventForm.repeatType === 'daily' ? 'days' :
                       eventForm.repeatType === 'weekly' ? 'weeks' :
                       eventForm.repeatType === 'monthly' ? 'months' : 'years'}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder</label>
                <select
                  value={eventForm.reminderTime}
                  onChange={(e) => setEventForm({...eventForm, reminderTime: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="0">No reminder</option>
                  <option value="5">5 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <div>
                {selectedEvent && (
                  <button
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  disabled={!eventForm.title}
                  className="px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {selectedEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
