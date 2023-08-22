// Fetch the JSON data  
d3.json("http://127.0.0.1:5000/api/v1.0/FireLocations").then(function (data) {

    // List all the unique caller IDs  
    let callID = Array.from(new Set(data.map((item) => item.Call_ID)));
    // console.log(callID)
    let callIDSorted = callID.sort((firstNum, secondNum) => firstNum - secondNum);
    // Count number of unique caller IDs
    let callIDNumber = callID.length;
    // Print # of unique caller IDs in the box
    let callIDBOX = d3.select("#call_ID_types").text(callIDNumber);
    // stationBox.text(stationNumber);


    // Calculate AVG number of calls
    let totalcall = data.map((item) => item.Call_ID)
    totalCalls = totalcall.length
    console.log(totalCalls)

    // // Calculate AVG number of calls
    // let totalcall = data.filter((item)=>item.Call_ID == 1)
    // console.log(totalcall)
    // totalCalls = totalcall.length
    // // console.log(totalCalls)

    let AvgCallsPerDay = Math.round(totalCalls / 365)
    // Print avg Response time in the box
    let callBox = d3.select("#avg-call").text(AvgCallsPerDay);


    let callIdList = []
    function callsPerMonth(calldata) {
        for (let i = 0; i < calldata.length; i++) {
            //create an array to store all data
            let callIdDict = {}
            // let keys = ["Call_ID","avgCalls", "month"]
            // for (let key of keys) {
            //     callIdDict[key] = undefined;
            // }

            //Filter Data by Caller Id, Caller ID is picked up from the unqiue call_id list we have create above
            //so basically the item.CallID = the unique call_Id number which we are looping and filtering on. 

            let sampleData = data.filter(item => item.Call_ID == calldata[i]);

            let avgCallsByCallID = Math.round(sampleData.length / 365)
            let totalCallsbyCallD = sampleData.length

            callIdDict.Call_ID = calldata[i];
            callIdDict.avgCalls = avgCallsByCallID;
            callIdDict.totalCalls = totalCallsbyCallD



            callIdList.push(callIdDict)

        }
    }

    let fullCallIDList = callsPerMonth(callIDSorted)
    console.log(callIdList)
    xaxis = callIdList.map( item => item.Call_ID)
    yaxis = callIdList.map(item => item.avgCalls)
    zaxis = callIdList.map(item => item.totalCalls)
    console.log(zaxis)

    
    let button = d3.select(".callidMAP")
    let button2 = d3.select(".callidMAP2")
    function displayRadioValue(){
      
                let trace1 = {
                    x: xaxis,
                    y: yaxis,
                    mode: 'lines+markers',
                    text: ["911", "Call from Civilian", "Ambulance", "Other Police Services", "Monitoring Agency", "direct Connection", "In Person at Fire Station", "FireDepartment", "Other Alarm", "No Alarm Received", "INcident Discovered by FD"],
                    marker: {
                        color: 'rgb(128, 0, 128)',
                        size: 8
                    },
                    line: {
                        color: 'rgb(128, 0, 128)',
                        width: 1
                    }
                }
        
                let dataplot1 = [trace1];
        
                let layout1 = {
                    title: " Average Number of calls each day per Call_ID",
                    xaxis: {
                        title: " Origin of Call From",
                    },
                    yaxis: {
                        title: "Average Calls per day"
                    }
                }
                Plotly.newPlot('mapi', dataplot1, layout1)
        
            } 
        button.on("click", displayRadioValue)

        function displayRadioValue2(){
            let trace2 = {
                x: xaxis,
                y: zaxis,
                mode: 'lines+markers',
                text: ["911", "Call from Civilian", "Ambulance", "Other Police Services", "Monitoring Agency", "direct Connection", "In Person at Fire Station", "FireDepartment", "Other Alarm", "No Alarm Received", "INcident Discovered by FD"],
                marker: {
                    color: '#050500',
                    size: 8
                },
                line: {
                    color: '#e31305',
                    width: 1
                }
            }

            let dataplot2 = [trace2];

            let layout2 = {
                title: " Total Calls in 2021 per Call_ID",
                xaxis: {
                    title: " Origin of Call From",
                },
                yaxis: {
                    title: "Total Calls in the year"
                }
            }
            Plotly.newPlot('mapi', dataplot2, layout2)

        }
        button2.on("click", displayRadioValue2)
        })
    





















            
   



    // let trace1 = {
    //     x: xaxis,
    //     y: yaxis,
    //     mode: 'lines+markers',
    //     text : ["911", "Call from Civilian", "Ambulance", "Other Police Services", "Monitoring Agency", "direct Connection", "In Person at Fire Station","FireDepartment", "Other Alarm", "No Alarm Received", "INcident Discovered by FD"],
    //     marker: {
    //         color: 'rgb(128, 0, 128)',
    //         size: 8
    //     },
    //     line: {
    //         color: 'rgb(128, 0, 128)',
    //         width: 1
    //     }
    // }

    // let dataplot1 = [trace1];

    // let layout1 = {
    //     title: " Average Number of calls each day per Call_ID",
    //     xaxis : {
    //         title: " Origin of Call From",
    //     },
    //     yaxis: {
    //         title: "Average Calls per day"
    //     }
    // }
    // Plotly.newPlot('map1', dataplot1, layout1)




    // let trace2 = {
    //     x: xaxis,
    //     y: zaxis,
    //     mode: 'lines+markers',
    //     text : ["911", "Call from Civilian", "Ambulance", "Other Police Services", "Monitoring Agency", "direct Connection", "In Person at Fire Station","FireDepartment", "Other Alarm", "No Alarm Received", "INcident Discovered by FD"],
    //     marker: {
    //         color: 'rgb(128, 0, 128)',
    //         size: 8
    //     },
    //     line: {
    //         color: 'rgb(128, 0, 128)',
    //         width: 1
    //     }
    // }

    // let dataplot2 = [trace2];

    // let layout2 = {
    //     title: " Total Calls in 2021 per Call_ID",
    //     xaxis : {
    //         title: " Origin of Call From",
    //     },
    //     yaxis: {
    //         title: "Total Calls in the year"
    //     }
    // }
    // Plotly.newPlot('map2', dataplot2, layout2)
