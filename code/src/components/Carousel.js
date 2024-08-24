import React, { useState, useEffect } from 'react';
import './Carousel.css';

const images = [
    require('../assets/images/home/image1.jpg'),
    require('../assets/images/home/image2.jpg'),
    require('../assets/images/home/image3.jpg'),
    require('../assets/images/home/image4.jpg')
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    };

    const goToIndex = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="carousel">
            <button className="prev" onClick={handlePrev}>❮</button>
            <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
            <button className="next" onClick={handleNext}>❯</button>

            <div className="indicators">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={index === currentIndex ? 'active' : ''}
                        onClick={() => goToIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
