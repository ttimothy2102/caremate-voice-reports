
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
    `}</style>
  );
}
