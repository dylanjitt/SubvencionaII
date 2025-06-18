import {
  Card,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from "@mui/material";
import CircleChart from "./circle";
import { DatePickerCustom } from "./datePicker";
import { PdfExportButton } from "../../utils/PdfExport";
import { CsvExportButton } from "../../utils/CsvExport";
import type { TicketDataProps } from "../../interface/ticketDataProps";
import { useFilterByCancel } from "../../hooks/useReportFilters/useFilterByCancel";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const FilterByCancel = ({ tickets, title }: TicketDataProps) => {

  const { chartRef, filteredData, ticketState, singleDate, rangeEnd, rangeStart, setSingleDate, setRangeEnd, setRangeStart, fuelFilter, setFuelFilter, stationFilter, setStationFilter, restoreAll, gasStationNames, getCurrentFilters, filteredticketsExport } = useFilterByCancel(tickets)

  return (
    <Card sx={{ p: 2, width:'100%',alignItems:'center',justifyContent:'center',display:'flex',flexDirection:'column' }}>
      <div ref={chartRef} style={{ position: 'relative' }}>
        <CircleChart tickets={filteredData} title={title} labels={ticketState} />
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
        <FormControl size="small" sx={{ minWidth: 100, mr: 2 }}>
          <InputLabel id="fuel-filter-label">Tipo de Combustible</InputLabel>
          <Select
            labelId="fuel-filter-label"
            value={fuelFilter}
            label="Tipo de Combustible"
            onChange={(e) => setFuelFilter(e.target.value as any)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="Especial">Gasolina</MenuItem>
            <MenuItem value="Diesel">Diesel</MenuItem>
            <MenuItem value="GNV">GNV</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100, mr: 2 }}>
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


        <IconButton
          onClick={restoreAll}
          color="inherit" // inherit keeps it black unless overridden
        >
          <RestartAltIcon style={{ color: 'black' }} />
        </IconButton>
      </Box>

      <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}  mt={1} textAlign="center">
        <PdfExportButton
          chartRef={chartRef}
          data={filteredData}
          title={title}
          detail="Estado Ticket"
          labels={ticketState}
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

