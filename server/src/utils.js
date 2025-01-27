// Core functions and classes needed by every other class
// Includes config, helper, and locations functions

const fs = require('fs')
const os = require('os');

config_path = os.homedir() + "/.config/imft/config.json"


/****************************
 ***   Helper Functions   ***
 ***************************/

// Get the current time from epoch in seconds
const epoch_s = () => Math.floor(Date.now()/1000)

let meter_to_feet = (meter) => meter * 3.28084;
let feet_to_meter = (feet) => feet * 0.3048;
let feet_to_mile = (feet) => feet / 5280;
let deg2rad = (deg) => deg * Math.PI/180
let haversine = (lat1, lon1, lat2, lon2) => {
  let a = Math.sin(deg2rad(lat2-lat1)/2)**2+
          Math.cos(deg2rad(lat2))*
          Math.cos(deg2rad(lat1))*
          Math.sin(deg2rad(lon2-lon1)/2)**2
  
  return 2 * meter_to_feet(6371e3) * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) // Distance in feet
}
// Measure the distance between 2 points. Should be ~100yrds=300ft
//console.log(haversine(39.18048154123995, -86.52535587827155, 39.18130600162018, -86.5253532904204))

// Bounding box around indiana
let poly = [[41.76017049802046, -84.8058859898437], 
            [41.75958188356967, -86.8287409887496], 
            [41.62146143090975, -87.52747541288129], 
            [39.35467658774465, -87.53284499177666],
            [37.79555542974644, -88.03242734650117],
            [38.04882063179981, -86.2649913420103],
            [39.115245999166696, -84.81392208527427],
            [41.76017049802046, -84.8058859898437]];
// Convert longitudes to positive numbers (needed for algorithm)
let ppoly = poly.map((p) => {return [p[0], p[1]+180]})

let point_within_bounds = (point) => {
    // Solution from https://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not
    // Only works in North America
    point[1] = point[1] + 180;

    let D = (p, p1, p2) => {
        // D = (x2 - x1) * (yp - y1) - (xp - x1) * (y2 - y1)
        // D > 0 => within bounds; D < 0 => outside bounds; D=0 => on bound
        return (p2[1]-p1[1]) * (p[0]-p1[0]) - (p[1]-p1[1]) * (p2[0]-p1[0])
    }

    // Need to go though counter-clockwise
    for(let i=0; i<ppoly.length-1; i++) {
        if(D(point, ppoly[i], ppoly[i+1]) < 0)
            return false
    }

    return true;
}


/******************
 ***   Config   ***
 *****************/

config = {};

let load_config = () => {
    if (fs.existsSync(config_path) || true) {
        let rawdata = fs.readFileSync(config_path);
        config = JSON.parse(rawdata);
    }
}

let save_config = () => {
    let data = JSON.stringify(config);
    fs.writeFileSync(config_path, data);
}

load_config();


module.exports = { 
    epoch_s, 
    meter_to_feet,
    feet_to_meter,
    feet_to_mile,
    deg2rad,
    haversine,
    point_within_bounds,
    config, 
    load_config,
    save_config
};