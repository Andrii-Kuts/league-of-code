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
    level: 'Beginner Level',
    description: 'Master the fundamentals of Python programming with hands-on projects and interactive coding exercises.',
    icon: '🐍',
    color: 'blue',
    tags: ['Beginner', 'Programming'],
    stats: { lessons: 12, duration: '4h', projects: 5 },
  },
  {
    id: 'python2',
    name: 'Python 2',
    level: 'Advanced Level',
    description: 'Advanced Python concepts including OOP, web frameworks, and real-world application development.',
    icon: '🚀',
    color: 'green',
    tags: ['Advanced', 'Web Dev'],
    stats: { lessons: 18, duration: '6h', projects: 8 },
  },
  {
    id: 'math101',
    name: 'Math 101',
    level: 'Foundation Level',
    description: 'Build a strong mathematical foundation with interactive problem-solving and visual learning tools.',
    icon: '📊',
    color: 'orange',
    tags: ['Foundation', 'Problem Solving'],
    stats: { lessons: 15, duration: '5h', projects: 6 },
  },
  {
    id: 'datascience',
    name: 'Data Science',
    level: 'Intermediate Level',
    description: 'Learn data analysis, visualization, and machine learning fundamentals with Python and popular libraries.',
    icon: '📈',
    color: 'purple',
    tags: ['Intermediate', 'Data'],
    stats: { lessons: 20, duration: '8h', projects: 10 },
    comingSoon: true,
  },
  {
    id: 'webdev',
    name: 'Web Development',
    level: 'Beginner Level',
    description: 'Build modern websites from scratch using HTML, CSS, and JavaScript with responsive design principles.',
    icon: '🌐',
    color: 'pink',
    tags: ['Beginner', 'Frontend'],
    stats: { lessons: 16, duration: '6h', projects: 7 },
    comingSoon: true,
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    level: 'Advanced Level',
    description: 'Master essential algorithms and data structures for technical interviews and competitive programming.',
    icon: '🧩',
    color: 'cyan',
    tags: ['Advanced', 'DSA'],
    stats: { lessons: 24, duration: '10h', projects: 15 },
    comingSoon: true,
  },
];

export const initialProgress: CourseProgress = {
  python1: 18,
  python2: 12,
  math101: 18,
  datascience: 20,
  webdev: 10,
  algorithms: 15,
};

