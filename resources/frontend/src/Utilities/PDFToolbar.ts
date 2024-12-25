import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';

export const createToolbarPluginInstance = () => {
    return toolbarPlugin({
        searchPlugin: {
            keyword: 'PDF'
        },
        selectionModePlugin: {
            selectionMode: SelectionMode.Hand
        },
        fullScreenPlugin: {
            enableShortcuts: true
        },
    });
};
