import { useSnackbar, type VariantType } from "notistack";

export const useSnackbarEnqueue = () => {

  const { enqueueSnackbar } = useSnackbar();

  const enqueueAlertVariant = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, { variant });
  };

  return {enqueueAlertVariant}
}