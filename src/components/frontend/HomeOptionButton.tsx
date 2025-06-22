import React from 'react';
import { MdChevronRight } from 'react-icons/md';

interface OptionButtonProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
}

const HomeOptionButton: React.FC<OptionButtonProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <div className="home-option">
      <div className="home-option__content">
        <button className="home-option__button" onClick={onClick}>
          <div className="home-option__left">
            <div className="home-option__icon">{icon}</div>
            <span className="home-option__title">{title}</span>
          </div>
          <MdChevronRight size={48} className="home-option__arrow" />
        </button>
      </div>
      <div className="home-option__description-wrapper">
        {description && (
          <p className="home-option__description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default HomeOptionButton;
