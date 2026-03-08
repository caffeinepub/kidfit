import { useEffect, useRef } from "react";
import { useCanSeeAd, useRecordAdView } from "../hooks/useQueries";
import { useUserProfile } from "../hooks/useQueries";

export default function AdBanner() {
  const { data: profile } = useUserProfile();
  const { data: canSeeAd } = useCanSeeAd();
  const { mutate: recordAdView } = useRecordAdView();
  const hasRecordedRef = useRef(false);

  const now = BigInt(Date.now()) * BigInt(1_000_000);
  const isAdFree = profile?.adFreeUntil ? profile.adFreeUntil > now : false;

  useEffect(() => {
    if (canSeeAd && !hasRecordedRef.current && !isAdFree) {
      hasRecordedRef.current = true;
      recordAdView();
    }
  }, [canSeeAd, isAdFree, recordAdView]);

  if (isAdFree || !canSeeAd) return null;

  return (
    <div
      data-ocid="ad.banner"
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center"
      style={{ height: "60px" }}
    >
      <div
        className="w-full max-w-[728px] mx-auto overflow-hidden relative"
        style={{ height: "60px" }}
      >
        <img
          src="/assets/generated/ad-placeholder.dim_728x90.jpg"
          alt="Advertisement"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/80 text-xs font-body bg-black/40 px-2 py-0.5 rounded">
            Advertisement
          </span>
        </div>
      </div>
    </div>
  );
}
