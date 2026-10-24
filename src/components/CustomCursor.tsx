import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor if on desktop (mouse pointer & width > 900px)
    const checkIsFinePointer = () => {
      const isFine = window.matchMedia('(pointer: fine)').matches;
      const isWideEnough = window.innerWidth > 900;
      setIsVisible(isFine && isWideEnough);
    };

    checkIsFinePointer();
    window.addEventListener('resize', checkIsFinePointer);

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Interactive element hover detection
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.interactive-card') ||
        target.closest('.theme-dot') ||
        target.closest('.hud-btn')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    window.addEventListener('mouseover', handleElementHover);

    // Smooth lerp animation for cursor follower
    let animId: number;
    let currX = -100;
    let currY = -100;

    const followLoop = () => {
      currX += (pos.x - currX) * 0.18;
      currY += (pos.y - currY) * 0.18;
      setTrailPos({ x: currX, y: currY });
      animId = requestAnimationFrame(followLoop);
    };
    animId = requestAnimationFrame(followLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleElementHover);
      window.removeEventListener('resize', checkIsFinePointer);
      cancelAnimationFrame(animId);
    };
  }, [pos.x, pos.y]);

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`custom-cursor-dot ${isClicking ? 'clicking' : ''} ${isHovered ? 'hovered' : ''}`}
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      />
      <div
        className={`custom-cursor-ring ${isClicking ? 'clicking' : ''} ${isHovered ? 'hovered' : ''}`}
        style={{ transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0)` }}
      />
    </>
  );
};
