import { useState, useEffect } from 'react';
import jsonServerInstance from '../api/jsonServerInstance';

export const useGasStations = () => {
    const [stations, setStations] = useState<any[]>([]);
    const [filteredStations, setFilteredStations] = useState<any[]>([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [selectedStation, setSelectedStation] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [zones, setZones] = useState<string[]>([]);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await jsonServerInstance.get('/gasStations');
                setStations(response.data);
                setFilteredStations(response.data);
            } catch (error) {
                console.error('Error fetching gas stations:', error);
                setStations([]);
                setFilteredStations([]);
            }
        };
        const fetchZones = async () => {
            try {
                const response = await jsonServerInstance.get('/zones');
                setZones(response.data.map((zone: any) => zone.name));
            } catch (error) {
                console.error('Error fetching zones:', error);
            }
        };
        fetchZones();
        fetchStations();
    }, []);

    const handleZoneChange = (zone: string) => {
        setSelectedZone(zone);
        if (zone) {
            setFilteredStations(stations.filter(station => station.zone === zone));
        } else {
            setFilteredStations(stations);
        }
    };

    const handleOpenModal = (station: any) => {
        setSelectedStation(station);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedStation(null);
    };

    return {
        stations,
        filteredStations,
        selectedZone,
        selectedStation,
        open,
        zones,
        handleZoneChange,
        handleOpenModal,
        handleCloseModal,
    };
};