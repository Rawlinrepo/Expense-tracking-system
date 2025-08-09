import React, { useEffect } from 'react';
import './Particles.css';

const Particles = () => {
    useEffect(() => {
        const particleCount = 500;
        const container = document.querySelector('.particles-container');

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 5 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${Math.random() * window.innerWidth}px`;
            particle.style.top = `${Math.random() * window.innerHeight}px`;

            particle.style.animationDelay = `${Math.random() * 10}s`;

            container.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 10000000);
        }
    }, []);

    return <div className="particles-container"></div>;
};

export default Particles;
