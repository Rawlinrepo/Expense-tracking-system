import React from 'react';
import PropTypes from 'prop-types';
import './CustomProgressBar.css';

const CustomProgressBar = ({ label, percentage, color }) => {
    return (
        <div className="custom-progress-bar">
            <div className="progress-label">
                <span>{label}</span>
                <span>{percentage}%</span>
            </div>
            <div className="progress-container">
                <div
                    className="progress-fill"
                    style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: color,
                    }}
                ></div>
            </div>
        </div>
    );
};

CustomProgressBar.propTypes = {
    label: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    color: PropTypes.string,
};

CustomProgressBar.defaultProps = {
    color: 'blue',
};

export default CustomProgressBar;
