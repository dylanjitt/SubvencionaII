import { useEffect, useRef, useState } from "react";
import type { ticketData } from "../../interface/ticketDataInterface";
import { useAuthStore } from "../../store/authStore";
import { fetchStationNames } from "../../helper/fetchStationNames";

export const useFilterByTypeLt =(tickets: ticketData[])=>{
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const [gasStationNames, setGasStationNames] = useState<string[]>([])
  const [stationFilter, setStationFilter] = useState<string>("all");

  const gasType = ["Especial" , "Diesel" , "GNV"]

  const chartRef = useRef<HTMLDivElement>(null);

  const [filteredData, setFilteredData] = useState<number[]>([]);
  const [filteredticketsExport, setFilteredticketsExport] = useState<ticketData[] | null>(tickets)

  const { user } = useAuthStore();
    useEffect(() => {
        fetchStationNames(setGasStationNames, user);
      }, [user]);


  const sumByType = (list: ticketData[]) => {

    return gasType.map(state => {
      const typeTicks= list.filter(ticket =>
        ticket.gasType === state
      )
      const total=typeTicks.reduce((sum,ticket)=>sum+ticket.quantity,0)
      return parseFloat(total.toFixed(2))
    })
  };

  useEffect(() => {

    let temp = tickets;


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

    setFilteredData(sumByType(temp));
    setFilteredticketsExport(temp)

  }, [tickets,  stationFilter, singleDate, rangeStart, rangeEnd]);

  const restoreAll = () => {
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
      dateFilter,
      stationFilter: stationFilter === "all" ? "All Gas Stations" : `Station: ${stationFilter}`,
    };
  };

  return{chartRef,filteredData,gasType,singleDate,rangeEnd,rangeStart,setSingleDate,setRangeEnd,setRangeStart,stationFilter,setStationFilter,gasStationNames,restoreAll,getCurrentFilters,filteredticketsExport}
}