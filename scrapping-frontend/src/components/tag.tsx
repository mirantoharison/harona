import React from "react";
import { CheckCircle, Cancel, HelpOutline } from "@mui/icons-material";
import { Box, SxProps, Theme, Typography } from "@mui/material";

interface TagProps {
  icon: React.ReactNode | React.ReactNode[];
  text: React.ReactNode | string;
  className?: string;
  value?: string | null;
  index?: number;
  style?: SxProps<Theme>
  isActive?: boolean;
  handleClick?: Function;
}

export const Tag: React.FC<TagProps> = ({ className, value, icon, text, style, isActive = false, handleClick = () => { }, index = 0 }) => {
  const isTextValidJSX = React.isValidElement(text);
  const isTextString = typeof text === "string" || typeof text === "number";

  return (
    <Box className={`${className ?? ''} ${isActive ? 'tag-active' : ''}`}
      sx={{
        display: "flex", alignItems: "center",
        padding: "1px",
        paddingRight: "10px",
        borderRadius: "4px",
        border: "1px solid #bbbbbb",
        ...style
      }}
      onClick={() => handleClick(index, value ?? "")}
    >
      {Array.isArray(icon) ? icon : React.isValidElement(icon) ? icon : null}
      {
        isTextValidJSX ? text : isTextString ? (
          <Typography variant="body2">{text}</Typography>
        ) : null
      }
    </Box >
  );
};