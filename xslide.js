/* Version 2023.05.04-7:28.pm */

class xslide {

    constructor(imgArr) {

        this.XslideConfigX.imgList = imgArr;
        return this.XslideConfigX.imgList;

    };

    /** main config options **/
    XslideConfigX = {

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

    }

    /** properties  - all styles and html blocks included **/

    $SlideTimer = null; // var for the setInterval

    /**  button icons **/
    $Pause = "&#9208;&#65039;";
    $Stop = "&#9744;";
    // $CloseX = "&#128940;"; // unicode x. not consistent throughout different browsers
    $CloseX = "X";
    $Play = "&#10097;&#10097;";
    $Forward = "&#10097;";
    $Backward = "&#10096;";
    // $Rotate = "&#8635;";
    $Enlarge = "&#8691;";
    $Up = "&#8679;";
    $Down = "&#8681;";

    // Classes
    $Classes = {

        "xslide-container": {

            "position":"fixed",
            "backdropFilter": "blur(" + this.XslideConfigX.slideContainerBlur + ")",
            "zIndex":"1500",
            "top":"0px",
            "left":"0px",
            "right":"0px",
            "bottom":"0px",
            "overflow":"hidden",
            "opacity":"0",
            "padding":"10px",
            "display":"flex",
            "flexDirection":"column",
            "alignItems":"top",
            "justifyContent":"center",
            "transition":"opacity " + this.XslideConfigX.slideContainerFadeSpeed,
            "background":this.XslideConfigX.slideContainerBackground

    
        },
        "xslide-image-section": {

            "height":"calc(100vh - 200px)",
            "width":"100%",
            "position":"relative",
            "overflow":"hidden",
            "padding":"10px",
            "display":"flex",
            "alignItems":"top",
            "justifyContent":"center",
            "alignSelf":"top"
    
        },
        "xslide-main-image": {

            "maxHeight": "100%", 
            "maxWidth": "100%",
            "cursor":"pointer", // todo: if imgClickAdvance is false, this should not be a pointer make that change below
            "width":"auto",
            "height":"auto",
            "alignSelf":"center"

        },
        "xslide-bottom-section": {

            "height":"200px",
            "width":"100%",
            "textAlign":"center"

    
        },
        "xslide-image-pick-container": {

            "display":"flex",
            "gap": "20px",
            "width":"80%",
            "alignItems": "center",
            "justifyContent": "center",
            "margin":"5px auto",
            "height": "80px", 
            "overflowX":"auto"

    
        },
        "xslide-thumb-image": {

            "cursor":"pointer", 
            "maxHeight": "60px",
            "maxWidth": "85px", 
            "borderRadius": this.XslideConfigX.thumbImageBorderRadius,
            "boxShadow":"none"
   
        },
        "xslide-menu-bottom": {

            "height":"50px",
            "display":"flex",
            "justifyContent":"space-evenly",
            "alignItems":"center",
            "margin":"auto",
            "fontWeight":"bold",
            "pointerEvent":"none",
            "color":this.XslideConfigX.navBarTextColor,
            "borderRadius": this.XslideConfigX.navBarBorderRadius,
            "background":this.XslideConfigX.navBarBackground,
            "width":this.XslideConfigX.navBarWidth,
            "boxShadow":this.XslideConfigX.navBarBorderBoxShadow
    
        },
        "xslide-sidemenu": {

            "display":"flex",
            "flexDirection": "column", 
            "width": "50px", 
            "gap": "20px", 
            "justifyContent": "top", 
            "alignItems": "center",
            "height": "calc(100vh - 20px)",
            "position": "absolute", 
            "top": "0px", 
            "left": "5px", 
            "paddingTop":"10px",
            "background":"transparent"

        },
        "xslide-button": {

            "fontSize":"1.8rem",
            "cursor":"pointer",
            "width":"40px",
            "height":"40px",
            "borderRadius":"25%",
            "background":this.XslideConfigX.buttonBackground,
            "position":"relative",
            "lineHeight": "40px",
            "border":"none",
            "color":this.XslideConfigX.navBarTextColor,
            "boxShadow":"none"
    
        },
        "xslide-button-icon":{

            "pointerEvents":"none"

        },
        "xslide-left-arrow": {

            "marginRight": ".2rem",
            "transform": "scale(1.8, 0.8)",
            "pointerEvents":"none",
                
        },
        "xslide-right-arrow": {

            "marginLeft": ".2rem",
            "transform": "scale(1.8, 0.8)",
            "pointerEvents":"none"
                
        },
        "xslide-stop": {

            "fontWeight": "bold",
            "pointerEvents":"none"
                    
        },
        "xslide-play": {

            "letterSpacing":"-.25rem",
            "transform": "scale(1.2, 0.8)",
            "pointerEvents":"none"
    
        },
        "xslide-close":{

            "background":"linear-gradient(to bottom, rgb(190,0,0), rgb(95,0,0))",
            "fontSize":"1.6rem",
            "fontWeight":"bold",
            "color":this.XslideConfigX.navBarTextColor,

        },
        "xslide-enlarge": {

            "fontWeight":"bold",
            "fontSize":"2rem",
            "lineHeight":"2rem",
            "display":"block"

        },
        "xslide-reduce": {

            "fontWeight":"bold",
            "fontSize":"2rem",
            "lineHeight":"2rem",
            "display":"none"

        },
        "xslide-hidden":{

            "display":"none"

        },
        "xslide-button-hover": {

            "color":this.XslideConfigX.navBarHoverTextColor,
            "background":this.XslideConfigX.buttonBackgroundHover 

        },
        "xslide-button-close-hover": {

            "background":"linear-gradient(to bottom,rgb(210,0,0), rgb(115,0,0)",
            "color":"white"


        },
        "xslide-button-image":{

            "maxHeight":"90%",
            "maxWidth" : "90%",
            "pointerEvents":"none"

        },
        "xslide-thumb-hover": {

            "boxShadow":"0px 0px 10px " + this.XslideConfigX.thumbImageHoverColor

        },
        "xslide-thumb-chosen": {

            "boxShadow":"0px 0px 10px " + this.XslideConfigX.thumbImageChosenColor

        }

    }

    $NavMenu = `
    
        <div id="XslideNavMenuX" class="xslide-menu-bottom XnoCloseClickX">

            <button id="XprevX" class="xslide-button  XnoCloseClickX" title="View Previous Image"> 
                
                <div class="xslide-button-icon xslide-left-arrow">${this.$Backward}</div>

            </button>


            <button id="XstopX" class="xslide-button XnoCloseClickX" title="Stop Slide Show"> 
                
                <div class="xslide-button-icon xslide-stop">${this.$Stop}</div>

            </button>

            <button id="XplayX" class="xslide-button XnoCloseClickX" title="Start Slideshow"> 
                
                <div class="xslide-button-icon xslide-play">${this.$Play}</div>

            </button>

            <button id="XnextX" class="xslide-button XnoCloseClickX"  title="View Next Image"> 

                <div class="xslide-button-icon xslide-right-arrow" >${this.$Forward}</div>

            </button> 

            <button id="XcloseX" class="xslide-button xslide-close XnoCloseClickX" title="Close Slidesshow"> 

                <div class="xslide-button-icon" >${this.$CloseX}</div>

            </button> 

        </div>

    `;

    $SideMenu = `
    
        <div id="XsideBarX" class="xslide-sidemenu">

            <button id="XsideCloseBtnX" class="xslide-button xslide-close" style="display:none;">${this.$CloseX}</button>
            <button id="XsideStopShowX" class="xslide-button " style="display:none";>${this.$Stop}</button>
            <button id="XenlargeX" class="xslide-button xslide-enlarge" style="display:none;">${this.$Up}</button>
            <button id="XreduceX" class="xslide-button xslide-reduce" style="display:none";>${this.$Down}</button>

        </div>
    
    `;

    $SlideContainer = `
    
        <div id="XslideContainerX" class="XslideX xslide-container" style="opacity:0;">

    
            <div id="XslideIMG" class="xslide-image-section">

                        
            </div>

            <div id="XslideBottom" class="xslide-bottom-section">


            
            </div>

            ${this.$SideMenu} 

        </div>

    `;

    /**  private methods **/

    // applies single class object above to passed html element.
    #addClass(elem,classOBJ) {

        for (const [cssName, cssVal] of Object.entries(classOBJ)) {

            elem.style[`${cssName}`] = cssVal;

        }

    }

    // applies all classes above to the html elements
    #applyClasses(){

        for (const [key] of Object.entries(this.$Classes)) {

            let allElements = document.getElementsByClassName(key);

            if(allElements) {

                for(let i = 0; i < allElements.length; i++) {

                    this.#addClass(allElements[i],this.$Classes[`${key}`]);

                }

            }

        }   

    }

    #setNavStyle(key,val) {

        let navOBJ = this.$Classes["xslide-menu-bottom"];

        if(key == "navBarWidth") {

            navOBJ.width = val;

        } else if(key == "navBarBackground") {

            navOBJ.background = val;

        } else if(key == "navBarTextColor") {

            navOBJ.color = val;

        } else if(key == "navBarBorderRadius") {

            navOBJ.borderRadius = val;

        } else if(key == "navBarBorderBoxShadow") {

            navOBJ.boxShadow = val;

        } else if(key == "navBarHoverTextColor") {

            this.$Classes['xslide-button-hover'].color = val;

        } else if(key == "buttonBackgroundHover") {

            this.$Classes['xslide-button-hover'].background = val;

        } else if(key = "slideContainerBlur") {

            this.$Classes['xslide-container']["backdrop-filter"] = "blur(" + val + ")";

        }

    }

    #cleanNumVal(num,type) {

        num = parseInt(num);

        if(num == NaN) {

            return false;

        }

        type = type.trim().toLowerCase()

        if(type == "px" || type == "ms") {

            return String(num) + type;

        } else {

            return false;

        }

    }

    #setContainerBackground(cssVal) {

        this.$Classes["xslide-container"].background = cssVal;

    }

    #setThumbBorderRadius(cssVal) {

        cssVal = this.#cleanNumVal(cssVal,"px");

        if(cssVal) {

            this.$Classes['xslide-thumb-image'].borderRadius = cssVal;

        }

    }

    #setContainerFade(ms) {

        ms = this.#cleanNumVal(ms,"ms");

        if(ms) {

            this.$Classes['xslide-container'].transition = "opacity " + ms;

        }

    }


    #setTransitionFadeSpeed(ms) {

        ms = this.#cleanNumVal(ms,"ms");

        if(ms) {

            let mainImgs = document.getElementsByClassName("xslide-main-image");

            if(mainImgs) {
    
                for(let i = 0; i < mainImgs.length; i++) {
    
                    mainImgs[i].style.transition = "opacity " + ms;
    
                }
    
            }
    
        }
        
    }

    #appendExtraButtons() {

        let sideBar = document.querySelector("#XsideBarX");

        if(sideBar && (this.XslideConfigX.otherButtons).length > 0) {

            let btnArr = this.XslideConfigX.otherButtons;

            for(let i = 0; i < btnArr.length; i++) {

                sideBar.innerHTML += btnArr[i];

            }

            let domBtns = sideBar.getElementsByTagName("button");

            for(let i = 0; i < domBtns.length; i++) {

                if(!domBtns[i].classList.contains("xslide-button")) {

                    domBtns[i].classList.add("xslide-button");
                    domBtns[i].classList.add("XnoCloseClickX");
                    domBtns[i].style = {};

                    let iconIMG = domBtns[i].getElementsByTagName("img");

                    if(iconIMG.length) {

                        iconIMG[0].style = {};
                        iconIMG[0].classList.add("xslide-button-image");

                    }

                }

            }

        }

    }

    /** main methods **/

    setProp(key,val) {

        if(key == "slideContainerBackground") {

            this.#setContainerBackground(val);

        } else if(key == "slideContainerFadeSpeed") {

            this.#setContainerFade(val);

        } else if(key == "slideTransitionFadeSpeed") {

            this.#setTransitionFadeSpeed(val);

        } else if(key == "thumbImageBorderRadius") {

            this.#setThumbBorderRadius(val)

        } else if(

            key == "navBarWidth" ||
            key == "navBarBackground" ||
            key == "navBarTextColor" ||
            key == "navBarBorderRadius" ||
            key == "navBarHoverTextColor" ||
            key == "buttonBackgroundHover" ||
            key == "navBarBorderBoxShadow" 

        ) {

            this.#setNavStyle(key,val);

        }

        Object.assign(this.XslideConfigX, { [key]: val});
        return this;

    }

    // add a button to the sidebar. it will be given the button class automatically and placed under the "close" button vertically down the side of the page.
    // Styles given to this button will be ignored. Button is 40px by 40px
    // it can be given other classes, an ID, data attributes, and title. a square image is best for the contents
    //
    // example html: <button id="myID" class="someClass" title="hello world" data-idx="1234"><img src="/my/icon.png" /></button>"
    // If present, the image will be resized to fit inside the button and given appropriate style attributes
    // see private method appendExtraButtons and classes 'xslide-button' and 'xslide-button-image' for how they will look
    addSideButton(btnHTML) {

        (this.XslideConfigX.otherButtons).push(btnHTML);

    }

    startSlides() {

        let evt = window.event;

        if(evt != undefined) {

            evt.stopPropagation();

        }

        if(this.XslideConfigX.imgList == null) {

            return;

        }

        // check to see that an "XslideContainerX" isn't already present isn't already present
        if(document.querySelector("#XslideContainerX")) {

            return;

        }

        document.body.innerHTML += this.$SlideContainer;

        let slideCnt = xslide.getSlideContainer();

        let theIMG = document.querySelector("#XslideIMG");
        let theBottom = slideCnt.querySelector("#XslideBottom");

        let IMGArr = (this.XslideConfigX.imgList).split(",");
        let IMGCount = IMGArr.length;
        // let sideBar = document.querySelector("#XsideBarX");

        if(IMGCount > this.XslideConfigX.maxImages) {

            IMGArr = IMGArr.slice(0, this.XslideConfigX.maxImages);
            IMGCount = this.XslideConfigX.maxImages;

        }

        // set various data attributes
        slideCnt.dataset.elsex = this.XslideConfigX.clickElsewhereClose;
        slideCnt.dataset.escclose = this.XslideConfigX.escapeToClose;
        slideCnt.dataset.hovercolor = this.XslideConfigX.thumbImageHoverColor;
        slideCnt.dataset.chosencolor = this.XslideConfigX.thumbImageChosenColor;
        slideCnt.dataset.hover = this.XslideConfigX.thumbImageHover;
        slideCnt.dataset.autoadvance = this.XslideConfigX.autoAdvanceSlides;
        slideCnt.dataset.autoadvancems = this.XslideConfigX.autoAdvanceMS;
        slideCnt.dataset.nocloseclass = this.XslideConfigX.noCloseClickClass;
        slideCnt.dataset.arrowadvance = this.XslideConfigX.arrowKeyAdvance;
        slideCnt.dataset.imgclickadvance = this.XslideConfigX.imgClickAdvance;
        slideCnt.dataset.cntfadespeed = parseInt(this.XslideConfigX.slideContainerFadeSpeed);
        slideCnt.dataset.startstophidden = this.XslideConfigX.hideStartButton;
        slideCnt.dataset.startadvancesimage = this.XslideConfigX.startAdvancesImage;
        slideCnt.dataset.escstopsshow = this.XslideConfigX.escStopsShow;
        slideCnt.dataset.showenlarge = this.XslideConfigX.enableEnlargeImage;
        slideCnt.dataset.shownavbar = this.XslideConfigX.showNavBar;
        slideCnt.dataset.imgcount = IMGCount;

        if(this.XslideConfigX.autoAdvanceSlides) {

            slideCnt.dataset.autoadvancing = 1;

        } else {

            slideCnt.dataset.autoadvancing = 0;

        }

        let hasCloseButton = !this.XslideConfigX.clickElsewhereClose || !this.XslideConfigX.noCloseButton;
        let hasNavBar = IMGCount > 1 && this.XslideConfigX.showNavBar;

        let imgPickSection = "";

        if(IMGCount > 1) {

            imgPickSection += `
            
                <div id="XslidePickX" class="xslide-image-pick-container">
                
            `;

            for (let i = 0; i < IMGArr.length; i++) {

                imgPickSection += `
                
                    <img data-idx="${i}" class="XimgPickX xslide-thumb-image" id="xPick_${i}" src="${IMGArr[i]}" />
                
                `;

            }

            imgPickSection += "</div>";

            theBottom.innerHTML += imgPickSection;

        } else {

            document.querySelector("#XslideBottom").remove();

        }

        // display navbar if enabled
        if(hasNavBar) {

            theBottom.innerHTML += this.$NavMenu;

            if(!this.XslideConfigX.navBarHasCloseButton) {

                document.querySelector("#XcloseX").style.display = "none";

            }

            if(this.XslideConfigX.hideStartButton) {

                document.querySelector("#XplayX").style.display = "none";
                document.querySelector("#XstopX").style.display = "none";

            }

        }

        // show close button on sidebar if enabled
        if(hasCloseButton) {

            let sideCloseBtn = document.querySelector("#XsideCloseBtnX");

            if(sideCloseBtn) {

                sideCloseBtn.style.display = "block";

            }

        }

        // add any extra buttons that were added
        this.#appendExtraButtons();


        // add hover events to buttons
        let buttons = document.getElementsByClassName("xslide-button");

        if(buttons) {

            let hoverClass = this.$Classes['xslide-button-hover'];
            let regClass = this.$Classes['xslide-button'];
            let closeHover = this.$Classes['xslide-button-close-hover'];
            let regClose = this.$Classes['xslide-close'];

            let addClass = this.#addClass;

            for(let i = 0; i < buttons.length; i++) {

                buttons[i].addEventListener("mouseover",function(e) {

                    if(!e.target.matches(".xslide-close")) {

                        addClass(e.target,hoverClass);

                    } else {

                        addClass(e.target,closeHover);

                    }

                });

                buttons[i].addEventListener("mouseout",function(e) {

                    if(!e.target.matches(".xslide-close")) {

                        addClass(e.target,regClass);
    
                    } else {

                        addClass(e.target,regClose);

                    }

                });

            }

        }

        // main image presentation
        for (var i = 0; i < IMGArr.length; i++) {

            let op = 0;
            let ds = "none";
            let chosenXIMG = "";

            if(i == this.XslideConfigX.imgStartIDX) {

                op = 1;
                ds = "block"
                chosenXIMG = "chosenXIMG";

            }

            let next = i+1;
            let prev = i-1;

            if(i == 0) {

                prev = IMGArr.length-1;

            }

            if(i == (IMGArr.length-1)) {

                next = 0;

            }

            theIMG.innerHTML += `
            
                <img class="XslideIMGX xslide-main-image ${chosenXIMG} ${this.XslideConfigX.noCloseClickClass}" id="Xslide_${i}" data-idx="${i}" data-next="${next}" data-prev="${prev}" src="${IMGArr[i]}" style="opacity:${op}; display:${ds}; transition: opacity ${this.XslideConfigX.slideTransitionFadeSpeed};" />
            
            `;

        }

        // set styles. 
        this.#applyClasses();

        // after styles have been applied, things may need to override them, they go here

        // deal with showing the close or play button at startup if slides are set to auto advance upon start
        let stopBtn = document.querySelector("#XstopX");
        let playBtn = document.querySelector("#XplayX");

        if(playBtn && stopBtn) {

            if(this.XslideConfigX.autoAdvanceSlides == 1) {

                playBtn.style.display = "none";

            } else {

                stopBtn.style.display = "none";

            }

        }

        // enlarge image section if not displaying navbar
        if(!hasNavBar /*&& slideCnt.showenlarge == "true"*/) {

            let topSection = document.querySelector(".xslide-image-section");

            if(IMGCount == 1) {

                topSection.style.height = `calc(100vh - 125px)`;

                let enlargeBtn = document.querySelector("#XenlargeX");

                if(enlargeBtn) {

                    console.log("here");
                    enlargeBtn.style.display = "none";

                }

            } else {

                let bottomSection = document.querySelector("#XslideBottom");

                // console.log(topSection,bottomSection);

                let newBottomHeight = "125px";

                if(topSection && bottomSection) {

                    console.log("no nav");


                    topSection.style.height = `calc(100vh - ${newBottomHeight})`;
                    bottomSection.style.height = `${newBottomHeight}`;


                }

            }

        }

        // show arrow keys if enlarging is enabled IF image count is greater than 1

        let enalargeArrow = document.querySelector("#XenlargeX");
        let reduceArrow = document.querySelector("#XreduceX");

        if(IMGCount > 1) {

            if(this.XslideConfigX.enableEnlargeImage) {

                if(this.XslideConfigX.startSlidesEnlarged) {

                    reduceArrow.style.display = "block";
                    enalargeArrow.style.display = "none";
        
                } else {

                    reduceArrow.style.display = "none";
                    enalargeArrow.style.display = "block";

                }
                
            } else {

                reduceArrow.style.display = "none";
                enalargeArrow.style.display = "none";
                
            }

        } else {

            reduceArrow.style.display = "none";
            enalargeArrow.style.display = "none";
        
        }

        // apply hover events on thumb images
        if(this.XslideConfigX.thumbImageHover) {

            let thumbs = document.getElementsByClassName('xslide-thumb-image');
            let chosenIMG = document.querySelector(".chosenXIMG");

            if(chosenIMG) {

            let chosenIDX = chosenIMG.dataset.idx;

                if(thumbs) {

                    let hoverClass = this.$Classes['xslide-thumb-hover'];
                    let regClass = this.$Classes['xslide-thumb-image'];
                    let chosenClass = this.$Classes['xslide-thumb-chosen'];

                    let addClass = this.#addClass;

                    for(let i = 0; i < thumbs.length; i++) {

                        thumbs[i].classList.add(this.XslideConfigX.noCloseClickClass);

                        thumbs[i].addEventListener('mouseover',function(e) {

                            if(!e.target.classList.contains("XchosenX")) {
                                
                                addClass(e.target,hoverClass);

                            }

                        });

                        thumbs[i].addEventListener('mouseout',function(e) {

                            if(!e.target.classList.contains("XchosenX")) {
                               
                                addClass(e.target,regClass);

                            }
        
                        });


                        if(i == chosenIDX) {

                            for (const [cssName, cssVal] of Object.entries(chosenClass)) {
        
                                thumbs[i].style[`${cssName}`] = cssVal;
        
                            }

                            thumbs[i].classList.add("XchosenX");

                        }
        
                    }

                }

            } else {

                xslide.closeXSlide();

            }

        }

        // render container
        requestAnimationFrame(function() {

            slideCnt.style.opacity = "1";
   
        });

        // add event handlers
        document.addEventListener("click",xslide.clickHandler);
        document.addEventListener("keydown",xslide.keydownHandler);

        // start auto advance of slides if it's configured
        if(this.XslideConfigX.autoAdvanceSlides) {

            xslide.startSlideShow();

        } else if(this.XslideConfigX.startSlidesEnlarged) {

            xslide.toggleBottomSection(0);

        }

    }

    /** static methods  **/

    // sets the "chosen" outline around the thumbnail currently being viewed
    static setActiveThumb() {

        let thumbs = xslide.getThumbs();

        if(thumbs) {

            for(let i = 0; i < thumbs.length; i++) {

                thumbs[i].style.boxShadow = "none";
                thumbs[i].classList.remove("XchosenX");

            }

        }

        // get active image
        let activeImage = xslide.getActiveImage();

        // get index of that image, and chosen color for outline
        let num = activeImage.dataset.idx;

        let chosenColor = xslide.getMainDataVal('chosencolor');
        let thumbElem = xslide.getSingleThumb(num);

        thumbElem.style.boxShadow = "0px 0px 10px " + chosenColor;
        thumbElem.classList.add("XchosenX");

    }

    // close entire slideshow and remove event listeners
    static closeXSlide() {


        let slideCnt = xslide.getSlideContainer();
        let tm = slideCnt.dataset.cntfadespeed;

        slideCnt.style.opacity = 0;

        setTimeout(function() {

            slideCnt.remove();
            xslide.removeEvtListeners();

        },tm);

    }

    // start auto slide show
    static startSlideShow() {

        let slideCnt = xslide.getSlideContainer();

        if(slideCnt) {

            if(slideCnt.dataset.autoadvancing == 1) {

                // if somehow this is true when here, stop the slideshow to clear the timer. I will be reset below
                xslide.stopSlideShow();
    
            }

            // remove bottom section and elarge picture at start of slideshow
            xslide.toggleBottomSection(0);

            let ms = slideCnt.dataset.autoadvancems;
            
            if(parseInt(ms) != NaN) {

                slideCnt.dataset.autoadvancing = 1;
                xslide.$SlideTimer = setInterval(xslide.advanceSlide,ms);
                
                let playButton = document.querySelector("#XplayX");
                let stopButton = document.querySelector("#XstopX");
                let sideStop = document.querySelector("#XsideStopShowX");

                requestAnimationFrame(function() {

                    playButton.style.display = "none";
                    stopButton.style.display = "block";

                    if(sideStop) {

                        sideStop.style.display = "block";

                    }
    
                });

                if(slideCnt.dataset.startadvancesimage == "true") { // advances image slide upon clicking "play"

                    xslide.advanceSlide(); 

                }

            } else {

                xslide.stopSlideShow();
                
            }
    
        }

    }

    static stopSlideShow() {

        clearInterval(xslide.$SlideTimer);

        let slideCnt = xslide.getSlideContainer();

        if(slideCnt) {

            xslide.toggleBottomSection(1);

            slideCnt.dataset.autoadvancing = 0;
            
            let navButtonsHidden = slideCnt.dataset.startstophidden;

            if(navButtonsHidden == "false") {

                let playButton = document.querySelector("#XplayX");
                let stopButton = document.querySelector("#XstopX");
                let sideStop = document.querySelector("#XsideStopShowX");

                if(playButton && stopButton) {

                    playButton.style.display = "block";
                    stopButton.style.display = "none";                

                } 

                if(sideStop) {

                    sideStop.style.display = "none";

                }

            }

        }

    }

    static toggleBottomSection(showHide) {

        if(showHide == undefined) {

            return;

        }

        let bottom = document.querySelector("#XslideBottom");
        let imgSection =  document.querySelector(".xslide-image-section");
        let slideCnt = xslide.getSlideContainer();

        if(bottom && imgSection) {

            if(showHide == 1) { // show bottom

                if(bottom.style != undefined) {

                    if(bottom.style.display == "none") {
    
                        bottom.style.display = "block";
                        imgSection.style.height = "calc(100vh - 125px)";

                        if(slideCnt.dataset.showenlarge == "true") {

                            document.querySelector("#XenlargeX").style.display = "block";

                        } else {

                            document.querySelector("#XenlargeX").style.display = "none";

                        }

                        document.querySelector("#XreduceX").style.display = "none";
            
                    }
    
                } 
    
            } else if(showHide == 0) { // hiding
    
                if(bottom.style.display != "none" /*&& slideCnt.dataset.showenlarge == "true"*/) {

                    bottom.style.display = "none";
                    imgSection.style.height = "100vh";
                    document.querySelector("#XenlargeX").style.display = "none";

                    if(slideCnt.dataset.showenlarge == "true") {

                        document.querySelector("#XreduceX").style.display = "block";

                    }
            
                }
    
            }
    
        }



    }

    static getMainDataVal(name) { // get dataset value from the parent container element

        let retVal = null;

        let slideCnt = xslide.getSlideContainer();

        if(slideCnt) {

            if(slideCnt.dataset[`${name}`] != undefined) {

                retVal = slideCnt.dataset[`${name}`];

            }

        }

        return retVal;

    }

    static getThumbs() {

        return document.getElementsByClassName("XimgPickX");

    }

    static getSlideContainer() {

        return document.querySelector("#XslideContainerX");

    }

    static getAllMainImages() {

        return document.getElementsByClassName("xslide-main-image");

    }

    static getActiveImage() {

        return document.querySelector(".chosenXIMG");

    }

    static getSingleThumb(idx) {

        return document.querySelector("#xPick_"+idx);

    }

    static getNextImageIDX(direction) {

        if(direction == undefined) {

            return 0;

        }

        direction = String(direction).trim().toLocaleLowerCase();

        if(direction == "" || (direction != "next" && direction != "prev")) {

            return 0;

        }

        let currentIDX = xslide.getActiveImage();

        return currentIDX.dataset[`${direction}`];

    }

    static keydownHandler(e) {

        if (e != undefined) {

            if(e.type == "keydown") {

                let slideCnt = xslide.getSlideContainer();

                if(slideCnt.dataset.arrowadvance == "true") {

                    if (e.keyCode == 37) {
        
                        e.preventDefault();
                        xslide.advanceSlide("prev");
                        
                    } else if(e.keyCode == 39) {
            
                        e.preventDefault();
                        xslide.advanceSlide();
            
                    } 
    
                }

                if(slideCnt.dataset.escclose == "true") {

                    if(e.keyCode == 27) {

                        e.preventDefault();

                        if(document.querySelector("#XslideBottom").style.display == "none" && slideCnt.dataset.showenlarge == "true") {
                            
                            xslide.toggleBottomSection(1);

                        } else if(slideCnt.dataset.autoadvancing == 1 && slideCnt.dataset.escstopsshow == "true") {

                            xslide.stopSlideShow();

                        } else {

                            xslide.closeXSlide();

                        }

    
                    }
    
                }

                if(slideCnt.dataset.showenlarge == "true") { // add condition once property is in place

                    if (e.keyCode == 38) {

                        e.preventDefault();        
                        xslide.toggleBottomSection(0);
                        
                    } else if(e.keyCode == 40) {
            
                        e.preventDefault();
                        xslide.toggleBottomSection(1);
            
                    } 

                }

            }

        }

    }

    static clickHandler(e) {

        e = e || window.event;

        if(e == undefined) {

            console.log("swallowed, no event");
            return;

        }

        let slideCnt = xslide.getSlideContainer();
        let elseClickClose = slideCnt.dataset.elsex;
        let noCloseClass = slideCnt.dataset.nocloseclass;
        let imageClickAdvance = slideCnt.dataset.imgclickadvance;

        if(e.target.matches("#XplayX")) {

            xslide.startSlideShow();

        } else if(e.target.matches("#XstopX") || e.target.matches("#XsideStopShowX")) {

            xslide.stopSlideShow();
            
        } else if(e.target.matches("#XnextX")) {

            xslide.advanceSlide();
            
        } else if(e.target.matches("#XprevX")) {

            xslide.advanceSlide("prev");

        } else if(e.target.matches(".chosenXIMG")) {

            if(imageClickAdvance == "true") {

                xslide.advanceSlide();

            }

        } else if(e.target.matches(".xslide-close")) {

            xslide.closeXSlide();
            
        } else if(e.target.matches(".xslide-thumb-image")) {

            xslide.showImage(e.target.dataset.idx);


        } else if(e.target.matches("#XenlargeX")) {

            xslide.toggleBottomSection(0);

        } else if(e.target.matches("#XreduceX")) {

            xslide.toggleBottomSection(1);

        } else {

            if(elseClickClose == "true" && !e.target.matches("."+noCloseClass)) {

                xslide.closeXSlide();

            }

        }

    }

    static showImage(destIDX) {

        let slideCnt = xslide.getSlideContainer();

        if(slideCnt) {

            let allIMGS = xslide.getAllMainImages();
            let newIMG = document.querySelector("#Xslide_"+destIDX);

            if(newIMG){

                // loop through main images, hiding them all (opacity 0), removing "chosenXIMG" class
                for(let i = 0; i < allIMGS.length; i++) {

                    if(i != destIDX) {
                        
                        allIMGS[i].classList.remove("chosenXIMG");
                        allIMGS[i].style.opacity = 0;
                        allIMGS[i].style.display = "none";
    
                    } else {

                        allIMGS[i].classList.add("chosenXIMG");
                        allIMGS[i].style.display = "block";
                        
                        requestAnimationFrame(function() {
                            requestAnimationFrame(function() {

                                allIMGS[i].style.opacity = 1;

                            });
                        });
                        
                    }
    
                }

                xslide.setActiveThumb();

            }

        }

    }

    static advanceSlide(prev) {

        let direction = "next";

        if(prev != undefined) {

            direction = "prev";

        }

        let nextIDX = xslide.getNextImageIDX(direction);

        xslide.showImage(nextIDX);

    }

    static removeEvtListeners() {

        document.removeEventListener("click",xslide.clickHandler);
        document.removeEventListener("keydown",xslide.keydownHandler);

        xslide.stopSlideShow();   

    }

}
