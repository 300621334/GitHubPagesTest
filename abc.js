//Shafiq-Ur-Rehman #300621334
var filePath = "abc.txt";
var urlArray = {};//an object. Never used!!
var i = 0;
var urlArray = [];//an array.
var timeArray = [];
var timeOut;

/*if txt file has blank lines,creates "" ele in arrays.
fullArray[x] !== "" inside if() wasn't filtering & "" were still being inserted!!! 
Probably \r was being pushed as array ele & converted to ""!!!?
Regex \r\n|,  (instead of [\n,] or [\r?\n,] or [\r\n,]) solved issue. If non-windows txt file then put a '?'=> \r?\n|,
\r\n left ONLY true empty strings so fullArray[x] !== "" does work. With other attempts even though console.log showed "" in arrays but those "" were NOT being stopped by fullArray[x] !== "" and were being passed-on into urlArray etc!!! Probably "" had \r inside of them and were NOT considered EMPTY in true sense!!!
http://www.w3schools.com/jsref/jsref_regexp_whitespace.asp
http://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
http://stackoverflow.com/questions/29558519/how-to-split-string-based-on-r-n

/\S/.test(fullArray[x])   to eliminate any array ele that contain white spaces ONLY & no text
http://www.w3schools.com/jsref/jsref_obj_regexp.asp
*/





function readTextFile(file) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {//wiring done bforehand to respond to status change AFTER xhr.open/send
        if (xhr.readyState === 4 && xhr.status === 200) {
            var fullArray = xhr.responseText.split(/\r?\n|,/);//response rcvd AFTER xhr.open/send

            console.log(fullArray);


            urlArray = [];//clear any previous ele. So aft UPDATE arrays r rebuilt//don't do this inside for() else only one img remains
            timeArray = [];

            for (var x = 0; x < fullArray.length; x++) {

                if (x % 2 === 0 && fullArray[x] !== "" && /\S/.test(fullArray[x])) //odd item. index# 0,2,4,6,8...
                    urlArray.push(fullArray[x]);

                else if (fullArray[x] !== "" && /\S/.test(fullArray[x]))
                    timeArray.push(fullArray[x]);
            }//for() ends

            console.log(urlArray);
            console.log(timeArray);

            document.getElementById("slideshow").style.marginTop = (screen.height * 0.15) + "px";
            document.getElementsByTagName("footer")[0].style.marginTop = ((screen.height) * 0.05) + "px";

            populate();
        }//outer-if ends
    }//fn ends

    xhr.open("GET", file, true);//true=async
    xhr.send();
}


function fadeEffect() {
    $("#img").fadeTo("fast", 0.01, populate);//fades till opacity becomes 0.01//(speed,opacity,callBack to this method to go to next img)
    clearCanvas(canvas, ctx);
    mouseDown = 0;
}


function populate() {

    //while (i < urlArray.length) {//while NOT needed since we break; & reset i=0 once looped thru array
        var image = document.getElementById("img");
        image.src = urlArray[i].trim();//trim coz in txt file comma/or end of line may have space(s) beside em  
        $("#img").fadeTo("fast", 1);//gradually appears till opacity becomes 1//(speed,opacity,[callback fn optional])//img shows up slowly
        timeOut = setTimeout(fadeEffect, timeArray[i]);//fadeEffect will callback populate()//img stays for this much time=timeArray[i] then fades away
        i++;//to go to next img
        if (i === urlArray.length)//if reached beyond LAST img then reset to 1st img(index# 0)
        { i = 0 }
        //break;
    //}
}


function backBtn() {
    clearTimeout(timeOut);//so that fadeEffect() that was to occur, is cancelled. & later-on re-started by populate()<<fadeEffect()
    $("#img").stop(true, true);//stop fadeTo animation. Remove sth in queue. Complete ongoing animation.
    if (i === 1)//i.e. 1st img is on display while i++ in populate() has inc index to 0+1=1
        i = urlArray.length - 1;//display LAST img
    else if (i === 0)//i.e. LAST img is on display
        i = urlArray.length - 2;//show 2nd-to-LAST img
    else
        i = i - 2;//i-1 img is on display while so i-2 is to be shown if back-btn clicked

    fadeEffect();//will callBack populate() in turn
}




//===========================DRAW Canvas=======================================
//https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/
// Variables for referencing the canvas and 2dcanvas context
var canvas, ctx;

// Variables to keep track of the mouse position and left-button status 
var mouseX, mouseY, mouseDown = 0;

// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(ctx, x, y, size) {
    // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
    r = 0; g = 0; b = 0; a = 255;

    // Select a fill style
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";

    // Draw a filled circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
    mouseDown = 1;
    drawDot(ctx, mouseX, mouseY, 12);
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown = 0;
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) {
    // Update the mouse co-ordinates when moved
    getMousePos(e);

    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown == 1) {
        drawDot(ctx, mouseX, mouseY, 12);
    }
}
// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    //if (!e)
    //    var e = event;

    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}


// Draw something when a touch start is detected
function sketchpad_touchStart() {
    // Update the touch co-ordinates
    getTouchPos();

    drawDot(ctx, touchX, touchY, 12);

    // Prevents an additional mousedown event being triggered
    event.preventDefault();
}

// Draw something and prevent the default scrolling when touch movement is detected
function sketchpad_touchMove(e) {
    // Update the touch co-ordinates
    getTouchPos(e);

    // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
    drawDot(ctx, touchX, touchY, 12);

    // Prevent a scrolling action as a result of this touchmove triggering.
    event.preventDefault();
}

// Get the touch position relative to the top-left of the canvas
// When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
// but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
// "target.offsetTop" to get the correct values in relation to the top left of the canvas.
function getTouchPos(e) {
    if (!e)
        var e = event;

    if (e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            touchX = touch.pageX - touch.target.offsetLeft;
            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
}

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    // Get the specific canvas element from the HTML document
    canvas = document.getElementById('sketchpad');

    // If the browser supports the canvas tag, get the 2d drawing context for this canvas
    if (canvas.getContext)
        ctx = canvas.getContext('2d');

    // Check that we have a valid context to draw on/with before adding event handlers
    if (ctx) {
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);

        // React to touch events on the canvas
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);

    }
}
//===========================End of DRAW Canvas=======================================

//addEventListener("load", function () { readTextFile(filePath); }, false);
$(window).load(function () { readTextFile(filePath); });//access object window eout quotes

//document.getElementById("next").addEventListener("click", function () { clearTimeout(timeOut); fadeEffect(); }, false);
$("#next").click(function () {//access "CSS selector"
    clearTimeout(timeOut);
    $("#img").stop(true, true);//stop animation(fade effect), remove img in queue=true, complete current animation=true//https://api.jquery.com/stop/
    fadeEffect();
});

//document.getElementById("back").addEventListener("click", backBtn, false);
$("#back").click(backBtn);

//document.getElementById("update").addEventListener("click", function () { clearTimeout(timeOut); i = 0; readTextFile(filePath); }, false);
$("#update").click(function () { clearTimeout(timeOut); $("#img").stop(true, true); i = 0; readTextFile(filePath); });
