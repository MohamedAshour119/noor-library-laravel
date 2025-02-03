import { useState, useEffect } from 'react';

export function useDarkMode() {
    // Initialize state based on whether the <html> element has the "dark" class.
    const [isDarkMode, setIsDarkMode] = useState(() =>
        document.documentElement.classList.contains('dark')
    );

    useEffect(() => {
        // Create a MutationObserver to watch for class attribute changes on the <html> element
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.attributeName === 'class') {
                    setIsDarkMode(document.documentElement.classList.contains('dark'));
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true });

        // Clean up the observer when the component unmounts
        return () => {
            observer.disconnect();
        };
    }, []);

    return isDarkMode;
}
