import { useEffect, useRef, useState } from "react";
import type { ticketData } from "../../interface/ticketDataInterface";
import { getGasStations } from "../../services/gasStationsService";

export const useFilterByStation =(tickets: ticketData[])=>{
  const [fuelFilter, setFuelFilter] = useState<"all" | "gasolina" | "diesel" | "GNV">("all");
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  
  const [gasStationNames,setGasStationNames]=useState<string[]>([])

  const chartRef = useRef<HTMLDivElement>(null);

  const [filteredData, setFilteredData] = useState<number[]>([]);
  const [filteredticketsExport, setFilteredticketsExport] = useState<ticketData[] | null>(tickets)

  const [exportedData,setexportedData]=useState<number[]>([])
  const [exportedLabels,setexportedLabels]=useState<string[]>([])
  

  useEffect(() => {
    const fetchStationNames = async () => {
      try {
        const stations = await getGasStations();
        
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


  const countByStation = (list: ticketData[]) =>{
    if (!gasStationNames || gasStationNames.length === 0) {
      return []; // Return empty array if no station names are loaded
    }
    return gasStationNames.map(stationName=>{
      return list.filter(ticket=>
        ticket.gasStationName===stationName 
      ).length
    })
    };

  useEffect(() => {

    let temp = tickets;
    console.log('temp',temp)

    if (fuelFilter !== "all") {
      temp = temp.filter((t) => t.gasType === fuelFilter);
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

  useEffect(() => {
    
    const nonZeroData: number[] = [];
    const nonZeroLabels: string[] = [];
    
    filteredData.forEach((count, index) => {
      if (count > 0) {
        nonZeroData.push(count);
        nonZeroLabels.push(gasStationNames[index]);
      }
    });
    
    setexportedData(nonZeroData);
    setexportedLabels(nonZeroLabels);
  }, [filteredData, gasStationNames]);

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

  return {chartRef,exportedData,exportedLabels,singleDate,rangeEnd,rangeStart,setSingleDate,setRangeEnd,setRangeStart,fuelFilter,setFuelFilter,restoreAll,getCurrentFilters,filteredticketsExport}
}
