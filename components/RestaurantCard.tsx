
import React from 'react';
import type { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <a
      href={restaurant.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.title}
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
          {restaurant.title}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          點擊查看地圖
        </p>
      </div>
    </a>
  );
};

export default RestaurantCard;
