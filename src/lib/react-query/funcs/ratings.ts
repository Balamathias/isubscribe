import { getRatings } from "@/lib/supabase/ratings";
import { useQuery } from "@tanstack/react-query";

export const useReviews = () => useQuery({
  queryKey: ['get_ratings'],
  queryFn: async () => getRatings()
})
