import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterText = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  className = "",
  onComplete 
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!isStarted) {
      const timer = setTimeout(() => {
        setIsStarted(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, delay, isStarted, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {isStarted && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default TypewriterText;
