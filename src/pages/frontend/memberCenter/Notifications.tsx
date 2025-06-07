import React, { useEffect, useState } from 'react';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getErrorMessage } from '@/utils/errorUtils';
import { MdAdd, MdClose } from 'react-icons/md';
import { useDialog } from '@/context/DialogContext';
import DateFormatter from '@/components/common/DateFormatter';
import { getAllNews } from '@/services/frontend/newsService';

const NotificationsScreen: React.FC = () => {
  const { openInfoDialog } = useDialog();
  const { setLoading } = useLoading();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(
    null
  );

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const response = await getAllNews();
        setNotifications(response.data);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        if (error.isAutoLogout) return;
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };

    loadNews();
  }, []);

  const openNotification = (item: any) => {
    setSelectedNotification(item);
  };

  const closeNotification = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="notifications">
      {notifications.map((item) => (
        <div key={item.id} className="notifications__item">
          <div>
            <p className="notifications__date">
              <DateFormatter date={item.createdDate} format="YYYY.MM.DD" />
            </p>
            <p className="notifications__title">{item.title}</p>
          </div>
          <button
            className={`notifications__button ${
              item.isRead === '未讀'
                ? 'notifications__button--unread'
                : 'notifications__button--read'
            }`}
            onClick={() => openNotification(item)}
          >
            <MdAdd className="notifications__button-icon" />
            {item.isRead === '未讀' ? '閱讀' : '已讀'}
          </button>
        </div>
      ))}

      {selectedNotification && (
        <div className="notifications__modal">
          <div className="notifications__modal-container">
            <h3 className="notifications__modal-title">
              <DateFormatter
                date={selectedNotification.createdDate}
                format="YYYY.MM.DD"
              />{' '}
              {selectedNotification.title}
            </h3>
            <div className="notifications__modal-content">
              <p>{selectedNotification.content}</p>
            </div>
            <button
              className="notifications__modal-close"
              onClick={closeNotification}
            >
              <MdClose size={16} />
              <span>關閉</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;
