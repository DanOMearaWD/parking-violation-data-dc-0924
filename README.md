# Visualizing Parking Violations in Washington, D.C. – September 2024🏛️

This project analyzes and visualizes parking violation data from September 2024 in Washington D.C. 

**Data Source:**

* [DC.gov Parking Violations Dataset](https://catalog.data.gov/dataset/parking-violations-issued-in-september-2024))

## 🌐 GitHub Page
[**Parking Violations in Washington, D.C. &ndash; September 2024**](https://danomearawd.github.io/project3-team4/) <br />
You can view the deployed app above:

![Screenshot](screenshot.png)

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="25" height="25" /> Key Features

* **Interactive Map:** Explore violation locations using a heatmap with marker clusters, built with [Leaflet.js](https://leafletjs.com/)). 
* **Violation Breakdown:** Visualize the most common violations with a donut chart using [Chart.js](https://www.chartjs.org/)).
* **Additional Analysis:** Uncover patterns in parking violations using Matplotlib visualizations (located in the `output/img` folder):
    * Violations by time of day
    * Violations by day of the week
    * Ticket fines distribution
    * Ticket penalties distribution
    * Ticket payments distribution


## 📂 Project Structure

```plaintext
REPO_NAME/
├── index.html  # Interactive Web Page
├── ORIGINAL_Parking_Violations_Issued_in_September_2024.geojson  # Raw parking violation data
├── Visualizations.ipynb  # Jupyter notebook for additional visualizations
├── output/
│   ├── geo_data.db  # SQLite database
│   └── Cleaned_Parking_Violations_DC_09_2024.geojson  # Cleaned geojson data
│   └── img/* # Additional Visualizations
│       
└── static/
    ├── css/
    │   └── style.css  # Styles for Web Page
    ├── js/
    │   └── main.js  # JavaScript for Web Page
    └── py/
        ├── create_sqlite_db.py  # Script for creating SQLite database
        └── localhost_server.py  # Script for local server setup (optional)
        └── preprocess_geojson.ipynb  # Jupyter notebook for preprocessing geojson data
```

## 📝 Summary of Operations



## 🛠️ Technologies Used
- **HTML/CSS**: Markup and styling to structure and design the webpage and map layout.
- **JavaScript**: Programming language used to fetch, process, and display interactive parking data
   - **Leaflet.js**: A JavaScript library for creating interactive maps, used to visualize the earthquake data.
      - Marker Cluster # plugin for Leaflet
      - Heat # heatmap plugin for Leaflet
   - **D3.js**: # JavaScript library for manipulating data, used for loading GeoJSON parking violation data.
   - **Chart.js**: # JavaScript library for creating charts and graphs
- **GeoJSON**: # format used for encoding geographic data structures, used to represent the parking violation data.
- **Jupyter Notebook** # used to run python code in blocks and render visualizations
