
import React, { useState, useCallback } from 'react';
import { geminiService } from './services/geminiService';
import type { Restaurant } from './types';
import RestaurantCard from './components/RestaurantCard';
import LoadingSpinner from './components/icons/LoadingSpinner';

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleFindRestaurants = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRestaurants([]);
    setStatusMessage('正在取得您的位置...');

    if (!navigator.geolocation) {
      setError('您的瀏覽器不支援地理位置功能。');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatusMessage('太棒了！正在為您尋找附近的餐廳...');
        
        try {
          const fetchedRestaurants = await geminiService.getRestaurants({ latitude, longitude });
          if(fetchedRestaurants.length === 0) {
            setError("抱歉，附近找不到推薦的餐廳。");
          } else {
            setRestaurants(fetchedRestaurants);
          }
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : '發生未知錯誤。');
        } finally {
          setIsLoading(false);
          setStatusMessage('');
        }
      },
      (geoError) => {
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError('您拒絕了位置存取權限。請在瀏覽器設定中啟用它。');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('無法取得您的位置資訊。');
            break;
          case geoError.TIMEOUT:
            setError('取得位置資訊超時。');
            break;
          default:
            setError('取得位置時發生未知錯誤。');
            break;
        }
        setIsLoading(false);
        setStatusMessage('');
      }
    );
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <LoadingSpinner />
          <p className="text-lg text-cyan-300">{statusMessage}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">發生錯誤</h3>
          <p>{error}</p>
        </div>
      );
    }
    
    if (restaurants.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((resto) => (
            <RestaurantCard key={resto.uri} restaurant={resto} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            晚餐吃甚麼？
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl">
            不知道晚餐該吃什麼嗎？讓我根據您目前的位置為您推薦附近的優質餐廳！
          </p>
        </header>

        {!isLoading && restaurants.length === 0 && (
          <div className="w-full flex justify-center mt-4 mb-12">
            <button
              onClick={handleFindRestaurants}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              幫我推薦！
            </button>
          </div>
        )}
        
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
