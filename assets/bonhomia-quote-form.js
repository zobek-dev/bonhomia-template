/*
 * Bonhomia — assisted purchase quote form (Alpine.js component)
 *
 * Mounted by snippets/bonhomia-quote-modal.liquid. The modal listens to the
 * global `bonhomia:open-quote` CustomEvent (detail: { product, productId, handle })
 * dispatched by the "Solicitar cotización" buttons in the quote panel.
 *
 * Submission target: window.__BONHOMIA_ASSISTED_API__ (theme setting).
 * If empty, falls back to a local-only success screen (dev mode).
 *
 * CRITICAL: this flow MUST NOT post to /cart/add or to Shopify checkout —
 * it is a separate lead-capture flow handled by the bonhomia backend.
 */
;(function () {
  function defaultFormData() {
    return {
      name: '',
      email: '',
      phone: '',
      city: '',
      length: '',
      width: '',
      height: '',
      unit: 'cm',
      material: '',
      finish: '',
      deadline: '',
      targetDate: '',
      message: '',
      contactPreference: 'email',
    }
  }

  function generateRequestId() {
    const year = new Date().getFullYear()
    const rand = Math.floor(1000 + Math.random() * 9000)
    return '#BON-' + year + '-' + rand
  }

  // Wire up any "Solicitar cotización" trigger (data-bh-open-quote) to the
  // global event the modal listens on. Delegated to support markup re-renders.
  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-bh-open-quote]')
    if (!trigger) return
    event.preventDefault()
    window.dispatchEvent(
      new CustomEvent('bonhomia:open-quote', {
        detail: {
          product: trigger.getAttribute('data-product-title') || '',
          productId: trigger.getAttribute('data-product-id') || '',
          handle: trigger.getAttribute('data-product-handle') || '',
        },
      })
    )
  })

  window.bonhomiaQuoteForm = function bonhomiaQuoteForm() {
    return {
      open: false,
      step: 1,
      loading: false,
      success: false,
      error: '',
      requestId: '',
      productTitle: '',
      productId: '',
      productHandle: '',
      formData: defaultFormData(),

      handleOpen(detail) {
        const d = detail || {}
        this.productTitle = d.product || d.productTitle || ''
        this.productId = d.productId || ''
        this.productHandle = d.handle || ''
        this.reset(false)
        this.open = true
        document.documentElement.style.overflow = 'hidden'
      },

      close() {
        this.open = false
        document.documentElement.style.overflow = ''
      },

      reset(closeModal) {
        this.step = 1
        this.loading = false
        this.success = false
        this.error = ''
        this.requestId = ''
        this.formData = defaultFormData()
        if (closeModal) this.close()
      },

      next() {
        this.error = ''
        if (this.step === 1) {
          if (!this.formData.name.trim() || !this.formData.email.trim()) {
            this.error = 'Completá nombre y email para continuar.'
            return
          }
        }
        if (this.step < 3) this.step += 1
      },

      prev() {
        if (this.step > 1) this.step -= 1
      },

      async submit() {
        this.error = ''
        if (this.loading) return
        this.loading = true

        const payload = {
          product: {
            id: this.productId,
            handle: this.productHandle,
            title: this.productTitle,
          },
          customer: {
            name: this.formData.name,
            email: this.formData.email,
            phone: this.formData.phone,
            city: this.formData.city,
          },
          customization: {
            dimensions: {
              length: this.formData.length,
              width: this.formData.width,
              height: this.formData.height,
              unit: this.formData.unit,
            },
            material: this.formData.material,
            finish: this.formData.finish,
            deadline: this.formData.deadline,
            targetDate: this.formData.targetDate,
          },
          message: this.formData.message,
          contactPreference: this.formData.contactPreference,
          source: {
            url: window.location.href,
            shop: window.shopUrl || '',
          },
        }

        const apiUrl = window.__BONHOMIA_ASSISTED_API__
        try {
          if (!apiUrl) {
            // Dev fallback — no API configured.
            await new Promise((r) => setTimeout(r, 600))
            this.requestId = generateRequestId()
            this.success = true
          } else {
            const res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
            if (!res.ok) {
              throw new Error('HTTP ' + res.status)
            }
            const data = await res.json().catch(() => ({}))
            this.requestId = data.requestId || data.id || generateRequestId()
            this.success = true
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[bonhomia-quote-form] submit failed:', e)
          this.error =
            'No pudimos enviar tu solicitud. Probá nuevamente o escribinos por WhatsApp.'
        } finally {
          this.loading = false
        }
      },
    }
  }
})()
