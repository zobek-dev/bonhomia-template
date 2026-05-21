const remToPx = require('tailwindcss-rem-to-px')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './config/*.json',
    './layout/*.liquid',
    './blocks/*.liquid',
    './assets/*.liquid',
    './assets/*.js',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './templates/*.json',
    './templates/customers/*.liquid',
    './templates/customers/*.json',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '720px',
            p: {
              fontSize: '16px',
              lineHeight: '24px',
              marginTop: '20px',
              marginBottom: '20px',
            },
            '[class~="lead"]': {
              fontSize: '20px',
              lineHeight: '32px',
              marginTop: '24px',
              marginBottom: '24px',
            },
            blockquote: {
              marginTop: '32px',
              marginBottom: '32px',
              paddingLeft: '20px',
            },
            h1: {
              fontSize: '48px',
              lineHeight: '48px',
              marginTop: '0',
              marginBottom: '32px',
            },
            h2: {
              fontSize: '30px',
              lineHeight: '36px',
              marginTop: '48px',
              marginBottom: '24px',
            },
            h3: {
              fontSize: '24px',
              lineHeight: '32px',
              marginTop: '40px',
              marginBottom: '16px',
            },
            h4: {
              fontSize: '20px',
              lineHeight: '28px',
              marginTop: '32px',
              marginBottom: '8px',
            },
            img: {
              marginTop: '32px',
              marginBottom: '32px',
            },
            video: {
              marginTop: '32px',
              marginBottom: '32px',
            },
            figure: {
              marginTop: '32px',
              marginBottom: '32px',
            },
            'figure > *': {
              marginTop: '0',
              marginBottom: '0',
            },
            figcaption: {
              fontSize: '14px',
              lineHeight: '20px',
              marginTop: '12px',
            },
            code: {
              fontSize: '14px',
            },
            'h2 code': {
              fontSize: '26px',
            },
            'h3 code': {
              fontSize: '21px',
            },
            pre: {
              fontSize: '14px',
              lineHeight: '24px',
              marginTop: '24px',
              marginBottom: '24px',
              borderRadius: '6px',
              paddingTop: '12px',
              paddingRight: '16px',
              paddingBottom: '12px',
              paddingLeft: '16px',
            },
            ol: {
              marginTop: '20px',
              marginBottom: '20px',
              paddingLeft: '20px',
            },
            ul: {
              marginTop: '20px',
              marginBottom: '20px',
              paddingLeft: '20px',
            },
            li: {
              marginTop: '8px',
              marginBottom: '8px',
            },
            'ol > li': {
              paddingLeft: '8px',
            },
            'ul > li': {
              paddingLeft: '8px',
            },
            '> ul > li p': {
              marginTop: '12px',
              marginBottom: '12px',
            },
            '> ul > li > *:first-child': {
              marginTop: '20px',
            },
            '> ul > li > *:last-child': {
              marginBottom: '20px',
            },
            '> ol > li > *:first-child': {
              marginTop: '20px',
            },
            '> ol > li > *:last-child': {
              marginBottom: '20px',
            },
            'ul ul, ul ol, ol ul, ol ol': {
              marginTop: '12px',
              marginBottom: '12px',
            },
            hr: {
              marginTop: '48px',
              marginBottom: '48px',
            },
            'hr + *': {
              marginTop: '0',
            },
            'h2 + *': {
              marginTop: '0',
            },
            'h3 + *': {
              marginTop: '0',
            },
            'h4 + *': {
              marginTop: '0',
            },
          },
        },
        sm: {
          css: {
            fontSize: '14px',
            lineHeight: '20px',
            p: {
              marginTop: '16px',
              marginBottom: '16px',
            },
            '[class~="lead"]': {
              fontSize: '18px',
              lineHeight: '28px',
              marginTop: '16px',
              marginBottom: '16px',
            },
            blockquote: {
              marginTop: '20px',
              marginBottom: '20px',
              paddingLeft: '16px',
            },
            h1: {
              fontSize: '36px',
              lineHeight: '40px',
              marginTop: '0',
              marginBottom: '24px',
            },
            h2: {
              fontSize: '24px',
              lineHeight: '32px',
              marginTop: '32px',
              marginBottom: '16px',
            },
            h3: {
              fontSize: '20px',
              lineHeight: '28px',
              marginTop: '24px',
              marginBottom: '12px',
            },
            h4: {
              fontSize: '16px',
              lineHeight: '24px',
              marginTop: '20px',
              marginBottom: '8px',
            },
          },
        },
        lg: {
          css: {
            fontSize: '18px',
            lineHeight: '28px',
            p: {
              marginTop: '24px',
              marginBottom: '24px',
            },
            '[class~="lead"]': {
              fontSize: '22px',
              lineHeight: '32px',
              marginTop: '24px',
              marginBottom: '24px',
            },
            blockquote: {
              marginTop: '40px',
              marginBottom: '40px',
              paddingLeft: '24px',
            },
            h1: {
              fontSize: '56px',
              lineHeight: '56px',
              marginTop: '0',
              marginBottom: '40px',
            },
            h2: {
              fontSize: '36px',
              lineHeight: '40px',
              marginTop: '56px',
              marginBottom: '32px',
            },
            h3: {
              fontSize: '30px',
              lineHeight: '36px',
              marginTop: '48px',
              marginBottom: '20px',
            },
            h4: {
              fontSize: '24px',
              lineHeight: '32px',
              marginTop: '32px',
              marginBottom: '12px',
            },
          },
        },
        xl: {
          css: {
            fontSize: '20px',
            lineHeight: '32px',
            p: {
              marginTop: '24px',
              marginBottom: '24px',
            },
            '[class~="lead"]': {
              fontSize: '24px',
              lineHeight: '36px',
              marginTop: '24px',
              marginBottom: '24px',
            },
            blockquote: {
              marginTop: '48px',
              marginBottom: '48px',
              paddingLeft: '32px',
            },
            h1: {
              fontSize: '64px',
              lineHeight: '64px',
              marginTop: '0',
              marginBottom: '48px',
            },
            h2: {
              fontSize: '48px',
              lineHeight: '52px',
              marginTop: '56px',
              marginBottom: '32px',
            },
            h3: {
              fontSize: '36px',
              lineHeight: '44px',
              marginTop: '48px',
              marginBottom: '24px',
            },
            h4: {
              fontSize: '30px',
              lineHeight: '36px',
              marginTop: '40px',
              marginBottom: '16px',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), remToPx({ baseFontSize: 16 })],
  prefix: 'tw-',
}