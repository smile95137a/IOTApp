// components/frontend/BannerSwiper.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getImageUrl } from '@/utils/ImageUtils';
import { useNavigate } from 'react-router-dom';

interface BannerSwiperProps {
  banners: any[];
}

const BannerSwiper: React.FC<BannerSwiperProps> = ({ banners }) => {
  const navigate = useNavigate();

  const goToNewsDetail = (banner: any) => {
    if (banner?.news?.newsUid) {
      navigate(`/news/${banner.news.newsUid}`, {
        state: { news: banner.news },
      });
    }
  };

  return (
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
          <SwiperSlide key={index} onClick={() => goToNewsDetail(banner)}>
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
  );
};

export default BannerSwiper;
