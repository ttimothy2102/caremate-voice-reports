
import React from 'react';

export function LiquidGradientStyles() {
  return (
    <style>{`
      .liquid-gradient-button {
        background: linear-gradient(135deg, #2D2CAB 0%, #29B6F6 50%, #2D2CAB 100%);
        background-size: 200% 200%;
        position: relative;
      }
      
      .liquid-gradient-button-inverse {
        background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #ffffff 100%);
        background-size: 200% 200%;
        position: relative;
      }
      
      .cursor-tracking-button,
      .cursor-tracking-button-inverse {
        background: linear-gradient(135deg, #2D2CAB 0%, #29B6F6 50%, #2D2CAB 100%);
        position: relative;
        overflow: hidden;
      }
      
      .cursor-tracking-button-inverse {
        background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #ffffff 100%);
      }
      
      .cursor-tracking-button::before,
      .cursor-tracking-button-inverse::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;
        pointer-events: none;
        z-index: 1;
      }
      
      .cursor-tracking-button:hover::before,
      .cursor-tracking-button-inverse:hover::before {
        width: 200px;
        height: 200px;
      }
      
      .cursor-tracking-button > *,
      .cursor-tracking-button-inverse > * {
        position: relative;
        z-index: 2;
      }

      /* Glass Morphism Effects */
      .glass-card {
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      .glass-card:hover {
        background: rgba(255, 255, 255, 0.35);
        transform: translateY(-4px);
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.4);
      }

      .glass-card-dark {
        background: rgba(45, 44, 171, 0.15);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(45, 44, 171, 0.3);
        box-shadow: 0 8px 32px rgba(45, 44, 171, 0.1);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      .glass-card-dark:hover {
        background: rgba(45, 44, 171, 0.25);
        transform: translateY(-4px);
        box-shadow: 0 16px 64px rgba(45, 44, 171, 0.2);
        border: 1px solid rgba(45, 44, 171, 0.4);
      }

      .glass-header {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
      }

      .glass-button {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      .glass-button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      .glass-input {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease;
      }

      .glass-input:focus {
        background: rgba(255, 255, 255, 0.25);
        border: 1px solid rgba(45, 44, 171, 0.4);
        box-shadow: 0 0 0 3px rgba(45, 44, 171, 0.1);
      }

      .floating-element {
        animation: float 6s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .liquid-gradient-bg {
        background: linear-gradient(135deg, 
          rgba(45, 44, 171, 0.1) 0%, 
          rgba(41, 182, 246, 0.1) 25%,
          rgba(255, 255, 255, 0.05) 50%,
          rgba(41, 182, 246, 0.1) 75%,
          rgba(45, 44, 171, 0.1) 100%);
        background-size: 400% 400%;
        animation: liquidGradient 15s ease infinite;
      }

      @keyframes liquidGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
      }

      /* Interactive Glow Effects */
      .glow-on-hover {
        position: relative;
        overflow: hidden;
      }

      .glow-on-hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
      }

      .glow-on-hover:hover::before {
        left: 100%;
      }
    `}</style>
  );
}
