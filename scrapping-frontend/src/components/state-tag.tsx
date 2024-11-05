import React from "react";
import { CheckCircle, Cancel, HelpOutline, AccessAlarm, HourglassBottom } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "@refinedev/core";

const _stateIcons: { [key: string]: React.ReactNode } = {
  completed: <CheckCircle sx={{ color: '#7b1fa2', marginRight: .3, scale: .8 }} />,
  failed: <Cancel sx={{ color: '#D90000', marginRight: .3, scale: .8 }} />,
  wait: <AccessAlarm sx={{ color: '#F1C912', marginRight: .3, scale: .8 }} />,
  unknown: <HelpOutline sx={{ color: '#303030', marginRight: .3, scale: .8 }} />,
  active: <HourglassBottom sx={{ color: '#03A8E9', marginRight: .3, scale: .8 }}></HourglassBottom>
};
export const StateCell: React.FC<{ row: { state: string } }> = ({ row }) => {
  const { translate } = useTranslation();

  const _stateTexts: { [key: string]: string } = {
    completed: translate("pages.jobs.list.taskCard.state.completed"),
    failed: translate("pages.jobs.list.taskCard.state.failed"),
    wait: translate("pages.jobs.list.taskCard.state.wait"),
    unknown: translate("pages.jobs.list.taskCard.state.unknown"),
    active: translate("pages.jobs.list.taskCard.state.active")
  };

  const icon = _stateIcons[row.state] || _stateIcons['unknown'];
  const text = _stateTexts[row.state] || _stateTexts['unknown'];

  return (
    <Box
      className={`task ${row.state}`}
      sx={{
        display: 'flex', alignItems: 'center',
        padding: "1px",
        paddingRight: "10px",
        borderRadius: "4px",
        border: "1px solid #959595",
        width: "fit-content"
      }}>
      {icon}
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
};