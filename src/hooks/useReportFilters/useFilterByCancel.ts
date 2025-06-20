import { useEffect, useRef, useState } from "react";
import type { ticketData } from "../../interface/ticketDataInterface";
import { fetchStationNames } from "../../helper/fetchStationNames";
import { useAuthStore } from "../../store/authStore";

export const useFilterByCancel =(tickets: ticketData[])=>{
  const [fuelFilter, setFuelFilter] = useState<"all" | "gasolina" | "diesel" | "GNV">("all");
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const [gasStationNames, setGasStationNames] = useState<string[]>([])
  const [stationFilter, setStationFilter] = useState<string>("all");

  const ticketState = ["Pendiente", "Reservado", "Notificado", "EnTurno", "Realizado", "Cancelado"]

  const chartRef = useRef<HTMLDivElement>(null);

  const [filteredData, setFilteredData] = useState<number[]>([]);
  const [filteredticketsExport, setFilteredticketsExport] = useState<ticketData[] | null>(tickets)

  const { user } = useAuthStore();

  useEffect(() => {
    fetchStationNames(setGasStationNames, user);
  }, [user]);



  const countByTicketState = (list: ticketData[]) => {

    return ticketState.map(state => {
      return list.filter(ticket =>
        ticket.ticketState === state
      ).length
    })
  };

  useEffect(() => {

    let temp = tickets;
    

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

    setFilteredData(countByTicketState(temp));
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
      stationFilter: stationFilter === "all" ? "All Gas Stations" : `Station: ${stationFilter}`,
    };
  };

  return {chartRef,filteredData,ticketState,singleDate,rangeEnd,rangeStart,setSingleDate,setRangeEnd,setRangeStart,fuelFilter,setFuelFilter,stationFilter,setStationFilter,restoreAll,gasStationNames,getCurrentFilters,filteredticketsExport}
}