import { useState, useEffect } from "react";
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

interface TicketDataProps {
  tickets: ticketData[];
  title: string;
}

export const FilterByStation = ({ tickets, title }: TicketDataProps) => {
  
  const [fuelFilter, setFuelFilter] = useState<"all" | "gasolina" | "diesel" | "GNV">("all");
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  
  const [filteredData, setFilteredData] = useState<number[]>([]);

  
  const countByStation = (list: ticketData[]) =>
    Array.from({ length: 10 }, (_, i) => {
      const id = (i + 1).toString();
      return list.filter((t) => t.gas_station_id === id).length;
    });

  
  useEffect(() => {
    
    let temp = tickets;

    
    if (fuelFilter !== "all") {
      temp = temp.filter((t) => t.gas_type.toLowerCase() === fuelFilter);
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
  }, [tickets, fuelFilter, singleDate, rangeStart, rangeEnd]);

  const restoreAll = () => {
    setFuelFilter("all");
    setSingleDate(null);
    setRangeStart(null);
    setRangeEnd(null);
  };

  return (
    <Card sx={{ p: 2 }}>
      <CircleChart tickets={filteredData} title={title} />


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
          Restore All
        </Button>
      </Box>
    </Card>
  );
};

