const activitiesSection = document.querySelector('#activities-section')
const feedMessage = document.querySelector('#feed-message')

const authURL = "https://www.strava.com/oauth/token"

function refreshAuth(){
    fetch(authURL,{
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: [REPLACE-WITH-STRAVA-CLIENT_ID],
            client_secret: [REPLACE-WITH-STRAVA-CLIENT_SECRET],
            refresh_token: [REPLACE-WITH-STRAVA-REFRESH_TOKEN],
            grant_type: 'refresh_token'
        })
    }).then(response => response.json())
        .then(data => getActivites(data))
}
refreshAuth()

function getActivites(data){
    const activitiesURL = `https://www.strava.com/api/v3/athlete/activities?access_token=${data.access_token}`
    fetch(activitiesURL)
    .then(response => response.json())
    .then(logs => {
        logs.forEach(log => {
        activityCard(log)
        })
    })
}

function activityCard(log){
    if(localStorage.getItem('token')){
        let type = log.type.toLowerCase()
        if(type === "run"){
            runCard(log)
        }if(type === "ride"){
            rideCard(log)
        }if(type === "yoga"){
            yogaCard(log)
        }if(type === "workout"){
            meditationCard(log)
        }
    }else {
        feedMessage.textContent = "You must be logged in to view your MVMNT"
    }
}

function runCard(log){
    const rightCard = document.createElement('div')
    const leftCard = document.createElement('div')
    const activityTile = document.createElement('div')
    const title = document.createElement('h2')
    const activityTypeDateTime = document.createElement('p')
    const workoutDetails = document.createElement('div')
    const duration = document.createElement('p')
    const distance = document.createElement('p')
    const averageSpeed = document.createElement('p')
    const maxElevation = document.createElement('p')
    const mapDiv = document.createElement('div')

    leftCard.className = 'left-card'
    rightCard.className = 'run-right-card'
    activityTile.className = 'run-activity-tile'
    workoutDetails.className = 'run-workout-details'
    title.className = 'run-title'
    const logID = log.id

    mapDiv.id = `${logID}`
    mapDiv.style.height = "512px"
    mapDiv.style.width = "512px"
    leftCard.append(mapDiv)
    activityTile.append(leftCard)
    activitiesSection.append(activityTile)

    let startLat = log.start_latitude
    let startLng = log.start_longitude
    let mymap = L.map(`${logID}`).setView([startLat, startLng], 14);
    L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=CaYElmhnQOLH2x72HVt9', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    let coordinates = L.Polyline.fromEncoded(log.map.summary_polyline)
    let latLng = coordinates.getLatLngs()
    let runPolyLine = new L.Polyline(latLng, {
    color: 'rgb(107, 162, 73)',
    weight: 4, 
    opacity: 0.8,
    smoothFactor: 2    
    })
    runPolyLine.addTo(mymap)

    title.textContent = log.name
    let dateTime = log.start_date_local
    activityTypeDateTime.textContent = dateAndTime(dateTime)
    let durationMinutes = (log.elapsed_time / 60).toFixed()
    duration.textContent = `${durationMinutes} minutes of movement`
    let distanceMiles = (log.distance * 0.00062).toFixed(2)
    distance.textContent = `-  Distance: ${distanceMiles} miles`
    let averageSpeedCalc = (log.average_speed * 2.23694).toFixed(2)
    averageSpeed.textContent = `-  Avg Speed: ${averageSpeedCalc} mph`
    let maxElevationCalc = (log.elev_high * 3.28).toFixed(2)
    maxElevation.textContent = `-  Max Elevation: ${maxElevationCalc} ft`
    
    workoutDetails.append(duration, activityTypeDateTime, distance, averageSpeed, maxElevation)
    rightCard.append(title, workoutDetails)
    activityTile.append(rightCard)
    activitiesSection.append(activityTile)
}

function rideCard(log){
    const image = document.createElement('img')
    const leftCard = document.createElement('div')
    const rightCard = document.createElement('div')
    const activityTile = document.createElement('div')
    const workoutDetails = document.createElement('div')
    const title = document.createElement('h2')
    const activityTypeDateTime = document.createElement('p')
    const duration = document.createElement('p')
    const distance = document.createElement('p')
    const averageSpeed = document.createElement('p')
    const averagePowerOutput = document.createElement('p')
    const averageHeartRate = document.createElement('p')

    leftCard.className = 'left-card'
    rightCard.className = 'right-card'
    activityTile.className = 'activity-tile'
    workoutDetails.className = 'workout-details'
    title.className = 'title'
    image.id = 'peloton-image'
    image.src = "images/peloton_image.png"

    title.textContent = log.name
    let dateTime = log.start_date_local
    activityTypeDateTime.textContent = dateAndTime(dateTime)
    let durationMinutes = (log.elapsed_time / 60).toFixed()
    duration.textContent = `${durationMinutes} minutes of movement`
    let distanceMiles = (log.distance * 0.00062).toFixed(2)
    distance.textContent = `-  Distance: ${distanceMiles} miles`
    let calculatedAverageSpeed = (log.average_speed * 2.23694).toFixed(2)
    averageSpeed.textContent = `-  Avg Speed: ${calculatedAverageSpeed} mph`
    let heartRate = log.average_heartrate
    if (heartRate === undefined){
        heartRate = "n/a"
    }
    averageHeartRate.textContent = `-  Avg Heart Rate: ${heartRate} bpm`
    let powerOutput = log.average_watts
    if (powerOutput === undefined){
        powerOutput = "n/a"
    }
    averagePowerOutput.textContent =`-  Avg Power Output: ${powerOutput} watts`

    leftCard.append(image)
    workoutDetails.append(duration, activityTypeDateTime, distance, averageSpeed, averagePowerOutput, averageHeartRate)
    rightCard.append(title, workoutDetails)
    activityTile.append(leftCard, rightCard)
    activitiesSection.append(activityTile)
}

function yogaCard(log){
    const leftCard = document.createElement('div')
    const rightCard = document.createElement('div')
    const activityTile = document.createElement('div')
    const workoutDetails = document.createElement('div')
    const title = document.createElement('h2')
    const activityTypeDateTime = document.createElement('p')
    const duration = document.createElement('p')
    const image = document.createElement('img')

    leftCard.className = 'left-card'
    rightCard.className = 'right-card'
    activityTile.className = 'activity-tile'
    workoutDetails.className = 'workout-details'
    title.className = 'title'
    image.id = 'yoga-image'
    image.src = "images/yoga_image.png"

    title.textContent = log.name
    let dateTime = log.start_date_local
    activityTypeDateTime.textContent = dateAndTime(dateTime)
    let durationMinutes = (log.elapsed_time / 60).toFixed()
    duration.textContent = `${durationMinutes} minutes of movement`

    leftCard.append(image)
    workoutDetails.append(duration, activityTypeDateTime)
    rightCard.append(title, workoutDetails)
    activityTile.append(leftCard, rightCard)
    activitiesSection.append(activityTile)
}

function meditationCard(log){
    const leftCard = document.createElement('div')
    const rightCard = document.createElement('div')
    const activityTile = document.createElement('div')
    const workoutDetails = document.createElement('div')
    const title = document.createElement('h2')
    const activityTypeDateTime = document.createElement('p')
    const duration = document.createElement('p')
    const image = document.createElement('img')

    leftCard.className = 'left-card'
    rightCard.className = 'right-card'
    activityTile.className = 'activity-tile'
    workoutDetails.className = 'workout-details'
    title.className = 'title'
    image.id = 'meditation-image'
    image.src = "images/meditation_image.png"

    title.textContent = log.name
    let dateTime = log.start_date_local
    activityTypeDateTime.textContent = dateAndTime(dateTime)
    let durationMinutes = (log.elapsed_time / 60).toFixed()
    duration.textContent = `${durationMinutes} minutes of zen`

    leftCard.append(image)
    workoutDetails.append(duration, activityTypeDateTime)
    rightCard.append(title, workoutDetails)
    activityTile.append(leftCard, rightCard)
    activitiesSection.append(activityTile)
}

function dateAndTime(dateTime){
    let dateTimeParsed = new Date(dateTime)
    let month = dateTimeParsed.getMonth() + 1
    let day = dateTimeParsed.getDate()
    let year = dateTimeParsed.getFullYear()
    let hours = dateTime.slice(11,13)
    let ampm = "AM"
    if(hours > 11){
        ampm = "PM"
    }if(hours > 12){
        hours -= 12
    }
    let minutes = dateTimeParsed.getMinutes()
    if(minutes < 10){
        minutes = "0" + minutes
    }
    return `on ${month}-${day}-${year} at ${hours}:${minutes} ${ampm}`
}





/*
 * Utility functions to decode/encode numbers and array's of numbers
 * to/from strings (Google maps polyline encoding)
 *
 * Extends the L.Polyline and L.Polygon object with methods to convert
 * to and create from these strings.
 *
 * Jan Pieter Waagmeester <jieter@jieter.nl>
 *
 * Original code from:
 * http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/
 * (which is down as of december 2014)
 */
(function () {
'use strict';

var defaultOptions = function (options) {
    if (typeof options === 'number') {
        // Legacy
        options = {
            precision: options
        };
    } else {
        options = options || {};
    }

    options.precision = options.precision || 5;
    options.factor = options.factor || Math.pow(10, options.precision);
    options.dimension = options.dimension || 2;
    return options;
};

var PolylineUtil = {
    encode: function (points, options) {
        options = defaultOptions(options);

        var flatPoints = [];
        for (var i = 0, len = points.length; i < len; ++i) {
            var point = points[i];

            if (options.dimension === 2) {
                flatPoints.push(point.lat || point[0]);
                flatPoints.push(point.lng || point[1]);
            } else {
                for (var dim = 0; dim < options.dimension; ++dim) {
                    flatPoints.push(point[dim]);
                }
            }
        }

        return this.encodeDeltas(flatPoints, options);
    },

    decode: function (encoded, options) {
        options = defaultOptions(options);

        var flatPoints = this.decodeDeltas(encoded, options);

        var points = [];
        for (var i = 0, len = flatPoints.length; i + (options.dimension - 1) < len;) {
            var point = [];

            for (var dim = 0; dim < options.dimension; ++dim) {
                point.push(flatPoints[i++]);
            }

            points.push(point);
        }

        return points;
    },

    encodeDeltas: function (numbers, options) {
        options = defaultOptions(options);

        var lastNumbers = [];

        for (var i = 0, len = numbers.length; i < len;) {
            for (var d = 0; d < options.dimension; ++d, ++i) {
                var num = numbers[i].toFixed(options.precision);
                var delta = num - (lastNumbers[d] || 0);
                lastNumbers[d] = num;

                numbers[i] = delta;
            }
        }

        return this.encodeFloats(numbers, options);
    },

    decodeDeltas: function (encoded, options) {
        options = defaultOptions(options);

        var lastNumbers = [];

        var numbers = this.decodeFloats(encoded, options);
        for (var i = 0, len = numbers.length; i < len;) {
            for (var d = 0; d < options.dimension; ++d, ++i) {
                numbers[i] = Math.round((lastNumbers[d] = numbers[i] + (lastNumbers[d] || 0)) * options.factor) / options.factor;
            }
        }

        return numbers;
    },

    encodeFloats: function (numbers, options) {
        options = defaultOptions(options);

        for (var i = 0, len = numbers.length; i < len; ++i) {
            numbers[i] = Math.round(numbers[i] * options.factor);
        }

        return this.encodeSignedIntegers(numbers);
    },

    decodeFloats: function (encoded, options) {
        options = defaultOptions(options);

        var numbers = this.decodeSignedIntegers(encoded);
        for (var i = 0, len = numbers.length; i < len; ++i) {
            numbers[i] /= options.factor;
        }

        return numbers;
    },

    encodeSignedIntegers: function (numbers) {
        for (var i = 0, len = numbers.length; i < len; ++i) {
            var num = numbers[i];
            numbers[i] = (num < 0) ? ~(num << 1) : (num << 1);
        }

        return this.encodeUnsignedIntegers(numbers);
    },

    decodeSignedIntegers: function (encoded) {
        var numbers = this.decodeUnsignedIntegers(encoded);

        for (var i = 0, len = numbers.length; i < len; ++i) {
            var num = numbers[i];
            numbers[i] = (num & 1) ? ~(num >> 1) : (num >> 1);
        }

        return numbers;
    },

    encodeUnsignedIntegers: function (numbers) {
        var encoded = '';
        for (var i = 0, len = numbers.length; i < len; ++i) {
            encoded += this.encodeUnsignedInteger(numbers[i]);
        }
        return encoded;
    },

    decodeUnsignedIntegers: function (encoded) {
        var numbers = [];

        var current = 0;
        var shift = 0;

        for (var i = 0, len = encoded.length; i < len; ++i) {
            var b = encoded.charCodeAt(i) - 63;

            current |= (b & 0x1f) << shift;

            if (b < 0x20) {
                numbers.push(current);
                current = 0;
                shift = 0;
            } else {
                shift += 5;
            }
        }

        return numbers;
    },

    encodeSignedInteger: function (num) {
        num = (num < 0) ? ~(num << 1) : (num << 1);
        return this.encodeUnsignedInteger(num);
    },

    // This function is very similar to Google's, but I added
    // some stuff to deal with the double slash issue.
    encodeUnsignedInteger: function (num) {
        var value, encoded = '';
        while (num >= 0x20) {
            value = (0x20 | (num & 0x1f)) + 63;
            encoded += (String.fromCharCode(value));
            num >>= 5;
        }
        value = num + 63;
        encoded += (String.fromCharCode(value));

        return encoded;
    }
};

// Export Node module
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = PolylineUtil;
}

// Inject functionality into Leaflet
if (typeof L === 'object') {
    if (!(L.Polyline.prototype.fromEncoded)) {
        L.Polyline.fromEncoded = function (encoded, options) {
            return L.polyline(PolylineUtil.decode(encoded), options);
        };
    }
    if (!(L.Polygon.prototype.fromEncoded)) {
        L.Polygon.fromEncoded = function (encoded, options) {
            return L.polygon(PolylineUtil.decode(encoded), options);
        };
    }

    var encodeMixin = {
        encodePath: function () {
            return PolylineUtil.encode(this.getLatLngs());
        }
    };

    if (!L.Polyline.prototype.encodePath) {
        L.Polyline.include(encodeMixin);
    }
    if (!L.Polygon.prototype.encodePath) {
        L.Polygon.include(encodeMixin);
    }

    L.PolylineUtil = PolylineUtil;
}
})();