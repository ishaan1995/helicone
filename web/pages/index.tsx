import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AuthLayout from "../components/shared/layout/authLayout";
import BasePageV2 from "../components/shared/layout/basePageV2";
import { useOrg } from "../components/shared/layout/organizationContext";
import LoadingAnimation from "../components/shared/loadingAnimation";
import MetaData from "../components/shared/metaData";
import HomePage from "../components/templates/home/homePage";
import { DEMO_EMAIL } from "../lib/constants";
import { SupabaseServerWrapper } from "../lib/wrappers/supabase";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

interface HomeProps {}

const Home = (props: HomeProps) => {
  const {} = props;
  const router = useRouter();

  const user = useUser();

  return <MetaData title="Home">{user ? user.email : "no user"}</MetaData>;
};

export default Home;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  console.log("CONTEXT", context);
  const client = createPagesServerClient(context, {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE",
  });
  console.log(
    "env",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL
  );
  console.log("testing client", await client.auth.getUser());

  const supabase = new SupabaseServerWrapper(context).getClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user", session.user.id)
      .single();
    if (data === null) {
      return {
        redirect: {
          destination: "/welcome",
          permanent: false,
        },
      };
    }
  }
  return {
    props: {},
  };
};
