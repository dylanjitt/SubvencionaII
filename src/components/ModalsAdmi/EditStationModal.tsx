import StationModal from '../StationForm';
import type { GasStation } from "../../interface/GasStation";

interface EditStationModalProps {
  open: boolean;
  onClose: () => void;
  station: GasStation;
}

export default function EditStationModal({ open, onClose, station }: EditStationModalProps) {
  return (
    <StationModal open={open} onClose={onClose} station={station} isEditMode={true} />
  );
}