import React, { useEffect, useRef, useState, useCallback } from "react";
import { useList, useTranslation } from "@refinedev/core";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mui";
import { Settings, Refresh, Inventory, Code, AddBox, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Search, SearchOff } from "@mui/icons-material";
import { Box, Typography, Button, Card, CardContent, SxProps, Theme, Grid, Pagination, Select, MenuItem, TextField, InputAdornment, CircularProgress, SelectChangeEvent } from "@mui/material";
import { Tag } from "../../components";

interface SelectorCardProps {
  selector: any;
  style?: SxProps<Theme>;
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface SelectorData {
  _id: string;
  name: string;
  displayName?: string;
  selector: string;
  group?: boolean;
  array?: boolean;
  text?: boolean;
  html?: boolean;
  trimText?: boolean;
  attrText?: boolean;
  firstNumber?: boolean;
  json?: boolean;
  description?: string;
}

interface SelectorResponse {
  data: SelectorData[];
  total: number;
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

export const SelectorCard: React.FC<SelectorCardProps> = React.memo(({ selector, style, canEdit = false, canDelete = false }) => {
  const [showDescription, setShowDescription] = useState(false);
  const { translate } = useTranslation();

  const handleDescriptionChange = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    setShowDescription((prevState) => !prevState);
    event.currentTarget.textContent = showDescription ? translate("pages.selectors.list.selectorCard.fullDescription") : translate("pages.selectors.list.selectorCard.someDescription");
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
                {canDelete ? (
                  <DeleteButton
                    hideText
                    recordItemId={selector._id}
                    confirmTitle={translate("pages.selectors.list.selectorCard.deleteConfirmTitle", { id: selector._id })}
                    confirmCancelText={translate("pages.selectors.list.selectorCard.deleteCancelText")}
                    confirmOkText={translate("pages.selectors.list.selectorCard.deleteOkText")}
                  />
                ) : null}
              </Box>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ minWidth: 0, flex: "1 1 auto", textOverflow: "ellipsis", overflow: "hidden", mb: "5px" }} style={{ whiteSpace: "nowrap" }}>{selector.displayName ?? selector.name}</Typography>
          <Typography variant="body2" sx={{ mb: "5px" }}>{selector.name}</Typography>
          <Typography variant="body2" sx={{ mb: "10px", color: "#999999", wordBreak: "break-all" }}>{selector.selector}</Typography>
          <Box sx={{ display: "flex", columnGap: "5px", rowGap: "5px" }}>
            {renderTag(selector.group, translate("pages.selectors.tags.group"), <IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />)}
            {renderTag(selector.array, translate("pages.selectors.tags.array"), <DataArray sx={{ color: "#7B1FA2", scale: .7 }} />)}
            {renderTag(selector.text, translate("pages.selectors.tags.text"), <TextFields sx={{ color: "#FFC900", scale: .7 }} />)}
            {renderTag(selector.html, translate("pages.selectors.tags.html"), <Code sx={{ color: "#022FFF", scale: .7 }} />)}
            {renderTag(selector.trimText, translate("pages.selectors.tags.split"), <Transform sx={{ color: "#7B1FA2", scale: .7 }} />)}
            {renderTag(selector.attrText, translate("pages.selectors.tags.attribute"), <FormatQuote sx={{ color: "#FFC900", scale: .7 }} />)}
            {renderTag(selector.firstNumber, translate("pages.selectors.tags.number"), <LooksOne sx={{ color: "#022FFF", scale: .7 }} />)}
            {renderTag(selector.json, translate("pages.selectors.tags.json"), <DataObject sx={{ color: "#022FFF", scale: .7 }} />)}
          </Box>
          {
            selector.description ?
              (
                <Box sx={{ mt: "15px", pt: "15px", borderTop: "1px solid #f5f5f5" }}>
                  <Typography variant="body2">{selector.description?.length > 100 && showDescription === false ? selector.description?.slice(0, 100) + "..." : selector.description}</Typography>
                  {
                    selector.description?.length > 100 ?
                      (<a className="link" onClick={handleDescriptionChange} style={{ display: "block", cursor: "pointer", marginTop: "10px" }}>{translate("pages.selectors.list.selectorCard.fullDescription")}</a>) :
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
});

export const SelectorConfigList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sort, setSort] = useState("_id");
  const [sortOrder, setSortOrder] = useState(1);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [selectors, setSelectors] = useState<SelectorData[]>([]);
  const { translate } = useTranslation();

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filterArray = [{ key: "_id", label: translate("pages.selectors.list.headerFilter.id") }, { key: "name", label: translate("pages.selectors.list.headerFilter.name") }];
  const filterButtonArray = [
    { text: translate("pages.selectors.tags.all"), icon: (<Inventory sx={{ scale: .7 }} />), key: null },
    { text: translate("pages.selectors.tags.group"), icon: (<IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />), key: "group" },
    { text: translate("pages.selectors.tags.array"), icon: (<DataArray sx={{ color: "#7B1FA2", scale: .7 }} />), key: "array" },
    { text: translate("pages.selectors.tags.text"), icon: (<TextFields sx={{ color: "#FFC900", scale: .7 }} />), key: "text" },
    { text: translate("pages.selectors.tags.html"), icon: (<Code sx={{ color: "#022FFF", scale: .7 }} />), key: "html" },
    { text: translate("pages.selectors.tags.split"), icon: (<Transform sx={{ color: "#1976D2", scale: .7 }} />), key: "split" },
    { text: translate("pages.selectors.tags.attribute"), icon: (<FormatQuote sx={{ color: "#C464E1", scale: .7 }} />), key: "attrText" },
    { text: translate("pages.selectors.tags.number"), icon: (<LooksOne sx={{ color: "#E400B0", scale: .7 }} />), key: "firstNumber" },
    { text: translate("pages.selectors.tags.json"), icon: (<DataObject sx={{ color: "#B80384", scale: .7 }} />), key: "json" }
  ];

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


  const handleActiveIndexChange = useCallback((index: number, key: string) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
      setGroup(key);
      setRefreshing(true);

      refetch().finally(() => setRefreshing(false));
    }
  }, [activeIndex, setActiveIndex, setGroup]);
  const handleRefresh = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);
  const handleSearchClick = () => {
    if (searchInputRef.current) {
      setPage(1);
      setSearch(searchInputRef.current.value);
    }
  };
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = event.target.value;
    setPage(1);
    setPageSize(Number(newPageSize));
  };
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => { setPage(value); };
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setSort(event.target.value); }
  const handleSortOrderChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setSortOrder(Number(event.target.value)); }

  useEffect(() => {
    if (!isLoading) {
      setSelectors((data?.data || []) as SelectorData[]);
      setTotalRowCount(data?.total || 0);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [search]);

  return (
    <List
      title={
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Settings sx={{ mr: 3, mt: .95 }} />
          <Typography variant="h4">{translate("pages.selectors.list.title")}</Typography>
        </Box>
      }
      headerButtons={({ defaultButtons }) => (
        <>
          <Button type="button" onClick={handleRefresh} sx={{ display: "flex", alignItems: "center" }}>
            <Refresh sx={{ marginRight: 1 }} />
            <Typography>{translate("pages.selectors.list.headerButtons.refresh")}</Typography>
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
        children: translate("pages.selectors.list.headerButtons.create"),
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
              <Box sx={{ mb: "5px" }}>{translate("pages.selectors.list.headerFilterText")}</Box>
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
              label={translate("pages.selectors.list.headerSearchInputLabel")}
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
            <Button type="button" sx={{ flex: 1 }} onClick={handleSearchClick}>{translate("pages.selectors.list.headerSearchInputButton")}</Button>
          </Box>
          <Box sx={{ display: "flex", columnGap: "10px" }}>
            <TextField
              select
              variant="standard"
              label={translate("pages.selectors.list.headerSortInputLabel")}
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
              label={translate("pages.selectors.list.headerSortOrderInputLabel")}
              value={sortOrder}
              sx={{
                "& .MuiInputBase-input": { fontSize: ".875rem" }
              }}
              onChange={handleSortOrderChange}
            >
              <MenuItem value={1}>{translate("pages.selectors.list.headerSortOrder.ascending")}</MenuItem>
              <MenuItem value={-1}>{translate("pages.selectors.list.headerSortOrder.descending")}</MenuItem>
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
            <Typography variant="h6" sx={{ marginTop: "20px" }}>{translate("pages.selectors.list.loadingSelectorList")}</Typography>
            <Typography
              variant="body2"
              sx={{ width: "50%", minWidth: "400px", marginTop: "10px" }}
            >
              {translate("pages.selectors.list.loadingSelectorListMessage")}
            </Typography>
          </Box>
        ) : (
          data && data.data && data?.data.length > 0 ?
            (
              <Grid container spacing={2}>
                {selectors.map((selector) => (
                  <Grid item xs={12} sm={6} md={4} xl={3} key={selector._id}>
                    <SelectorCard selector={selector} canEdit canDelete />
                  </Grid>
                ))}
              </Grid>
            ) :
            (
              <Box sx={{ width: "100%" }}>
                <Box sx={{ width: "50%", textAlign: "center", padding: "50px", margin: "0 auto" }}>
                  <SearchOff sx={{ transform: "scale(3)" }}></SearchOff>
                  <Typography variant="h6" sx={{ mt: "30px" }}>{translate("pages.selectors.list.noElementFound")}</Typography>
                  <Typography variant="body2" sx={{ mt: "5px" }}>{translate("pages.selectors.list.noElementFoundMessage")}</Typography>
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
        <Typography sx={{ flexGrow: 1, flexShrink: 0, padding: "0 20px", textAlign: "center", height: "40px", lineHeight: "40px", verticalAlign: "middle" }} variant="body2">
          {
            translate("pages.selectors.list.footerElementsCount", {
              from: (page - 1) * pageSize + 1,
              to: Math.min(page * pageSize, totalRowCount || 0),
              total: totalRowCount ?? 0
            })
          }
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">{translate("pages.selectors.list.footerElementsShowCount")}</Typography>
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
    </List >
  );
};