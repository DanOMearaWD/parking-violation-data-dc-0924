import geopandas as gpd
import pandas as pd
import sqlite3
import os
import re
# Ensure file is exported to expected location
# Change the working directory to the script's directory
    #os.path.abspath(__file__) returns the full path:
    #os.path.dirname() strips off the filename
    #os.chdir() then changes the current working directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))


# Load GeoJSON file
gdf = gpd.read_file("ORIGINAL_Parking_Violations_Issued_in_September_2024.geojson")

#Filter columns of interest
gdf_filtered = gdf[['ISSUE_DATE','ISSUE_TIME','ISSUING_AGENCY_NAME','VIOLATION_CODE','VIOLATION_PROC_DESC','LOCATION','FINE_AMOUNT','TOTAL_PAID','PENALTY_1','LATITUDE','LONGITUDE','geometry']].copy()


#COMBINE ISSUE_DATE AND ISSUE TIME INTO SINGLE COLUMN ISSUE_DATE

#Normalize time:
def normalizeTime(time):
    # Remove non-digit characters using regex
    time_str = re.sub(r'\D', '', str(time))  # \D matches anything that's not a digit
    # Zero-pad to ensure it's at least 4 characters long
    time_str = time_str.zfill(4)  
    hours = time_str[:-2]  # First two digits (hours)
    minutes = time_str[-2:]  # Last two digits (minutes)
    return f"{hours}:{minutes}" # HH:MM

#apply normalize function
gdf_filtered['ISSUE_TIME'] = gdf_filtered['ISSUE_TIME'].apply(normalizeTime)

#concatenate both strings and convert to datetime
gdf_filtered['ISSUE_DATE'] = pd.to_datetime(
    gdf_filtered['ISSUE_DATE'].dt.date.astype(str) + ' ' + gdf_filtered['ISSUE_TIME'], #date+ time ex: 2024-09-01 12:59
    format='%Y-%m-%d %H:%M'
)

# Drop the ISSUE_TIME column
gdf_filtered = gdf_filtered.drop(columns=['ISSUE_TIME'], errors='ignore')


#Rename columns
gdf_filtered.columns = ['date','agency_name','violation_code','violation_description','location','fine','paid','penalty','latitude','longitude','geometry']


# DROP ROWS WHERE ANY COLUMN EXCEPT LAST IS NULL

#strip trailing periods
gdf_filtered['violation_description'] = gdf_filtered['violation_description'].str.rstrip('.')


# Drop rows where violation_description contains only spaces or is empty
gdf_filtered = gdf_filtered.loc[gdf_filtered['violation_description'].str.strip().ne('')]
# Drop rows where any column is NaN except last one (geometry)
gdf_filtered.dropna(axis=0, subset=gdf_filtered.columns[:-1], inplace=True)






# Connect to SQLite database (it will create the file if it doesn't exist)
conn = sqlite3.connect('output/geo_data.db')

# Insert the entire GeoDataFrame into the SQLite database, replacing the existing table
#exclude geometry (unsupported data type)
gdf_filtered.to_sql('geo_data', conn, if_exists='replace', index=False)

# Close the connection
conn.close()

print("Data has been inserted successfully.")