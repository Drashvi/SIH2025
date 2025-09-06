// Schedule service for managing schedule data
export interface ScheduleClass {
  id: number | string
  time: string
  subject: string
  instructor: string
  room: string
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar'
  color?: string
  status?: 'upcoming' | 'ongoing' | 'completed'
  duration?: string
  description?: string
}

export interface DaySchedule {
  day: string
  date: string
  classes: ScheduleClass[]
}

export interface TodaySchedule {
  classes: ScheduleClass[]
}

// Real schedule data (moved from SchedulePage.tsx)
export const weeklySchedule: DaySchedule[] = [
  {
    day: 'Monday',
    date: '2024-01-15',
    classes: [
      {
        id: 1,
        time: '9:00 AM - 10:30 AM',
        subject: 'Data Structures',
        instructor: 'Dr. Smith',
        room: 'Room 301',
        type: 'Lecture',
        color: 'bg-blue-500',
        duration: '90 minutes'
      },
      {
        id: 2,
        time: '2:00 PM - 3:30 PM',
        subject: 'Software Engineering',
        instructor: 'Dr. Williams',
        room: 'Room 108',
        type: 'Lecture',
        color: 'bg-green-500',
        duration: '90 minutes'
      }
    ]
  },
  {
    day: 'Tuesday',
    date: '2024-01-16',
    classes: [
      {
        id: 3,
        time: '8:00 AM - 9:30 AM',
        subject: 'Mathematics',
        instructor: 'Dr. Brown',
        room: 'Room 205',
        type: 'Lecture',
        color: 'bg-purple-500',
        duration: '90 minutes'
      },
      {
        id: 4,
        time: '11:00 AM - 12:30 PM',
        subject: 'Database Systems',
        instructor: 'Prof. Johnson',
        room: 'Lab 205',
        type: 'Lab',
        color: 'bg-orange-500',
        duration: '90 minutes'
      }
    ]
  },
  {
    day: 'Wednesday',
    date: '2024-01-17',
    classes: [
      {
        id: 5,
        time: '9:00 AM - 10:30 AM',
        subject: 'Data Structures',
        instructor: 'Dr. Smith',
        room: 'Room 301',
        type: 'Lecture',
        color: 'bg-blue-500',
        duration: '90 minutes'
      },
      {
        id: 6,
        time: '2:00 PM - 3:30 PM',
        subject: 'Software Engineering',
        instructor: 'Dr. Williams',
        room: 'Room 108',
        type: 'Lecture',
        color: 'bg-green-500',
        duration: '90 minutes'
      }
    ]
  },
  {
    day: 'Thursday',
    date: '2024-01-18',
    classes: [
      {
        id: 7,
        time: '8:00 AM - 9:30 AM',
        subject: 'Mathematics',
        instructor: 'Dr. Brown',
        room: 'Room 205',
        type: 'Lecture',
        color: 'bg-purple-500',
        duration: '90 minutes'
      },
      {
        id: 8,
        time: '11:00 AM - 12:30 PM',
        subject: 'Database Systems',
        instructor: 'Prof. Johnson',
        room: 'Lab 205',
        type: 'Lab',
        color: 'bg-orange-500',
        duration: '90 minutes'
      }
    ]
  },
  {
    day: 'Friday',
    date: '2024-01-19',
    classes: [
      {
        id: 9,
        time: '9:00 AM - 10:30 AM',
        subject: 'Data Structures',
        instructor: 'Dr. Smith',
        room: 'Room 301',
        type: 'Lecture',
        color: 'bg-blue-500',
        duration: '90 minutes'
      }
    ]
  }
]

// Get today's classes based on current day
export const getTodaySchedule = (): TodaySchedule => {
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  
  // Find today's schedule
  const todaySchedule = weeklySchedule.find(day => day.day === dayName)
  
  if (!todaySchedule) {
    return { classes: [] }
  }

  // Add status to classes based on current time
  const currentTime = today.getHours() * 60 + today.getMinutes()
  
  const classesWithStatus = todaySchedule.classes.map(classItem => {
    const [startTime, endTime] = classItem.time.split(' - ')
    const [startHour, startMin] = startTime.includes('AM') 
      ? startTime.replace(' AM', '').split(':').map(Number)
      : [parseInt(startTime.replace(' PM', '').split(':')[0]) + 12, parseInt(startTime.replace(' PM', '').split(':')[1])]
    const [endHour, endMin] = endTime.includes('AM')
      ? endTime.replace(' AM', '').split(':').map(Number)
      : [parseInt(endTime.replace(' PM', '').split(':')[0]) + 12, parseInt(endTime.replace(' PM', '').split(':')[1])]
    
    const classStartTime = startHour * 60 + startMin
    const classEndTime = endHour * 60 + endMin
    
    let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming'
    if (currentTime >= classStartTime && currentTime <= classEndTime) {
      status = 'ongoing'
    } else if (currentTime > classEndTime) {
      status = 'completed'
    }
    
    return {
      ...classItem,
      status
    }
  })

  return { classes: classesWithStatus }
}

// Get classes for a specific day
export const getDaySchedule = (dayName: string): DaySchedule | null => {
  return weeklySchedule.find(day => day.day === dayName) || null
}

// Get all classes for the week
export const getWeeklySchedule = (): DaySchedule[] => {
  return weeklySchedule
}

// Get next upcoming class
export const getNextClass = (): ScheduleClass | null => {
  const todaySchedule = getTodaySchedule()
  const upcomingClasses = todaySchedule.classes.filter(classItem => classItem.status === 'upcoming')
  
  if (upcomingClasses.length > 0) {
    return upcomingClasses[0]
  }
  
  // If no more classes today, find next class in the week
  const today = new Date()
  const currentDayIndex = today.getDay() // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7
    const nextDayName = dayNames[nextDayIndex]
    const nextDaySchedule = getDaySchedule(nextDayName)
    
    if (nextDaySchedule && nextDaySchedule.classes.length > 0) {
      return nextDaySchedule.classes[0]
    }
  }
  
  return null
}

// Get classes count for today
export const getTodayClassesCount = (): number => {
  return getTodaySchedule().classes.length
}

// Get total classes count for the week
export const getWeeklyClassesCount = (): number => {
  return weeklySchedule.reduce((sum, day) => sum + day.classes.length, 0)
}
