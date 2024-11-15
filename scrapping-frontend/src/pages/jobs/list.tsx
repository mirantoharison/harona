import { useState, useEffect, useRef } from "react";
import { List, RefreshButton } from "@refinedev/mui";
import { List as ListIcon } from "@mui/icons-material";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useList, useTranslation } from "@refinedev/core";
import { usePageTitle } from "../../components/title";
import { JobHeader, JobPagination, TaskCard } from "../../components/jobs";
import { Loading, NoElement } from "../../components/misc";

import { TaskProps } from "../../interfaces/jobs";

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
      return {
        message: translate("pages.error.listMessage", {
          error: error?.message,
          stack: error?.stack
        }),
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

  const handleRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
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
    if (!isLoading && data) {
      setTotalRowCount(data?.total || 0);
    }
  }, [isLoading, data]);

  usePageTitle("GMB | Liste des tâches");

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
          <JobHeader
            search={search}
            setPage={setPage}
            setSearch={setSearch}
            handleRefresh={handleRefresh}
            sort={sort}
            sortOrder={sortOrder}
            setSort={setSort}
            setSortOrder={setSortOrder}
            filterArray={filterArray}
          />
          <Box sx={{ padding: 2, backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#545454" }}>
            {isLoading || refreshing ? (
              <Loading loadingTitle={translate("pages.jobs.list.loadingTaskList")} loadingMessage={translate("pages.jobs.list.loadingTaskListMessage")} />
            ) : (
              data && data.data && data?.data.length > 0 ? (
                <Grid container spacing={2}>
                  {
                    data?.data.map((task, id) => (
                      <Grid item sm={12} md={6} lg={4} xl={3} key={id} sx={{ width: "100%" }}>
                        <TaskCard
                          recordId={Number(task.id) ?? 0}
                          task={task as TaskProps}
                          canEdit={task.state !== "completed"}
                          canDelete={task.state !== "active"} />
                      </Grid>
                    ))
                  }
                </Grid>
              ) : (
                <NoElement noelementTitle={translate("pages.jobs.list.noElementFound")} noelementMessage={translate("pages.jobs.list.noElementFoundMessage")} />
              )
            )}
          </Box>
          <JobPagination
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            totalRowCount={totalRowCount}
            textElementCountIndicator={
              translate("pages.jobs.list.footerElementsCount", {
                from: (page - 1) * pageSize + 1,
                to: Math.min(page * pageSize, totalRowCount || 0),
                total: totalRowCount ?? 0
              })
            }
            textElementShownIndicator={translate("pages.jobs.list.footerElementsShowCount")}
          />
        </Box>
      </List>
    </>
  );
};
