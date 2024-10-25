import React, { useEffect, useRef, useState, useCallback } from "react";
import { useList } from "@refinedev/core";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mui";
import { Settings, Refresh, Inventory, Code, AddBox, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Search, SearchOff } from "@mui/icons-material";
import { Box, Typography, Button, Stack, Card, CardContent, SxProps, Theme, Grid, Pagination, Select, MenuItem, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { Tag } from "../../components";

export const QueueList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sort, setSort] = useState("_id");
  const [sortOrder, setSortOrder] = useState(1);
  const [totalRowCount, setTotalRowCount] = useState(0);

  const handleActiveIndexChange = useCallback((index: number, key: string) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
      setGroup(key);
      setRefreshing(true);

      refetch().finally(() => setRefreshing(false));
    }
  }, [activeIndex, setActiveIndex, setGroup]);
  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      refetch().finally(() => setRefreshing(false));
    }
  };
  const handleSearchClick = () => {
    if (searchInputRef.current) {
      setPage(1);
      setSearch(searchInputRef.current.value);
    }
  };
  const handlePageSizeChange = (event) => {
    const newPageSize = event.target.value;
    setPage(1);
    setPageSize(newPageSize);
  };
  const handlePageChange = (event, value: number) => { setPage(value); };
  const handleSortChange = (event) => { setSort(event.target.value); }
  const handleSortOrderChange = (event) => { setSortOrder(event.target.value); }

  const searchInputRef = useRef();

  const filterArray = [{ key: "_id", label: "ID" }, { key: "name", label: "Nom" }];
  const filterButtonArray = [
    { text: "Tous", icon: (<Inventory sx={{ scale: .7 }} />), key: null },
    { text: "Groupe", icon: (<IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />), key: "group" },
    { text: "Tableau", icon: (<DataArray sx={{ color: "#7B1FA2", scale: .7 }} />), key: "array" },
    { text: "Texte", icon: (<TextFields sx={{ color: "#FFC900", scale: .7 }} />), key: "text" },
    { text: "HTML", icon: (<Code sx={{ color: "#022FFF", scale: .7 }} />), key: "html" },
    { text: "Split", icon: (<Transform sx={{ color: "#1976D2", scale: .7 }} />), key: "split" },
    { text: "Attribut", icon: (<FormatQuote sx={{ color: "#C464E1", scale: .7 }} />), key: "attrText" },
    { text: "Premier nombre", icon: (<LooksOne sx={{ color: "#E400B0", scale: .7 }} />), key: "firstNumber" },
    { text: "JSON", icon: (<DataObject sx={{ color: "#B80384", scale: .7 }} />), key: "json" }
  ]
  const { data, isLoading, refetch } = useList({
    resource: "selectors",
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
      {
        field: "group",
        operator: "eq",
        value: group
      }
    ],
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

  return (
    <>
      <List
        title={
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Settings sx={{ mr: 3, mt: .95 }} />
            <Typography variant="h4">Liste des selecteurs enregistrés dans la base de données</Typography>
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
        headerProps={{
          style: {
            padding: "20px",
            rowGap: "10px"
          }
        }}
        createButtonProps={{
          children: "Ajouter un nouvel élément",
        }}
        contentProps={{
          style: {
            padding: 0,
          }
        }}
      >
        <Box sx={{ padding: 2, borderTop: "1px solid #f5f5f5" }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%", placeContent: "space-between" }}>
              <Box>
                <Box sx={{ mb: "5px" }}>Filtrer le résultat</Box>
                <Box sx={{ display: "flex", columnGap: "8px", rowGap: "8px", flexWrap: "wrap" }}>
                  {
                    filterButtonArray.map((filter, index) => (
                      <Tag isActive={activeIndex === index} key={filter.key} value={filter.key} index={index} handleClick={handleActiveIndexChange} style={{ cursor: "pointer", columnGap: "3px", padding: "1px 4px", borderRadius: "4px", width: "fit-content" }} text={filter.text} icon={filter.icon} />
                    ))
                  }
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", pt: "20px", mt: "20px", borderTop: "1px solid #f5f5f5", placeContent: "space-between" }}>
            <Box sx={{ display: "flex", columnGap: "10px" }}>
              <TextField
                variant="standard"
                type="search"
                label="Rechercher un selecteur ou un groupe ..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                className="custom-input"
                inputRef={searchInputRef}
                sx={{ minWidth: "300px" }}
              />
              <Button type="button" sx={{ flex: 1 }} onClick={handleSearchClick}>Rechercher</Button>
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
                padding: "40px",
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
                Nous sommes en train de retrouver la liste des sélecteurs qui ont été
                créées sur la plateforme. Nous vous prions de patienter un moment.
              </Typography>
            </Box>
          ) : (
            data && data.data && data?.data.length > 0 ?
              (
                <Grid container spacing={2}>
                  {
                    data?.data.map((selector, index) => (
                      <Grid item key={selector._id} sm={6} md={6} lg={4} xl={3}><SelectorCard selector={selector} canEdit={true} canDelete={true}></SelectorCard></Grid>
                    ))
                  }
                </Grid>
              ) :
              (
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ width: "50%", textAlign: "center", padding: "50px", margin: "0 auto" }}>
                    <SearchOff sx={{ transform: "scale(3)" }}></SearchOff>
                    <Typography variant="h6" sx={{ mt: "30px" }}>Aucun élément trouvé</Typography>
                    <Typography variant="body2" sx={{ mt: "5px" }}>Nous n'avons trouvé aucun élément satisfaisant vos critères.</Typography>
                  </Box>
                </Box>
              )

          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center", flexWrap: "wrap", rowGap: "10px", borderTop: "1px solid #f5f5f5", pt: "10px", pb: "10px" }}>
          <Pagination
            count={Math.ceil(totalRowCount / pageSize)}
            page={page}
            onChange={handlePageChange}
          />
          <Typography sx={{ flexGrow: 1, flexShrink: 0, padding: "0 20px", textAlign: "center", height: "40px", lineHeight: "40px", verticalAlign: "middle" }} variant="body2">Eléments {`${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalRowCount || 0)}`} de {totalRowCount ?? 0}</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2">Afficher les éléments par :</Typography>
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
      </List>
    </>
  );
};
