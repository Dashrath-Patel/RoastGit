"use client";
import React, { useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  className,
  children,
  intensity = 0.8,
  speed = 1.2,
  interactive = true,
}: {
  className?: string;
  children?: React.ReactNode;
  intensity?: number;
  speed?: number;
  interactive?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const ripplesRef = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    opacity: number;
    speed: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create automatic ripples
    const createAutoRipple = () => {
      if (ripplesRef.current.length < 5) {
        ripplesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 0,
          maxRadius: 100 + Math.random() * 100,
          opacity: 0.3 + Math.random() * 0.4,
          speed: speed * (0.8 + Math.random() * 0.4),
        });
      }
    };

    // Create ripples periodically
    const autoRippleInterval = setInterval(createAutoRipple, 2000 + Math.random() * 3000);

    // Handle mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Add ripple on mouse move (throttled)
      if (Math.random() < 0.02) {
        ripplesRef.current.push({
          x,
          y,
          radius: 0,
          maxRadius: 50 + Math.random() * 50,
          opacity: 0.2 + Math.random() * 0.3,
          speed: speed * (1 + Math.random() * 0.5),
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!interactive) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 120 + Math.random() * 80,
        opacity: 0.6 + Math.random() * 0.3,
        speed: speed * (1.2 + Math.random() * 0.8),
      });
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += ripple.speed;
        ripple.opacity *= 0.995;

        if (ripple.radius < ripple.maxRadius && ripple.opacity > 0.01) {
          // Create gradient for ripple
          const gradient = ctx.createRadialGradient(
            ripple.x, ripple.y, Math.max(0, ripple.radius - 20),
            ripple.x, ripple.y, ripple.radius
          );
          
          gradient.addColorStop(0, `rgba(168, 85, 247, ${ripple.opacity * intensity})`);
          gradient.addColorStop(0.4, `rgba(236, 72, 153, ${ripple.opacity * intensity * 0.7})`);
          gradient.addColorStop(0.8, `rgba(239, 68, 68, ${ripple.opacity * intensity * 0.4})`);
          gradient.addColorStop(1, `rgba(249, 115, 22, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Inner glow
          if (ripple.radius > 10) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * intensity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius - 5, 0, Math.PI * 2);
            ctx.stroke();
          }

          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(autoRippleInterval);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, speed, interactive]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
