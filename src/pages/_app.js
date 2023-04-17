import "@/styles/globals.css";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import RentModal from "../../components/modals/RentModal";
import ReviewModal from "../../components/modals/ReviewModal";

const progress = new ProgressBar({
  size: 7,
  color: "#3F9337",
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <RentModal />
      <ReviewModal />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
