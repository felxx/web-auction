import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingSpinner = ({ message = 'Loading...', size = 'normal' }) => {
  const spinnerSize = size === 'large' ? '50px' : size === 'small' ? '20px' : '30px';

  return (
    <div className={`loading-spinner-container loading-spinner-${size}`}>
      <div className="loading-spinner-content">
        <ProgressSpinner 
          style={{ width: spinnerSize, height: spinnerSize }} 
          strokeWidth="4" 
          fill="transparent" 
          animationDuration="1s"
        />
        <span className="loading-spinner-message">{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
