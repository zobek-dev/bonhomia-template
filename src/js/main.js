import Alpine from 'alpinejs'
import Swiper from 'swiper'
import {
  Navigation as SwiperNavigation,
  Pagination,
  Thumbs,
  FreeMode,
  Autoplay,
} from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import 'swiper/css/autoplay'

window.SwiperNavigation = SwiperNavigation
window.Pagination = Pagination
window.Thumbs = Thumbs
window.FreeMode = FreeMode
window.Autoplay = Autoplay
window.Swiper = Swiper

window.Alpine = Alpine

Alpine.start()