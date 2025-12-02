import { useState, useEffect } from 'react';
import { MOCK_STOCKS } from '../components/data/mockStocks';

/**
 * Custom hook to get live fluctuating stock data
 * Updates prices and changePercent every minute
 */
export const useLiveStocks = () => {
    const [liveStocks, setLiveStocks] = useState(() => {
        // Initialize with MOCK_STOCKS
        return MOCK_STOCKS.map(stock => ({
            ...stock,
            basePrice: stock.currentPrice / (1 + stock.changePercent / 100), // Calculate base price
        }));
    });

    useEffect(() => {
        // Function to fluctuate stock prices
        const fluctuateStocks = () => {
            console.log('🔄 Fluctuating stock prices...'); // Debug log
            setLiveStocks(prevStocks =>
                prevStocks.map(stock => {
                    // Generate random fluctuation between -0.3% to +0.3% per minute
                    const fluctuation = (Math.random() - 0.5) * 0.6; // -0.3 to +0.3
                    const newChangePercent = parseFloat((stock.changePercent + fluctuation).toFixed(2));

                    // Calculate new price based on base price and new change percent
                    const newPrice = parseFloat((stock.basePrice * (1 + newChangePercent / 100)).toFixed(2));

                    console.log(`📊 ${stock.symbol}: ${stock.currentPrice} → ${newPrice} (${newChangePercent}%)`); // Debug log

                    return {
                        ...stock,
                        currentPrice: newPrice,
                        changePercent: newChangePercent,
                    };
                })
            );
        };

        // Initial fluctuation after 1 second
        const initialTimeout = setTimeout(() => {
            console.log('⏰ Initial fluctuation triggered');
            fluctuateStocks();
        }, 1000);

        // Set interval to fluctuate every minute (60000ms)
        // For testing, let's make it 10 seconds
        const interval = setInterval(() => {
            console.log('⏰ Interval fluctuation triggered');
            fluctuateStocks();
        }, 30000); // 30 seconds

        // Cleanup on unmount
        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    return liveStocks;
};
