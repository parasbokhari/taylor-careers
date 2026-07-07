"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { useSearchParams } from "next/navigation";

const DISABLE_PIXELS_PARAM = "disable_pixels";
const DISABLE_PIXELS_VALUE = "true";
const GTM_ID = "GTM-TG7GLGCX";

export default function PixelLoaders() {
  const searchParams = useSearchParams();
  const shouldDisablePixels =
    searchParams.get(DISABLE_PIXELS_PARAM) === DISABLE_PIXELS_VALUE;

  if (shouldDisablePixels) {
    return null;
  }

  return (
    <>
      <GoogleTagManager gtmId={GTM_ID} />
    </>
  );
}
