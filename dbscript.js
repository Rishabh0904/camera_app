// Database create/open -> camera
// Database objectSore -> gallery
// photo capture / video store -> gallery(obs) store
// format
// data = [
//     nId:01309030,
//     type : "img"/"vid",
//     media: actual content -> img:todataurl/vid:blob
// ]

let dbAccess;
let request = indexedDB.open("Camera", 1);

request.addEventListener("upgradeneeded", function(){
    let db = request.result;
    db.createObjectStore("gallery", {keyPath : "nId"});
});

request.addEventListener("success", function(){
    dbAccess = request.result;
})

request.addEventListener("error", function(){
    alert("error!!!!!!!!!!!!!!!");
})

function addMedia(type, media){
    let tx = dbAccess.transaction("gallery", readwrite);
    let galleryObjectStore = tx.ocjecStore("gallery");
    let data = {
        nId : Date.now(),
        type,
        media

        // {
        //  type : type,
        // media : media 
        // }
    }
    galleryObjectStore.add(data);
}