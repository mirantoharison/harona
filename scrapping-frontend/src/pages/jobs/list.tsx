import React, { useState, useEffect } from "react";
import { DeleteButton, EditButton, List, ShowButton, RefreshButton } from "@refinedev/mui";
import { DataGrid, type GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { List as ListIcon, Refresh, Public, Search } from "@mui/icons-material";
import { CircularProgress, Box, Typography, Button, Grid, Select, MenuItem, Pagination, Card, CardContent, CardActionArea, SxProps, Theme, TextField, InputAdornment, SelectChangeEvent } from "@mui/material";
import { useList, useTranslation } from "@refinedev/core";
import { StateCell } from "../../components";

interface TaskProps {
  id: number;
  name: string;
  state: string;
  processedOn: string;
  finishedOn: string;
  data: {
    url: string
  };
  totalReviews: number;
  countReviewsScrapped: number
}

interface TaskCardProps {
  recordId: number;
  style?: SxProps<Theme>;
  task: TaskProps,
  canEdit: boolean;
  canDelete: boolean;
}

const BlogTaskCard: React.FC<TaskCardProps> = ({ recordId, task, style, canEdit = false, canDelete = false }) => {
  const { translate } = useTranslation();

  return (
    <Card sx={{
      ...style,
      "&:hover .hoverable-button-container": { display: "flex" },
    }}>
      <CardContent>
        <Box sx={{ display: "flex", placeContent: "space-between", mb: "15px" }}>
          <Typography variant="h4" sx={{ overflow: "hidden", textOverflow: "ellipsis", wordWrap: "nowrap" }}>{task.name}</Typography>
          <Box sx={{ display: "flex", columnGap: "5px", alignItems: "center" }}>
            <Box sx={{ display: "none" }} className="hoverable-button-container">
              <ShowButton hideText recordItemId={recordId} />
              {canEdit ? (<EditButton hideText recordItemId={recordId} />) : null}
              {canDelete ? (<DeleteButton hideText recordItemId={recordId} />) : null}
            </Box>
            <Typography sx={{ padding: "0 5px", pr: 0 }}>#{task.id}</Typography>
          </Box>
        </Box>
        <Box sx={{ wordWrap: "break-word", wordBreak: "break-all", display: "flex", alignItems: "center", columnGap: "5px", pb: "10px", mb: "10px", borderBottom: "1px solid #f5f5f5" }}>
          <Public className="link" sx={{ scale: .6 }} />
          <a href={task.data.url ?? "#"} className="link">{task.data.url ?? "Lien vers l'avis"}</a>
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

export const JobList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [refreshing, setRefreshing] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [sort, setSort] = useState("id");
  const [sortOrder, setSortOrder] = useState(1);

  const { data, isLoading, refetch, } = useList({
    resource: "jobs",
    pagination: {
      current: page,
      pageSize: pageSize,
      mode: "server",
    },
    sorters: [{
      field: sort,
      order: sortOrder === 1 ? "asc" : "desc"
    }]
  });
  const { translate } = useTranslation();

  const filterArray = [
    { key: "id", label: translate("pages.jobs.list.headerSortField.id") },
    { key: "name", label: translate("pages.jobs.list.headerSortField.name") },
    { key: "state", label: translate("pages.jobs.list.headerSortField.state") },
    { key: "processedOn", label: translate("pages.jobs.list.headerSortField.processedOn") },
    { key: "finishedOn", label: translate("pages.jobs.list.headerSortField.finishedOn") },
    { key: "totalReviews", label: translate("pages.jobs.list.headerSortField.totalReviews") },
    { key: "countReviewsScrapped", label: translate("pages.jobs.list.headerSortField.countReviewsScrapped") }
  ];

  useEffect(() => {
    if (data) {
      setTotalRowCount(data.total ?? 0);
    }
  }, [data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = Number(event.target.value);
    setPage(1);
    setPageSize(newPageSize);
  };
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value);
  }
  const handleSortOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(Number(event.target.value));
  }

  return (
    <>
      <List
        title={
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <ListIcon sx={{ mr: 3, mt: .95 }} />
            <Typography variant="h4">{translate("pages.jobs.list.title")}</Typography>
          </Box>
        }
        headerButtons={({ defaultButtons }) => (
          <>
            <RefreshButton onClick={handleRefresh} sx={{ display: "flex", alignItems: "center" }}></RefreshButton>
            {defaultButtons}
          </>
        )}
        headerProps={{
          style: { padding: "20px", rowGap: "10px" }
        }}
        createButtonProps={{
          children: translate("pages.jobs.list.addNewTask"),
        }}
        contentProps={{
          style: {
            padding: 0,
          }
        }}
      >
        <Box
          flex={1}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box sx={{ display: "flex", padding: "10px 20px", borderTop: "1px solid #f5f5f5", placeContent: "space-between" }}>
            <Box sx={{ display: "flex", columnGap: "10px" }}>
              <TextField
                variant="standard"
                type="search"
                label={translate("pages.jobs.list.headerSearchInputLabel")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }} className="custom-input"
              />
              <Button type="button" sx={{ flex: 1 }}>{translate("pages.jobs.list.headerSearchButton")}</Button>
            </Box>
            <Box sx={{ display: "flex", columnGap: "10px" }}>
              <TextField
                select
                variant="standard"
                label={translate("pages.jobs.list.headerSortInputLabel")}
                value={sort}
                sx={{
                  "& .MuiInputBase-input": { fontSize: ".875rem" }
                }}
                onChange={handleSortChange}
              >
                {filterArray.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                variant="standard"
                label={translate("pages.jobs.list.headerSortOrderInputLabel")}
                value={sortOrder}
                sx={{
                  "& .MuiInputBase-input": { fontSize: ".875rem" }
                }}
                onChange={handleSortOrderChange}
              >
                <MenuItem value={1}>{translate("pages.jobs.list.headerSortOrder.ascending")}</MenuItem>
                <MenuItem value={-1}>{translate("pages.jobs.list.headerSortOrder.descending")}</MenuItem>
              </TextField>
            </Box>
          </Box>
          <Box sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>

            {isLoading || refreshing ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "50px",
                }}
              >
                <CircularProgress />
                <Typography variant="h6" sx={{ marginTop: "20px" }}>
                  {translate("pages.jobs.list.loadingTaskList")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ width: "50%", minWidth: "400px", marginTop: "10px" }}
                >
                  {translate("pages.jobs.list.loadingTaskListMessage")}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {
                  data?.data.map((task, id) => (
                    <Grid item sm={12} md={6} lg={4} xl={3} key={id}>
                      <BlogTaskCard recordId={Number(task.id) ?? 0} task={task as TaskProps} canEdit={task.state !== "completed"} canDelete={true} />
                    </Grid>
                  ))
                }
              </Grid>
            )}
          </Box>
          <Box sx={{
            display: "flex",
            placeContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f5f5f5",
            padding: "5px",
          }}>
            <Pagination
              count={Math.ceil(totalRowCount / pageSize)}
              page={page}
              onChange={handlePageChange}
            />
            <Typography variant="body2">
              {
                translate("pages.jobs.list.footerElementsCount", {
                  from: (page - 1) * pageSize + 1,
                  to: Math.min(page * pageSize, totalRowCount || 0),
                  total: totalRowCount ?? 0
                })
              }</Typography>
            <Box sx={{
              display: "flex",
              alignItems: "center",
            }}>
              <Typography variant="body2">{translate("pages.jobs.list.footerElementsShowCount")}</Typography>
              <Select
                value={pageSize}
                sx={{
                  '.MuiOutlinedInput-notchedOutline': { border: "none" },
                  '.MuiSelect-select': {
                    padding: '10px 20px',
                    color: '#333',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#7b1fa2',
                  },
                }}
                onChange={handlePageSizeChange}
              >
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={48}>48</MenuItem>
                <MenuItem value={96}>96</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>
      </List>
    </>
  );
};
