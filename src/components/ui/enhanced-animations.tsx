import React from 'react';

export function EnhancedAnimations() {
  return (
    <style>{`
      /* Floating Navigation Indicator */
      .floating-nav {
        position: fixed;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 50;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 1rem;
        padding: 1rem 0.5rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .nav-dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.3);
        margin: 0.5rem 0;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }

      .nav-dot.active {
        background: #3b82f6;
        transform: scale(1.2);
      }

      .nav-dot::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        transform: translateY(-50%);
        margin-left: 1rem;
        padding: 0.25rem 0.75rem;
        background: rgba(59, 130, 246, 0.9);
        color: white;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .nav-dot:hover::after {
        opacity: 1;
      }

      .nav-dot[data-section="hero"]::after { content: 'Welcome'; }
      .nav-dot[data-section="features"]::after { content: 'Features'; }
      .nav-dot[data-section="dashboard-preview"]::after { content: 'Demo'; }
      .nav-dot[data-section="waitlist-form"]::after { content: 'Waitlist'; }
      .nav-dot[data-section="pricing"]::after { content: 'Pricing'; }

      /* Rewarding Button Interactions */
      .rewarding-button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .rewarding-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 1;
      }

      .rewarding-button:active::before {
        width: 300px;
        height: 300px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .rewarding-button:active {
        transform: scale(0.98);
      }

      .rewarding-button > * {
        position: relative;
        z-index: 2;
      }

      /* Success Celebration */
      .celebration {
        position: relative;
      }

      .celebration::after {
        content: '🎉';
        position: absolute;
        top: -2rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1.5rem;
        opacity: 0;
        animation: celebrate 1s ease-out forwards;
        pointer-events: none;
      }

      @keyframes celebrate {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(0) scale(0);
        }
        50% {
          opacity: 1;
          transform: translateX(-50%) translateY(-1rem) scale(1.2);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(-2rem) scale(1);
        }
      }

      /* Playful Card Animations */
      .playful-card {
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .playful-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }

      .playful-card:hover::before {
        left: 100%;
      }

      .playful-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
      }

      .playful-card:active {
        transform: translateY(-4px) scale(1.01);
        transition: all 0.1s ease;
      }

      /* Staggered Entrance */
      .stagger-child {
        opacity: 0;
        transform: translateY(30px);
        animation: staggerIn 0.6s ease-out forwards;
      }

      .stagger-child:nth-child(1) { animation-delay: 0.1s; }
      .stagger-child:nth-child(2) { animation-delay: 0.2s; }
      .stagger-child:nth-child(3) { animation-delay: 0.3s; }
      .stagger-child:nth-child(4) { animation-delay: 0.4s; }
      .stagger-child:nth-child(5) { animation-delay: 0.5s; }
      .stagger-child:nth-child(6) { animation-delay: 0.6s; }

      @keyframes staggerIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Particle Background */
      .particle-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
      }

      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: float-particle 20s infinite linear;
      }

      .particle:nth-child(odd) {
        background: rgba(147, 51, 234, 0.3);
        animation-duration: 25s;
      }

      @keyframes float-particle {
        0% {
          transform: translateY(100vh) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) rotate(360deg);
          opacity: 0;
        }
      }

      /* Progress Bar */
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        transform-origin: left;
        z-index: 100;
        transition: transform 0.1s ease-out;
      }

      /* Interactive Hover Glow */
      .interactive-glow {
        position: relative;
        transition: all 0.3s ease;
      }

      .interactive-glow::before {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6);
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
        background-size: 200% 200%;
        animation: gradientShift 3s ease infinite;
      }

      .interactive-glow:hover::before {
        opacity: 0.6;
      }

      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      /* Morphing Buttons */
      .morph-button {
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        position: relative;
        overflow: hidden;
      }

      .morph-button:hover {
        border-radius: 2rem;
        padding-left: 2rem;
        padding-right: 2rem;
      }

      /* Loading States */
      .loading-dots::after {
        content: '';
        display: inline-block;
        width: 1em;
        text-align: left;
        animation: loadingDots 1.5s infinite;
      }

      @keyframes loadingDots {
        0%, 20% { content: ''; }
        40% { content: '.'; }
        60% { content: '..'; }
        80%, 100% { content: '...'; }
      }

      /* Bounce on Click */
      .bounce-click:active {
        animation: bounceClick 0.3s ease;
      }

      @keyframes bounceClick {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      /* Pulse Ring */
      .pulse-ring {
        position: relative;
      }

      .pulse-ring::before {
        content: '';
        position: absolute;
        inset: -10px;
        border: 2px solid rgba(59, 130, 246, 0.5);
        border-radius: inherit;
        animation: pulseRing 2s infinite;
        pointer-events: none;
      }

      @keyframes pulseRing {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }

      /* Shake Animation */
      .shake {
        animation: shake 0.5s ease-in-out;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      /* Typewriter Effect */
      .typewriter {
        overflow: hidden;
        border-right: 2px solid #3b82f6;
        white-space: nowrap;
        margin: 0 auto;
        animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
      }

      @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
      }

      @keyframes blink-caret {
        from, to { border-color: transparent; }
        50% { border-color: #3b82f6; }
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .floating-nav {
          display: none;
        }
        
        .particle {
          width: 2px;
          height: 2px;
        }
        
        .playful-card:hover {
          transform: translateY(-4px) scale(1.01);
        }
        
        .nav-dot::after {
          display: none;
        }
      }
    `}</style>
  );
}