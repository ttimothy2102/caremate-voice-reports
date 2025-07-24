import React, { useEffect, useState } from 'react';

export function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    const particleCount = 15;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="particle-bg">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
}