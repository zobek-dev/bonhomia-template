const mix = require('laravel-mix')

mix
  .disableNotifications()
  .js('src/js/main.js', 'assets')
  .postCss('src/css/main.css', 'assets', [require('tailwindcss')])