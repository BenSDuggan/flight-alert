# Server


## Sockets

### Client side:

* `get_hospitals`: Get the list of hospitals from the server as an array

### Server side:

* `hospitals`: Send the list of hospitals to the client as an array


## Data structures

### Flights data structure

Used by server and client to store the locations of aircraft.

```
[
    {
        "icao24": "", // The icao24
        "faa":{}, // FAA registration data
        "last":{}, // Data from the last update interval
        "stl":{}, // Data from the second to last interval (copied from last when the next update interval occurs)
        "latest":{}, // Latest data received, not necessarily up to date
        "time": -1, // Time that the last flight data was received
        "tics": 0, // How many tics has it been without data
        "tracking": { // Tracking information
            "current": { // The current tracking
                "status": "los", // Is the aircraft: `airborn`, `grounded`, or `los`
                "reason": "", // Reason status was changed
                "time": -1, // When the flight status was last updated
                "tics": 0, // How many intervals the flight status has been the same
                "counter": 0, // How many times the flight status has flipped
                "location": null // Location
            },
            "next": { // Tracking next status change
                "status": "los", // Is the aircraft: `airborn`, `grounded`, or `los`
                "status": "los", // Is the aircraft: `airborn`, `grounded`, or `los`
                "reason": "", // Reason status was changed
                "time": -1, // When the flight status was last updated
                "tics": 0, // How many intervals the flight status has been the same
                "counter": 0, // How many times the flight status has flipped
                "location": null // Location
            },
            "previous": { // Tracking previous status change
                "status": "los", // Is the aircraft: `airborn`, `grounded`, or `los`
                "status": "los", // Is the aircraft: `airborn`, `grounded`, or `los`
                "reason": "", // Reason status was changed
                "time": -1, // When the flight status was last updated
                "tics": 0, // How many intervals the flight status has been the same
                "counter": 0, // How many times the flight status has flipped
                "location": null // Location
            }
        }
    }
]
```

### Trip Data Structure

Data structure for a trip which captures the path traveled from the beginning to the end of a flights path.

```
{
    "tid":-1, // Trip ID
    "aid":-1, // Aircraft ID
    "status":"", // `grounded` `airborn` `los`
    "departure": { // Departure information
        "lid": "", // Location ID if one exists
        "type": "", // Was the location determined using `hospital`, `faaID`, or `geo`
        "display_name": "", // Name to display
        "time": 0, // Time the status was changed
        "lat": 0, // Lat where location was decided
        "lon": 0, // Lon where location was decided
        "distance": 0, // Distance to true location coordinates when status was changed
        "reason": "" // Reason status was changed to this
    },
    "arrival": { // Arrival information in 
        "lid": "", // Location ID if one exists
        "type": "", // Was the location determined using `hospital`, `faaID`, or `geo`
        "display_name": "", // Name to display
        "time": 0, // Time the status was changed
        "lat": 0, // Lat where location was decided
        "lon": 0, // Lon where location was decided
        "distance": 0, // Distance to true location coordinates when status was changed
        "reason": "" // Reason status was changed to this
    },
    "stats": {
        "time": 0, // Trip travel time in minutes
        "distance": 0, // Trip travel distance in miles
    },
    "path": [ // Aircraft travel path

    ]
}
```



