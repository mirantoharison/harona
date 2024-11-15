import React, { useEffect, useState } from "react";
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
  MarkdownField,
  RefreshButton,
  ImportButton,
} from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useTranslate, useMany, useInvalidate } from "@refinedev/core";
import { alpha, Box, gridClasses, styled, Typography } from "@mui/material";
import { Store } from "@mui/icons-material";
import { JobHeader, JobPagination } from "../../components/jobs";
import { NoElement } from "../../components/misc";

interface EstablishmentProps {

}

export const EstablishmentList = () => {
  const [search, setSearch] = useState("");

  const invalidate = useInvalidate();
  const translate = useTranslate();

  const { dataGridProps, setFilters } = useDataGrid({
    resource: "establishment",
    filters: {
      initial: [
        {
          field: "search",
          operator: "eq",
          value: "",
        },
      ]
    },
    pagination: {
      mode: "server",
    }
  });

  const ODD_OPACITY = 0.05;
  const StripedDataGridBase  = styled(DataGrid)(({ theme }) => ({
    [`& .even`]: {
      backgroundColor: theme.palette.grey[200],
      '&.Mui-selected': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity,
        )
      },
    },
  }));
  const StripedDataGrid = React.memo(StripedDataGridBase);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        minWidth: 50,
      },
      {
        field: "categories",
        headerName: "Types",
      },
      {
        field: "name",
        flex: 1,
        headerName: "Nom de l'établissement",
      },
      {
        field: "url",
        flex: 2.5,
        headerName: "Url à scrapper",
        renderCell: function render({ value }) {
          return (<a href={value ?? "#"} className="link" target="_blank">{value ?? ""}</a>);
        },
      },
      {
        field: "formatted_address",
        headerName: "Adresse",
      },
      {
        field: "description",
        headerName: translate("Description"),
      },
      {
        field: "actions",
        headerName: translate("table.actions"),
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} resource="establishment" />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
    ],
    [translate],
  );

  const handleSetSearch = async (value: string) => {
    setSearch(value);
    setFilters([
      {
        field: "search",
        operator: "eq",
        value,
      },
    ]);
  }

  const handleRefresh = async () => {
    await invalidate({
      resource: "establishment",
      invalidates: ["list"],
    });
  };

  return (
    <List
      title={
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Store sx={{ mr: 3, mt: .95 }} />
          <Typography variant="h4">{"Liste des pages"}</Typography>
        </Box>
      }
      headerButtons={({ defaultButtons }) => (
        <>
          <RefreshButton
            onClick={handleRefresh}
            sx={{ display: "flex", alignItems: "center", minWidth: "auto" }}
          />
          {defaultButtons}
        </>
      )}
      headerProps={{
        style: { padding: "20px", rowGap: "10px", placeContent: "space-between" }
      }}
      createButtonProps={{
        children: "Ajouter une nouvelle page",
      }}
      contentProps={{
        style: {
          padding: 0,
        }
      }}
    >
      <JobHeader
        search={search}
        setSearch={handleSetSearch}
        handleRefresh={handleRefresh}
      />
      <StripedDataGrid
        {...dataGridProps}
        disableColumnMenu
        localeText={{
          noRowsLabel: translate("resources.common.noData")
        }}
        columns={columns}
        rowHeight={40}
        autoHeight
        sx={{ p: "0 20px", border: "none", borderTop: "1px solid #f5f5f5" }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        slotProps={{
          pagination: {
            labelRowsPerPage: <Typography variant="body2">{translate("pages.jobs.list.footerElementsShowCount")}</Typography>,
            labelDisplayedRows: ({ from, to, count }) => translate("pages.jobs.list.footerElementsCount", { from, to, total: count }),
          },
        }}
      />
    </List>
  );
};