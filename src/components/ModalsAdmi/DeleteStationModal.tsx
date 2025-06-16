import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface DeleteStationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteStationModal({
  open,
  onClose,
  onConfirm,
}: DeleteStationModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        ¿Estas seguro/a de eliminar esta estación de combustible?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Esta acción es irreversible.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
