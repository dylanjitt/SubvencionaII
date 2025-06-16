import { useEffect, useMemo, useRef, useState } from "react";
import type { ticketData } from "../../interface/ticketDataInterface";
import { fetchStationNames } from "../../helper/fetchStationNames";
import { useAuthStore } from "../../store/authStore";

export const useFilterByRushHours =(tickets: ticketData[])=>{
  const [fuelFilter, setFuelFilter] = useState<"all" | "gasolina" | "diesel" | "GNV">("all");
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const [gasStationNames, setGasStationNames] = useState<string[]>([]);
  const [stationFilter, setStationFilter] = useState<string>("all");

  const labels = useMemo(() => {
      const out: string[] = [];
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      for (let i = 0; i < 96; i++) {
        const newdate=new Date(day.getTime() + i * 15 * 60 * 1000);
        const hours = newdate.getHours().toString();
        const minutes = newdate.getMinutes().toString();
        const time = `${(hours==='0'?'00':hours)}:${(minutes==='0'?'00':minutes)}`.toString()
        out.push(time);
      }
      return out;
    }, []);

  const [exportedData,setexportedData]=useState<number[]>([])
  const [exportedLabels,setexportedLabels]=useState<string[]>([])
  
  const chartRef = useRef<HTMLDivElement>(null);

  const [filteredData, setFilteredData] = useState<number[]>([]);
  const [filteredticketsExport, setFilteredticketsExport] = useState<ticketData[] | null>(tickets);

  const { user } = useAuthStore();
  useEffect(() => {
      fetchStationNames(setGasStationNames, user);
    }, [user]);


  const countByHour = (list: ticketData[]) => {
    // array de 96 elementos
    const hourlyCounts = new Array(96).fill(0);
  
    list.forEach(ticket => {
      const date = new Date(ticket.date);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      //intervalo de 15 minutos
      const interval = (hours * 4) + Math.floor(minutes / 15);
      
      // Incrementar conteo para este intervalo
      if (interval >= 0 && interval < 96) {
        hourlyCounts[interval]++;
      }
    });
  
    return hourlyCounts;
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

  //exportar datos que no sean 0 para el PDF
  useEffect(() => {
    
    const nonZeroData: number[] = [];
    const nonZeroLabels: string[] = [];
    
    filteredData.forEach((count, index) => {
      if (count > 0) {
        nonZeroData.push(count);
        nonZeroLabels.push(labels[index]);
      }
    });
    
    setexportedData(nonZeroData);
    setexportedLabels(nonZeroLabels);
  }, [filteredData, labels]);

  return {chartRef,labels,filteredData,singleDate,rangeStart,rangeEnd,setSingleDate,setRangeStart,setRangeEnd,fuelFilter,setFuelFilter,stationFilter,setStationFilter,gasStationNames,restoreAll,exportedData,exportedLabels,getCurrentFilters,filteredticketsExport }
}