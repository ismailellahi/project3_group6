# project3_group6 : Galina, Ismail, Lekshmi, Leon

Analysis on FIRE INCIDENTS in Toronto City 

Project Overview :- Identify if the workload between various fire stations, and what potential actions could be taken to improve the situation (adding more stations/ redistributing existing resources/ providing additional education to citizens etc.).

Data Source : The City of Toronto’s Open Data Portal - Fire Services Emergency Incident, 2021.

Potential Audience  : Fire Department Management

Project Overview :-
Over 50 000 rows of data containing information about fire incidents (21 columns) recorded in Toronto in 2021.
Records without GEO data were excluded.
Records without Incident Type were excluded.
Response time = Alarm Time - Arrival Time, rounded to minutes.
Data stored in SQLite DB.
Leaflet, Plotly, Chart.js were used to build visualization

Data Limitations:-
Size of the unit (fleet size, number of teams) was not taken into account.
Complexity of an incident wasn’t a part of analysis.
Size of the area covered by a particular station wasn’t considered.
Data is only analyzed for 1 year.
Other factors (pandemic etc.) are not taken into account.

Solution Workflow:-
a. Input the .CSV file to python and use Pandas library to clean data.
b. Cleaned Data was then transferred to a SQLite Database.
c. Flask was used to connect the SQLITE Database to create an API for fetching data.
d. Javascript libraries  i.e - D3, Leaflet, plotly,chart.js was used to create visualtions of the API data 
e. HTML was used to create a dashboard which loaded the .JS files 


Conclusion :
Fire Management team can now see which are the top 15 locations which recevie the most calls. They can also see each station ID min and max time for each month  and types of incidents each station encounters. 
This can help them staff their stations accordingly with manpower. 
There is also a map which outlines all the locations of the incidents that encountered and the markers help them identify which are above or below average response time at a glance. 

Overall the Firemanagement team will now have a fair idea of the locations which are mostly prone to fire incidents, the most common challenges they face at each location, the station average time taken to respond and make judgement calls if they have sufficient manpower to handle the incidents at the locations. 

