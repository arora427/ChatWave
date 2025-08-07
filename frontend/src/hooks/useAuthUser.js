import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api.js'

const useAuthUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  })

  return { isLoading, authUser: data?.user }
}

export default useAuthUser
