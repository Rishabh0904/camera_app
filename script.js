let video = document.querySelector("video");
let body = document.querySelector("body");
let filters = document.querySelectorAll(".filter")
let vidbtn = document.querySelector("button#video");
let imgbtn = document.querySelector("button#image");
let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");
let constraints = { video: true };
let mediaRecorder;
let isRecording = false;
let chunks = [];
let currZoom = 1;
let minZoom = 1;
let maxZoom = 3;


let filter = "";
// --------------- adding listners for applying filters-----------------
for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function(e){
        filter = e.currentTarget.style.backgroundColor;
        removeFilter();
        applyFilter(filter);
    })
}
// ----------------------------------------------------------------------

// -----------------------zoom-in functionality-------------------------
zoomIn.addEventListener("click", function(){
    let vidCurScale = video.style.transform.split("(")[1].split(")")[0];
    // console.log(vidCurScale);
    if(vidCurScale > maxZoom){
        return;
    }else{
        currZoom = Number(vidCurScale)  + 0.1;
        video.style.transform = `scale(${currZoom})`;
    }
})
// ----------------------------------------------------------------------

// ----------------------zoom-out functionality--------------------------
zoomOut.addEventListener("click", function(){
    if(currZoom>minZoom){
        currZoom = currZoom - 0.1;
        video.style.transform = `scale(${currZoom})`;
    }
})
// ------------------------------------------------------------------------

// start and stop are predefined functions in mediaRecorder.
//  ---------------------video recording-----------------------
vidbtn.addEventListener("click", function () {
    let innerDiv = vidbtn.querySelector("div");
    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        // vidbtn.innerText = "Record";
        innerDiv.classList.remove("record-animation");
    } else {
        mediaRecorder.start();
        // triggers the start of recording
        filter = "";
        removeFilter();
        isRecording = true;
        // vidbtn.innerText = "Recording...";
        innerDiv.classList.add("record-animation");
    }
})
// --------------------------------------------------------------

// ----------------------------img capture-----------------------
imgbtn.addEventListener("click", function () {
    let innerDiv = imgbtn.querySelector("div");
    innerDiv.classList.add("capture-animation");
    setTimeout(function () {
        innerDiv.classList.remove("capture-animation");
    }, 500);
    capture();
})
// ---------------------------------------------------------------------

// ------------------------getting data from browser---------------------
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
        video.srcObject = mediaStream;
        mediaRecorder = new MediaRecorder(mediaStream);
        // mediaStream ko mediaRecorder mein dalenge th data record krna shuru kr dega
        mediaRecorder.addEventListener("dataavailable", function (e) {
            // dataavailable inbuilt event of mediaRecorder
            chunks.push(e.data);
            // chunks mein data turant push nhi hoga jb mediaRecorder ki limit exceed kr jaegi store krne ki
            // tbhi voh push kr dega agr humne store nhi kra toh data destroy ho jaega
        })

        mediaRecorder.addEventListener("stop", function (e) {
            let blob = new Blob(chunks, { type: "video/mp4" });
            // compile small-small chunks into one single data
            chunks = [];
            let url = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = "video.mp4";
            // is name se file download hogi
            a.click();
            a.remove();
        })
    })
// --------------------------------------------------------------------------


function capture() {
    let c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    // videoWidth and videoHeight jo h vedio ki height aur width btaega na ki video element ki height and width
    // we are capturing the image drawn on canvas
    let ctx = c.getContext("2d");
    ctx.beginPath();
    // ----------for zoom--------------------
    ctx.translate(c.width / 2, c.height / 2);  // isse pointer center pr aega
    ctx.scale(currZoom, currZoom);             // zoom ki values dali jaengi
    // canvas ka size same rehta h, canvas ke andr jo draw hota h uska size scale hota h
    ctx.translate(-c.width / 2, -c.height / 2);  //moving pointer to top-left
    // ---------------------------------------

    ctx.drawImage(video, 0, 0);
    // draw image saare kaam krne krne ke baad hi likhna chaiye
    // ----= to capture image with filter --------------
    if(filter != ""){
        ctx.fillStyle = filter;
        ctx.fillRect(0, 0, c.width, c.height);
    }
    let a = document.createElement("a");
    a.href = c.toDataURL()
    // video pr us time pr jo bhi frame hoga voh url mein convert ho jaega
    a.download = "image.jpg";
    a.click();
    a.remove();
}

function applyFilter(filterColor){
    let filterDiv = document.createElement("div");
    filterDiv.classList.add("filter-div");
    filterDiv.style.backgroundColor = filterColor;
    body.appendChild(filterDiv);
}

function removeFilter(){
    let filterDiv = document.querySelector(".filter-div");
    if(filterDiv){
        filterDiv.remove();
    }
}