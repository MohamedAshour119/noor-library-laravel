import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {FaLongArrowAltLeft, FaLongArrowAltRight} from "react-icons/fa";

// Set the PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url,).toString();
interface Props {
    pdf_file: string; // Path to the PDF file
}

const PdfPreview: React.FC<Props> = ({ pdf_file }: Props) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // On document load success, set the number of pages
    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
    };
    const goToPage = (pageNum: number) => {
        setCurrentPage(pageNum);
    };

    return (
        <div className="relative min-h-[500px] min-w-[600px]">
            <Document
                file={pdf_file}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {/* Render the current page */}
                <div className="overflow-auto max-h-[500px]">
                    <Page
                        pageNumber={currentPage}
                        width={600} // Adjust width as needed
                        className="page"
                    />
                </div>
            </Document>

            {/* Page navigation buttons */}
            <div className="flex justify-between mt-4 px-4 pb-4">
                <button
                    onClick={() => currentPage > 1 && goToPage(currentPage - 1)} // Prevent going below 1
                    disabled={currentPage <= 1}
                    className="px-4 py-2 bg-main_color text-white rounded disabled:bg-gray-300"
                >
                    <FaLongArrowAltLeft />
                </button>

                {/* Display current page number */}
                <div className={`border px-4 flex items-center justify-center rounded-full`}>Page {currentPage} of {numPages}</div>

                <button
                    onClick={() => currentPage < (numPages || 1) && goToPage(currentPage + 1)} // Prevent going beyond numPages
                    disabled={currentPage >= (numPages || 1)}
                    className="px-4 py-2 bg-main_color text-white rounded disabled:bg-gray-400"
                >
                    <FaLongArrowAltRight />
                </button>
            </div>
        </div>
    );
};

export default PdfPreview;
