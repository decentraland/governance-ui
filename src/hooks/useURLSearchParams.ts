import { useParams } from 'react-router-dom'

export default function useURLSearchParams() {
  const params = useParams()

  return params
}
