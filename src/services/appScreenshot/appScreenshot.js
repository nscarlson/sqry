const {desktopCapturer, screen} = require('electron');

/**
 * Create a screenshot of your electron app. You can modify which process to render in the conditional line #61.
 * In this case, filtered using the title of the document.
 *
 * @param callback {Function} callback receives as first parameter the base64 string of the image
 * @param imageFormat {String} Format of the image to generate ('image/jpeg' or 'image/png')
 **/
function appScreenshot(callback, imageFormat) {
     var _this = this;
     this.callback = callback;
     imageFormat = imageFormat || 'image/jpeg';
     
     this.handleStream = (stream) => {
         // console.log('stream',stream);
         // Create hidden video tag
         var video = document.createElement('video');
         video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
         // Event connected to stream
         video.onloadedmetadata = function () {
             // Set video ORIGINAL height (screenshot)
             video.style.height = this.videoHeight + 'px'; // videoHeight
             video.style.width = this.videoWidth + 'px'; // videoWidth
 
             // Create canvas
             var canvas = document.createElement('canvas');
             canvas.width = this.videoWidth;
             canvas.height = this.videoHeight;
             var ctx = canvas.getContext('2d');
             // Draw video on canvas
             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
 
             if (_this.callback) {
                 // Save screenshot to jpg - base64
                 _this.callback(canvas.toDataURL(imageFormat));
             } else {
                 console.log('Need callback!');
             }
 
             // Remove hidden video tag
             video.remove();
             try {
                 // Destroy connect to stream
                 stream.getTracks()[0].stop();
             } catch (e) {}
         }
         video.src = URL.createObjectURL(stream);
         document.body.appendChild(video);
     };
 
     this.handleError = function(e) {
         console.log(e);
     };
 
     desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
         if (error) throw error;
         // console.log(sources);
         for (let i = 0; i < sources.length; ++i) {
             console.log(sources);
             // Filter: main screen
             if (sources[i].name === document.title) {
                 navigator.webkitGetUserMedia({
                     audio: false,
                     video: {
                         mandatory: {
                             chromeMediaSource: 'desktop',
                             chromeMediaSourceId: sources[i].id,
                             minWidth: 1280,
                             maxWidth: 4000,
                             minHeight: 720,
                             maxHeight: 4000
                         }
                     }
                 }, this.handleStream, this.handleError);
                 return
             }
         }
     });
 }