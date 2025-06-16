import { useState, useEffect, useRef, useMemo } from "react";
import {
  Card,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import type { ticketData } from "../../interface/ticketDataInterface";
import { DatePickerCustom } from "./datePicker";
import { PdfExportButton } from "../../utils/PdfExport";
import { CsvExportButton } from "../../utils/CsvExport";
import { getGasStations } from "../../services/gasStationsService";
import type { TicketDataProps } from "../../interface/ticketDataProps";
import TimePointChart from "./timeView";

export const FilterByRushHour= ({ tickets, title }: TicketDataProps) => {

  const [fuelFilter, setFuelFilter] = useState<"all" | "gasolina" | "diesel" | "GNV">("all");
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const [gasStationNames, setGasStationNames] = useState<string[]>([]);
  const [stationFilter, setStationFilter] = useState<string>("all");

  // const ticketState = ["Pendiente", "Reservado", "Notificado", "EnTurno", "Realizado", "Cancelado"];
  const labels = useMemo(() => {
      const out: string[] = [];
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      for (let i = 0; i < 96; i++) {
        const newdate=new Date(day.getTime() + i * 15 * 60 * 1000);
        const hours = newdate.getHours().toString();
        const minutes = newdate.getMinutes().toString();
        const time = `${(hours==='0'?'00':hours)}:${(minutes==='0'?'00':minutes)}`.toString()

        console.log('time:',time)
        out.push(time);
      }
      return out;
    }, []);

  const chartRef = useRef<HTMLDivElement>(null);

  const [filteredData, setFilteredData] = useState<number[]>([]);
  const [filteredticketsExport, setFilteredticketsExport] = useState<ticketData[] | null>(tickets);

  useEffect(() => {
    const fetchStationNames = async () => {  
      try {
        const stations = await getGasStations();

        const names = ["all", ...stations.map((station: any) => station.name)];
        setGasStationNames(names);
      } catch (error) {
        console.error('Error fetching station names:', error);
        setGasStationNames([]);
      }
    };
    fetchStationNames();
  }, []);


  const countByHour = (list: ticketData[]) => {
    // Create array of 96 elements (15-minute intervals) initialized to 0
    const hourlyCounts = new Array(96).fill(0);
  
    list.forEach(ticket => {
      const date = new Date(ticket.date);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      // Calculate which 15-minute interval this belongs to (0-95)
      const interval = (hours * 4) + Math.floor(minutes / 15);
      
      // Increment count for this interval
      if (interval >= 0 && interval < 96) {
        hourlyCounts[interval]++;
      }
    });
  
    return hourlyCounts;
  };

  useEffect(() => {

    let temp = tickets;
    console.log('temp', temp)

    if (fuelFilter !== "all") {
      temp = temp.filter((t) => t.gasType === fuelFilter);
    }

    if (stationFilter !== "all") {
      temp = temp.filter((t) => t.gasStationName === stationFilter);
    }

    if (singleDate) {
      temp = temp.filter((t) => {
        const d = new Date(t.date);
        return d.toDateString() === singleDate.toDateString();
      });
    } else if (rangeStart && rangeEnd) {
      const startTs = rangeStart.setHours(0, 0, 0, 0);
      const endTs = rangeEnd.setHours(23, 59, 59, 999);
      temp = temp.filter((t) => {
        const ts = new Date(t.date).getTime();
        return ts >= startTs && ts <= endTs;
      });
    }

    setFilteredData(countByHour(temp));
    setFilteredticketsExport(temp)
    
  }, [tickets, fuelFilter, stationFilter, singleDate, rangeStart, rangeEnd]);

  const restoreAll = () => {
    setFuelFilter("all");
    setStationFilter("all");
    setSingleDate(null);
    setRangeStart(null);
    setRangeEnd(null);
  };

  const getCurrentFilters = () => {
    let dateFilter = "";
    if (singleDate) {
      dateFilter = `Date: ${singleDate.toLocaleDateString()}`;
    } else if (rangeStart && rangeEnd) {
      dateFilter = `Range: ${rangeStart.toLocaleDateString()} to ${rangeEnd.toLocaleDateString()}`;
    } else {
      dateFilter = "All dates";
    }

    return {
      fuelFilter: fuelFilter === "all" ? "All fuels" : `Fuel: ${fuelFilter}`,
      dateFilter,
      stationFilter: stationFilter === "all" ? "All Gas Stations" : `Station: ${fuelFilter}`,
    };
  };

  //const randomDataset = Array.from({ length: 96 }, () => Math.floor(Math.random() * 201));

  return (
    <Card sx={{ p: 2 }}>
      <div ref={chartRef} style={{ position: 'relative' }}>
      <TimePointChart dataValues={filteredData} title={title}/>
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


        <Button variant="outlined" color="secondary" onClick={restoreAll}>
          Reiniciar
        </Button>
      </Box>

      <Box mt={3} textAlign="center">
        <PdfExportButton
          chartRef={chartRef}
          data={filteredData}
          title={title}
          detail="Horarios"
          labels={labels}
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