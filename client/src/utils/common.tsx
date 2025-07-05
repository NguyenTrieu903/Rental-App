export const handleLocationSearch = async (localFilters: {
  location: string | number | boolean;
}) => {
  if (
    typeof localFilters.location !== "string" ||
    !localFilters.location.trim()
  )
    return;

  try {
    // Sử dụng Nominatim API (OpenStreetMap) thay vì Mapbox
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        localFilters.location
      )}&limit=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "RentalApp/1.0", // Nominatim yêu cầu user-agent
        },
      }
    );

    const data = await response.json();

    if (data && data.length > 0) {
      // Nominatim trả về [lon, lat] dưới dạng chuỗi, cần chuyển đổi sang số
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);

      // Cập nhật tọa độ với định dạng [longitude, latitude] cho phù hợp với Leaflet
      (localFilters as any).coordinates = [lon, lat];

      console.log(
        `Location found: ${data[0].display_name}, coordinates: [${lon}, ${lat}]`
      );
    } else {
      console.log("No location found for the search term");
    }
  } catch (err) {
    console.error("Error searching location:", err);
  }
};
