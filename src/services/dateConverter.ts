import * as ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// This function processes an XLSX file to convert specific date formats using ExcelJS.
export const convertDatesInXlsx = async (file: File): Promise<Blob> => {
  dayjs.extend(customParseFormat);

  try {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    // Define the date formats to look for and the target format
    const sourceFormats = ['DD MMM YYYY HH:mm', 'YYYY-MM-DD HH:mm'];
    const targetFormat = 'DD/MM/YYYY HH:mm:ss';

    // Iterate over each sheet in the workbook
    workbook.eachSheet((worksheet: ExcelJS.Worksheet) => {
      // Iterate over each cell in the sheet
      worksheet.eachRow({ includeEmpty: true }, (row: ExcelJS.Row) => {
        row.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
          let dateObj;

          // Case 1: Cell is already a date type (ExcelJS handles this well)
          if (cell.type === ExcelJS.ValueType.Date) {
            // cell.value is a JavaScript Date object
            dateObj = dayjs(cell.value as Date);
          }
          // Case 2: Cell is a string that might be a date
          else if (cell.type === ExcelJS.ValueType.String && typeof cell.value === 'string') {
            const cellValue = cell.value.trim();
            for (const format of sourceFormats) {
              const parsedDate = dayjs(cellValue, format, true); // true for strict parsing
              if (parsedDate.isValid()) {
                dateObj = parsedDate;
                break;
              }
            }
          }
          // Case 3: Cell is a number, but might represent a date (Excel's date serial number)
          else if (cell.type === ExcelJS.ValueType.Number && cell.numFmt) {
            // A simple heuristic: if numFmt contains 'y', 'm', or 'd', it's likely a date.
            const nf = cell.numFmt.toLowerCase();
            if (nf.includes('y') || nf.includes('m') || nf.includes('d')) {
                 // ExcelJS usually correctly identifies these as ValueType.Date, but this is a fallback.
                 // The value is an OLE Automation date.
                 const jsDate = new Date(((cell.value as number) - 25569) * 86400 * 1000);
                 if (!isNaN(jsDate.getTime())) {
                    dateObj = dayjs(jsDate);
                 }
            }
          }

          // If a valid date was found, format it and update the cell.
          if (dateObj && dateObj.isValid()) {
            // When changing a cell's value, some style properties like the font can be reset.
            // We explicitly preserve the font object to ensure it's not lost.
            const existingFont = { ...cell.font };
            
            // Set the new value
            cell.value = dateObj.format(targetFormat);
            
            // Re-apply the font if it existed
            if (existingFont) {
              cell.font = existingFont as Partial<ExcelJS.Font>;
            }
            
            // Set the number format to Text ('@') to ensure Excel doesn't
            // try to auto-format our string.
            cell.numFmt = '@';
          }
        });
      });
    });

    // Write the modified workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/octet-stream' });

  } catch (err) {
    console.error("Error processing XLSX file with ExcelJS:", err);
    throw new Error('Failed to process the XLSX file. It might be corrupted or in an unsupported format.');
  }
};
