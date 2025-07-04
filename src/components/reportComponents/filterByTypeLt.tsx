import {
  Card,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import CircleChart from "./circle";
import { DatePickerCustom } from "./datePicker";
import { PdfExportButton } from "../../utils/PdfExport";
import { CsvExportButton } from "../../utils/CsvExport";
import type { TicketDataProps } from "../../interface/ticketDataProps";
import { useFilterByTypeLt } from "../../hooks/useReportFilters/useFilterByTypeLt";

export const FilterByTypeLt = ({ tickets, title }: TicketDataProps) => {
  
  const {chartRef,filteredData,gasType,singleDate,rangeEnd,rangeStart,setSingleDate,setRangeEnd,setRangeStart,stationFilter,setStationFilter,gasStationNames,restoreAll,getCurrentFilters,filteredticketsExport}=useFilterByTypeLt(tickets)

  return (
    <Card sx={{ p: 2 }}>
      <div ref={chartRef} style={{ position: 'relative' }}>
        <CircleChart tickets={filteredData} title={title} labels={gasType} />
      </div>

      <DatePickerCustom
        singleDate={singleDate}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        setSingleDate={setSingleDate}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        minDate={tickets[0] ? new Date(tickets[0].date) : undefined}
        maxDate={new Date()}
      />

      <Box mt={3} textAlign="center">

        <FormControl size="small" sx={{ minWidth: 160, mr: 2 }}>
          <InputLabel id="station-filter-label">Estación de Servicio</InputLabel>
          <Select
            labelId="station-filter-label"
            value={stationFilter}
            label="Estación de Servicio"
            onChange={(e) => setStationFilter(e.target.value as string)}
          >
            {gasStationNames.map((name) => (
              <MenuItem key={name} value={name === "all" ? "all" : name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <Button variant="outlined" color="secondary" onClick={restoreAll}>
          Reiniciar
        </Button>
      </Box>

      <Box mt={3} textAlign="center">
        <PdfExportButton
          chartRef={chartRef}
          data={filteredData}
          title={title}
          detail="Tipo Combustible"
          labels={gasType}
          filters={getCurrentFilters()}
        />
        <CsvExportButton
          data={filteredticketsExport || []}
          filename={`turnos_por_Cancelacion_export_${new Date().toISOString().slice(0, 10)}`}
        />
      </Box>

    </Card>
  );
};
