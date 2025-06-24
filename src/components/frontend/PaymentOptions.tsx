import React from 'react';
import { MdChevronRight } from 'react-icons/md'; // 加入這行

export interface PaymentOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  rightText?: string;
  onClick: () => void;
}

interface PaymentOptionsProps {
  options: PaymentOption[];
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ options }) => {
  return (
    <div className="payment-options">
      {options.map((opt) => (
        <div
          key={opt.id}
          className="payment-options__item"
          onClick={opt.onClick}
        >
          <div className="payment-options__left">
            <div className="payment-options__icon">{opt.icon}</div>
            <div className="payment-options__title">{opt.title}</div>
          </div>
          <div className="payment-options__right">
            {opt.rightText && (
              <span className="payment-options__right-text">
                {opt.rightText}
              </span>
            )}
            <MdChevronRight className="payment-options__chevron" size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentOptions;
