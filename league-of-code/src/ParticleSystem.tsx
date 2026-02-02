import React, { useEffect, useRef, useCallback } from 'react';
import type { CourseProgress } from './types';
import { courseColorConfigs } from './courseData';

interface ParticleSystemProps {
  courseProgress: CourseProgress;
  particlesPerCourse?: number;
}

const PARTICLES_PER_COURSE = 50;
const MAX_PARTICLES = 300;

const detectPerformance = (): 'low' | 'medium' | 'high' => {
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  
  if (hardwareConcurrency <= 2 || deviceMemory <= 2) return 'low';
  if (hardwareConcurrency <= 4 || deviceMemory <= 4) return 'medium';
  return 'high';
};

class Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  layer: number;
  size: number;
  opacity: number;
  colorPrefix: string;
  direction: number;
  
  constructor(x: number, y: number, colorPrefix: string) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = 0;
    this.speed = 0.0005 + Math.random() * 0.001;
    this.layer = 0.5 + Math.random() * 0.5;
    this.size = 3 + Math.random() * 5;
    this.opacity = 0.5 + Math.random() * 0.4;
    this.colorPrefix = colorPrefix;
    this.direction = Math.random() > 0.5 ? 1 : -1;
  }
  
  update(centerX: number, centerY: number, baseRadius: number, time: number) {
    this.angle += this.speed * this.direction;
    this.radius = baseRadius * this.layer;
    
    const pulse = 1 + Math.sin(time * 0.003 + this.angle * 2) * 0.1;
    const currentRadius = this.radius * pulse;
    
    this.x = centerX + Math.cos(this.angle) * currentRadius;
    this.y = centerY + Math.sin(this.angle) * currentRadius;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colorPrefix + this.opacity.toFixed(2) + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  courseProgress, 
  particlesPerCourse = PARTICLES_PER_COURSE 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeRef = useRef<number>(0);
  const performanceLevelRef = useRef<'low' | 'medium' | 'high'>(detectPerformance());
  const lastProgressRef = useRef<string>('');
  
  const courseColorMap: Record<string, string> = {
    python1: 'blue',
    python2: 'green',
    math101: 'orange',
    datascience: 'purple',
    webdev: 'pink',
    algorithms: 'cyan',
  };

  const getParticleCount = useCallback((baseCount: number): number => {
    const perf = performanceLevelRef.current;
    if (perf === 'low') return Math.floor(baseCount * 0.5);
    if (perf === 'medium') return Math.floor(baseCount * 0.75);
    return baseCount;
  }, []);

  const createParticles = useCallback((width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const particles: Particle[] = [];
    
    let totalParticles = 0;
    const courseParticleCounts: Array<{ count: number; colorPrefix: string }> = [];
    
    Object.entries(courseProgress).forEach(([courseId, progress]) => {
      const colorKey = courseColorMap[courseId];
      if (!colorKey) return;
      
      const config = courseColorConfigs[colorKey];
      const count = Math.floor((getParticleCount(particlesPerCourse) * progress) / 100);
      totalParticles += count;
      
      if (count > 0) {
        const colorIndex = Math.floor(Math.random() * config.particles.length);
        courseParticleCounts.push({
          count,
          colorPrefix: config.particles[colorIndex]
        });
      }
    });
    
    if (totalParticles > MAX_PARTICLES) {
      const scale = MAX_PARTICLES / totalParticles;
      courseParticleCounts.forEach(course => {
        course.count = Math.max(0, Math.floor(course.count * scale));
      });
      
      let scaledTotal = courseParticleCounts.reduce((sum, course) => sum + course.count, 0);
      
      if (scaledTotal < MAX_PARTICLES && courseParticleCounts.length > 0) {
        const diff = MAX_PARTICLES - scaledTotal;
        let added = 0;
        for (let i = 0; added < diff && i < courseParticleCounts.length; i++) {
          courseParticleCounts[i].count += 1;
          added++;
        }
      }
    }
    
    const grayColor = 'rgba(156,163,175,';
    const grayParticleCount = 30;
    
    if (totalParticles === 0) {
      for (let i = 0; i < grayParticleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.min(width, height) * 0.4;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        const particle = new Particle(x, y, grayColor);
        particle.opacity = 0.2 + Math.random() * 0.15;
        particle.size = 2.5 + Math.random() * 2.5;
        particles.push(particle);
      }
    } else {
      courseParticleCounts.forEach(({ count, colorPrefix }) => {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * Math.min(width, height) * 0.4;
          const x = centerX + Math.cos(angle) * dist;
          const y = centerY + Math.sin(angle) * dist;
          particles.push(new Particle(x, y, colorPrefix));
        }
      });
      
      if (totalParticles < grayParticleCount) {
        const grayCount = Math.floor(grayParticleCount * (1 - totalParticles / grayParticleCount));
        for (let i = 0; i < grayCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * Math.min(width, height) * 0.4;
          const x = centerX + Math.cos(angle) * dist;
          const y = centerY + Math.sin(angle) * dist;
          const particle = new Particle(x, y, grayColor);
          particle.opacity = 0.2 + Math.random() * 0.15;
          particle.size = 2.5 + Math.random() * 2.5;
          particles.push(particle);
        }
      }
    }
    
    return particles;
  }, [courseProgress, particlesPerCourse, getParticleCount]);

  const scaleParticles = useCallback((oldWidth: number, oldHeight: number, newWidth: number, newHeight: number) => {
    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;
    const oldCenterX = oldWidth / 2;
    const oldCenterY = oldHeight / 2;
    const newCenterX = newWidth / 2;
    const newCenterY = newHeight / 2;

    particlesRef.current.forEach(particle => {
      const relX = particle.x - oldCenterX;
      const relY = particle.y - oldCenterY;
      particle.x = newCenterX + relX * scaleX;
      particle.y = newCenterY + relY * scaleY;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    ctx.globalCompositeOperation = 'source-over';

    let resizeTimeout: number | undefined;
    let lastWidth = 0;
    let lastHeight = 0;

    const resize = () => {
      const hero = canvas.parentElement;
      if (!hero) return;
      
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      
      if (width === lastWidth && height === lastHeight) return;
      
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = window.setTimeout(() => {
        const oldWidth = canvas.width || width;
        const oldHeight = canvas.height || height;
        
        canvas.width = width;
        canvas.height = height;
        lastWidth = width;
        lastHeight = height;
        
        if (particlesRef.current.length > 0 && oldWidth > 0 && oldHeight > 0) {
          scaleParticles(oldWidth, oldHeight, width, height);
        } else {
          particlesRef.current = createParticles(width, height);
        }
      }, 150);
    };

    const hero = canvas.parentElement;
    if (hero) {
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      canvas.width = width;
      canvas.height = height;
      lastWidth = width;
      lastHeight = height;
      particlesRef.current = createParticles(width, height);
    }

    window.addEventListener('resize', resize, { passive: true });

    const animate = () => {
      timeRef.current += 1;
      const width = canvas.width;
      const height = canvas.height;
      
      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.45;
      
      ctx.clearRect(0, 0, width, height);
      
      const particles = particlesRef.current;
      const len = particles.length;
      
      for (let i = 0; i < len; i++) {
        const particle = particles[i];
        particle.update(centerX, centerY, baseRadius, timeRef.current);
        particle.draw(ctx);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [createParticles, scaleParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const progressKey = JSON.stringify(courseProgress);
    if (progressKey === lastProgressRef.current) return;
    lastProgressRef.current = progressKey;
    
    const hero = canvas.parentElement;
    if (!hero) return;
    
    const width = hero.clientWidth || canvas.width;
    const height = hero.clientHeight || canvas.height;
    
    if (width > 0 && height > 0) {
      particlesRef.current = createParticles(width, height);
    }
  }, [courseProgress, createParticles]);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};
