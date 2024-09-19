import React, { useState } from "react";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List as ListIcon, Refresh } from "@mui/icons-material";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { useList } from "@refinedev/core";
import { CreateForm } from "./create";
import { StateCell } from "../../components";

export const BlogPostList = () => {
  const { data, isLoading, refetch } = useList({
    resource: "jobs",
  });

  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 50,
      },
      {
        field: "state",
        headerName: "Etat",
        minWidth: 120,
        align: "center",
        renderCell: (params) => <StateCell row={params.row} />,
      },
      {
        field: "name",
        headerName: "Fil d'attente",
        minWidth: 100,
      },
      {
        field: "url",
        headerName: "URL de la tâche",
        minWidth: 350,
        flex: 1,
        renderCell: ({ row }) => (
          <>
            <a
              href={row.data?.url || "#"}  // Fallback in case URL is missing
              target="_blank"              // Correct target for opening in a new tab
              rel="noopener noreferrer"    // Security enhancement for new tab links
              className="link"
            >
              {row.data?.url || "URL introuvable"}
            </a>
          </>
        ),
      },
      {
        field: "comment",
        headerName: "Commentaire",
        minWidth: 250,
        flex: 1,
        valueGetter: ({ row }) => row.comments || "",
      },
      {
        field: "totalReviews",
        headerName: "Nombre total d'avis",
        minWidth: 150,
      },
      {
        field: "countReviewsScrapped",
        headerName: "Nombre d'avis scrapés",
        minWidth: 150,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: ({ row }) => (
          <>
            <Box sx={{
              padding: "auto 15px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
            >
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </Box>
          </>
        ),
        align: "center",
        headerAlign: "center",
        minWidth: 120,
      },
    ],
    []
  );

  return (
    <>
      <List
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ListIcon sx={{ marginRight: 1 }} />
            <Typography variant="h6">Affichage de la liste des tâches enregistrées</Typography>
          </Box>
        }
        headerButtons={({ defaultButtons }) => (
          <>
            <Button type="button" style={{ textTransform: "capitalize" }} onClick={handleRefresh} sx={{ display: "flex", alignItems: "center" }}>
              <Refresh sx={{ marginRight: 1 }} />
              <Typography variant="body1">Rafraichir</Typography>
            </Button>
            {defaultButtons}
          </>
        )}
        createButtonProps={{
          children: "Ajouter une nouvelle tâche",
          onClick: handleOpen,
          sx: {
            textTransform: "capitalize"
          }
        }}
      >
        {isLoading || refreshing ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <CircularProgress />
            <Typography variant="h5" sx={{ marginTop: "20px" }}>
              En cours de chargement de la liste...
            </Typography>
            <Typography
              variant="body1"
              sx={{ width: "50%", minWidth: "400px", marginTop: "10px" }}
            >
              Nous sommes en train de retrouver la liste des tâches qui ont été
              créées sur la plateforme. Nous vous prions de patienter un moment.
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={(data?.data as any)?.job ?? []} // Use data from useList
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
          />
        )}
      </List>

      <CreateForm open={open} onClose={handleClose} />
    </>
  );
};
