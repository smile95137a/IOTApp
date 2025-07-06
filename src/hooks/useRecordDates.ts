import axios from 'axios';
import { Buffer } from 'buffer';

const AUTH_HEADER = {
  Authorization: 'Basic ' + Buffer.from('admin:123456').toString('base64'),
};

export const getRecordDates = async (
  cameraHost: string,
  channelId: number,
  startDate: string,
  endDate: string
): Promise<string[]> => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <config version="1.0" xmlns="http://www.ipc.com/ver10">
      <search>
        <startDate type="string"><![CDATA[${startDate}]]></startDate>
        <endDate type="string"><![CDATA[${endDate}]]></endDate>
      </search>
    </config>`;

  const response = await axios.post(
    `${cameraHost}/SearchRecordDate/${channelId}`,
    xml,
    {
      headers: {
        ...AUTH_HEADER,
        'Content-Type': 'application/xml; charset=UTF-8',
      },
    }
  );

  const text = response.data;
  const matchDates = text.match(/<recordDate>(.*?)<\/recordDate>/g);
  return matchDates?.map((d) => d.replace(/<\/?recordDate>/g, '')) ?? [];
};
