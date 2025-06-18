import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { RefObject } from "react"; // Note the 'type' keyword here
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface PdfExportButtonProps {
  chartRef: RefObject<HTMLDivElement | null>; // Allow null
  data: number[];
  labels:string[];
  detail:string;
  title: string;
  filters: {
    fuelFilter?: string;
    stationFilter?:string;
    dateFilter: string;
  };
}

export const PdfExportButton = ({
  chartRef,
  data,
  labels,
  detail,
  title,
  filters
}: PdfExportButtonProps) => {
  const exportToPDF = async () => {
    if (!chartRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

    // Add chart image
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    
    
    const tableTop = margin + imgHeight + (data.length>30?10:2);
    
    pdf.setFontSize(12);
    pdf.setTextColor(40);
    pdf.setFont("helvetica", "bold");

    if (data.length > 30) {
      const third = Math.ceil(data.length / 3);
      const column2X = margin + 60;
      const column3X = margin + 120;
      
      // Column 1
      pdf.text(detail, margin, tableTop);
      pdf.text("Cantidad", margin + 20, tableTop);
      for (let i = 0; i < third; i++) {
        const yPos = tableTop + 8 + (i * 8);
        pdf.setFont("helvetica", "normal");
        pdf.text(labels[i], margin, yPos);
        pdf.text(data[i].toString(), margin + 20, yPos);
      }
      
      // Column 2
      pdf.setFont("helvetica", "bold");
      pdf.text(detail, column2X, tableTop);
      pdf.text("Cantidad", column2X + 20, tableTop);
      for (let i = third; i < third * 2; i++) {
        if (i >= data.length) break;
        const yPos = tableTop + 8 + ((i - third) * 8);
        pdf.setFont("helvetica", "normal");
        pdf.text(labels[i], column2X, yPos);
        pdf.text(data[i].toString(), column2X + 20, yPos);
      }
      
      // Column 3
      pdf.setFont("helvetica", "bold");
      pdf.text(detail, column3X, tableTop);
      pdf.text("Cantidad", column3X + 20, tableTop);
      for (let i = third * 2; i < data.length; i++) {
        const yPos = tableTop + 8 + ((i - third * 2) * 8);
        pdf.setFont("helvetica", "normal");
        pdf.text(labels[i], column3X, yPos);
        pdf.text(data[i].toString(), column3X + 20, yPos);
      }
    } 
    // Si hay mas de 6 items mostramos en 2 columnas
    else if (data.length > 6) {
      const half = Math.ceil(data.length / 2);
      const column2X = margin + 80; 
      
      // Columna 1
      pdf.text(detail,margin, tableTop);
      pdf.text("Cantidad", margin + 50, tableTop);
      for (let i = 0; i < half; i++) {
        const yPos = tableTop + 8 + (i * 8);
        pdf.setFont("helvetica", "normal");
        pdf.text(labels[i], margin, yPos);
        pdf.text(data[i].toString(), margin + 50, yPos);
      }
      
      // Columna 2
      pdf.setFont("helvetica", "bold");
      pdf.text(detail,column2X, tableTop);
      pdf.text("Cantidad", column2X + 50, tableTop);
      for (let i = half; i < data.length; i++) {
        const yPos = tableTop + 8 + ((i - half) * 8);
        pdf.setFont("helvetica", "normal");
        pdf.text(labels[i], column2X, yPos);
        pdf.text(data[i].toString(), column2X + 50, yPos);
      }
    } else {
      // 1 sola columna
      pdf.text(detail,margin, tableTop);
      pdf.text("Cantidad", margin + 50, tableTop);
      data.forEach((count, index) => {
        const yPos = tableTop + 8 + (index * 8);
        pdf.setFont("helvetica", "normal");
        pdf.text(labels[index], margin, yPos);
        pdf.text(count.toString(), margin + 50, yPos);
      });
    }

    //Mostrar los filtros usados
    const filtersY = tableTop + (data.length > 6 ? 
      (Math.ceil(data.length / 2) * 8 + 10) : data.length * 8 + 10);
      
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Filtros: ${filters.fuelFilter?filters.fuelFilter+',':''} ${filters.dateFilter}${filters.stationFilter?', '+filters.stationFilter:''}`, margin, filtersY);

    pdf.save(`${title.replace(/\s+/g, '_')}_report.pdf`);
  };

  return (
    <Button 
      variant="contained" 
      color="error" 
      onClick={exportToPDF}
      sx={{ ml: 2, justifyContent: 'center',width:'200px',margin:1 }}
    >
      <PictureAsPdfIcon sx={{ marginRight: 1 }} />
      Exportar a PDF
    </Button>
  );
};