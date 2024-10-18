import React, { useState, useEffect } from "react";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mui";
import { DataGrid, type GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { List as ListIcon, Refresh, Public, Search } from "@mui/icons-material";
import { CircularProgress, Box, Typography, Button, Grid, Select, MenuItem, Pagination, Card, CardContent, CardActionArea, SxProps, Theme, TextField, InputAdornment } from "@mui/material";
import { useList } from "@refinedev/core";
import { CreateForm } from "./create";
import { StateCell } from "../../components";


interface BlogTaskCardProps {
  recordId: number;
  style?: SxProps<Theme>;
  task: {
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
  };
}

const BlogTaskCard: React.FC<BlogTaskCardProps> = ({ recordId, task, style }) => {
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
              <EditButton hideText recordItemId={recordId} />
              <DeleteButton hideText recordItemId={recordId} />
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
          <Typography variant="body2">Commencée le : {task.processedOn}</Typography>
          <Typography variant="body2">Finie le : {task.finishedOn}</Typography>
          <Typography variant="body2">Avis total : {task.totalReviews}</Typography>
          <Typography variant="body2">Avis scrapés : {task.countReviewsScrapped}</Typography>
        </Box>
      </CardContent>
    </Card >
  );
}

export const BlogPostList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [sort, setSort] = useState("id");
  const [sortOrder, setSortOrder] = useState(1);

  const filterArray = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
    { key: "state", label: "Etat" },
    { key: "processedOn", label: "Date de traitement" },
    { key: "finishedOn", label: "Date de fin" },
    { key: "totalReviews", label: "Nombre total d'avis" },
    { key: "countReviewsScrapped", label: "Nombre d'avis scrapés" }
  ];
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

  useEffect(() => {
    if (data) {
      setTotalRowCount(data.total ?? 0);
    }
  }, [data]);

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

  const handlePageSizeChange = (event) => {
    const newPageSize = event.target.value;
    setPage(1);
    setPageSize(newPageSize);
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  }
  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  }

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
            <Button type="button" onClick={handleRefresh} sx={{ display: "flex", alignItems: "center" }}>
              <Refresh sx={{ marginRight: 1 }} />
              Rafraichir
            </Button>
            {defaultButtons}
          </>
        )}
        createButtonProps={{
          children: "Ajouter une nouvelle tâche",
          onClick: handleOpen
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
                label="Rechercher une tâche ..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }} className="custom-input"
              />
              <Button type="button" sx={{ flex: 1 }}>Rechercher</Button>
            </Box>
            <Box sx={{ display: "flex", columnGap: "10px" }}>
              <TextField
                select
                variant="standard"
                label="Trier les résultats suivant ..."
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
                label="Dans l'odre ..."
                value={sortOrder}
                sx={{
                  "& .MuiInputBase-input": { fontSize: ".875rem" }
                }}
                onChange={handleSortOrderChange}
              >
                <MenuItem value={1}>Croissant</MenuItem>
                <MenuItem value={-1}>Décroissant</MenuItem>
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
                  En cours de chargement de la liste...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ width: "50%", minWidth: "400px", marginTop: "10px" }}
                >
                  Nous sommes en train de retrouver la liste des tâches qui ont été
                  créées sur la plateforme. Nous vous prions de patienter un moment.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {
                  data?.data.map((task, id) => (
                    <Grid item sm={12} md={6} lg={4} xl={3} key={id}>
                      <BlogTaskCard recordId={task.id} task={task} />
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
            <Typography variant="body2">Eléments {`${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalRowCount || 0)}`} de {totalRowCount ?? 0}</Typography>
            <Box sx={{
              display: "flex",
              alignItems: "center",
            }}>
              <Typography variant="body2">Afficher les éléments par :</Typography>
              <Select
                value={pageSize}
                sx={{
                  '.MuiOutlinedInput-notchedOutline': { border: "none" }, // No border
                  '.MuiSelect-select': {
                    padding: '10px 20px', // Adjust padding inside the select box
                    color: '#333',        // Text color
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#7b1fa2',         // Custom color for the dropdown icon
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

      <CreateForm open={open} onClose={handleClose} />
    </>
  );
};
