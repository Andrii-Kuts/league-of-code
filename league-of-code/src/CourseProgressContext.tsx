import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { Course, CourseProgress } from './types';

interface CourseProgressContextType {
  progress: CourseProgress;
  updateProgress: (courseId: string, progress: number) => void;
  getProgress: (courseId: string) => number;
}

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined);

export const useCourseProgress = () => {
  const context = useContext(CourseProgressContext);
  if (!context) {
    throw new Error('useCourseProgress must be used within CourseProgressProvider');
  }
  return context;
};

interface CourseProgressProviderProps {
  children: ReactNode;
  initialCourses: Course[];
  initialProgress?: CourseProgress;
}

export const CourseProgressProvider: React.FC<CourseProgressProviderProps> = ({ 
  children, 
  initialCourses,
  initialProgress: providedInitialProgress
}) => {
  const initialProgressState = useMemo(() => {
    if (providedInitialProgress) {
      return providedInitialProgress;
    }
    const progress: CourseProgress = {};
    initialCourses.forEach(course => {
      progress[course.id] = 0;
    });
    return progress;
  }, [initialCourses, providedInitialProgress]);

  const [progress, setProgress] = useState<CourseProgress>(initialProgressState);

  const updateProgress = (courseId: string, newProgress: number) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: Math.max(0, Math.min(100, newProgress)),
    }));
  };

  const getProgress = (courseId: string): number => {
    return progress[courseId] || 0;
  };

  return (
    <CourseProgressContext.Provider value={{ progress, updateProgress, getProgress }}>
      {children}
    </CourseProgressContext.Provider>
  );
};

