import React from 'react';
import { CourseProgressProvider } from './CourseProgressContext';
import { useCourseProgress } from './CourseProgressContext';
import { ParticleSystem } from './ParticleSystem';
import { CourseCard } from './CourseCard';
import { initialCourses, initialProgress } from './courseData';
import './App.css';

const Hero: React.FC = () => {
  const { progress } = useCourseProgress();

  return (
    <section className="hero">
      <ParticleSystem courseProgress={progress} />
      <div className="hero-content">
        <h1>Leagues of Code</h1>
        <p>Master programming through interactive courses designed for all skill levels</p>
      </div>
    </section>
  );
};

const CoursesSection: React.FC = () => {
  const { updateProgress } = useCourseProgress();

  return (
    <section className="courses-section">
      <div className="section-header">
        <h2>Available Courses</h2>
        <p>Choose your learning path</p>
      </div>

      <div className="courses-grid">
        {initialCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onProgressUpdate={updateProgress}
          />
        ))}
      </div>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <CourseProgressProvider initialCourses={initialCourses} initialProgress={initialProgress}>
      <div className="app">
        <Hero />
        <CoursesSection />
      </div>
    </CourseProgressProvider>
  );
};

export default App;

