export interface Course {
  id: string
  name: string
  level: string
  description: string
  icon: string
  color: string
  tags: string[]
  stats: {
    lessons: number
    duration: string
    projects: number
  }
  comingSoon?: boolean
}

export interface CourseColorConfig {
  icon: string
  button: string
  particles: string[]
}

export type CourseProgress = Record<string, number>

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  colorIdx: number
  speed: number
  offset: number
  layer: number
  baseOpacity: number
  direction: number
  orbitStrength: number
  driftAngle: number
  driftSpeed: number
  courseId: string
  colorStrings: string[]
}