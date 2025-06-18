import { Button } from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
interface CsvExportButtonProps {
  data: any[];
  filename: string;
}

export const CsvExportButton = ({ data, filename }: CsvExportButtonProps) => {
  const exportToCsv = () => {
    if (!data || data.length === 0) return;

    // CSV header
    const headers = Object.keys(data[0]).join(",") + "\n";
    
    // CSV rows
    const rows = data.map(item => 
      Object.values(item).map(value => {
        // Handle nested objects
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        // Escape quotes in strings
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    ).join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      variant="contained" 
      color="success" 
      onClick={exportToCsv}
      sx={{ ml: 2, justifyContent: 'center', width:'200px',margin:1 }}
    >
      <TableChartIcon sx={{marginRight:1}}/>

      Export to CSV
    </Button>
  );
};