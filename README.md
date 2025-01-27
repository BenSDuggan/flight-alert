# Indiana Medical Flight Tracking (IMFT)

Project to track medical helicopters in Indiana. Tweeting locations at <https://twitter.com/IN_MFT>. Website coming soon!

![IMFT Logo](logo.png)

## Version

* `0.5.0`

## Install

1. Install Python, MongoDB, and Node on your respective system. On Linux:
    1. `sudo apt install git python3-pip zip`
    2. Install node
        1. `curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - `
        2. `sudo apt-get install -y nodejs`
        3. Install MongoDB
            1. `wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc |  gpg --dearmor | sudo tee /usr/share/keyrings/mongodb.gpg > /dev/null`
            2. `echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list`
            3. `sudo apt update`
            4. `sudo apt install mongodb-org`
            5. `sudo systemctl start mongod`
            6. `sudo systemctl enable mongod`
2. Install [server](/server) directory. Inside the [server](/server) folder run: `npm install`
3. Install [client](/client) directory. Inside the [client](/client) folder run: `npm install`
4. Install OpenSky
    1. `git clone https://github.com/openskynetwork/opensky-api`
    2. `pip install -e opensky-api/python`
5. Initialize database. From within the [database](/database) directory run the following commands.
    1. `npm install`
    2. `node src/make-hospitals.js`
    3. `node src/make-faa.js`
    4. `node src/make-faa-lid.js`


## Challenges

* Limitations on free and paid ADS-B services: 
    * [OpenSkies](https://openskynetwork.github.io/opensky-api/rest.html)
        * New quotas!!!
            * Authenticated user: 4,000 pulls/day
            * Authenticated user that contributes with 30% up time: 8,000 pulls/day
            * Pull criterial
                * 1 credit: 0 - 25 (<500x500km) (Indiana!)
                * 2 credit: 25 - 100 (<1000x1000km)
                * 3 credit: 100 - 400 (<2000x2000km)
                * 4 credit: over 400 or all (>2000x2000km)
        * Old Quotas
            * Antonymous 100 / day
            * Signed in 1000 / day (~1 poll / 90 sec)
            * Can get your data from your sensor unlimited
        * Doesn't have good coverage of Northern Indiana
    * ADS-B Exchange $10 / mo
        * 10,000 / mo (~1 poll / 4.32 min)
        * Best coverage in Indianapolis
    * Flight Aware 
        * $20 / mo
* Aircraft can come into the airspace (from outside Indiana) and already be in flight
* Helicopters can hover, so if vertical speed and horizontal speed are 0, you don't know if it's hovering or not
* It is difficult to determine air/ground and location status


### Ground or airborn status:

Determine if an aircraft is on the ground or airborne

* Airborn (easier to tell than on ground) if any of the criteria are met
    * Vertical speed > 1 m/s
    * Horizontal speed > 1 m/s
    * True altitude > 250
* Grounded:
    * `on-ground` is true
    * Aircraft is within Zone 1 of a hospital: ~ 1000 ft radius and 500 ft vertical ceiling
        * *Some exceptions like Eski and Riley*
    * ***Assume that helicopters won't hover***
* LOS (loss of signal): No updated data for 2 minutes or 5 intervals, which ever is less

### Location status

Ideally a location is set under ideal conditions. For a departure that occurs when going from grounded to airborn and for an arrival that is going from airborn to grounded. However, aircraft may enter from outside the bounding box or have a signal lost near their landing site. Actually, this doesn't matter


## ToDo

* Add dynamic pull rates to ADS-B logic
    * If the ADS-B controller knows the quota for a 24 hour period, then pull less at night (when helicopters are not flying) and pull more often during the day (when helicopters are flying)
    * Variables used by controller
        * Night is between 7PM EST and 7AM EST
        * `quota`: the number of requests that can be made within a 24 hour period
        * `current_rate`: the current pull rate (in seconds)
        * `mean_rate`: the number of time (in seconds) between pulls if pulls were evenly spread out during the day so quota was used completely
        * `min_rate`: the largest time (in seconds) between pulls (highest number)
        * `max_rate`: the smallest time (in seconds) between pulls (smallest number)
        * `day_mean_rate`: the rate we should pull at to use the rest of the quota
    * Pulling logic
        * At night: If an aircraft is flying then make a request using the `mean_rate` time. If no aircraft are flying, set the pull rate at each interval to `current_rate += Math.ceiling((min_rate-current_rate)/2)`;
        * During day: If no aircraft are flying pull at `day_mean_rate`
* Fix problem with multiple trips being created when aircraft isn't moving or from receiving bad data
* Require x intervals for state to change
    * Use `next` status in `flights`
* Fix menu not highlighting text when on page
* Dockerize
* Views
    * Hospitals
    * Aircraft
* Aircraft database upgrade
    * Separate aircraft database from FAA lookup. Focused on Medical helicopters adn providing additional information
    * Add `medical_flight` tag to aircraft
    * Add faa `display_name`
* Admin page to edit all this information
* Remove aircraft that are not medical helicopters

