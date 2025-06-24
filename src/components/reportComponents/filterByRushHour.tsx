import {
  Card,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from "@mui/material";
import { DatePickerCustom } from "./datePicker";
import { PdfExportButton } from "../../utils/PdfExport";
import { CsvExportButton } from "../../utils/CsvExport";
import type { TicketDataProps } from "../../interface/ticketDataProps";
import TimePointChart from "./timeView";
import { useFilterByRushHours } from "../../hooks/useReportFilters/useFilterByRushHour";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const FilterByRushHour= ({ tickets, title }: TicketDataProps) => {
  
  const {chartRef,labels,filteredData,singleDate,rangeStart,rangeEnd,setSingleDate,setRangeStart,setRangeEnd,fuelFilter,setFuelFilter,stationFilter,setStationFilter,gasStationNames,restoreAll,exportedData,exportedLabels,getCurrentFilters,filteredticketsExport } = useFilterByRushHours(tickets)



  return (
    <Card sx={{ p: 2,minWidth:'700px',width:'55vw',maxWidth:"1015px",maxHeight:'600px',height:'40vw',minHeight:'500px' }}>
       <Box sx={{flexDirection:'row-reverse',display:'flex'}} >
        
        <PdfExportButton
          chartRef={chartRef}
          data={exportedData}
          title={title}
          detail="Horarios"
          labels={exportedLabels}
          filters={getCurrentFilters()}
        />
        <CsvExportButton
          data={filteredticketsExport || []}
          filename={`turnos_por_Cancelacion_export_${new Date().toISOString().slice(0, 10)}`}
        />
      </Box>
      <div ref={chartRef} style={{ position: 'relative' }}>
      <TimePointChart labels={labels} dataValues={filteredData} title={title}/>
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