# MVMNT
> Appreciate Your Movement


## General info
MVMNT is a user-based web application to view and interract with movement/exercise data recorded and/or synced to the user's Strava account. OAuth setup is required to access user-specific Strava data, which will be developed in future updates. 

## Intro Video
[MVMNT on YouTube](https://youtu.be/22tom38xRHs)

## Technologies
* Ruby - v 2.6.5
* Rails - v 6.1.2.1
  * JWT
  * Bcrypt

* Javascript 
  * Leaflet
  * Google Maps: Polyline Encoding
  * OAuth
* HTML
* CSS


## Setup
To utilize MVMNT, install locally using the following command:
```
git clone git@github.com:natekcroteau/MVMNT.git
```

Backend setup:
```
bundle install
rails db:migrate
```

Start the backend, then frontend server with the following commands in the respective directory:

backend: 
```
rails s
```
frontend:
```
lite-sever
```


## Code Example
```
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
    let mymap = L.map(`${logID}`).setView([startLat, startLng], 14)
    L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=CaYElmhnQOLH2x72HVt9',{
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(mymap)

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
```

## Features
* Create users and sign-in with authentication
* User must be logged-in and authorize with Strava to access MVMNT Feed
* MVMNT Feed allows the user to view customized, up-to-date movement and exercise activity details, beginning with the most-recent Strava sync.
  * Details are presented in a sport-specific manner:
    * Example: Cycling activity is synced from a Peloton bike and includes total duration(mins) and distance(miles), among average speed(mph), power output(watts), and heart-rate(bpm).
    * Example: Run activity is synced from the mobile application and includes GPS coordinates(dynamically plotted on Leaflet map), total duration(mins) and distance(miles), average speed(mph), and maximum eleveation(ft).
* The user is able to remove authentication by logging out


## To-do list:
* Develop automated Strava Authentication during user creation.
* Further develop presentation and interaction with MVMNT feed details.


## Status
Project functions as intended for single user, with multiple user functionality planned.


## Inspiration
As a former exercise physiologist, biometric data is all powerful. Viewing and interpretting this data allows for in-depth analysis of the physiological feedback that occurred during recorded exercise, allowing the user to better understand their cellular response(as a whole) to stress(movement). MVNMT uses minimalistic styling to allow the user to appreciate their movement.


## Contact
Created by [Nate Croteau](https://github.com/natekcroteau)
