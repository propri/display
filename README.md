# display
display content on another device

## Starting the display
1. Add your images to `public/img/`
2. Start the server by running `node app.js`
3. Determine your IP
4. Open the server `<yourIP>:8080/server`
5. Open the client on the device you want to display your images on `<yourIP>:8080/client`

## Using the display
* On the server interface:
  * Top left is the currently displayed image
  * On the right is the list of available images
  * Bottom left is a preview of the next file (file hovered on the right side)
* Click on a file name on the right to display this image to the client(s)
* Use the update button to show images added after starting the server
* Use the inputs to enter the URL to an external image / an iframe
