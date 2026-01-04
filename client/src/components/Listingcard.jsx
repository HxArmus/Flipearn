import React from "react";
import { platformIcons } from "../assets/assets";
import { BadgeCheck, Currency, LineChart, MapPin, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY  || 'USD';
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ml-2">

      {/* Featured Banner */}
      {listing.featured && (
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold text-center py-1 uppercase z-10">
          Featured
        </div>
      )}

      <div className="p-5 pt-8">

        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Platform Icon */}
          <div className="flex-shrink-0">
            {platformIcons[listing.platform]}
          </div>

          {/* Title + Username */}
          <div className="flex-grow">
            <h2 className="font-semibold text-gray-900">
              {listing.title}
            </h2>
            <p className="text-sm text-gray-600">
              @{listing.username} –{" "}
              <span className="capitalize">{listing.platform}</span>
            </p>
          </div>

          {/* Verified */}
          {listing.verified && (
            <BadgeCheck className="w-5 h-5 text-green-500" />
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4">
          {/* Followers */}
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-5 h-5 mr-1 text-gray-400" />
            <span className="font-medium text-gray-800 mr-1">
              {listing.followers_count.toLocaleString()}
            </span>
            followers
          </div>

          {/* Engagement */}
          {listing.engagement_rate && (
            <div className="flex items-center text-sm text-gray-600">
              <LineChart className="w-5 h-5 mr-1 text-gray-400" />
              <span className="font-medium text-gray-800 mr-1">
                {listing.engagement_rate}%
              </span>
              engagement
            </div>
          )}
        </div>

        {/* Tags and Location */}
        <div className="flex items-center gap-3 mt-4 mb-3">
          <span className="text-xs font-medium bg-pink-100 text-pink-600 px-3 py-1 rounded-full capitalize">{listing.niche}</span>
          {listing.country && (
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              {listing.country}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{listing.description}</p>

        <hr className="my-5 border-gray-200" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-xl font-medium text-slate-800">
              {currency || 'USD'} {listing.price.toLocaleString()}
            </span>
          </div>
          <button onClick={() => { navigate(`/listing/${listing.id}`); window.scrollTo(0, 0); }}
            className="px-7 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
            More Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
