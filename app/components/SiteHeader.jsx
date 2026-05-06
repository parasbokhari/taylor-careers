import { getTaylorHeader } from "@/app/lib/taylorHeader";
import SiteHeaderClient from "@/app/components/SiteHeaderClient";

export default async function SiteHeader() {
  const header = await getTaylorHeader();

  return (
    <>
      {header.styles ? (
        <style dangerouslySetInnerHTML={{ __html: header.styles }} />
      ) : null}
      <div
        className="u__sticky-header"
        data-taylor-header-source={header.isFallback ? "fallback" : "hubspot"}
        dangerouslySetInnerHTML={{ __html: header.html }}
      />
      <SiteHeaderClient />
    </>
  );
}
