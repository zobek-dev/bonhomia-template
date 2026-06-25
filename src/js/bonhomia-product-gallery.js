import Swiper from 'swiper'
import { Thumbs, FreeMode, Navigation } from 'swiper/modules'

const GALLERY_SELECTOR = 'bonhomia-media-gallery'

function destroySwipers(gallery) {
  if (gallery.mainSwiper) {
    gallery.mainSwiper.destroy(true, true)
    gallery.mainSwiper = null
  }
  if (gallery.thumbsSwiper) {
    gallery.thumbsSwiper.destroy(true, true)
    gallery.thumbsSwiper = null
  }
}

function syncThumbAriaCurrent(gallery, activeIndex) {
  const thumbButtons = gallery.querySelectorAll('.bh-gallery-thumbs__btn')
  thumbButtons.forEach((btn, index) => {
    if (index === activeIndex) {
      btn.setAttribute('aria-current', 'true')
    } else {
      btn.removeAttribute('aria-current')
    }
  })
}

function initGallery(gallery) {
  const mainEl = gallery.querySelector('[data-bh-gallery-main]')
  const thumbsEl = gallery.querySelector('[data-bh-gallery-thumbs]')

  if (!mainEl) return

  destroySwipers(gallery)

  let thumbsSwiper = null
  if (thumbsEl && thumbsEl.querySelector('.swiper-slide')) {
    thumbsSwiper = new Swiper(thumbsEl, {
      modules: [FreeMode, Navigation],
      spaceBetween: 8,
      slidesPerView: 'auto',
      freeMode: {
        enabled: true,
        momentumRatio: 0.35,
      },
      watchSlidesProgress: true,
      slideToClickedSlide: true,
      navigation: {
        prevEl: gallery.querySelector('[data-bh-thumbs-prev]'),
        nextEl: gallery.querySelector('[data-bh-thumbs-next]'),
      },
    })
    gallery.thumbsSwiper = thumbsSwiper
  }

  gallery.mainSwiper = new Swiper(mainEl, {
    modules: [Thumbs],
    spaceBetween: 0,
    slidesPerView: 1,
    watchOverflow: true,
    thumbs: thumbsSwiper
      ? {
          swiper: thumbsSwiper,
        }
      : undefined,
  })

  const syncFromMain = () => {
    if (!gallery.mainSwiper) return
    syncThumbAriaCurrent(gallery, gallery.mainSwiper.activeIndex)
  }

  gallery.mainSwiper.on('slideChange', syncFromMain)
  syncFromMain()
}

if (!customElements.get(GALLERY_SELECTOR)) {
  customElements.define(
    GALLERY_SELECTOR,
    class BonhomiaMediaGallery extends HTMLElement {
      connectedCallback() {
        this.elements = {
          liveRegion: this.querySelector('[id^="GalleryStatus"]'),
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => initGallery(this), { once: true })
        } else {
          requestAnimationFrame(() => initGallery(this))
        }
      }

      disconnectedCallback() {
        destroySwipers(this)
      }

      setActiveMedia(mediaId, prepend) {
        const mainWrapper = this.querySelector('[data-bh-gallery-main] .swiper-wrapper')
        if (!mainWrapper) return

        let slide =
          mainWrapper.querySelector(`[data-media-id="${mediaId}"]`) ||
          mainWrapper.querySelector('[data-media-id]')

        if (!slide) return

        if (prepend) {
          if (mainWrapper.firstElementChild !== slide) {
            mainWrapper.prepend(slide)
          }

          const thumbWrapper = this.querySelector('[data-bh-gallery-thumbs] .swiper-wrapper')
          const thumb = thumbWrapper?.querySelector(`[data-target="${mediaId}"]`)
          if (thumb && thumbWrapper.firstElementChild !== thumb) {
            thumbWrapper.prepend(thumb)
          }

          initGallery(this)
          slide =
            mainWrapper.querySelector(`[data-media-id="${mediaId}"]`) ||
            mainWrapper.querySelector('[data-media-id]')
        }

        if (this.mainSwiper && slide) {
          const index = [...mainWrapper.children].indexOf(slide)
          if (index >= 0) {
            this.mainSwiper.slideTo(index, 0)
            syncThumbAriaCurrent(this, index)
          }
        }

        if (slide) this.announceActiveSlide(slide)
      }

      announceActiveSlide(slide) {
        const liveRegion = this.elements?.liveRegion
        if (!liveRegion) return

        const image = slide.querySelector('img')
        if (!image) return

        const position = slide.dataset.mediaPosition || '1'
        const announce = () => {
          if (!window.accessibilityStrings?.imageAvailable) return
          liveRegion.setAttribute('aria-hidden', 'false')
          liveRegion.innerHTML = window.accessibilityStrings.imageAvailable.replace('[index]', position)
          window.setTimeout(() => {
            liveRegion.setAttribute('aria-hidden', 'true')
          }, 2000)
        }

        if (image.complete) announce()
        else image.addEventListener('load', announce, { once: true })
      }
    }
  )
}

document.addEventListener('shopify:section:load', (event) => {
  event.target.querySelectorAll(GALLERY_SELECTOR).forEach((gallery) => initGallery(gallery))
})
