import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getAllBanners } from '@/services/frontend/bannerService';
import { getImageUrl } from '@/utils/ImageUtils';
import HomeOptionButton from '@/components/frontend/HomeOptionButton';
import { MdAccessTime, MdStorefront } from 'react-icons/md';

const Main = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<any[]>([]);
  const { setLoading } = useLoading();

  const loadMainData = async () => {
    try {
      setLoading(true);
      const bannerData = await getAllBanners();
      setLoading(false);

      if (bannerData.success) {
        setBanners(bannerData.data.filter((x) => x.imageUrl));
      } else {
        console.error('獲取橫幅資料失敗:', bannerData.message);
      }
    } catch (err) {
      setLoading(false);
      console.error('Error loading main data:', err);
    }
  };

  useEffect(() => {
    loadMainData();
  }, []);

  const goToProductDetail = (banner: any) => {
    if (banner?.productId) {
      navigate(`/product/${banner.productId}`);
    }
  };

  return (
    <div className="home">
      {banners.length > 0 && (
        <div className="home__slider">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            navigation
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            className="home__swiper"
            breakpoints={{
              820: { slidesPerView: 3 },
            }}
          >
            {banners.map((banner, index) => (
              <SwiperSlide
                key={index}
                onClick={() => goToProductDetail(banner)}
              >
                <div className="home__slide">
                  {banner.imageUrl && (
                    <img
                      src={getImageUrl(banner.imageUrl)}
                      className="home__slide-image"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="home__options">
        <div className="home-option-button">
          <HomeOptionButton
            icon={<MdStorefront size={36} color="black" />}
            title="門市探索"
            description="查看附近的營業門市"
            onClick={() => navigate('/store')}
          />
        </div>
        <div className="home-option-button">
          <HomeOptionButton
            icon={<MdAccessTime size={36} color="black" />}
            title="預約開台"
            description="選擇門市預約開台"
            onClick={() => navigate('/book-store')}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
