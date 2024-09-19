import React from "react";
import { CheckCircle, Cancel, HelpOutline } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

interface TagProps {
    icon: React.ReactNode | React.ReactNode[];
    text: React.ReactNode | string;
}

export const Tag: React.FC<TagProps> = ({ icon, text }) => {
    const isTextValidJSX = React.isValidElement(text);
    const isTextString = typeof text === "string" || typeof text === "number";

    return (
        <Box sx={{
            display: "flex", alignItems: "center",
            padding: "1px",
            paddingRight: "10px",
            borderRadius: "20px",
            border: "1px solid #959595",
        }}>
            {Array.isArray(icon) ? icon : React.isValidElement(icon) ? icon : null}
            {
                isTextValidJSX ? text : isTextString ? (
                    <Typography variant="body1">{text}</Typography>
                ) : null
            }
        </Box >
    );
};