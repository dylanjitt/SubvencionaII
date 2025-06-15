import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { RefObject } from "react"; // Note the 'type' keyword here
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface PdfExportButtonProps {
  chartRef: RefObject<HTMLDivElement | null>; // Allow null
  data: number[];
  title: string;
  filters: {
    fuelFilter: string;
    dateFilter: string;
  };
}

export const PdfExportButton = ({
  chartRef,
  data,
  title,
  filters
}: PdfExportButtonProps) => {
  const exportToPDF = async () => {
    if (!chartRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

    // Add chart image
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    
    // Add data table
    const tableTop = margin + imgHeight + 10;
    
    pdf.setFontSize(12);
    pdf.setTextColor(40);
    pdf.setFont("helvetica", "bold");
    pdf.text("Estación", margin, tableTop);
    pdf.text("Cantidad", margin + 50, tableTop);
    
    pdf.setFont("helvetica", "normal");
    data.forEach((count, index) => {
      const yPos = tableTop + 8 + (index * 8);
      pdf.text(`Station ${index + 1}`, margin, yPos);
      pdf.text(count.toString(), margin + 50, yPos);
    });

    // Add filters info
    const filtersTop = tableTop + data.length * 10 + 15;
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Filters: ${filters.fuelFilter}, ${filters.dateFilter}`, margin, filtersTop);

    pdf.save(`${title.replace(/\s+/g, '_')}_report.pdf`);
  };

  return (
    <Button 
      variant="contained" 
      color="error" 
      onClick={exportToPDF}
      sx={{ ml: 2, justifyContent:'space-between' }}
    >
      <PictureAsPdfIcon sx={{marginRight:1}}/>
      Exportar a PDF
    </Button>
  );
};