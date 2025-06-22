import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllStores } from '@/services/frontend/storeService';
import { AppDispatch } from '@/store';
import { getImageUrl } from '@/utils/ImageUtils';
import { MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '@/context/DialogContext';
import { useLoading } from '@/context/frontend/LoadingContext';

const StoreScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [stores, setStores] = useState<any[]>([]);
  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const { success, data, message } = await fetchAllStores();
      setLoading(false);
      if (success) {
        const withCount = data.map((store: any) => {
          const available = store.poolTables?.filter((t: any) => !t.isUse);
          return { ...store, availablesCount: available.length };
        });
        setStores(withCount);
      } else {
        console.log('載入失敗', message);
      }
    } catch (err: any) {
      setLoading(false);
    }
  };
  const navigateToStore = (uid: string) => {
    navigate(`/storeDetail/${uid}`);
  };
  return (
    <div className="store">
      <div className="store__list">
        {stores.map((store) => (
          <div
            className="store__item"
            key={store.id}
            onClick={() => navigateToStore(store.uid)}
          >
            <div className="store__img-wrap">
              <img
                src={getImageUrl(store.imgUrl)}
                className="store__img"
                alt={store.name}
              />
            </div>
            <div className="store__info">
              <p className="store__name">{store.name}</p>
              <p className="store__address">{store.address}</p>
            </div>
            <div
              className={`store__status ${
                store.availablesCount === 0
                  ? 'store__status--gray'
                  : 'store__status--yellow'
              }`}
            >
              <p className="store__status-text">剩餘桌數</p>
              <p className="store__status-count">{store.availablesCount}</p>
              <div className="store__status-view">
                <span>查看</span>
                <MdChevronRight size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreScreen;
