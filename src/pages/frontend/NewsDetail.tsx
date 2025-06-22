import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DateFormatter from '@/components/common/DateFormatter';
import { getNewsByIdNoUser } from '@/services/frontend/newsService';
import { getImageUrl } from '@/utils/ImageUtils';
import { MdShare } from 'react-icons/md';

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

  if (!newsItem) return <p className="news-detail__loading">Loading...</p>;

  return (
    <div className="news-detail">
      <div className="news-detail__header">
        <div>
          <h1 className="news-detail__title">{newsItem.title}</h1>
          <p className="news-detail__date">
            <DateFormatter date={newsItem.createdDate} format="YYYY.MM.DD" />
          </p>
        </div>
      </div>

      <div className="news-detail__card">
        <img
          className="news-detail__image"
          src={getImageUrl(newsItem.imageUrl)}
          alt={newsItem.title}
        />
        {newsItem.preview && (
          <div
            className="news-detail__preview"
            dangerouslySetInnerHTML={{ __html: newsItem.preview }}
          />
        )}
        {newsItem.content && (
          <div
            className="news-detail__content"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
