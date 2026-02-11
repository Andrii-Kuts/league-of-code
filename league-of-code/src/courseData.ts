import type { Course, CourseColorConfig, CourseProgress } from './types';

export const courseColorConfigs: Record<string, CourseColorConfig> = {
  blue: {
    icon: '#dbeafe',
    button: '#3b82f6',
    particles: ['rgba(59,130,246,', 'rgba(96,165,250,'],
  },
  green: {
    icon: '#d1fae5',
    button: '#10b981',
    particles: ['rgba(16,185,129,', 'rgba(52,211,153,'],
  },
  orange: {
    icon: '#fef3c7',
    button: '#f59e0b',
    particles: ['rgba(245,158,11,', 'rgba(251,191,36,'],
  },
  purple: {
    icon: '#ede9fe',
    button: '#8b5cf6',
    particles: ['rgba(139,92,246,', 'rgba(167,139,250,'],
  },
  pink: {
    icon: '#fce7f3',
    button: '#ec4899',
    particles: ['rgba(236,72,153,', 'rgba(244,114,182,'],
  },
  cyan: {
    icon: '#cffafe',
    button: '#06b6d4',
    particles: ['rgba(6,182,212,', 'rgba(34,211,238,'],
  },
};

export const initialCourses: Course[] = [
  {
    id: 'python1',
    name: 'Python 1',
    level: 'Beginner',
    description: 'Master the fundamentals of Python programming with hands-on projects and interactive coding exercises.',
    icon: '🐍',
    color: 'blue',
    stats: { lessons: 150, duration: '4h' },
  },
  {
    id: 'python2',
    name: 'Python 2',
    level: 'Advanced',
    description: 'Advanced Python concepts including OOP, web frameworks, and real-world application development.',
    icon: '🚀',
    color: 'green',
    stats: { lessons: 100, duration: '6h' },
  },
  {
    id: 'math101',
    name: 'Math 101',
    level: 'Foundation',
    description: 'Build a strong mathematical foundation with interactive problem-solving and visual learning tools.',
    icon: '📐',
    color: 'orange',
    stats: { lessons: 60, duration: '5h' },
  },
  {
    id: 'math-ml',
    name: 'Math for ML',
    level: 'Advanced',
    description: 'Learn data analysis, visualization, and machine learning fundamentals with Python and popular libraries.',
    icon: '🤖',
    color: 'purple',
    stats: { lessons: 100, duration: '8h' },
    comingSoon: true,
  },
];

export const initialProgress: CourseProgress = {
  python1: 100,
  python2: 90,
  math101: 5,
  datascience: 0,
};

