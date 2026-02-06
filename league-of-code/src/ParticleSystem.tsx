import React, { useEffect, useRef, useCallback } from 'react';
import type { CourseProgress } from './types';
import { courseColorConfigs } from './courseData';

interface ParticleSystemProps {
  courseProgress: CourseProgress;
  particlesPerCourse?: number;
}

const STAR_COEFFICIENT = 0.3;
const NODE_SIZE = 10;
const LINE_COLOR = "rgba(128,128,128,0.15)";
const NODES_DISTANCE = 30;
const SPEED_DAMPING = 0.8;
class Particle {
  x: number;
  y: number;
  baseSize: number;
  size: number;
  opacity: number;
  colorPrefix: string;
  timeOffset: number;
  parent: number;
  hasParent: boolean;
  parentX: number;
  parentY: number;
  parentSize: number;
  velocityX: number;
  velocityY: number;
  
  constructor(x: number, y: number, size: number, colorPrefix: string, opacity: number, parent: number) {
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.hasParent = parent != -1;
    this.parentX = 0;
    this.parentY = 0;
    this.parentSize = 0;
    this.baseSize = size;
    this.opacity = opacity;
    this.colorPrefix = colorPrefix;
    this.size = this.baseSize;
    this.timeOffset = Math.random() * Math.PI*2;
    this.velocityX = 0;
    this.velocityY = 0;
  }
  
  update(time: number, parentX: number, parentY: number, parentSize: number) {  
    const pulse = 1 + Math.sin(time * 0.01 + this.timeOffset) * 0.05;
    this.size = this.baseSize * pulse;
    this.velocityX *= SPEED_DAMPING;
    this.velocityY *= SPEED_DAMPING;
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.parentX = parentX;
    this.parentY = parentY;
    this.parentSize = parentSize;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    this.drawCircle(ctx);
  }

  drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colorPrefix + this.opacity.toFixed(2) + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDiamond(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colorPrefix + this.opacity.toFixed(2) + ')';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.size);
    ctx.lineTo(this.x + this.size, this.y);
    ctx.lineTo(this.x, this.y + this.size);
    ctx.lineTo(this.x - this.size, this.y);
    ctx.closePath();
    ctx.fill();
  }

  drawStar(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colorPrefix + this.opacity.toFixed(2) + ')';
    ctx.beginPath();
    const size2 = this.size * STAR_COEFFICIENT;
    ctx.moveTo(this.x, this.y - this.size);
    ctx.lineTo(this.x + size2, this.y - size2);
    ctx.lineTo(this.x + this.size, this.y);
    ctx.lineTo(this.x + size2, this.y + size2);
    ctx.lineTo(this.x, this.y + this.size);
    ctx.lineTo(this.x - size2, this.y + size2);
    ctx.lineTo(this.x - this.size, this.y);
    ctx.lineTo(this.x - size2, this.y - size2);
    ctx.closePath();
    ctx.fill();
  }

  drawEdge(ctx: CanvasRenderingContext2D) {
    if(!this.hasParent)
      return;
    ctx.strokeStyle = LINE_COLOR;
    ctx.beginPath();
    const dx = this.parentX - this.x;
    const dy = this.parentY - this.y;
    const len2 = dx ** 2 + dy ** 2;
    const minLen = this.size + this.parentSize;
    if( len2 < minLen ** 2 )
      return;
    const len = Math.sqrt(len2);

    ctx.moveTo(this.x + dx / len * this.size, this.y + dy / len * this.size);
    ctx.lineTo(this.parentX - dx / len * this.parentSize, this.parentY - dy / len * this.parentSize);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  courseProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeRef = useRef<number>(0);
  const lastProgressRef = useRef<string>('');
  const mouseRef = useRef({ x: -1000, y: -1000 });
  
  const courseColorMap: Record<string, string> = {
    python1: 'blue',
    python2: 'green',
    math101: 'orange',
    datascience: 'purple',
    webdev: 'pink',
    algorithms: 'cyan',
  };

  const createParticles = useCallback((width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const particles: Particle[] = [];

    const radiusFromProgress = (progress: number) => {
      return progress * 2 + NODE_SIZE;
    }

    const nonEmptyCourses = Object.entries(courseProgress)
      .filter(([_, progress]) => progress > 0);

    nonEmptyCourses.forEach(([courseId, progress], index) => {
      if(progress == 0)
        return;

      const createCourseParticle = () => {
        const colorKey = courseColorMap[courseId];
        const config = courseColorConfigs[colorKey];
        const colorPrefix = config.particles[Math.floor(Math.random() * config.particles.length)];
        const angle = Math.PI * 2 / nonEmptyCourses.length * index;
        const dist = 100;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        const particle = new Particle(x, y, radiusFromProgress(progress), colorPrefix, 0.6, -1);
        particles.push(particle);
        return { particle: particle, index: particles.length-1 };
      }

      const { particle: courseParticle, index: courseParticleIndex } = createCourseParticle();
      
      let layerParticles = 0;
      let layerIndex = 0;
      let distance = courseParticle.size;
      let angle = 0;
      let angleDelta = 0;
      for( let i = 0; i < progress; i++ ) {
        if( layerIndex == layerParticles ) {
          distance += NODES_DISTANCE;
          // layerParticles = nodesPerRadius(distance);
          layerParticles = progress;
          layerIndex = 0;
          angle = Math.random() * Math.PI * 2;
          angleDelta = Math.PI * 2 / layerParticles;
        }
        const colorKey = courseColorMap[courseId];
        const config = courseColorConfigs[colorKey];
        const colorPrefix = config.particles[Math.floor(Math.random() * config.particles.length)];
        const x = courseParticle.x + Math.cos(angle) * distance;
        const y = courseParticle.y + Math.sin(angle) * distance;
        const particle = new Particle(x, y, NODE_SIZE, colorPrefix, 0.3, courseParticleIndex);
        particles.push(particle);

        angle += angleDelta;
        layerIndex++;
      }
    });
    
    return particles;
  }, [courseProgress]);

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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      } else {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

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
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      timeRef.current += 1;
      const width = canvas.width;
      const height = canvas.height;
      
      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      
      // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // const data = imageData.data;

      // for (let i = 0; i < data.length; i += 4) {
      //   data[i+3] = Math.max(0, Math.floor(Math.pow(data[i+3], 0.99)));
      // }

      // ctx.putImageData(imageData, 0, 0);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for( let i = 0; i < particles.length; i++ ) {
        const particle = particles[i];
        let fx = 0;
        let fy = 0;
        const attractionCoefficient = 0.003;
        const targetX = particle.parent == -1 ? centerX : particles[particle.parent].x;
        const targetY = particle.parent == -1 ? centerY : particles[particle.parent].y;
        fx += attractionCoefficient * (targetX - particle.x);
        fy += attractionCoefficient * (targetY - particle.y);
        const padding = NODES_DISTANCE;
        for( let j = 0; j < particles.length; j++ ) {
          if( i == j )
            continue;
          const particle2 = particles[j];
          const dist2 = (particle.x - particle2.x) ** 2 + (particle.y - particle2.y) ** 2;
          const dist = Math.sqrt(dist2);
          let wantedDistance = padding + particle.size + particle2.size;
          wantedDistance = wantedDistance ** 2;
          if( dist2 < wantedDistance ) {
            const force = 5 * (wantedDistance - dist2) / wantedDistance;
            const relativeForce = (force * particle2.size ** 2) / (particle.size ** 2 + particle2.size ** 2);
            fx += (particle.x - particle2.x) / dist * relativeForce;
            fy += (particle.y - particle2.y) / dist * relativeForce;
          }
        }
        particle.velocityX += fx;
        particle.velocityY += fy;
      }
      particles.forEach(particle => {
        const parent = particle.parent == -1 ? null : particles[particle.parent];
        const parentX = parent ? parent.x : 0;
        const parentY = parent ? parent.y : 0;
        const parentSize = parent ? parent.size : 0;
        particle.update(timeRef.current, parentX, parentY, parentSize);
      });
      particles.forEach(particle => particle.drawEdge(ctx));
      particles.forEach(particle => particle.draw(ctx));
      
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
        pointerEvents: 'auto',
      }}
    />
  );
};
