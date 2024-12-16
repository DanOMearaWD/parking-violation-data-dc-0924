# Visualizing Parking Violations in Washington, D.C. – September 2024🏛️

This project provides a comprehensive analysis and visualization of parking violation data from September 2024 in Washington, D.C., using the publicly available [DC.gov Parking Violations Dataset](https://catalog.data.gov/dataset/parking-violations-issued-in-september-2024). A **Flask** web application allows users to interactively explore violation locations on a dynamic map, with data stored in an **SQLite** database. The application visualizes insights such as the most common violations.

Additionally, a **Jupyter Notebook** is included for deeper analysis, leveraging **Seaborn** and **Matplotlib** to generate statistical visualizations and identify patterns in parking violations. The project combines web development, geospatial analysis, and data visualization to provide a detailed look at parking behavior and trends in the city.


![Screenshot](screenshot.png)

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="25" height="25" /> Key Features

* **Interactive Map:** Explore violation locations using a heatmap with marker clusters, built with [Leaflet.js](https://leafletjs.com/)). 
* **Violation Breakdown:** Visualize the most common violations with a donut chart using [Chart.js](https://www.chartjs.org/)).
* **Additional Analysis:** Uncover patterns in parking violations using Matplotlib and Seaborn visualizations (located in the `output/img` folder):
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

1. **Data Preprocessing**:
    - Load and filter data using **GeoPandas** from a GeoJSON file.
    - Combine the `ISSUE_DATE` and `ISSUE_TIME` columns, clean violation descriptions, and drop rows with missing data.

2. **Database Insertion**:
    - Insert the cleaned data into an SQLite database (`geo_data.db`) using **sqlite3**.

3. **Web Application**:
    - Build a **Flask** web application that serves an `index.html` page and data in GeoJSON format via the `/geojson` endpoint.

4. **Data Visualization**:
    - Use **Matplotlib** and **Seaborn** to generate visualizations such as bar plots and histograms, providing insights into fines, penalties, and payments.

5. **Mapping**:
    - Create an interactive Leaflet map to display parking violations by location, with overlays for heatmaps and marker clusters.
    - Use **D3.js** for date formatting and **Chart.js** for donut charts of violation descriptions.


## 📊 Database Documentation
The project employs an SQLite database for storing parking violation data due to its lightweight nature and ease of use, requiring no additional setup. Additionally, SQLite is compatible with Python’s built-in sqlite3 library, ensuring seamless integration.

### Database Schema
- **date**: The date and time when the violation occurred.
- **agency_name**: The name of the agency that issued the violation.
- **violation_code**: A unique code identifying the type of violation.
- **violation_description**: A detailed description of the violation.
- **location**: The address or area where the violation occurred.
- **fine**: The monetary fine amount for the violation.
- **paid**: Amount paid toward the violation fine.
- **penalty**: Additional penalties or charges applied.
- **latitude**: The latitude coordinate of the violation location.
- **longitude**: The longitude coordinate of the violation location.
- **geometry**: Geospatial data representing the violation location.



## 🛠️ Technologies Used

### Frontend
- **HTML/CSS**: Used for structuring and styling the webpage and map layout.  
- **JavaScript**: Used to fetch, process, and display interactive parking data.  
   - **[Leaflet.js](https://leafletjs.com/)**: A library for creating interactive maps, used to visualize parking violation data.  
     - **[MarkerCluster plugin](https://github.com/Leaflet/Leaflet.markercluster)**: Groups markers and improves map performance.  
     - **[Heatmap plugin](https://github.com/Leaflet/Leaflet.heat)**: Creates heatmaps based on parking violation density.
   - **[D3.js](https://d3js.org/)**: For loading and visualizing GeoJSON parking violation data.  
   - **[Chart.js](https://www.chartjs.org/)**: For creating interactive charts and graphs.  

### Data Format
- **[GeoJSON](https://geojson.org/)**: A format for encoding geographic data structures, used to represent parking violation data.  

### Backend
- **[Python](https://www.python.org/)**: The programming language used for backend development and data processing.  

**Python Libraries Used**:
- **[Flask](https://flask.palletsprojects.com/)**: A web framework for creating the server and handling API routing.  
- **[sqlite3](https://docs.python.org/3/library/sqlite3.html)**: A library for interacting with and managing SQLite databases.  
- **[os](https://docs.python.org/3/library/os.html)**: A library for interacting with the operating system, managing file paths, and more.  
- **[re](https://docs.python.org/3/library/re.html)**: A library for performing regular expression operations on text data.  
- **[GeoPandas](https://geopandas.org/)**: A library for working with geospatial data, enabling spatial operations and analysis.  
- **[Pandas](https://pandas.pydata.org/)**: A library for data manipulation, cleaning, and analysis.  
- **[Matplotlib](https://matplotlib.org/)**: A library for creating static, interactive, and animated visualizations.  
- **[Seaborn](https://seaborn.pydata.org/)**: A statistical data visualization library built on top of Matplotlib, providing easy-to-use plotting functions.  

### Additional Tools
- **[Jupyter Notebook](https://jupyter.org/)**: A tool for running Python code in blocks and rendering interactive visualizations and analysis.  


## 💻 How to Use
Ensure that you have access to the technologies mentioned above.

To get started with this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/DanOMearaWD/parking-violation-data-dc-0924.git
   ```
2. Navigate to the project directory:
   ```bash
   cd parking-violation-data-dc-0924
   ```
3. Create SQLite Database:
   ```bash
   python create_sqlite_db.py
   ```
   This script converts raw GeoJSON data into an SQLite database for efficient querying.

4. Run Flask Server:
   ```bash
   python app.py
   ```
   Access the web application at **http://127.0.0.1:5000/**

5. Explore Additional Visualizations:\
Open **visualizations.ipynb** in Jupyter Notebook for detailed analysis and static plots.

## 🕵️ Ethical Considerations
Ethical considerations were taken into account to ensure the responsible use of parking violation data. The dataset did not contain any personally identifiable information (PII) or sensitive data. Additionally, visualizations were presented in a neutral manner to avoid biased interpretations that could misrepresent any demographic or area.
