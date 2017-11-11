README.md

This is a weather app that allows as user to enter in a zip code and check the current weather with the National Weather Service.

It will send a GET request to the server.
<!-- It will create a session cookie and return that to the client.
 -->

The server will then form a GET request to send to the NWS.
NWS will send back requested data.
The server will accept that data and store it into MongoDB.
The server will then send a response back to the client.
The client will then send a GET request to retrieve back the current data.


Alternate page view may render a 3-day forecast for the zipcode.
Alternate page view may have a historical view of the weather for the zipcode.