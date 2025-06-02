
import React from 'react';

export function LiquidGradientStyles() {
  return (
    <style>{`
      .liquid-gradient-button {
        background: linear-gradient(135deg, #2D2CAB 0%, #29B6F6 50%, #2D2CAB 100%);
        background-size: 200% 200%;
        animation: liquidGradient 3s ease-in-out infinite;
      }
      
      .liquid-gradient-button:hover {
        animation: liquidGradientHover 0.8s ease-in-out infinite;
        transform: translateY(-2px);
      }
      
      .liquid-gradient-button-inverse {
        background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #ffffff 100%);
        background-size: 200% 200%;
        animation: liquidGradient 3s ease-in-out infinite;
      }
      
      .liquid-gradient-button-inverse:hover {
        animation: liquidGradientHover 0.8s ease-in-out infinite;
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3);
      }
      
      @keyframes liquidGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes liquidGradientHover {
        0% { background-position: 0% 50%; }
        25% { background-position: 100% 0%; }
        50% { background-position: 100% 100%; }
        75% { background-position: 0% 100%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  );
}
