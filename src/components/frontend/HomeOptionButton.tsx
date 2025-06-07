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
      <button className="home-option__button" onClick={onClick}>
        <div className="home-option__icon">{icon}</div>
        <div className="home-option__content">
          <span className="home-option__title">{title}</span>
          <MdChevronRight size={24} className="home-option__arrow" />
        </div>
      </button>
      {description && <p className="home-option__description">{description}</p>}
    </div>
  );
};

export default HomeOptionButton;
