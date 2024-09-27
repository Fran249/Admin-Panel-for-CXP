import { Alert, Snackbar } from '@mui/material'


type Props = {
    openSnackbar: boolean
    message: null | string
    handleCloseSnackbar: () => void
    severity: "success" | "info" | "warning" | "error",
}

export const SnackBar = ({openSnackbar , message, handleCloseSnackbar, severity}: Props) => {
  return (
    <Snackbar
    color="white"
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    autoHideDuration={3000}
    open={openSnackbar}
    onClose={handleCloseSnackbar}
  >
    <Alert
      onClose={handleCloseSnackbar}
      severity={severity}
      sx={{ bgcolor: "white", color: "black" }}
    >
      {message}
    </Alert>
  </Snackbar>
  )
}