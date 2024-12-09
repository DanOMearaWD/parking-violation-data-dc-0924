//IN ORDER FOR THIS CODE TO WORK YOU NEED A
//LOCAL SERVER. RUN static/py/server.py then use:
// http://localhost:8000/


//initialize geojson file location
const geojson_file = "../../output/Cleaned_Parking_Violations_DC_09_2024.geojson";

//load the file
d3.json(geojson_file).then(function (data) {
    console.log(data);























}).catch(function (error) {
    console.error("Error loading GeoJSON file:", error);
});


