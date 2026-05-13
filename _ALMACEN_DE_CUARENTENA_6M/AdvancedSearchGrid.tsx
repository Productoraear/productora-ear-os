import React, { useState } from 'react';
import { BespokeTemplate } from '../components/SClassScreens/BespokeTemplate';
import { BentoGrid } from '../components/ui/BentoGrid';

type Filters = {
  luxury: boolean;
  // Add more filters as needed
};

const AdvancedSearchGrid: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    luxury: false,
    // Add more filters as needed
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            name="luxury"
            checked={filters.luxury}
            onChange={handleFilterChange}
          />
          Luxury
        </label>
        {/* Add more filters as needed */}
      </div>

      {/* BespokeTemplate and BentoGrid integration (Desacoplados y Tipados) */}
      <BespokeTemplate 
        title="Búsqueda S-Class"
        description="Exploración avanzada de activos y servicios."
        location="EAR OS Global"
        serviceId="search-core-01"
        keywords={["luxury", "s-class", "ear", "search"]}
      />
      <BentoGrid />
    </div>
  );
};

export default AdvancedSearchGrid;
