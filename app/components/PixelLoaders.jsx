"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import HubSpotConsentLoader from "@/app/components/HubSpotConsentLoader";
import OliviaChatLoader from "@/app/components/OliviaChatLoader";

const DISABLE_PIXELS_PARAM = "disable_pixels";
const DISABLE_PIXELS_VALUE = "true";
const GTM_ID = "GTM-TG7GLGCX";

export default function PixelLoaders() {
  const searchParams = useSearchParams();
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);
  const shouldDisablePixels =
    searchParams.get(DISABLE_PIXELS_PARAM) === DISABLE_PIXELS_VALUE;
  const handleAnalyticsConsentChange = useCallback((isAllowed) => {
    setHasAnalyticsConsent(isAllowed);
  }, []);

  if (shouldDisablePixels) {
    return null;
  }

  return (
    <>
      <HubSpotConsentLoader
        onAnalyticsConsentChange={handleAnalyticsConsentChange}
      />
      {hasAnalyticsConsent ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      <OliviaChatLoader />
    </>
  );
}
