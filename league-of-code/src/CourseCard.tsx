import React from 'react';
import type { Course } from './types';
import { courseColorConfigs } from './courseData';
import { useCourseProgress } from './CourseProgressContext';

interface CourseCardProps {
  course: Course;
  onProgressUpdate?: (courseId: string, progress: number) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { getProgress } = useCourseProgress();
  const config = courseColorConfigs[course.color];
  const progress = Math.max(0, Math.min(100, getProgress(course.id)));

  return (
    <div className={`course-card ${course.comingSoon ? 'coming-soon' : ''}`}>
      <div className="card-header">
        <div 
          className={`course-icon ${course.color}`}
          style={{ background: config.icon }}
        >
          {course.icon}
        </div>
        <div className="course-info">
          <h3>{course.name}</h3>
          <span className="course-level">{course.level}</span>
        </div>
      </div>
      
      <div className="card-body">
        <p className="course-description">{course.description}</p>
        
        <div className="course-progress">
          <div className="progress-label">
            <span>Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar-fill ${course.color}`}
              style={{ 
                width: `${progress}%`,
                background: config.button
              }}
            />
          </div>
        </div>
        
        <div className="course-tags">
          {course.tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="course-stats">
          <div className="stat">
            <div className="stat-value">{course.stats.lessons}</div>
            <div className="stat-label">Lessons</div>
          </div>
          <div className="stat">
            <div className="stat-value">{course.stats.duration}</div>
            <div className="stat-label">Duration</div>
          </div>
          <div className="stat">
            <div className="stat-value">{course.stats.projects}</div>
            <div className="stat-label">Projects</div>
          </div>
        </div>
        
        {course.comingSoon ? (
          <span className="course-btn" style={{ background: '#9ca3af' }}>
            Coming Soon
          </span>
        ) : (
          <a 
            href="#" 
            className="course-btn"
            style={{ background: config.button }}
          >
            Start Learning
          </a>
        )}
      </div>
    </div>
  );
};

