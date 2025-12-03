import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchPage() {
  const query = new URLSearchParams(useLocation().search).get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Later → fetch search results from backend
    setResults([]); 
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Search Results</h1>
      <p className="text-gray-600 mb-4">You searched for: <b>{query}</b></p>

      {results.length === 0 ? (
        <p className="text-gray-400">No results (yet)</p>
      ) : (
        results.map(r => <div key={r.id}>{r.title}</div>)
      )}
    </div>
  );
}
