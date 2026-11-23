import { useTranslations } from "next-intl";

import styles from "./app-header.module.css";

export function AppHeader() {
  const t = useTranslations("appHeader");

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{t("title")}</h1>
    </header>
  );
}
