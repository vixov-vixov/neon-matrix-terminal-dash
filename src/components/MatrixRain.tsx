
import React, { useEffect, useRef } from 'react';
import { generateRandomString } from '../utils/terminalEffects';

interface MatrixRainProps {
  density?: number;
  speed?: number;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ 
  density = 30, 
  speed = 50 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Calculate columns based on density
    const columnWidth = 20; // Width of each column
    const numberOfColumns = Math.floor(containerWidth / columnWidth) * (density / 100);
    
    const columns: HTMLDivElement[] = [];
    const columnHeights: number[] = [];
    const columnSpeeds: number[] = [];
    
    // Create columns
    for (let i = 0; i < numberOfColumns; i++) {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      column.style.left = `${Math.random() * containerWidth}px`;
      column.style.animationDuration = `${10 + Math.random() * 20}s`;
      column.style.opacity = `${0.3 + Math.random() * 0.5}`;
      column.style.fontSize = `${12 + Math.random() * 6}px`;
      
      // Generate random characters for the column
      column.textContent = generateRandomString(Math.floor(20 + Math.random() * 50));
      
      container.appendChild(column);
      columns.push(column);
      columnHeights.push(0);
      columnSpeeds.push(50 + Math.random() * speed * 2);
    }
    
    // Animation loop
    const updateColumns = () => {
      columns.forEach((column, index) => {
        columnHeights[index] += columnSpeeds[index] * 0.01;
        
        if (columnHeights[index] > containerHeight) {
          columnHeights[index] = -column.clientHeight;
          column.style.left = `${Math.random() * containerWidth}px`;
          column.textContent = generateRandomString(Math.floor(20 + Math.random() * 50));
        }
        
        column.style.transform = `translateY(${columnHeights[index]}px)`;
      });
      
      animationId = requestAnimationFrame(updateColumns);
    };
    
    let animationId = requestAnimationFrame(updateColumns);
    
    // Handle window resize
    const handleResize = () => {
      columns.forEach(column => {
        column.style.left = `${Math.random() * window.innerWidth}px`;
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      columns.forEach(column => column.remove());
    };
  }, [density, speed]);
  
  return <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden" />;
};

export default MatrixRain;
