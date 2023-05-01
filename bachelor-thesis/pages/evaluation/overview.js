import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import BasicLayout from "@/layouts/BasicLayout";
import evaluationConfig from "@/configs/evaluation";

const EvaluationOverview = () => {
  const { t } = useTranslation("evaluation");

  return (
    <BasicLayout>
      <div className="flex flex-col font-bold gap-2px my-10px font-titilium text-25px text-theme-blue">
        <h1 className="text-40px">{t("evaluation")}</h1>
        <Link href={`${evaluationConfig.origin}/received-awards/2`}>{t("received_awards")}</Link>
        <Link href={`${evaluationConfig.origin}/1/pending-proposals/3`}>{t("pending_proposals")}</Link>
        <Link href={`${evaluationConfig.origin}/1/evaluated-providers/1`}>{t("evaluated_providers")}</Link>
      </div>
    </BasicLayout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["evaluation"])),
    },
  };
}

export default EvaluationOverview;
