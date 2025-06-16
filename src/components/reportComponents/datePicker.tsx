import { Box,Stack,Switch,FormControlLabel } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

interface DatePickerProps {
  singleDate: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  setSingleDate: (d: Date | null) => void;
  setRangeStart: (d: Date | null) => void;
  setRangeEnd: (d: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePickerCustom = ({
  singleDate,
  rangeStart,
  rangeEnd,
  setSingleDate,
  setRangeStart,
  setRangeEnd,
  minDate,
  maxDate
}: DatePickerProps) => {
  const [isSingleDate, setIsSingleDate] = useState(true);

  return (
    <Box mt={4}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <FormControlLabel
            control={
              <Switch
                checked={!isSingleDate}
                onChange={() => setIsSingleDate((prev) => !prev)}
                color="primary"
              />
            }
            label={"Rango de fechas"}
            labelPlacement="start"
          />

          {isSingleDate ? (
            <>
              <DatePicker
                label="Seleccione una fecha"
                value={singleDate}
                onChange={setSingleDate}
                minDate={minDate}
                maxDate={maxDate}
                sx={{width:315}}
                slotProps={{ textField: { size: "small" } }}
              />
            </>
          ) : (
            <>
              <DatePicker
                label="Fecha Inicial"
                value={rangeStart}
                onChange={setRangeStart}
                minDate={minDate}
                maxDate={maxDate}
                sx={{width:150}}
                slotProps={{ textField: { size: "small" } }}
              />
              <DatePicker
                label="Fecha Final"
                value={rangeEnd}
                onChange={setRangeEnd}
                minDate={minDate}
                maxDate={maxDate}
                sx={{width:150}}
                slotProps={{ textField: { size: "small" } }}
              />
            </>
          )}
        </Stack>
      </LocalizationProvider>
    </Box>
  );
};
