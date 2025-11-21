import { useRef, useEffect } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initMatrix();
    };
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const fontSize = 16;
    let columns: number;
    
    let drops: Array<{
      y: number;
      speed: number;
      brightness: number;
      char: string;
      trailLength: number;
    }> = [];
    
    const initMatrix = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      
      for (let i = 0; i < columns; i++) {
        drops.push({
          y: Math.random() * canvas.height / fontSize * -50,
          speed: 1 + Math.random() * 3,
          brightness: 0.3 + Math.random() * 0.7,
          char: chars[Math.floor(Math.random() * chars.length)],
          trailLength: 5 + Math.random() * 15
        });
      }
    };
    
    const drawChar = (char: string, x: number, y: number, brightness: number, isTrail: boolean = false) => {
      const alpha = isTrail ? brightness * 0.1 : brightness;
      
      ctx.shadowColor = `rgba(0, 255, 0, ${alpha})`;
      ctx.shadowBlur = isTrail ? 2 : 8;
      ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.fillText(char, x, y);
      
      ctx.shadowBlur = 0;
    };
    
    let animationFrameId: number;
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * fontSize;
        
        if (Math.random() > 0.97) {
          drop.char = chars[Math.floor(Math.random() * chars.length)];
        }
        
        for (let trail = 0; trail < drop.trailLength; trail++) {
          const trailY = drop.y - trail;
          if (trailY > 0 && trailY < canvas.height) {
            const trailBrightness = drop.brightness * (1 - trail / drop.trailLength);
            drawChar(drop.char, x, trailY * fontSize, trailBrightness, true);
          }
        }
        
        if (drop.y > 0 && drop.y < canvas.height) {
          if (Math.random() > 0.995) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 12;
            ctx.font = `${fontSize}px "Courier New", monospace`;
            ctx.fillText(drop.char, x, drop.y * fontSize);
            ctx.shadowBlur = 0;
          } else {
            drawChar(drop.char, x, drop.y * fontSize, drop.brightness, false);
          }
        }
        
        drop.y += drop.speed;
        
        if (drop.y * fontSize > canvas.height && Math.random() > 0.98) {
          drop.y = 0;
          drop.speed = 1 + Math.random() * 3;
          drop.brightness = 0.3 + Math.random() * 0.7;
          drop.char = chars[Math.floor(Math.random() * chars.length)];
          drop.trailLength = 5 + Math.random() * 15;
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    resizeCanvas();
    draw();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
