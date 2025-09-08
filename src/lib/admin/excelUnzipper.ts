import JSZip from "jszip";

/**
 * Membongkar file Excel (xlsx) secara manual menggunakan JSZip.
 * Mengembalikan isi file XML mentah dari sheet dan workbook.
 */
export async function unzipExcel(
   file: File
): Promise<{ [key: string]: string }> {
   const zip = await JSZip.loadAsync(file);
   const result: { [key: string]: string } = {};
   // Ambil semua file XML utama (workbook, sheet, sharedStrings, dll)
   for (const filename of Object.keys(zip.files)) {
      if (filename.endsWith(".xml")) {
         result[filename] = await zip.files[filename].async("text");
      }
   }
   return result;
}
