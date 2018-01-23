README.md

This is a weather app that allows as user to enter in a zip code and check the current weather with the National Weather Service.

* It will send a GET request to the server. :white_check_mark:
<!-- It will create a session cookie and return that to the client.
 -->

* The server will check if it has current info for the zip code already stored :white_check_mark:

* If no zip code data is available for the current day: :white_check_mark:

* The server will check for zipcode data. :white_check_mark:

* If not available, the server will then form a GET request for zipcode geocoding to send to Google Maps. :white_check_mark:

* The server will respond with stored data if available. :white_check_mark:

* If current weather data for zip is not a available in the database: :white_check_mark:

* The server will then form a GET request for retrieving weather data from NWS. :white_check_mark:

* NWS will send back requested data in XML format. :white_check_mark:

* The server will accept that data and store it into MongoDB. :white_check_mark:

* The server will then send a response back to the client. :white_check_mark:

* The client will then send a GET request to retrieve back the current data. :x: OBE, fulfilled by an automatic response to the client after post.


* Alternate page view may render a 3-day forecast for the zipcode, or at least have a link for it. :white_check_mark: Pulls in full NWS forecast page

* Alternate page view may have a historical view of the weather for the zipcode. :x: Not built

#mvp-starter
This is a project I completed as a student at [hackreactor](http://hackreactor.com). This project was worked on solo.

# To start:
* First start MongoDB by typing "mongod" in a new shell.
* On a new shell, navigate to the server directory, type "nodemon"
