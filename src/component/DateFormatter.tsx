import React from 'react';
import moment from 'moment';

interface DateFormatterProps {
  date: string | Date | null;
  format?: string;
}

const DateFormatter: React.FC<DateFormatterProps> = ({
  date,
  format = 'YYYY-MM-DD HH:mm',
}) => {
  let formattedDate = 'Invalid Date';

  if (date) {
    const parsed = moment(
      date,
      [moment.ISO_8601, 'YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss'],
      true
    );

    if (parsed.isValid()) {
      formattedDate = parsed.format(format);
    }
  }

  return <>{formattedDate}</>;
};

export default DateFormatter;
