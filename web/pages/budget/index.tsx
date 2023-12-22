import AuthLayout from "../../components/shared/layout/authLayout";
import MetaData from "../../components/shared/metaData";
import Header from "./header";
import Main from "./main";

const BudgetManager = (props: any) => {
  const { user } = props;

  return (
    <MetaData title="Budget Manager">
      <AuthLayout user={user}>
        <div className="h-full w-full pt-4">
          <Header />
          <Main />
        </div>
      </AuthLayout>
    </MetaData>
  );
};

export default BudgetManager;
