import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login } from '../lib/api';

const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      // ✅ Use the instance, not the class
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Login failed", {
        style: {
          fontSize: '1rem',
          minWidth: 'auto',
          borderRadius: '8px',
          maxWidth: '250px',
        },
      });
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;



