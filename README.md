# Lemonfy

The Lemonfy Project inspired by songsterr app (https://www.songsterr.com/)

### Storybook with pnpm

- Install webpack 5 and @babel/core
- To install, run 'pnpm dlx sb@next init --builder webpack5 --package-manager=pnpm'
- Then install loaders with 'pnpm i -D ...': css-loader, postcss-loader, style-loader
- Then install: 'pnpm i -D @storybook/addon-postcss' and add it to .storybook/main.js addons
- Add .storybook/preview-head.html file
- Add global styles import in .storybook/preview.js

### TODOs

- <s>Add Bar removal</s>
- Add pause
- Enable Bar addition in middle of sheet
- Enable Bar edition
- Add mouse support
- Add backend and DB integration
- Add player pages
