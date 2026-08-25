import { Box, styled } from 'decentraland-ui2'

// The shared navbar is `position: fixed`, so this padding is what keeps the page
// out from under it. The values are its own heights, which changed in ui2 3.x:
// 64px below 992px and 92px above it (66px was the 1.x height, and left 26px of
// content sitting behind the bar on desktop).
const LayoutContainer = styled(Box)({
  paddingTop: '64px',
  '@media (min-width: 992px)': {
    paddingTop: '92px',
  },
})

export { LayoutContainer }
