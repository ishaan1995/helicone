import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import { useState } from "react";
import Notification from "../components/shared/notification/Notification";
import { NotificationProvider } from "../components/shared/notification/NotificationContext";
import "../styles/globals.css";
import "../styles/index.css";

import posthog from "posthog-js";
import { OrgContextProvider } from "../components/shared/layout/organizationContext";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_API_KEY &&
  process.env.NEXT_PUBLIC_ENDPOINT &&
  !process.env.NEXT_PUBLIC_DISABLE_POSTHOG
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, {
    api_host: "https://www.helicone.ai/ingest",
  });
}

export default function MyApp({
  Component,
  router,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const queryClient = new QueryClient();
  const apolloClient = new ApolloClient({
    uri: `/api/graphql`,
    cache: new InMemoryCache(),
    credentials: "include",
    headers: {
      "use-cookies": "true",
    },
  });

  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  if (typeof window !== "undefined") {
    document.documentElement.classList.add("dark");
  }

  return (
    <>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
              <OrgContextProvider>
                <Component {...pageProps} />
              </OrgContextProvider>
              <Notification />
            </NotificationProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </SessionContextProvider>
      <Analytics />
    </>
  );
}
