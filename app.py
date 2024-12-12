from flask import Flask, jsonify, send_from_directory
import sqlite3
import os

app = Flask(__name__)

# Path to your SQLite database
DATABASE = 'output/geo_data.db'

# Serve index.html from the root directory
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')  # Serve index.html from root directory

# Serve static assets (CSS, JS, images) from the static folder
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join('static'), path)

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    return conn

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.getcwd(), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/geojson', methods=['GET'])
def get_geojson():
    try:
        # Connect to the database
        conn = get_db_connection()
        
        # Query all data from the geo_data table
        cursor = conn.cursor()
        cursor.execute('SELECT date, agency_name, violation_code, violation_description, location, fine, paid, penalty, latitude, longitude FROM geo_data')
        rows = cursor.fetchall()

        if not rows:
            return jsonify({"error": "No data found in the database"}), 404

        # Convert the data into GeoJSON format
        features = []
        for row in rows:
            geometry = {
                "type": "Point",
                "coordinates": [row['longitude'], row['latitude']]  # Create GeoJSON Point from latitude and longitude
            }

            # Populate the properties field with relevant data
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

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)