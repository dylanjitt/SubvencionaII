import { useState, useEffect } from "react";
import { Card, Box, Button, Stack, Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import type { ticketData } from "../../interface/ticketDataInterface";
import CircleChart from "./circle";

interface TicketDataProps {
  tickets: ticketData[];
  title: string;
}

export const FilterByStation = ({ tickets, title }: TicketDataProps) => {
  // baseline counts (all tickets)
  const countsByStation = Array.from({ length: 10 }, (_, i) => {
    const id = (i + 1).toString();
    return tickets.filter((t) => t.gas_station_id === id).length;
  });

  // state for filtered counts
  const [filteredData, setFilteredData] = useState<number[]>(countsByStation);

  // datepicker state
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  // whenever tickets change, reset filters
  useEffect(() => {
    setFilteredData(countsByStation);
  }, [tickets.join("," /** hack: stringify IDs */)]);

  // helper to compare only date-part (ignore time)
  const sameDay = (a: Date, b: Date) =>
    a.toDateString() === b.toDateString();

  // apply single-date filter
  const applySingleDate = () => {
    if (!singleDate) return;
    const dayCounts = Array.from({ length: 10 }, (_, i) => {
      const id = (i + 1).toString();
      return tickets.filter((t) => {
        const d = new Date(t.date);
        return t.gas_station_id === id && sameDay(d, singleDate);
      }).length;
    });
    setFilteredData(dayCounts);
  };

  // apply range filter
  const applyRange = () => {
    if (!rangeStart || !rangeEnd) return;
    const start = rangeStart.setHours(0, 0, 0, 0);
    const end = rangeEnd.setHours(23, 59, 59, 999);
    const rangeCounts = Array.from({ length: 10 }, (_, i) => {
      const id = (i + 1).toString();
      return tickets.filter((t) => {
        const d = new Date(t.date).getTime();
        return (
          t.gas_station_id === id &&
          d >= start &&
          d <= end
        );
      }).length;
    });
    setFilteredData(rangeCounts);
  };

  // filter by fuel type
  const applyFuelFilter = (fuel: string) => {
    const fuelCounts = Array.from({ length: 10 }, (_, i) => {
      const id = (i + 1).toString();
      return tickets.filter(
        (t) =>
          t.gas_station_id === id &&
          t.gas_type.toLowerCase() === fuel.toLowerCase()
      ).length;
    });
    setFilteredData(fuelCounts);
  };

  // restore to baseline
  const restoreAll = () => {
    setFilteredData(countsByStation);
    setSingleDate(null);
    setRangeStart(null);
    setRangeEnd(null);
  };
  const [isSingleDate,setisSingleDate]=useState(true)
  useEffect(()=>{
    console.log('isSingleDate:',isSingleDate)
  },[isSingleDate])

  return (
    <Card sx={{ p: 2 }}>
      <CircleChart tickets={filteredData} title={title} />

      <Box mt={4}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <p>filtrar por rango de fechas</p>
            <Checkbox onClick={()=>setisSingleDate(!isSingleDate)} value={isSingleDate} />
            
            {
            isSingleDate?
            <>
            <DatePicker
              label="Pick a date"
              value={singleDate}
              onChange={(newVal) => setSingleDate(newVal)}
              // restrict between first ticket and today
              minDate={new Date(tickets[0]?.date)}
              maxDate={new Date()}
              slotProps={{ textField: { size: "small" } }}
            />
            <Button
              variant="contained"
              onClick={applySingleDate}
              disabled={!singleDate}
            >
              Filter
            </Button>
            </>:
            <>
            <DatePicker
              label="Start date"
              value={rangeStart}
              onChange={(newVal) => setRangeStart(newVal)}
              minDate={new Date(tickets[0]?.date)}
              maxDate={new Date()}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="End date"
              value={rangeEnd}
              onChange={(newVal) => setRangeEnd(newVal)}
              minDate={new Date(tickets[0]?.date)}
              maxDate={new Date()}
              slotProps={{ textField: { size: "small" } }}
            />
            <Button
              variant="contained"
              onClick={applyRange}
              disabled={!rangeStart || !rangeEnd}
            >
              Filter
            </Button>
            </>
            }            
          </Stack>
        </LocalizationProvider>
      </Box>

      {/* Fuel type buttons + Restore */}
      <Box mt={3} textAlign="center">
        {["gasolina", "diesel", "GNV"].map((fuel) => (
          <Button
            key={fuel}
            sx={{ mx: 1 }}
            onClick={() => applyFuelFilter(fuel)}
          >
            {fuel}
          </Button>
        ))}

        <Button
          sx={{ ml: 2 }}
          color="secondary"
          onClick={restoreAll}
        >
          Restore All
        </Button>
      </Box>
    </Card>
  );
};

// import { Card } from "@mui/material";
// import type { ticketData } from "../../interface/ticketDataInterface";

// import CircleChart from "./circle";

// interface ticketDataProps{
//   tickets:ticketData[],
//   title:string
// }

// export const FilterByStation = ({tickets,title}:ticketDataProps)=>{
  
//   const countsByStation = Array.from({ length: 10 }, (_, i) => {
//     const id = (i + 1).toString();
//     return tickets.filter(t => t.gas_station_id === id).length;
//   });  
//   console.log("tickets:",tickets)
//   let filteredData = countsByStation

//   const singleDateFilterHandler = (date:string)=>{
//     filteredData = Array.from({ length: 10 }, () => {
//       return tickets.filter(t => t.date === date).length;
//     })
//   }

//   const rangeDateFilterHandler = (dateStart:string,dateEnd:string)=>{
//     filteredData = Array.from({ length: 10 }, () => {
//       return tickets.filter(t => t.date > dateStart && t.date < dateEnd).length;
//     })
//   }

//   const fuelTypeFilterHandler = (fuel:string)=>{
//     filteredData = Array.from({ length: 10 }, () => {
//       return tickets.filter(t => t.gas_type === fuel).length;
//     })
//   }

//   const restoreValuesHandler = () => {
//     filteredData = countsByStation
//   }


// return(
// <Card>
//   <CircleChart tickets={filteredData} title={title}/>
// </Card>
//   )
// }

