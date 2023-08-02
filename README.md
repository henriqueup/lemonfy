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
  - <s>Finish library page</s>
    - <s>Enable loading existing song in Editor</s>
      - <s>Clear song when exiting Editor</s>
        - <s>Confirmation if Song is dirty</s>
    - <s>Fix tests</s>
    - <s>Add new song button</s>
    - <s>Move global menu to root</s>
      - <s>Create topbar menu</s>
      - <s>Change to use shadcn/ui</s>
      - <s>Move side menus to topbar</s>
    - <s>Change to table</s>
      - <s>Implement pagination</s>
      - <s>Implement sorting</s>
      - <s>Implement filters</s>
      - <s>Implement song removal</s>
        - <s>Use row selection</s>
        - <s>Fix selection jumping to next song after deletion</s>
  - Create server tests
    - Fix existing tests and mocking
- <s>Fix float issue</s>
  - <s>Maybe something like: Number((0.009033203125).toFixed(8))</s>
- <s>Add player pages</s>
- Add loading and toasters
  - <s>Add global loading component</s>
    - <s>Wrapper?</s>
      - <s>Used absolute div on \_app</s>
  - Add error handling
    - <s>Add error boundary</s>
      - Make it pretty...
    - <s>Use tRPC, see: https://github.com/trpc/trpc/discussions/2036#discussioncomment-4488650</s>
  - <s>Add success toast</s>
- <s>Enable Song edition</s>
- <s>Add Immer</s>
  - <s>Fix nesting</s>
  - <s>Fix tests</s>
  - <s>Add undo/redo</s>
    - <s>Use patches: https://immerjs.github.io/immer/patches/</s>
    - <s>Fix tests</s>
    - <s>Add tests</s>
- Change Sheet to Instruments
  - <s>Fields</s>
    - <s>name</s>
    - <s>type</s>
    - <s>trackCount</s>
    - <s>tuning</s>
    - <s>isFretted</s>
    - <s>sheet</s>
  - <s>Add classes in layers</s>
  - <s>Adjust Song classes</s>
  - Add Instrument management page
    - <s>Add creation dialog</s>
      - <s>Integrate creation with backend</s>
      - <s>Fix tuning scroll and popover position</s>
    - <s>Add data table</s>
    - <s>Add update and delete</s>
      - <s>Fix Tuning table</s>
  - Add Instrument to song creation in Editor
  - Make note adding take the instrument into account
- <s>Add modal component</s>
- Add Bar copy/paste
- Add mouse support
  - Drag playback cursor
- Add automatic save
- Add component animations
- Add multiple Instrument support
- Add metronome
- Migrate to App Router
  - Remove tRPC?
