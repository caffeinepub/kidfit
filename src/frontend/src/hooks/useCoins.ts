import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useCoins() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["myCoins"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return (
        actor as unknown as { getMyCoins(): Promise<bigint> }
      ).getMyCoins();
    },
    enabled: !!actor && !isFetching,
  });
}
