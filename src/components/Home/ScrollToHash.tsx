import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash
    if (hash) {
      const targetElement = document.querySelector(hash)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  return null
}

export default ScrollToHash
