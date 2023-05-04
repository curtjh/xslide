# xslide
Javascript Slideshow Class

Example implementation in xslide.html file.

Pure javascript class that will produce a configurable slideshow when passed a comma seperated string of images. Example image of how this looks is in the xslide_default.png file. 


```
    let pics = getPics(); // helper function you would create to get comma sep list of image paths to pass to class
    
    let xslide = new xslide(pics);
    xslide.startSlides();
    
```

here is an example with some config options set. This minimal config will produce a slideshow with no navbar or thumb images or close icon.
Arrow keyboard keys will advance slides as well as clicking/tapping image itself, and escape will close the whole show along with clicking away from image. This ill 
look just like the xslide_default.png example image but with a larger image centered on screen with no buttons at all.

```

    let pics = getPics(); // helper function you would create to get comma sep list of image paths to pass to class
    
    let slide = new xslide(pics);
    slide.setProp("enableEnlargeImage",false);
    slide.setProp("startSlidesEnlarged",true);
    slide.setProp("showNavBar",false);
    slide.setProp("noCloseButton",true);

    slide.startSlides(); 
    

```
Here is another example adding your own buttons to the side menu. This is an example taken from an implementation I have that sets the orientatin of an image permanently using a php script. But it could just rotate the image for viewing, make it do whatever.


```
    function showSlideAdditionalButtons(clickedThumb) {

        let rot180 = `

        <button id="rotate180" class="rotateIMG" data-deg="180" data-noticeid="SomeSpecialID" title="Rotate Image 180 degrees clockwise">

            <img src="/img/rot180.png" />

        </button>

        `;

        let rot90 = `

            <button id="rotate90" class="rotateIMG" data-deg="90" data-noticeid="SomeSpecialID" title="Rotate Image 90 degrees clockwise">

                <img src="/img/rot90.png" />

            </button>

        `;

        let xslide = new xslide(pics);

        slide.addSideButton(rot180);
        slide.addSideButton(rot90);

        xslide.setProp("imgStartIDX",clickedThumb.dataset.idx); // use data set idx value to show this image

    }

```
There are several configuration options. Here is the config object with the default options when using only the 1st default example code above:

   
```
imgList: null // comma sep list of images paths to dispaly in slideshow
,maxImages: 20 // list will be culled to this number if it is greater. Extras will be ignored.
,imgStartIDX: 0 // image to start with (array index from list)
,slideContainerBackground: "rgba(0,0,0,.75)"
,slideContainerBlur: "8px" // backdrip-filter css property to blur background. Only works on translucent backgrounds (so use rgba for background above)
,slideContainerFadeSpeed: "200ms" // spee at which whole slideshow fades in at start
,enableEnlargeImage: true // a button will be placed in the side bar that will remove the bottom section of the show (thumbs and controls) and use that space to make the image a bit bigger
                          // a button will appear to restore the bottom section upon removing it. this will also activate up and down arrow keyboard keys to hide and show respectively
,startSlidesEnlarged: false // if true, slides will open with no bottom menu or thumbs, and the image will be enlargeed to use that space. arrow keys and image click will be only navigation tools visible. 
                      // up and down arrow keys will enlarge/reduce and hide/show menu to toggle bottom menu and thumbs if desired.

// thumb options
,thumbImageHover: true // an outline will appear on hover over thumbs, look defined below
,thumbImageHoverColor: "orange"
,thumbImageChosenColor: "aqua"
,thumbImageBorderRadius: "10px"

,arrowKeyAdvance: true // clicking left and right arrows advances slides accordingly

//closing options
,clickElsewhereClose: true // clicking on areas not defined with the 'noCloseClick' class will close the slideshow. This is anywhere but thumbs, navbar, or image itself
,noCloseClickClass: "XnoCloseClickX" // elements with this class will not close the slide show even if elewhere click is enabled and they are elsewhere
,escapeToClose: true // escape closes slideshow. However, it can be last in line with escape reducing the screen, then stopping a slideshow, THEN it will close altogether
,noCloseButton: false // hide close button from the side

//slideShow options
,autoAdvanceSlides: false // if enabled, slides will advance to next pic ofter 'autoAdvanceMS' value below
,slideTransitionFadeSpeed: "800ms" // transition fade between slides
,autoAdvanceMS: 4000 // numeric value  representing milliseconds to wait before advancing to next pic if 'autoAvanceSlides' enabled
,imgClickAdvance: true // clicking main image advances to next image, false it should not
,imgAdvanceStopsShow: false // if user advances slides in any way (arrow keys, arrow buttons click, thumbs click, image click), slideshow stops, fase = timer restarts
,hideStartButton: false // will hide the start and stop slideshow buttons regardless of slideshow state
,startAdvancesImage: true // true: upon starting slideshow, it will advance immediatel to next image. False, it will not advance, just start the slide timer and advance after its up
,escStopsShow: true // if true, escape will stop auto slide show. This will supress the normal behavior of escape closing the whole slideshow. It will the next time esc is hit


//nav bar (forward, back, play, close) styling
,showNavBar: true // ture = if there is more than one image, show the navbar. False = supress navbar regardless of image count
,navBarWidth: "325px"
,navBarBackground: "linear-gradient(to top, rgb(25,25,25), rgb(65,75,85))"
,navBarTextColor: "aqua"
,navBarBorderRadius: "8px"
,navBarBorderBoxShadow: "none"
,navBarHasCloseButton: true // show a close button in the nav bar if it's present
,navBarHoverTextColor: "orange"

,buttonBackground: "linear-gradient(to top, rgb(60,60,60), rgb(110,130,150))"
,buttonBackgroundHover: "linear-gradient(to bottom, rgb(130,150,170),rgb(70,70,70))"

,otherButtons: [] // add additional buttons. this is populated using the "addButton" and would be added underneath the "close" button or in that area if htere isn't one
// buttons will be 40px by 40px, so just an image, and a web accessible image/htmlcode should be added to the button. Title can be added too

```
