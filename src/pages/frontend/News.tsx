import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewsByStatusNoUser } from '@/services/frontend/newsService';
import { getImageUrl } from '@/utils/ImageUtils';
import { getErrorMessage } from '@/utils/errorUtils';
import NoData from '@/components/frontend/NoData';
import DateFormatter from '@/components/common/DateFormatter';
import { MdChevronRight } from 'react-icons/md';

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { success, data } = await getNewsByStatusNoUser('AVAILABLE');
        if (success) setNewsList(data);
        else setNewsList([]);
      } catch (error) {
        console.error('getNewsByStatusNoUser error:', getErrorMessage(error));
      }
    };

    fetchNews();
  }, []);

  const goToDetail = (newsUid: string) => {
    navigate(`/news/${newsUid}`);
  };

  return (
    <div className="news">
      {newsList.length === 0 ? (
        <NoData />
      ) : (
        <div className="news__list">
          {newsList.map((item) => (
            <div
              key={item.newsUid}
              className="news__card"
              onClick={() => goToDetail(item.newsUid)}
            >
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.title}
                className="news__image"
              />
              <div className="news__info">
                <p className="news__title">{item.title}</p>
                <p
                  className="news__preview"
                  dangerouslySetInnerHTML={{ __html: item.preview }}
                />
                <p className="news__date">
                  <DateFormatter date={item.createdDate} format="YYYY.MM.DD" />
                </p>
              </div>
              <div className="news__arrow">
                <MdChevronRight />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
