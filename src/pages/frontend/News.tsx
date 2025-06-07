import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DateFormatter from '@/components/common/DateFormatter';
import NoData from '@/components/frontend/NoData';
import { getNewsByStatusNoUser } from '@/services/frontend/newsService';
import CircleIcon from '@/components/frontend/CircleIcon';
import { getErrorMessage } from '@/utils/errorUtils';
import { getImageUrl } from '@/utils/ImageUtils';
import { MdCampaign } from 'react-icons/md';

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchNewsList = async () => {
    try {
      const { success, data } = await getNewsByStatusNoUser('AVAILABLE');
      if (success) {
        setNewsList(data);
      } else {
        setNewsList([]);
      }
    } catch (error) {
      console.error('Error fetching news list:', getErrorMessage(error));
    }
  };

  const goToDetail = (newsUid: string) => {
    navigate(`/news/${newsUid}`);
  };

  useEffect(() => {
    fetchNewsList();
  }, []);

  return (
    <div className="news">
      <div className="news__header">
        <div className="news__header-title">
          <div className="news__icon">
            <CircleIcon icon={MdCampaign} />
          </div>
          <p className="news__text">最新消息</p>
        </div>
      </div>

      {newsList.length === 0 ? (
        <NoData />
      ) : (
        <div className="news__list">
          {newsList.map((item) => (
            <div
              className="news__item"
              key={item.newsUid}
              onClick={() => goToDetail(item.newsUid)}
            >
              <div className="news__item-img">
                <img src={getImageUrl(item.imageUrl)} />
              </div>
              <div className="news__item-content">
                <p className="news__text news__text--title">{item.title}</p>
                <p className="news__text">
                  <DateFormatter
                    date={item.createdDate}
                    format="YYYY/MM/DD HH:mm:ss"
                  />
                </p>
                <p
                  className="news__text news__text--preview"
                  dangerouslySetInnerHTML={{ __html: item.preview }}
                ></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
