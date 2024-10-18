import React, { useEffect, useRef, useState, useCallback } from "react";
import { useList } from "@refinedev/core";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mui";
import { Settings, Refresh, Inventory, Code, AddBox, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Search } from "@mui/icons-material";
import { Box, Typography, Button, Stack, Card, CardContent, SxProps, Theme, Grid, Pagination, Select, MenuItem, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { Tag } from "../../components";

interface SelectorCardProps {
  selector: any;
  style?: SxProps<Theme>;
  canEdit?: boolean;
  canDelete?: boolean;
}

const renderTag = (condition: boolean, text: string, icon: any) => {
  return condition ? (
    <Tag
      text={text}
      icon={icon}
      style={{
        columnGap: "3px",
        padding: "1px 4px",
        borderRadius: "4px",
        width: "fit-content",
      }}
    />
  ) : null;
};

export const SelectorCard: React.FC<SelectorCardProps> = ({ selector, style, canEdit = false, canDelete = false }) => {
  const [showDescription, setShowDescription] = useState(false);

  const handleDescriptionChange = useCallback((event) => {
    setShowDescription((prevState) => !prevState);
    event.target.textContent = showDescription ? "Afficher la description complete" : "Masquer une partie";
  }, [showDescription]);

  return (
    <Card sx={{
      ...style,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      "&:hover .hoverable-button-container": { display: "flex" },
    }}>
      <CardContent>
        <Box sx={{ mt: "10px" }}>
          <Box sx={{ display: "flex", placeContent: "space-between", mb: "5px", alignItems: "center" }}>
            <Typography variant="body2" sx={{ height: "30px", lineHeight: "30px", verticalAlign: "middle" }}>{selector._id}</Typography>
            <Box sx={{ display: "flex", columnGap: "8px", alignItems: "center" }}>
              <Box sx={{ display: "none", columnGap: "5px" }} className="hoverable-button-container">
                {selector.type === "group" ? (<Button sx={{ padding: "4px 6px", minWidth: 0, width: "fit-content" }}><AddBox sx={{ scale: .975 }} /></Button>) : null}
                <ShowButton hideText recordItemId={selector._id} />
                {canEdit ? (<EditButton hideText recordItemId={selector._id} />) : null}
                {canDelete ? (<DeleteButton hideText recordItemId={selector._id} />) : null}
              </Box>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ minWidth: 0, flex: "1 1 auto", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", mb: "5px" }}>{selector.displayName ?? selector.name}</Typography>
          <Typography variant="body2" sx={{ mb: "5px" }}>{selector.name}</Typography>
          <Typography variant="body2" sx={{ mb: "10px", color: "#999999", wordBreak: "break-all" }}>{selector.selector}</Typography>
          <Box sx={{ display: "flex", columnGap: "5px", rowGap: "5px" }}>
            {renderTag(selector.group, "Groupe", <IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />)}
            {renderTag(selector.array, "Tableau", <DataArray sx={{ color: "#7B1FA2", scale: .7 }} />)}
            {renderTag(selector.text, "Texte", <TextFields sx={{ color: "#FFC900", scale: .7 }} />)}
            {renderTag(selector.html, "HTML", <Code sx={{ color: "#022FFF", scale: .7 }} />)}
            {renderTag(selector.trimText, "Split", <Transform sx={{ color: "#7B1FA2", scale: .7 }} />)}
            {renderTag(selector.attrText, "Attribut", <FormatQuote sx={{ color: "#FFC900", scale: .7 }} />)}
            {renderTag(selector.firstNumber, "Premier nombre", <LooksOne sx={{ color: "#022FFF", scale: .7 }} />)}
            {renderTag(selector.json, "JSON", <DataObject sx={{ color: "#022FFF", scale: .7 }} />)}
          </Box>
          {
            selector.description ?
              (
                <Box sx={{ mt: "15px", pt: "15px", borderTop: "1px solid #f5f5f5" }}>
                  <Typography variant="body2">{selector.description?.length > 100 && showDescription === false ? selector.description?.slice(0, 100) + "..." : selector.description}</Typography>
                  {
                    selector.description?.length > 100 ?
                      (<a className="link" onClick={handleDescriptionChange} style={{ display: "block", cursor: "pointer", marginTop: "10px" }}>Afficher la description complete</a>) :
                      null
                  }
                </Box>
              ) :
              null
          }
        </Box>
      </CardContent>
    </Card >
  );
}

export const SelectorConfigList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sort, setSort] = useState("id");
  const [sortOrder, setSortOrder] = useState(1);
  const [totalRowCount, setTotalRowCount] = useState(0);

  const handleActiveIndexChange = (index: number, key: string) => { setActiveIndex(index); setGroup(key); }
  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      refetch().finally(() => setRefreshing(false));
    }
  };
  const handleAddGroup = () => { }
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

  const filterArray = [{ key: "id", label: "ID" }, { key: "name", label: "Nom" }];
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
            <Settings sx={{ mr: 1, mt: .45 }} />
            <Typography variant="h6">Liste des selecteurs enregistrés dans la base de données</Typography>
          </Box>
        }
        headerButtons={({ defaultButtons }) => (
          <>
            <Button type="button" onClick={handleRefresh} sx={{ display: "flex", alignItems: "center" }}>
              <Refresh sx={{ marginRight: 1 }} />
              Rafraichir
            </Button>
            <Button type="button" onClick={handleAddGroup} sx={{ display: "flex", alignItems: "center" }}>
              Ajouter un nouveau groupe
            </Button>
            {defaultButtons}
          </>
        )}
        headerProps={{
          style: {
            padding: "20px",
            rowGap: "20px"
          }
        }}
        createButtonProps={{
          children: "Ajouter un nouveau sélécteur",
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
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center", mt: "20px", flexWrap: "wrap", rowGap: "10px", borderTop: "1px solid #f5f5f5", paddingTop: "20px" }}>
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
                      <Grid item key={index} sm={6} md={4} lg={3}><SelectorCard selector={selector} canEdit={true} canDelete={true}></SelectorCard></Grid>
                    ))
                  }
                </Grid>
              ) :
              (
                <Box>
                  aucun resultat
                </Box>
              )

          )}
        </Box>
      </List>
    </>
  );
};
