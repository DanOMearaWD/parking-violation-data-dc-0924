import geopandas as gpd
import sqlite3
import os
# Ensure file is exported to expected location
# Change the working directory to the script's directory
    #os.path.abspath(__file__) returns the full path:
    #os.path.dirname() strips off the filename
    #os.chdir() then changes the current working directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))


# Load the GeoJSON file using GeoPandas
gdf = gpd.read_file('../../output/Cleaned_Parking_Violations_DC_09_2024.geojson')

# Connect to SQLite database (it will create the file if it doesn't exist)
conn = sqlite3.connect('../../output/geo_data.db')

# Insert the entire GeoDataFrame into the SQLite database, replacing the existing table
#exclude geometry (unsupported data type)
gdf.drop(columns=['geometry']).to_sql('geo_data', conn, if_exists='replace', index=False)

# Close the connection
conn.close()

print("Data has been inserted successfully.")