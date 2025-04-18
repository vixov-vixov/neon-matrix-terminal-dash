
import React, { useEffect, useRef, useState } from 'react';

const EarthGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Update canvas size
    const updateSize = () => {
      const containerSize = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.3);
      setSize({
        width: containerSize,
        height: containerSize
      });
    };
    
    // Draw earth
    const drawEarth = (rotation: number) => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2.5;
      
      // Draw globe outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#001830';
      ctx.fill();
      
      // Add a subtle glow
      const gradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.8,
        centerX, centerY, radius * 1.2
      );
      gradient.addColorStop(0, 'rgba(0, 128, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 128, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw longitude lines
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + rotation;
        
        ctx.beginPath();
        ctx.ellipse(
          centerX, centerY,
          radius, radius * Math.abs(Math.cos(angle)),
          0, 0, Math.PI * 2
        );
        ctx.stroke();
      }
      
      // Draw latitude lines
      for (let i = 1; i < 5; i++) {
        const latRadius = (radius * i) / 5;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, latRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw simulated continents (simplified)
      ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
      
      // North America
      drawContinent(ctx, centerX, centerY, radius, rotation, [
        { lat: 0.7, lng: -2.0, size: 0.25 },
        { lat: 0.6, lng: -1.8, size: 0.3 },
        { lat: 0.4, lng: -1.9, size: 0.2 },
      ]);
      
      // South America
      drawContinent(ctx, centerX, centerY, radius, rotation, [
        { lat: 0.0, lng: -1.2, size: 0.15 },
        { lat: -0.2, lng: -1.1, size: 0.2 },
        { lat: -0.4, lng: -1.2, size: 0.15 },
      ]);
      
      // Europe & Africa
      drawContinent(ctx, centerX, centerY, radius, rotation, [
        { lat: 0.5, lng: -0.2, size: 0.15 },
        { lat: 0.2, lng: 0.0, size: 0.2 },
        { lat: -0.2, lng: 0.1, size: 0.3 },
      ]);
      
      // Asia & Australia
      drawContinent(ctx, centerX, centerY, radius, rotation, [
        { lat: 0.5, lng: 1.0, size: 0.4 },
        { lat: 0.3, lng: 1.2, size: 0.3 },
        { lat: -0.3, lng: 1.5, size: 0.2 },
      ]);
      
      // Draw some network lines connecting points
      drawNetwork(ctx, centerX, centerY, radius, rotation);
    };
    
    // Draw continent blobs
    const drawContinent = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number,
      rotation: number,
      points: Array<{ lat: number, lng: number, size: number }>
    ) => {
      points.forEach(point => {
        const lng = point.lng + rotation;
        const x = centerX + radius * Math.cos(point.lat * Math.PI) * Math.sin(lng);
        const y = centerY + radius * Math.sin(point.lat * Math.PI);
        const size = point.size * radius;
        
        if (Math.cos(lng) > -0.2) { // Only show if on visible side of globe
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };
    
    // Draw network connection lines
    const drawNetwork = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number,
      rotation: number
    ) => {
      const points = [
        { lat: 0.7, lng: -2.0 },
        { lat: -0.2, lng: -1.1 },
        { lat: 0.5, lng: -0.2 },
        { lat: -0.3, lng: 1.5 },
        { lat: 0.5, lng: 1.0 },
      ];
      
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const lng1 = points[i].lng + rotation;
          const lng2 = points[j].lng + rotation;
          
          const x1 = centerX + radius * Math.cos(points[i].lat * Math.PI) * Math.sin(lng1);
          const y1 = centerY + radius * Math.sin(points[i].lat * Math.PI);
          
          const x2 = centerX + radius * Math.cos(points[j].lat * Math.PI) * Math.sin(lng2);
          const y2 = centerY + radius * Math.sin(points[j].lat * Math.PI);
          
          // Only draw if both points are on the visible side
          if (Math.cos(lng1) > -0.2 && Math.cos(lng2) > -0.2) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Add pulsing dots along the lines
            const pulseTime = Date.now() / 1000;
            const pulse = (Math.sin(pulseTime * 2) + 1) / 2;
            
            const midX = x1 + (x2 - x1) * pulse;
            const midY = y1 + (y2 - y1) * pulse;
            
            ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
            ctx.beginPath();
            ctx.arc(midX, midY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };
    
    // Animation loop
    let rotation = 0;
    const animate = () => {
      rotation += 0.01;
      drawEarth(rotation);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    // Start animation
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateSize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size.width} 
      height={size.height}
      className="animate-rotate opacity-80 mx-auto"
    />
  );
};

export default EarthGlobe;
