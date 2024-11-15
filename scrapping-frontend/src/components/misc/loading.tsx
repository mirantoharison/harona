import { SearchOff } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";

export const Loading: React.FC<any> = ({
  loadingTitle,
  loadingMessage
}) => {
  return (
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
      <Typography variant="h6" sx={{ marginTop: "20px" }}>{loadingTitle}</Typography>
      <Typography
        variant="body2"
        sx={{ marginTop: "10px" }}
      >{loadingMessage}</Typography>
    </Box>
  );
} 

export const NoElement: React.FC<any> = ({
  noelementTitle,
  noelementMessage,
}) => {
  return (
    <Box sx={{
      maxWidth: "500px",
      margin: "0 auto",
      width: "100%"
    }}>
      <Box sx={{ textAlign: "center", padding: "50px", margin: "0 auto" }}>
        <SearchOff sx={{ transform: "scale(3)" }}></SearchOff>
        <Typography variant="h6" sx={{ mt: "30px" }}>{noelementTitle}</Typography>
        <Typography variant="body2" sx={{ mt: "5px" }}>{noelementMessage}</Typography>
      </Box>
    </Box>
  );
}