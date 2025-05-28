  const video = document.querySelector('.player');
  const canvas = document.querySelector('.photo');
  const ctx = canvas.getContext('2d');
  const strip = document.querySelector('.strip');
  const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video:true, audio:true})
    .then(localMediaStream =>{
        console.log(localMediaStream);
        video.srcObject = localMediaStream;
        video.play();
    }).catch(err =>{
        console.error('Oh No Failed',err); }); }
function printToCanvas(){
    const width = video.videoWidth; //Gives Video feed Dimension
    const height = video.videoHeight; 
    canvas.height = height;  // set canvas dimensions eqv.video feed dimension
    canvas.width = width;
return setInterval(()=>{ //
//  Usage of closure the variable here, declared outside func printToCamvas() like height and width 
//  by an arrow func and thus its prefer over regular function.
//  starts drawing frame after 19ms
    ctx.drawImage(video, 0, 0, width, height); // copy current frame from video to canvas
    let pixels = ctx.getImageData(0, 0, width, height); // reterive raw pixel data from canvas.
    pixels = rgbSplit(pixels); // glitch effect
    ctx.putImageData(pixels, 0, 0); //Draws the putImageData(pixels, dx, dy) from a canvas's top left corner
    // end coordinates are known by (dx+width, dy+height); pixels is width x height drawn rectangle satarting at (dx,dy).
    }, 16); // 60fps 
}

function takePhoto(){
  snap.currentTime = 0;
  snap.play();
const data = canvas.toDataURL('image/jpeg');
const link = document.createElement('a');
link.href = data;
link.setAttribute('download', 'HelloUser');
link.innerHTML = `<img src "${data}" alt = "Hello User"/>`;
strip.insertBefore(link,strip.firstChild);
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){

        pixels.data[i + 0] = pixels.data[i + 0] + 200;
        pixels.data[i + 1] = pixels.data[i + 1] - 50;
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
    
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i - 550] = pixels.data[i + 2];
    }
    return pixels;
}

function greenScreen(pixels){
    const levels = {}
    document.querySelectorAll('.rgb input').forEach((input) =>{
        levels[input.name] = input.value;
    });

    for(let i = 0; i < pixels.data.length; i+=4) {
            red = pixels.data[i + 0];
            green = pixels.data[i + 1];
            blue = pixels.data[i + 2];
            alpha = pixels.data[i + 3];

                if (red >= levels.rmin
                && green >= levels.gmin
                && blue >= levels.bmin
                && red <= levels.rmax
                && green <= levels.gmax
                && blue <= levels.bmax) {
      pixels.data[i + 3] = 0;
    }
}
  return pixels;
}

getVideo();
video.addEventListener('canplay', printToCanvas);







