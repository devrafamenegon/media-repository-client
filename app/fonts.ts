import localFont from "@next/font/local"

export const glancyr = localFont({
  src: [
    {
      path: '../public/fonts/Glancyr-Regular.otf',
      weight: '400'
    },
  ],
  variable: '--font-glancyr'
});

export const dirtyline = localFont({
  src: [
    {
      path: '../public/fonts/Dirtyline.otf',
      weight: '400'
    },
  ],
  variable: '--font-dirtyline'
});