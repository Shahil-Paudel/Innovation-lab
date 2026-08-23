// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Mountain, Trees } from "lucide-react";

// const NepalMap = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative mt-20 w-full">
//       {/* Nepal Map */}
//       <img
//         src="/images/nepal.svg"
//         alt="Nepal Map"
//         className="block w-full"
//       />

//       {/* Everest Base Camp */}
//       <button
//         onClick={() => navigate("/everest")}
//         className="group absolute right-[15%] top-[60%] z-10 cursor-pointer"
//       >
//         <span
//           className="
//             absolute bottom-full left-1/2 mb-2
//             -translate-x-1/2 translate-y-2
//             whitespace-nowrap rounded-md bg-black
//             px-3 py-1 text-sm text-white
//             opacity-0 transition-all duration-300
//             group-hover:translate-y-0
//             group-hover:opacity-100
//           "
//         >
//           Everest Base Camp
//         </span>

//         <div className="text-white transition-transform duration-300 hover:scale-110 hover:text-[#9be564]">
//           <Mountain size={28} strokeWidth={1.5} />
//         </div>
//       </button>

//       {/* Annapurna Base Camp */}
//       <button
//         onClick={() => navigate("/annapurna")}
//         className="group absolute left-[12%] top-[12%] z-10 cursor-pointer"
//       >
//         <span
//           className="
//             absolute bottom-full left-1/2 mb-2
//             -translate-x-1/2 translate-y-2
//             whitespace-nowrap rounded-md bg-black
//             px-3 py-1 text-sm text-white
//             opacity-0 transition-all duration-300
//             group-hover:translate-y-0
//             group-hover:opacity-100
//           "
//         >
//           Annapurna Base Camp
//         </span>

//         <div className="text-blue-700 transition-transform duration-300 hover:scale-110 hover:text-[#9be564]">
//           <Mountain size={28} strokeWidth={1.5} />
//         </div>
//       </button>

//       {/* Chitwan Safari */}
//       <button
//         onClick={() => navigate("/chitwan")}
//         className="group absolute right-[48%] top-[68%] z-10 cursor-pointer"
//       >
//         <span
//           className="
//             absolute bottom-full left-1/2 mb-2
//             -translate-x-1/2 translate-y-2
//             whitespace-nowrap rounded-md bg-black
//             px-3 py-1 text-sm text-white
//             opacity-0 transition-all duration-300
//             group-hover:translate-y-0
//             group-hover:opacity-100
//           "
//         >
//           Chitwan Safari
//         </span>

//         <div className="text-white transition-transform duration-300 hover:scale-110 hover:text-[#9be564]">
//           <Trees size={28} strokeWidth={1.5} />
//         </div>
//       </button>
//     </div>
//   );
// };

// export default NepalMap;

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const NepalMap = () => {
  const [protectedAreas, setProtectedAreas] = useState(null);

  useEffect(() => {
    fetch("/protected_area_nepal.geojson")
      .then((response) => response.json())
      .then((data) => {
        setProtectedAreas(data);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, []);

  // This function runs for every GeoJSON feature
  const onEachFeature = (feature, layer) => {
    const properties = feature.properties;

    console.log(properties);

    layer.bindPopup(`
      <div>
        <h3 style="font-weight: bold; font-size: 18px;">
          ${properties?.name || "Protected Area"}
        </h3>

        <p>
          <strong>Type:</strong>
          ${properties?.type || "N/A"}
        </p>
      </div>
    `);
  };

  return (
    <MapContainer
      center={[28.3949, 84.1240]}
      zoom={7}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {protectedAreas && (
        <GeoJSON
          data={protectedAreas}
          style={{
            fillColor: "#22c55e",
            fillOpacity: 0.4,
            color: "#166534",
            weight: 2,
          }}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default NepalMap;