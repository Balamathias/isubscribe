import { getRatings } from "@/lib/supabase/ratings";
import { useQuery } from "@tanstack/react-query";

export const useReviews = (limit?: number) => useQuery({
  queryKey: ['get_ratings', limit],
  queryFn: async () => getRatings(limit)
})
