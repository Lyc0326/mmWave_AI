// src/components/Footer.js
import React from 'react';
import './Footer.css';
import icon1 from '../assets/images/footer/phone-call.png';
import icon2 from '../assets/images/footer/user.png';
import icon3 from '../assets/images/footer/instagram.png';
import icon4 from '../assets/images/footer/facebook.png';
import icon5 from '../assets/images/footer/youtube.png';

const Footer = () => {
    return (
        <footer>
            <div className="footer-top">
                <a href="#" className="footer-icon">
                    <img src={icon1} alt="聯絡我們" />
                    <span>聯絡我們</span>
                </a>
                <a href="#" className="footer-icon">
                    <img src={icon2} alt="志工" />
                    <span>志工</span>
                </a>
                <a href="#" className="footer-icon">
                    <img src={icon3} alt="Instagram" />
                    <span>Instagram</span>
                </a>
                <a href="#" className="footer-icon">
                    <img src={icon4} alt="Facebook" />
                    <span>Facebook</span>
                </a>
                <a href="#" className="footer-icon">
                    <img src={icon5} alt="Youtube" />
                    <span>Youtube</span>
                </a>
            </div>
            <div className="footer-bottom">
                <input type="email" placeholder="請輸入Email" className="newsletter-input" />
                <button type="submit" className="newsletter-btn">訂閱電子報</button>
            </div>
            <div className="footer-info">
                <div className="footer-links">
                    <a href="#">徵才</a>
                    <a href="#">常見問題</a>
                    <a href="#">無障礙網站</a>
                    <a href="#">隱私權政策</a>
                </div>
                <div className="footer-contact">
                    互動式展覽系統 © 2024<br />
                    666我沒市好委區通往天國的道路 +886 0000-000-000
                </div>
            </div>
        </footer>
    );
};

export default Footer;
