import React, { useState, useEffect, useRef } from "react";

interface RollingDigitProps {
  char: string;
  startDelay: number;
}

function RollingDigit({ char, startDelay }: RollingDigitProps) {
  const isDigit = /[0-9]/.test(char);
  const [digit, setDigit] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isDigit || !ref.current) return;

    let observer: IntersectionObserver;
    const element = ref.current;

    const startAnimation = () => {
      const timer = setTimeout(() => {
        setDigit(parseInt(char, 10));
      }, startDelay);
      return timer;
    };

    if ('IntersectionObserver' in window) {
      let timerId: any;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              timerId = startAnimation();
              observer.unobserve(element);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(element);

      return () => {
        if (observer && element) {
          observer.unobserve(element);
        }
        clearTimeout(timerId);
      };
    } else {
      const timerId = startAnimation();
      return () => clearTimeout(timerId);
    }
  }, [char, isDigit, startDelay]);

  if (!isDigit) {
    return <span className="inline-block">{char === " " ? "\u00A0" : char}</span>;
  }

  return (
    <span ref={ref} className="inline-block overflow-hidden h-[1.1em] relative align-baseline" style={{ width: "0.62em" }}>
      <span
        className="absolute left-0 top-0 flex flex-col w-full"
        style={{ 
          transform: `translateY(-${digit * 10}%)`,
          transition: "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
          <span key={num} className="h-[1.1em] block text-center leading-[1.1em]">
            {num}
          </span>
        ))}
      </span>
      <span className="invisible select-none leading-[1.1em]">0</span>
    </span>
  );
}

export function RollingCounter({ value }: { value: string }) {
  const chars = value.split("");
  return (
    <span className="inline-flex items-baseline select-none">
      {chars.map((char, idx) => (
        <RollingDigit key={idx} char={char} startDelay={idx * 70 + 150} />
      ))}
    </span>
  );
}
