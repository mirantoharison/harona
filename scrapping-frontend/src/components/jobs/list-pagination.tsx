import { Box, Typography, Select, MenuItem, Pagination, SelectChangeEvent } from "@mui/material";

export const JobPagination: React.FC<any> = ({
  page,
  pageSize,
  totalRowCount,
  setPage,
  setPageSize,

  textElementCountIndicator,
  textElementShownIndicator
}) => {
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

  return (
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
        {textElementCountIndicator}
      </Typography>
      <Box sx={{
        display: "flex",
        alignItems: "center"
      }}>
        <Typography variant="body2">{textElementShownIndicator}</Typography>
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
  );
}