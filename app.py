from flask import Flask, jsonify, send_from_directory  # Flask for creating the web app, jsonify for JSON responses, and send_from_directory for serving files.
import sqlite3  # interact with SQLite databases.
import os  # file paths.


#Create Flask Object
app = Flask(__name__)

# database path
DATABASE = 'output/geo_data.db'

# Serve index.html from root directory
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')  # Serve index.html from root directory

# Serve static assets (CSS, JS, images) from the static folder
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join('static'), path)

# connect to database
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # access columns by name
    return conn

# icon in browser tab
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.getcwd(), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

# fetch data from database
@app.route('/geojson', methods=['GET'])
def get_geojson():
    try:
        # Connect to the database
        conn = get_db_connection()
        
        # Query all data from the geo_data table
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM geo_data')
        
        # Prepare to store GeoJSON features
        features = []

        # Iterate over rows directly from the cursor
        for row in cursor:
            # Create GeoJSON Point geometry from latitude and longitude
            geometry = {
                "type": "Point",
                "coordinates": [row['longitude'], row['latitude']]
            }

            # Populate properties with column data
            properties = {
                "date": row['date'],
                "agency_name": row['agency_name'],
                "violation_code": row['violation_code'],
                "violation_description": row['violation_description'],
                "location": row['location'],
                "fine": row['fine'],
                "paid": row['paid'],
                "penalty": row['penalty']
            }

            # Create feature and append it to the features list
            feature = {
                "type": "Feature",
                "geometry": geometry,
                "properties": properties
            }
            features.append(feature)

        # Close the database connection
        conn.close()

        # Return the GeoJSON response
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        return jsonify(geojson)

    # If error connecting to db
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# run app
if __name__ == '__main__':
    app.run(debug=True)