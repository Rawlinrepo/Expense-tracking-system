import React from 'react';

const LineProgressBar = ({ label, percentage, lineColor }) => {
  return (
    <div style={styles.container}>
      <div style={styles.labelContainer}>
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div style={styles.progressBarContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${percentage}%`,
            backgroundColor: lineColor,
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    marginBottom: '1rem',
  },
  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  progressBarContainer: {
    height: '24px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    transition: 'width 1s ease-in-out',
  },
};

export default LineProgressBar;
