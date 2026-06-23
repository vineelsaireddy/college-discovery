"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import CollegeCard from "@/components/CollegeCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { SlidersHorizontal, X, Loader2, GraduationCap, Search as SearchIcon } from "lucide-react";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type: string;
  rating: number;
  fees: number;
  ownership: string;
  ranking: number | null;
  placements: { averagePackage: number; placementRate: number }[];
  _count: { reviews: number; courses: number };
}

interface Filters {
  states: string[];
  types: string[];
}

export default function HomePage() {
  const { data: session } = useSession();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState<Filters>({ states: [], types: [] });
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Search + filter state
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedOwnership, setSelectedOwnership] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedState) params.set("state", selectedState);
      if (selectedType) params.set("type", selectedType);
      if (selectedOwnership) params.set("ownership", selectedOwnership);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/colleges?${params.toString()}`);
      const data = await res.json();

      setColleges(data.colleges);
      setPagination(data.pagination);
      setFilters(data.filters);
    } catch (error) {
      console.error("Failed to fetch colleges:", error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedState, selectedType, selectedOwnership, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Fetch saved IDs
  useEffect(() => {
    if (session) {
      fetch("/api/saved-colleges/ids")
        .then((res) => res.json())
        .then((ids) => setSavedIds(ids))
        .catch(console.error);
    }
  }, [session]);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const handleToggleSave = useCallback((collegeId: string) => {
    setSavedIds((prev) =>
      prev.includes(collegeId) ? prev.filter((id) => id !== collegeId) : [...prev, collegeId]
    );
  }, []);

  const clearFilters = () => {
    setSelectedState("");
    setSelectedType("");
    setSelectedOwnership("");
    setSortBy("rating");
    setSortOrder("desc");
    setPage(1);
  };

  const activeFilterCount = [selectedState, selectedType, selectedOwnership].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Find Your Perfect College
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Explore {pagination.total}+ colleges across India — compare, review, and decide.
        </p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} defaultValue={search} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-colors ${showFilters || activeFilterCount > 0
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Filter & Sort</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">All States</option>
                {filters.states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {filters.types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ownership</label>
              <select
                value={selectedOwnership}
                onChange={(e) => { setSelectedOwnership(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split("-");
                  setSortBy(by);
                  setSortOrder(order);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="rating-desc">Rating: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="fees-asc">Fees: Low to High</option>
                <option value="fees-desc">Fees: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="ranking-asc">Ranking: Best First</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `Showing ${colleges.length} of ${pagination.total} colleges`}
        </p>
      </div>

      {/* College Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20">
          <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No colleges found</h3>
          <p className="text-sm text-gray-500 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isSaved={savedIds.includes(college.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />

      {/* Bottom spacer for compare bar */}
      <div className="h-16" />
    </div>
  );
}
