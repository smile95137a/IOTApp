import React from 'react';
import logoImg from '@/assets/image/i-Pool_logo_RGB_2.png';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__logo">
            <div className="footer__logo-img">
              <img src={logoImg} />
            </div>
          </div>
        </div>
        <div className="footer__footer">
          <p className="footer__text">@{new Date().getFullYear()} 版權所有</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
