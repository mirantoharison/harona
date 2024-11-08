import { Menu, MenuItem, Typography, Button, ButtonPropsVariantOverrides } from "@mui/material";
import { useTranslation } from "@refinedev/core";
import { useState } from "react";
import i18n from "i18next";

interface LangMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onMenuClick: (lang: string) => void;
  selectedLang: string;
}

export const LanguageChange = () => {
  const { getLocale, changeLocale, translate } = useTranslation();
  const currentLocale = getLocale();

  const [selectedLang, setSelectedLang] = useState(currentLocale ?? "fr");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  const handleLangButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
    setLangMenuOpen(true);
  };

  const handleMenuItemClick = (lang: string) => {
    changeLocale(lang);
    setSelectedLang(lang);
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setLangMenuOpen(false);
    setAnchorElement(null);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case "en":
        return "English";
      case "de":
        return "German";
      case "fr":
        return "Français";
      case "es":
        return "Español";
      default:
        return lang;
    }
  };

  const LangMenu: React.FC<LangMenuProps> = ({ open, anchorEl, selectedLang, onClose, onMenuClick }) => (
    <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
      {[...(i18n.languages || [])].sort().map((lang: string) => (
        <MenuItem
          key={lang}
          onClick={() => onMenuClick(lang)}
          selected={lang === selectedLang}
        >
          <Typography variant="body2" style={{ marginRight: 8 }}>
            {lang.toUpperCase()}
          </Typography>
          <Typography variant="body2">
            {getLanguageLabel(lang)}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <>
      <Button variant="contained" onClick={handleLangButtonClick} children={getLanguageLabel(selectedLang)}></Button>
      <LangMenu open={langMenuOpen} anchorEl={anchorElement} selectedLang={selectedLang} onClose={handleMenuClose} onMenuClick={handleMenuItemClick}></LangMenu>
    </>
  )
}