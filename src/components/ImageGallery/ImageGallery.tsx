import { useState } from 'react'

import classNames from 'classnames'
import { useMobileMediaQuery, useTabletAndBelowMediaQuery } from 'decentraland-ui/dist/components/Media/Media'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import NO_IMAGE from '../../images/no-image.png'

import './ImageGallery.css'
import ImageGalleryFullscreen from './ImageGalleryFullscreen'

interface Props {
  className?: string
  imageUrls: string[]
}

function ImageGallery({ className, imageUrls }: Props) {
  const isNarrowScreen = useTabletAndBelowMediaQuery()
  const isMobile = useMobileMediaQuery()
  const [openFullscreen, setOpenFullscreen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const imageClickHandler = (index: number) => {
    setSelectedImage(index)
    setOpenFullscreen(true)
  }

  return (
    <>
      {imageUrls.length > 0 && (
        <>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={isNarrowScreen ? 3 : 4}
            spaceBetween={10}
            pagination={{ clickable: true }}
            navigation={!isMobile}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className={classNames('ImageGallery__Carousel', className)}
          >
            {imageUrls.map((imageUrl, index) => (
              <SwiperSlide key={index} onClick={() => imageClickHandler(index)}>
                <img src={imageUrl} onError={(e) => (e.currentTarget.src = NO_IMAGE)} />
              </SwiperSlide>
            ))}
          </Swiper>
          <ImageGalleryFullscreen
            className={classNames('ImageGallery__Carousel--fullscreen', className)}
            open={openFullscreen}
            imageUrls={imageUrls}
            onClose={() => setOpenFullscreen(false)}
            startIndex={selectedImage}
            navigation={!isMobile}
          />
        </>
      )}
    </>
  )
}

export default ImageGallery
