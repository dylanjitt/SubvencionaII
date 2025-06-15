import { useState, useEffect, useRef } from "react";
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
import CircleChart from "./circle";
import { DatePickerCustom } from "./datePicker";
import { PdfExportButton } from "../../utils/PdfExport";
import { CsvExportButton } from "../../utils/CsvExport";
import { getGasStations } from "../../services/gasStationsService";
interface TicketDataProps {
  tickets: ticketData[];
  title: string;
}

export const FilterByStation = ({ tickets, title }: TicketDataProps) => {

  const [fuelFilter, setFuelFilter] = useState<"all" | "gasolina" | "diesel" | "GNV">("all");
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  
  const [gasStationNames,setGasStationNames]=useState<string[]|null>(null)

  const chartRef = useRef<HTMLDivElement>(null);

  const [filteredData, setFilteredData] = useState<number[]>([]);
  const [filteredticketsExport, setFilteredticketsExport] = useState<ticketData[] | null>(tickets)

  useEffect(() => {
    const fetchStationNames = async () => {
      try {
        const stations = await retrieveStationnames();
        
        const names = stations.map((station:any) => station.name);
        setGasStationNames(names);
        console.log('names',names)
      } catch (error) {
        console.error('Error fetching station names:', error);
        setGasStationNames([]);
      }
    };

    fetchStationNames();
  }, []);

  const retrieveStationnames = async () => {
    try {
      const response = await getGasStations();
      return response; // This should be your array of objects
    } catch (error) {
      console.error('Error in retrieveStationnames:', error);
      return [];
    }
  };

  const countByStation = (list: ticketData[]) =>{
    if (!gasStationNames || gasStationNames.length === 0) {
      return []; // Return empty array if no station names are loaded
    }
    return gasStationNames?.map(stationName=>{
      return list.filter(ticket=>
        ticket.gasStationName===stationName 
      ).length
    })
    };

  useEffect(() => {

    let temp = tickets;
    console.log('temp',temp)

    if (fuelFilter !== "all") {
      temp = temp.filter((t) => t.gasType.toLowerCase() === fuelFilter);
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

    setFilteredData(countByStation(temp));
    setFilteredticketsExport(temp)
    console.log('filtered:',filteredData)
  }, [tickets, fuelFilter, singleDate, rangeStart, rangeEnd]);

  const restoreAll = () => {
    setFuelFilter("all");
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
      dateFilter
    };
  };

  return (
    <Card sx={{ p: 2 }}>
      <div ref={chartRef} style={{ position: 'relative' }}>
        <CircleChart tickets={filteredData} title={title} />
      </div>
      {/* <CircleChart tickets={filteredData} title={title} /> */}


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
            <MenuItem value="gasolina">Gasolina</MenuItem>
            <MenuItem value="diesel">Diesel</MenuItem>
            <MenuItem value="GNV">GNV</MenuItem>
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
          filters={getCurrentFilters()}
        />
        <CsvExportButton
          data={filteredticketsExport || []}
          filename={`tickets_export_${new Date().toISOString().slice(0, 10)}`}
        />
      </Box>

    </Card>
  );
};

