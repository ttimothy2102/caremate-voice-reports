import React, { useEffect, useState } from 'react';

interface FloatingNavigationProps {
  sections: { id: string; label: string }[];
}

export function FloatingNavigation({ sections }: FloatingNavigationProps) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="floating-nav hidden lg:block">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`nav-dot ${activeSection === section.id ? 'active' : ''}`}
          data-section={section.id}
          onClick={() => scrollToSection(section.id)}
          title={section.label}
        />
      ))}
    </div>
  );
}