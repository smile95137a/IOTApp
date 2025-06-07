import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DateFormatter from '@/components/common/DateFormatter';
import {
  getNewsById,
  getNewsByIdNoUser,
} from '@/services/frontend/newsService';
import { getImageUrl } from '@/utils/ImageUtils';

const NewsDetail: React.FC = () => {
  const { newsUid } = useParams<{ newsUid: string }>();
  const [newsItem, setNewsItem] = useState<any | null>(null);

  const fetchNewsDetail = async (uid: string) => {
    try {
      const { success, data, message } = await getNewsByIdNoUser(uid);
      if (success) {
        setNewsItem(data);
      } else {
        console.error('Error fetching news:', message);
      }
    } catch (error) {
      console.error('Error fetching news detail:', error);
    }
  };

  useEffect(() => {
    if (newsUid) {
      fetchNewsDetail(newsUid);
    }
  }, [newsUid]);

  return (
    <div className="newsDetail">
      {newsItem ? (
        <>
          <div className="newsDetail__title">
            <div className="newsDetail__title-title">
              <p className="newsDetail__text">{newsItem.title}</p>
            </div>
          </div>
          <div className="news__item-img">
            <img src={getImageUrl(newsItem.imageUrl)} />
          </div>
          <p className="newsDetail__text">
            <DateFormatter
              date={newsItem.createdDate}
              format="YYYY/MM/DD HH:mm:ss"
            />
          </p>
          <hr className="m-t-24" />
          <div className="newsDetail__content"></div>
          <div
            className="newsDetail__preview"
            dangerouslySetInnerHTML={{ __html: newsItem.preview }}
          ></div>
          <div
            className="newsDetail__fullContent"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          ></div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NewsDetail;
