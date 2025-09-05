import React, { useMemo } from "react";
import { motion } from "framer-motion";

export const BoxesCore = ({
  className,
  ...rest
}) => {
  const rows = useMemo(() => new Array(120).fill(1), []);
  const cols = useMemo(() => new Array(80).fill(1), []);
  const colors = useMemo(() => [
    "#06b6d4", // cyan-500
    "#0891b2", // cyan-600
    "#0e7490", // cyan-700
    "#155e75", // cyan-800
    "#164e63", // cyan-900
  ], []);
  
  const getRandomColor = useMemo(() => () => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colors]);

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
        position: 'absolute',
        top: '-60%',
        left: '-60%',
        zIndex: 0,
        display: 'flex',
        height: '250vh',
        width: '250vw',
        padding: '0'
      }}
      className={className}
      {...rest}>
      {rows.map((_, i) => (
        <motion.div 
          key={`row` + i} 
          style={{
            position: 'relative',
            height: '32px',
            width: '64px',
            borderLeft: '1px solid #374151'
          }}
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `${getRandomColor()}`,
                transition: { duration: 0.1 },
              }}
              key={`col` + j}
              style={{
                position: 'relative',
                height: '32px',
                width: '64px',
                borderTop: '1px solid #374151',
                borderRight: '1px solid #374151'
              }}
            >
              {j % 3 === 0 && i % 3 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  style={{
                    position: 'absolute',
                    left: '-22px',
                    top: '-14px',
                    height: '24px',
                    width: '40px',
                    strokeWidth: '1px',
                    color: '#374151'
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(({ className, ...rest }) => {
  return (
    <div 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
      className={className} 
      {...rest}
    >
      <BoxesCore />
    </div>
  );
});