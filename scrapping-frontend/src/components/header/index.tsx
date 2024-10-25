import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { useGetIdentity, useTranslation } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import { ColorModeContext } from "../../contexts/color-mode";
import { Menu, MenuItem, Typography, Button } from "@mui/material";
import React, { useContext, useState } from "react";
import i18n from "i18next";

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

interface LangMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onMenuClick: (lang: string) => void;
  selectedLang: string;
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);
  const { getLocale, changeLocale, translate } = useTranslation();
  const { data: user } = useGetIdentity<IUser>();
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
    <AppBar position={sticky ? "sticky" : "relative"}>
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          <HamburgerMenu />
          <Button onClick={handleLangButtonClick} variant="contained" children={getLanguageLabel(selectedLang)}></Button>
          <LangMenu open={langMenuOpen} anchorEl={anchorElement} selectedLang={selectedLang} onClose={handleMenuClose} onMenuClick={handleMenuItemClick}></LangMenu>
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
          >
            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
            {(user?.avatar || user?.name) && (
              <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                {user?.name && (
                  <Typography
                    sx={{
                      display: {
                        xs: "none",
                        sm: "inline-block",
                      },
                    }}
                    variant="subtitle2"
                  >
                    {user?.name}
                  </Typography>
                )}
                <Avatar src={user?.avatar} alt={user?.name} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
