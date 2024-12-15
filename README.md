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
ROOT/
├── index.html  # Web Page (Flask server must be running to use)
├── ORIGINAL_Parking_Violations_Issued_in_September_2024.geojson  # Raw parking violation data
├── visualizations.ipynb  # Jupyter notebook for additional visualizations
├── app.py  # Flask application
├── create_sqlite_db.py  # Script for creating SQLite database
├── output/
│   ├── geo_data.db  # SQLite database
│   └── img/  # Additional visualizations
├── static/
│   ├── css/
│   │   └── style.css  # Styles for Web Page
│   ├── js/
│   │   └── main.js  # JavaScript for Web Page

```

## 📝 Summary of Operations


## 🛠️ Technologies Used

### Frontend
- **HTML/CSS**: Used for structuring and styling the webpage and map layout.  
- **JavaScript**: Used to fetch, process, and display interactive parking data.  
   - **Leaflet.js**: A library for creating interactive maps, used to visualize parking violation data.  
     - **MarkerCluster plugin**: Groups markers and improves map performance.  
     - **Heatmap plugin**: Creates heatmaps based on parking violation density.  
   - **D3.js**: For loading and visualizing GeoJSON parking violation data.  
   - **Chart.js**: For creating interactive charts and graphs.  

### Data Format
- **GeoJSON**: A format for encoding geographic data structures, used to represent parking violation data.  

### Backend
- **Python**: The programming language used for backend development and data processing.  

**Python Libraries Used**:
- **Flask**: A web framework for creating the server and handling API routing.  
- **sqlite3**: A library for interacting with and managing SQLite databases.  
- **os**: A library for interacting with the operating system, managing file paths, and more.  
- **re**: A library for performing regular expression operations on text data.  
- **GeoPandas**: A library for working with geospatial data, enabling spatial operations and analysis.  
- **Pandas**: A library for data manipulation, cleaning, and analysis.  
- **Matplotlib**: A library for creating static, interactive, and animated visualizations.  
- **Seaborn**: A statistical data visualization library built on top of Matplotlib, providing easy-to-use plotting functions.  

### Additional Tools
- **Jupyter Notebook**: A tool for running Python code in blocks and rendering interactive visualizations and analysis.  

