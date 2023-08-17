import numpy as np

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///databse.db")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
fire= Base.classes.fire

## Database has only one table called fire which we referencing to a variable "fire"

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"/api/v1.0/FireLocations<br/>"
        f"/api/v1.0/FireLocations/floatingChart<br/>"
    )

@app.route("/api/v1.0/FireLocations")
def fire_location():
    # Create our session (link) from Python to the DB
    session = Session(engine)


    # Query all fire locations
    results = session.query(fire._id, fire.INCIDENT_NUMBER, fire.Initial_CAD_Event_Type, fire.Initial_CAD_Event_Call_Type,
    fire.Final_Incident_ID, fire.Final_Incident_Types, fire.Event_Alarm_Level, fire.Call_ID,
    fire.Call_Origin, fire.Incident_Station_Area, fire.Incident_Ward, fire.Location, fire.TFS_Alarm_Time,
    fire.TFS_Arrival_Time, fire.Time_Taken_to_Arrive, fire.Last_TFS_Unit_Clear_Time,
    fire.Total_Time_at_Scene, fire.Persons_Rescued, fire.Latitude, fire.Longitude, fire.Month)

    # results = session.query(fire._id, fire.INCIDENT_NUMBER)
    
    session.close()

    result_list = []

    for result in results:
        result_dict = {}
        result_dict["ID"] = result[0]
        result_dict["INCIDENT_NUMBER"] = result[1]
        result_dict["Initial_CAD_Event_Type"] = result[2]
        result_dict["Initial_CAD_Event_Call_Type"] = result[3]
        result_dict["Final_Incident_ID"] = result[4]
        result_dict["Final_Incident_Types"] = result[5]
        result_dict["Event_Alarm_Level"] = result[6]
        result_dict["Call_ID"] = result[7]
        result_dict["Call_Origin"] = result[8]
        result_dict["Incident_Station_Area"] = result[9]

        result_dict["Incident_Ward"] = result[10]
        result_dict["Location"] = result[11]
        result_dict["TFS_Alarm_Time"] = result[12]
        result_dict["TFS_Arrival_Time"] = result[13]
        result_dict["Time_Taken_to_Arrive"] = result[14]
        result_dict["Last_TFS_Unit_Clear_Time"] = result[15]
        result_dict["Total_Time_at_Scene"] = result[16]

        result_dict["Persons_Rescued"] = result[17]
        result_dict["Latitude"] = result[18]
        result_dict["Longitude"] = result[19]
        result_dict["Month"] = result[20]
        result_list.append(result_dict)

    return jsonify(result_list)

@app.route("/api/v1.0/FireLocations/floatingChart")
def floating_chart():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all fire locations
    results = session.query(fire.Incident_Station_Area, fire.Time_Taken_to_Arrive, fire.Month)
   
    session.close()

    result_list = []

    for result in results:
        result_dict = {}
        result_dict["Incident_Station_Area"] = result[0]
        result_dict["Time_Taken_to_Arrive"] = result[1]
        result_dict["Month"] = result[2]
        result_list.append(result_dict)

    return jsonify(result_list)

    # if __name__ == "__main__":
    # app.run(debug=True)
