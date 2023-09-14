"use client";
import { useEffect } from "react";
import { useGlobalContext } from "./context/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/utilities/translations/useTranslation";

const HomePage = () => {
  const { user } = useGlobalContext();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  return (
    <div>
      <h1>
        {t("welcome")}{" "}
        {user?.name ? `${t("welcomeUser").replace("{user}", user.name)}` : ""}
      </h1>
      <div>
        {user?.name ? (
          <h1>{t("redirecting")}</h1>
        ) : (
          <div>
            <p>{t("workInProgress")}</p>
            <p>{t("clickToRegister")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
