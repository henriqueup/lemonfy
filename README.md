# Lemonfy

The Lemonfy Project, create and playback songs with a sheet-like interface.
Inspired by the [Songsterr app](https://www.songsterr.com/).

This project was created with the main goal of practicing software engineering on my own terms.
Besides that, it is also a chance to experience different stacks, frameworks, languages etc.
And finally, it can also be used as a showcase of my skills.

## Dev notes

### Storybook with pnpm

- Install webpack 5 and @babel/core
- To install, run 'pnpm dlx sb@next init --builder webpack5 --package-manager=pnpm'
- Then install loaders with 'pnpm i -D ...': css-loader, postcss-loader, style-loader
- Then install: 'pnpm i -D @storybook/addon-postcss' and add it to .storybook/main.js addons
- Add .storybook/preview-head.html file
- Add global styles import in .storybook/preview.js

### TODOs

- <s>Add Bar removal</s>
- <s>Enable Bar addition in middle of sheet</s>
- <s>Add pause</s>
- <s>Fix tests</s>
- <s>Refactor sheet.playSong()</s>
- <s>Fix move cursor when its inside note</s>
- <s>Add stop and rewind</s>
- <s>Add dark/light mode</s>
- <s>Understand zod</s>
- <s>Use form with zod</s>
  - <s>Complete other forms</s>
  - <s>Only error when dirty</s>
- <s>Add Song entity</s>
  - <s>Adjust tests</s>
  - <s>Fix store bug</s>
    - <s>Adjust tests</s>
- Add backend and DB integration
  - <s>Create basic architecture</s>
    - <s>Should domains be used? So far, yes</s>
  - <s>Create prisma models</s>
  - <s>Create trpc routers</s>
    - <s>Song create</s>
    - <s>Song get</s>
    - <s>Song update</s>
  - <s>Add trpc usage in frontend</s>
    - <s>Song create</s>
    - <s>Song get</s>
    - <s>Song update</s>
  - Finish library page
    - <s>Enable loading existing song in Editor</s>
      - <s>Clear song when exiting Editor</s>
        - <s>Confirmation if Song is dirty</s>
    - <s>Fix tests</s>
    - <s>Add new song button</s>
    - <s>Move global menu to root</s>
      - <s>Create topbar menu</s>
      - <s>Change to use shadcn/ui</s>
      - <s>Move side menus to topbar</s>
    - Change to table
      - <s>Implement pagination</s>
      - <s>Implement sorting</s>
      - <s>Implement filters</s>
      - Implement song removal
        - Use row selection
  - Create server tests
    - Fix existing tests and mocking
- <s>Fix float issue</s>
  - <s>Maybe something like: Number((0.009033203125).toFixed(8))</s>
- Add player pages
- Add loading and toasters
- Add modal component
- Enable Bar edition
- Add Bar copy/paste
- Add mouse support
  - Drag playback cursor
- Add automatic save
- Add component animations
- Add multiple Sheet support
- Add metronome
- Migrate to App Router
  - Remove tRPC?
