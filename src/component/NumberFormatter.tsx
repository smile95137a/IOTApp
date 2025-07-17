import React from 'react';

interface NumberFormatterProps {
  number: number;
  locale?: string;
  options?: Intl.NumberFormatOptions;
}

const NumberFormatter: React.FC<NumberFormatterProps> = ({
  number,
  locale = 'en-US',
  options = {},
}) => {
  const fractionDigits = options.maximumFractionDigits ?? 0;

  // 無條件進位到指定小數位
  const factor = Math.pow(10, fractionDigits);
  const roundedNumber = Math.ceil(number * factor) / factor;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    ...options,
  });

  return <>{formatter.format(roundedNumber)}</>;
};

export default NumberFormatter;
