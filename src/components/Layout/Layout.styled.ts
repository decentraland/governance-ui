import { Box, styled } from 'decentraland-ui2'

const LayoutContainer = styled(Box)<{ isNavbar2Enabled: boolean }>((props) => {
  const { isNavbar2Enabled } = props
  if (isNavbar2Enabled) {
    return {
      paddingTop: '66px',
    }
  }
  return {}
})

export { LayoutContainer }
