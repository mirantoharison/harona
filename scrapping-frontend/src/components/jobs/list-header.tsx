import { List, Search } from "@mui/icons-material";
import { Box, Button, MenuItem, TextField, InputAdornment } from "@mui/material";
import { useEffect, useRef } from "react";
import { useTranslation } from "@refinedev/core";

import { SortFilterArray } from "../../interfaces/jobs";

export const JobHeader: React.FC<any> = ({
  search,
  setPage,
  setSearch,
  handleRefresh,

  sort,
  sortOrder,
  setSort,
  setSortOrder,

  filterArray
}) => {
  const { translate } = useTranslation();

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchClick = async () => {
    if (searchInputRef.current) {
      if (search !== searchInputRef.current.value) {
        if(setPage) setPage(1);
        await setSearch(searchInputRef.current.value);
        await handleRefresh();
      }
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value);
  }
  const handleSortOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(Number(event.target.value));
  }

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [search]);

  return (
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
        {filterArray ?
          (
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
              {filterArray.map((option: SortFilterArray) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : null
        }
        {sort && setSort ?
          (
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
          ) : null
        }
      </Box>
    </Box>
  );
}