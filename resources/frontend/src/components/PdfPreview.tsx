import {Viewer, Worker} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { createToolbarPluginInstance } from '../Utilities/PDFToolbar.ts';

interface Props {
    pdf_file: string; // Path to the PDF file
}

const PdfPreview: React.FC<Props> = ({ pdf_file }: Props) => {
    const toolbarPluginInstance = createToolbarPluginInstance();
    const { Toolbar } = toolbarPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div className="max-h-[500px] overflow-y-hidden w-full">
                <Toolbar />
                <Viewer
                    fileUrl={pdf_file}
                    plugins={[
                        toolbarPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default PdfPreview;
