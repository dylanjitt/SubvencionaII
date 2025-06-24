import {
  Card,
  Box,
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
import { useFilterByStation } from "../../hooks/useReportFilters/useFilterByStation";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const FilterByStation = ({ tickets, title }: TicketDataProps) => {

  const { chartRef, exportedData, exportedLabels, singleDate, rangeEnd, rangeStart, setSingleDate, setRangeEnd, setRangeStart, fuelFilter, setFuelFilter, restoreAll, getCurrentFilters, filteredticketsExport } = useFilterByStation(tickets)

  return (
    <Card sx={{ p: 2, minWidth:'350px',width:'27vw',maxWidth:'500px',maxHeight:'600px',height:'40vw',minHeight:'500px' }}>

      <Box sx={{ flexDirection: 'row-reverse', display: 'flex' }} >
        <PdfExportButton
          chartRef={chartRef}
          data={exportedData}
          title={title}
          detail="Estaciones de Servicio"
          labels={exportedLabels}
          filters={getCurrentFilters()}
        />
        <CsvExportButton
          data={filteredticketsExport || []}
          filename={`turnos_por_Estacion_export_${new Date().toISOString().slice(0, 10)}`}
        />
      </Box>

      <div ref={chartRef} style={{ position: 'relative' }}>
        {/* <CircleChart tickets={filteredData} title={title} labels={gasStationNames}/> */}
        <CircleChart tickets={exportedData} title={title} labels={exportedLabels} />
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

        <IconButton
          onClick={restoreAll}
          color="inherit" // inherit keeps it black unless overridden
        >
          <RestartAltIcon style={{ color: 'black' }} />
        </IconButton>
      </Box>



    </Card>
  );
};

