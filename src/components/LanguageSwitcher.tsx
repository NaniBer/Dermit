import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); // switch language in i18next
    localStorage.setItem("appLanguage", lang); // save choice
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button onClick={() => changeLanguage("en")}>🇬🇧 English</button>
      <button onClick={() => changeLanguage("am")}>🇪🇹 አማርኛ</button>
    </div>
  );
};

export default LanguageSwitcher;
