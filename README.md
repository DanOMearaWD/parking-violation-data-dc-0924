# Visualizing Parking Violations in Washington, D.C. – September 2024🏛️

This project analyzes and visualizes parking violation data from September 2024 in Washington, D.C. It features a Flask application that serves an interactive web page, visualizing data stored in an SQLite server to provide dynamic insights. Additionally, a Jupyter notebook is included, which loads the data from the server and generates visualizations using the Seaborn Python library for deeper analysis.

**Data Source:**

* [DC.gov Parking Violations Dataset](https://catalog.data.gov/dataset/parking-violations-issued-in-september-2024))

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
├── index.html  # Web Page (Flask server must be running to use)
├── ORIGINAL_Parking_Violations_Issued_in_September_2024.geojson  # Raw parking violation data
├── visualizations.ipynb  # Jupyter notebook for additional visualizations
├── app.py  # Flask application
├── output/
│   ├── geo_data.db  # SQLite database
│   └── img/*  # Additional Visualizations
│       
└── static/
    ├── css/
    │   └── style.css  # Styles for Web Page
    ├── js/
    │   └── main.js  # JavaScript for Web Page
    └── py/
        ├── create_sqlite_db.py  # Script for creating SQLite database

```

## 📝 Summary of Operations



## 🛠️ Technologies Used

- **HTML/CSS**: Used for structuring and styling the webpage and map layout.
- **JavaScript**: The programming language used to fetch, process, and display interactive parking data.
   - **Leaflet.js**: A JavaScript library for creating interactive maps, used to visualize parking violation data.
     - **MarkerCluster plugin**: Groups markers and improves map performance.
     - **Heatmap plugin**: Creates heatmaps based on parking violation density.
   - **D3.js**: A JavaScript library for manipulating documents based on data, used for loading and visualizing GeoJSON parking violation data.
   - **Chart.js**: A JavaScript library for creating interactive charts and graphs.
- **GeoJSON**: A format for encoding geographic data structures, used to represent the parking violation data.
- **Python**: Programming language used for backend and data processing.
   - **Flask**: A web framework for creating the server and handling routing.
   - **GeoPandas**: A Python library for working with geospatial data.
   - **Pandas**: A Python library for data manipulation and analysis.
   - **sqlite3**: Python library for interacting with the SQLite database.
   - **os**: Python library for interacting with the operating system.
   - **re**: Python library for regular expression operations.
- **Jupyter Notebook**: Used for running Python code in blocks and rendering visualizations.
