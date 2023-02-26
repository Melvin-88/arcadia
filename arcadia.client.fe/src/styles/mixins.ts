export function customScrollbar(size: string, colorThumb: string, colorTrack: string = 'transparent') {
  return ({
    selectors: {
      '::-webkit-scrollbar': {
        width: size,
        height: size,
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: colorTrack,
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: colorThumb,
        borderRadius: '5px',
        selectors: {
          ':active': {
            backgroundColor: `rgba(${colorThumb}, 0.7)`,
          },
        },
      },
    },
  });
}
