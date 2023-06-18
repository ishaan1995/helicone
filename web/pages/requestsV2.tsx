import { User } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import AuthLayout from "../components/shared/layout/authLayout";
import MetaData from "../components/shared/metaData";
import RequestsPageV2 from "../components/templates/requestsV2/requestsPageV2";
import { SupabaseServerWrapper } from "../lib/wrappers/supabase";

interface RequestsV2Props {
  user: User;
  currentPage: number;
  pageSize: number;
}

const RequestsV2 = (props: RequestsV2Props) => {
  const { user, currentPage, pageSize } = props;

  return (
    <MetaData title={"Requests"}>
      <AuthLayout user={user}>
        <RequestsPageV2 currentPage={currentPage} pageSize={pageSize} />
      </AuthLayout>
    </MetaData>
  );
};

export default RequestsV2;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = new SupabaseServerWrapper(context).getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const { page, page_size, sort } = context.query;

  const currentPage = parseInt(page as string, 10) || 1;
  const pageSize = parseInt(page_size as string, 10) || 10;

  return {
    props: {
      user: user,
      currentPage,
      pageSize,
    },
  };
};
