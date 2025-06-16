import StationModal from '../StationForm';

interface CreateStationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateStationModal({ open, onClose }: CreateStationModalProps) {
  return (
    <StationModal open={open} onClose={onClose} isEditMode={false} />
  );
}