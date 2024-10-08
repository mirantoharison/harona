import React from "react";
import { CheckCircle, Cancel, HelpOutline } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const _stateIcons: { [key: string]: React.ReactNode } = {
  completed: <CheckCircle sx={{ color: '#049400', marginRight: .3, scale: .8 }} />,
  failed: <Cancel sx={{ color: '#D90000', marginRight: .3, scale: .8 }} />,
  unknown: <HelpOutline sx={{ color: 'white', marginRight: .3, scale: .8 }} />,
};
const _stateTexts: { [key: string]: string } = {
  completed: 'Términé',
  failed: 'Echoué',
  unknown: 'Inconnu',
};
export const StateCell: React.FC<{ row: { state: string } }> = ({ row }) => {
  const icon = _stateIcons[row.state] || _stateIcons['unknown'];
  const text = _stateTexts[row.state] || _stateTexts['unknown'];

  return (
    <Box
      className={`task ${row.state}`}
      sx={{
        display: 'flex', alignItems: 'center',
        padding: "1px",
        paddingRight: "10px",
        borderRadius: "20px",
        border: "1px solid #959595",
      }}>
      {icon}
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
};