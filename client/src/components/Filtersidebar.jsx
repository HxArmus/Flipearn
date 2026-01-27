import React from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import {
  BrowserRouter as Router,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

/**
 * Filtersidebar Component
 * Handles the UI for filtering marketplace items.
 */
const Filtersidebar = ({
  showFilterPhone,
  setShowFilterPhone,
  filter,
  setFilter,
}) => {
  const navigate = useNavigate();
  const currency = "$"; // Fallback if import.meta.env is not set

  // 1. State Hooks
  const [expandedSections, setExpandedSections] = React.useState({
    platform: true,
    niche: true,
    followers: true,
    status: true,
    price: true,
  });

  const [searchParam, setSearchParam] = useSearchParams();
  const [search, setSearch] = React.useState(searchParam.get("search") || "");

  // 2. Data Arrays (Moved to component scope)
  const platforms = [
    { label: "Instagram", value: "instagram" },
    { label: "YouTube", value: "youtube" },
    { label: "TikTok", value: "tiktok" },
    { label: "Twitch", value: "twitch" },
    { label: "Twitter", value: "twitter" },
    { label: "Facebook", value: "facebook" },
  ];

  const niches = [
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'technology', label: 'Technology' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'education', label: 'Education' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'art', label: 'Art' },
    { value: 'photography', label: 'Photography' },
    { value: 'comedy', label: 'Comedy' },
  ];

  // 3. Logic Functions
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const onFilterChange = (newFilters) => {
    if (typeof setFilter === "function") {
      setFilter((prev) => ({ ...prev, ...newFilters }));
    }
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value) {
      setSearchParam({ search: value });
    } else {
      setSearchParam({});
    }
  };

  const onClearFilters = () => {
    if (search) {
      navigate('/marketplace');
    }
    if (typeof setFilter === "function") {
      setFilter({
        platform: [],
        maxPrice: 100000,
        minfollowers: 0,
        niche: null,
        verified: false,
        monetized: false,
      });
    }
  };

  return (
    <div
      className={`
      max-sm:inset-0 z-50 max-sm:h-screen max-sm:overflow-scroll 
      bg-white rounded-lg shadow-sm border border-gray-200 
      h-fit sticky top-24 md:min-w-[300px] 
      ${showFilterPhone ? "max-sm:fixed" : "max-sm:hidden"}
    `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-700">
            <Filter className="size-4" />
            <h3 className="font-semibold">Filter</h3>
          </div>

          <div className="flex items-center gap-2">
            <X
              onClick={onClearFilters}
              className="size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            />

            <button
              onClick={() => setShowFilterPhone(false)}
              className="sm:hidden text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
        {/* Search */}
        <input
          onChange={onSearchChange}
          value={search}
          type="text"
          placeholder="Search username, platform, niche..."
          className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500"
        />

        {/* Platform Filter */}
        <div>
          <button
            onClick={() => toggleSection("platform")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="cursor-pointer text-sm font-medium text-gray-800">
              Platform
            </label>
            <ChevronDown
              className={`size-4 transition-transform ${expandedSections.platform ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.platform && (
            <div className="flex flex-col gap-2">
              {platforms.map((p) => (
                <label
                  key={p.value}
                  className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(filter?.platform || []).includes(p.value)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const current = filter?.platform || [];
                      const updated = checked
                        ? [...current, p.value]
                        : current.filter((item) => item !== p.value);

                      onFilterChange({ platform: updated });
                    }}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div>
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="cursor-pointer text-sm font-medium text-gray-800">
              Price Range
            </label>
            <ChevronDown
              className={`size-4 transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.price && (
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={filter?.maxPrice || 100000}
                onChange={(e) =>
                  onFilterChange({ maxPrice: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{currency}0</span>
                <span>{currency}{(filter?.maxPrice || 100000).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Followers Filter */}
        <div>
          <button
            onClick={() => toggleSection("followers")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="cursor-pointer text-sm font-medium text-gray-800">
              Minimum Followers
            </label>
            <ChevronDown
              className={`size-4 transition-transform ${expandedSections.followers ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.followers && (
            <select
              value={filter?.minfollowers?.toString() || '0'}
              onChange={(e) =>
                onFilterChange({ minfollowers: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500"
            >
              <option value="0">Any</option>
              <option value="1000">1K+</option>
              <option value="10000">10K+</option>
              <option value="100000">100K+</option>
              <option value="1000000">1M+</option>
            </select>
          )}
        </div>

        {/* Niche Filter */}
        <div>
          <button
            onClick={() => toggleSection("niche")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="cursor-pointer text-sm font-medium text-gray-800">
              Niche
            </label>
            <ChevronDown
              className={`size-4 transition-transform ${expandedSections.niche ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.niche && (
            <select
              value={filter?.niche || ''}
              onChange={(e) =>
                onFilterChange({ niche: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500"
            >
              <option value="">All Niches</option>
              {niches.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <button
            onClick={() => toggleSection("status")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="cursor-pointer text-sm font-medium text-gray-800">
              Account Status
            </label>
            <ChevronDown
              className={`size-4 transition-transform ${expandedSections.status ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.status && (
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filter?.verified || false} 
                  onChange={(e) => onFilterChange({ verified: e.target.checked })} 
                />
                <span className="text-sm text-gray-700">Verified</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filter?.monetized || false} 
                  onChange={(e) => onFilterChange({ monetized: e.target.checked })} 
                />
                <span className="text-sm text-gray-700">Monetized</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Filtersidebar;