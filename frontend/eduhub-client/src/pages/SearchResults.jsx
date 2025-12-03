import React from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <p className="text-gray-600">You searched for: <b>{query}</b></p>

      {/* add search logic later */}
    </div>
  );
}
