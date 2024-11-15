import { Box, Typography, Card, CardContent, SxProps, Theme } from "@mui/material";
import { DeleteButton, EditButton, ShowButton } from "@refinedev/mui";
import { List as ListIcon, Public, Search, SearchOff, ArrowDropDown, ImportExport } from "@mui/icons-material";
import { StateCell } from "..";
import { useTranslation } from "@refinedev/core";

import { TaskCardProps } from "../../interfaces/jobs";

export const TaskCard: React.FC<TaskCardProps> = ({ recordId, task, style, canEdit = false, canDelete = false }) => {
  const { translate } = useTranslation();

  return (
    <Card sx={{
      ...style,
      height: "100%",
      "&:hover .hoverable-button-container": { display: "flex" },
    }}>
      <CardContent>
        <Box sx={{ display: "flex", placeContent: "space-between", mb: "15px", alignItems: "center", height: "40px" }}>
          <Typography variant="h6" sx={{ overflow: "hidden", textOverflow: "ellipsis" }} className="task-title">{task.data.name ?? task.name}</Typography>
          <Box sx={{ display: "flex", columnGap: "5px", alignItems: "center" }}>
            <Box sx={{ display: "none" }} className="hoverable-button-container">
              <ShowButton hideText recordItemId={recordId} />
              {canEdit ? (<EditButton hideText recordItemId={recordId} />) : null}
              {canDelete ? (<DeleteButton hideText recordItemId={recordId} resource={"jobs"} />) : null}
            </Box>
            <Typography sx={{ padding: "0 5px", pr: 0 }}>#{task.id}</Typography>
          </Box>
        </Box>
        <Box sx={{ wordWrap: "break-word", wordBreak: "break-all", display: "flex", alignItems: "center", columnGap: "5px", pb: "10px", mb: "10px", borderBottom: "1px solid #f5f5f5" }}>
          <Public className="link" sx={{ scale: .6 }} />
          <a href={task.data.url ?? "#"} target="_blank" className="link">{task.data.url ?? "Lien vers l'avis"}</a>
        </Box>
        <StateCell row={task} />
        <Box sx={{ mt: "10px" }}>
          <Typography variant="body2">{translate("pages.jobs.list.taskCard.startedAt", { value: task.processedOn })}</Typography>
          <Typography variant="body2">{translate("pages.jobs.list.taskCard.finishedAt", { value: task.finishedOn })}</Typography>
          <Typography variant="body2">{translate("pages.jobs.list.taskCard.reviewsTotal", { value: task.totalReviews })}</Typography>
          <Typography variant="body2">{translate("pages.jobs.list.taskCard.reviewsScraped", { value: task.countReviewsScrapped })}</Typography>
        </Box>
      </CardContent>
    </Card >
  );
}