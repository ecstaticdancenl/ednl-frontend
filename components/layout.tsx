import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import WordpressLogo from "@/components/wordpressLogo";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;

export default function Layout({ children }: { children: any }) {
  const [show_admin_bar, setShowAdminBar] = useState(0);
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const { wp } = Object.fromEntries(urlSearchParams.entries());

    if (wp) {
      console.log("load adminbar");
      setShowAdminBar(parseInt(wp));
    }
  }, []);
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
      </Script>
      {show_admin_bar === 1 && (
        <div
          onClick={() => {
            history.back();
          }}
          className={
            "bg-gray-900 fixed top-0 z-[99] w-full text-xs py-1 px-2.5 cursor-pointer hover:bg-gray-800 hover:text-blue-300 text-white flex items-center gap-2 group"
          }
        >
          <WordpressLogo
            className={"w-5 h-5 text-gray-400 group-hover:text-blue-300"}
          />
          <span>Preview modus. Klik hier om terug te gaan naar Wordpress.</span>
        </div>
      )}
      <div
        className={
          "md:pt-24 pt-16 flex flex-col text-white min-h-screen relative max-w-wrapper"
        }
      >
        {children}
      </div>
    </>
  );
}
