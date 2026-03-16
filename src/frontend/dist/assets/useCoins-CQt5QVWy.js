import { g as useActor, C as useQuery } from "./index-ZhaeuKrs.js";
function useCoins() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myCoins"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMyCoins();
    },
    enabled: !!actor && !isFetching
  });
}
export {
  useCoins as u
};
