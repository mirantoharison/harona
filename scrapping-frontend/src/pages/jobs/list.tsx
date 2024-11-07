import React, { useState, useEffect, useRef } from "react";
import { DeleteButton, EditButton, List, ShowButton, RefreshButton } from "@refinedev/mui";
import { List as ListIcon, Public, Search, SearchOff, ArrowDropDown, ImportExport } from "@mui/icons-material";
import { CircularProgress, Box, Typography, Button, Grid, Select, MenuItem, Pagination, Card, CardContent, SxProps, Theme, TextField, InputAdornment, SelectChangeEvent, useTheme, Menu, IconButton } from "@mui/material";
import { useCustom, useList, useTranslation } from "@refinedev/core";
import { StateCell } from "../../components";
import { dataProvider } from "../../providers/mockDataProvider";

interface TaskProps {
  id: number;
  name: string;
  state: string;
  processedOn: string;
  finishedOn: string;
  data: {
    url: string;
    name: string;
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

const TaskCard: React.FC<TaskCardProps> = ({ recordId, task, style, canEdit = false, canDelete = false }) => {
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
              {/*<EditButton hideText recordItemId={recordId} />*/}
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

export const JobList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [refreshing, setRefreshing] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [sort, setSort] = useState("id");
  const [sortOrder, setSortOrder] = useState(-1);
  const [search, setSearch] = useState("");
  const [shouldExport, setShouldExport] = useState(false);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [exportType, setExportType] = useState("");
  const theme = useTheme();

  const { translate } = useTranslation();
  const { data, isLoading, refetch } = useList({
    errorNotification: (error, values, resource) => {
      console.log(error);
      return {
        message: translate("pages.error.listMessage"),
        description: translate("pages.error.listDescription"),
        type: "error",
      };
    },
    resource: "jobs",
    pagination: {
      current: page,
      pageSize: pageSize,
      mode: "server",
    },
    filters: [
      {
        field: "search",
        operator: "eq",
        value: search,
      },
    ],
    sorters: [{
      field: sort,
      order: sortOrder === 1 ? "asc" : "desc"
    }]
  });

  /*const { data: uniqueCheckData, isLoading: isUniqueCheckLoading, isFetched, isSuccess } = useCustom({
    url: `${dataProvider.getApiUrl()}/jobs/export`,
    method: "get",
    config: {
      query: {
        info: true,
        type: exportType
      }
    },
    queryOptions: {
      enabled: shouldExport,
    },
  });*/

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listWrapperRef = useRef<HTMLDivElement>(null);

  const filterArray = [
    { key: "id", label: translate("pages.jobs.list.headerSortField.id") },
    { key: "name", label: translate("pages.jobs.list.headerSortField.name") },
    { key: "state", label: translate("pages.jobs.list.headerSortField.state") },
    { key: "processedOn", label: translate("pages.jobs.list.headerSortField.processedOn") },
    { key: "finishedOn", label: translate("pages.jobs.list.headerSortField.finishedOn") },
    { key: "totalReviews", label: translate("pages.jobs.list.headerSortField.totalReviews") },
    { key: "countReviewsScrapped", label: translate("pages.jobs.list.headerSortField.countReviewsScrapped") }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const handleSearchClick = () => {
    if (searchInputRef.current) {
      if (search !== searchInputRef.current.value) {
        setPage(1);
        setSearch(searchInputRef.current.value);
      }
      handleRefresh();
    }
  };
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = Number(event.target.value);
    setPage(1);
    setPageSize(newPageSize);
  };
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (value !== page) {
      setPage(value);
    }
  };
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value);
  }
  const handleSortOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(Number(event.target.value));
  }
  const handleScrollToTarget = () => {
    listWrapperRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /*const handleExportOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (event.currentTarget.parentElement) {
      setExportAnchorEl(event.currentTarget.parentElement);
    }
  }
  const handleExportChoice = (value: string) => {
    handleExportClose();
    if (value !== exportType) {
      setShouldExport(true);
      setExportType(value);
    }
  }
  const handleExportClose = () => {
    setExportAnchorEl(null);
  }

  const handleExport = () => {
    setShouldExport(true);
  }*/

  /*useEffect(() => {
    if (shouldExport && isSuccess) {
      setShouldExport(false);
    }
  }, [shouldExport, isSuccess]);*/

  useEffect(() => {
    handleScrollToTarget();
  }, [page]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [search]);

  useEffect(() => {
    if (!isLoading && data) {
      setTotalRowCount(data?.total || 0);
    }
  }, [isLoading, data]);

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
            <RefreshButton
              onClick={handleRefresh}
              sx={{ display: "flex", alignItems: "center", minWidth: "auto" }}
            />
            {
              /*<Box>
              <Button variant="outlined" onClick={handleExport} sx={{ pl: "5px", pr: "5px" }}>
                <ImportExport sx={{ scale: .8, mr: "5px" }} />
                {exportType ? `Exporter en ${exportType}` : 'Choisir une option pour exporter'}
                <IconButton onClick={handleExportOpen} size="small" sx={{ marginLeft: 1, padding: 0 }}>
                  <ArrowDropDown />
                </IconButton>
              </Button>
              <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={handleExportClose}
              >
                <MenuItem onClick={() => handleExportChoice("json")}><Typography variant="body2">Exporter en JSON</Typography></MenuItem>
                <MenuItem onClick={() => handleExportChoice("xls")}><Typography variant="body2">Exporter en XLS</Typography></MenuItem>
                <MenuItem onClick={() => handleExportChoice("xlsx")}><Typography variant="body2">Exporter en XLSX</Typography></MenuItem>
              </Menu>
            </Box>
            */
            }
            {defaultButtons}
          </>
        )}
        headerProps={{
          style: { padding: "20px", rowGap: "10px", placeContent: "space-between" }
        }}
        createButtonProps={{
          children: translate("pages.jobs.list.addNewTask"),
        }}
        contentProps={{
          style: {
            padding: 0,
          }
        }}
        wrapperProps={{
          ref: listWrapperRef,
          sx: {
            ".MuiCardHeader-action": { width: "fit-content" },
            ".MuiCardHeader-action > div": { display: "flex", flexWrap: "wrap" }
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
          <Box sx={{ display: "flex", padding: "10px 20px", borderTop: "1px solid #f5f5f5", placeContent: "space-between", width: "100%", flexWrap: "wrap", rowGap: "20px" }}>
            <Box sx={{ display: "flex", columnGap: "10px", width: "fit-content", rowGap: "10px" }}>
              <TextField
                variant="standard"
                type="search"
                inputRef={searchInputRef}
                label={translate("pages.jobs.list.headerSearchInputLabel")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }} className="custom-input"
              />
              <Button type="button" sx={{ flex: 1 }} onClick={handleSearchClick}>{translate("pages.jobs.list.headerSearchButton")}</Button>
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
          <Box sx={{ padding: 2, backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#545454" }}>
            {isLoading || refreshing ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "50px",
                  maxWidth: "500px",
                  margin: "0 auto",
                  width: "100%"
                }}
              >
                <CircularProgress />
                <Typography variant="h6" sx={{ marginTop: "20px" }}>
                  {translate("pages.jobs.list.loadingTaskList")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ marginTop: "10px" }}
                >
                  {translate("pages.jobs.list.loadingTaskListMessage")}
                </Typography>
              </Box>
            ) : (
              data && data.data && data?.data.length > 0 ? (
                <Grid container spacing={2}>
                  {
                    data?.data.map((task, id) => (
                      <Grid item sm={12} md={6} lg={4} xl={3} key={id} sx={{ width: "100%" }}>
                        <TaskCard recordId={Number(task.id) ?? 0} task={task as TaskProps} canEdit={task.state !== "completed" && task.state !== "active"} canDelete={task.state !== "active"} />
                      </Grid>
                    ))
                  }
                </Grid>
              ) : (
                <Box sx={{
                  maxWidth: "500px",
                  margin: "0 auto",
                  width: "100%"
                }}>
                  <Box sx={{ textAlign: "center", padding: "50px", margin: "0 auto" }}>
                    <SearchOff sx={{ transform: "scale(3)" }}></SearchOff>
                    <Typography variant="h6" sx={{ mt: "30px" }}>{translate("pages.jobs.list.noElementFound")}</Typography>
                    <Typography variant="body2" sx={{ mt: "5px" }}>{translate("pages.jobs.list.noElementFoundMessage")}</Typography>
                  </Box>
                </Box>
              )
            )}
          </Box>
          <Box sx={{
            display: "flex",
            placeContent: "space-evenly",
            alignItems: "center",
            borderTop: "1px solid #f5f5f5",
            padding: "10px 20px",
            flexWrap: "wrap"
          }}>
            <Pagination
              count={Math.ceil(totalRowCount / pageSize)}
              page={page}
              onChange={handlePageChange}
            />
            <Typography variant="body2" sx={{
              padding: "0 20px",
              textAlign: "center"
            }}>
              {
                translate("pages.jobs.list.footerElementsCount", {
                  from: (page - 1) * pageSize + 1,
                  to: Math.min(page * pageSize, totalRowCount || 0),
                  total: totalRowCount ?? 0
                })
              }
            </Typography>
            <Box sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <Typography variant="body2">{translate("pages.jobs.list.footerElementsShowCount")}</Typography>
              <Select
                value={pageSize}
                sx={{
                  '.MuiOutlinedInput-notchedOutline': { border: "none" },
                  '.MuiSelect-select': {
                    padding: '10px 20px',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#7b1fa2',
                  }
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
