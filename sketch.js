// empty array to store our first pages
let pages_main = [];
// empty array to store our pages after choice 7a was chosen
let pages_7a = [];
// empty array to store our pages after choice 7b was chosen
let pages_7b = [];
// empty array to store our pages after choice 19a was chosen
let pages_19a = [];
// empty array to store our pages after choice 19b was chosen
let pages_19b = [];
// empty array to store our pages after choice 39a was chosen
let pages_39a = [];
// empty array to store our pages after choice 39b was chosen
let pages_39b = [];

// variable to access data located at specific index positions in the pages array
let pagenum = 0;

// "main" for main story, "7a" or "7b" for branches
let currentPath = 'main';

// Global button variables so we can access them in multiple functions
let Start_btn;
let Next_btn;
let Back_btn;

let Menu_btn;
let Yes_btn;
let No_btn;
let menuMessage;
let menuopen = false;

let ChoiceA_btn;
let ChoiceB_btn;

let choiceAPath = '';
let choiceBPath = '';

let returnPage = 0;

let totalpages_main = 42
let totalpages_branch7 = 2
let totalpages_branch19 = 1
let totalpages_branch39a = 5
let totalpages_branch39b = 11

let spacesinbetween, dearlittlebrother, calm;

let slider;

// Preload all the images before the sketch starts
function preload() {
    for (let i = 0; i < totalpages_main; i++) {
        let page = loadImage('images/page' + i + '.JPG');
        pages_main.push(page);
        //    pages_main[i] = loadImage('images/page'+ i + '.JPG');
    }
    
      
    for (let i = 0; i < totalpages_branch7; i++) { // can add more pages later
        pages_7a.push(loadImage('images/page7a_' + i + '.JPG'));
        pages_7b.push(loadImage('images/page7b_' + i + '.JPG'));
    }
    

    for (let i = 0; i < totalpages_branch19; i++) { // can add more pages later
        pages_19a.push(loadImage('images/page19a_' + i + '.JPG'));
        pages_19b.push(loadImage('images/page19b_' + i + '.JPG'));
      }
   
    for (let i = 0; i < totalpages_branch39a; i++) { // can add more pages later
        pages_39a.push(loadImage('images/page39a_' + i + '.JPG'));
    }
    for (let i = 0; i < totalpages_branch39b; i++) { // can add more pages later
        pages_39b.push(loadImage('images/page39b_' + i + '.JPG'));
    }

    //MUSIC
    spacesinbetween = loadSound('music/spacesinbetween.mp3');   //music to be played in the middle ground
    dearlittlebrother = loadSound('music/dearlittlebrother.mp3');   //music to be played in the real world
    calm = loadSound('music/calm.mp3')  //music to be playes when mc enters husbands dream
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    slider = createSlider(0, 1, 0.5, 0.01)
    slider.position(150, 10)
    slider.style('color', 'rgb(100 ,100 ,100)')


    Start_btn = createButton('Start')
    Start_btn.size(windowWidth / 5, windowHeight / 10)
    // Set a fixed Y position
    let yPosition = windowHeight / 1.5;

    // Set the X position to center the button
    let xPosition = (windowWidth - Start_btn.width) / 2;

    // Set the position of the button
    Start_btn.position(xPosition, yPosition,);

    // When "Start" is clicked:  
    Start_btn.mousePressed(() => {
        pagenum++;         // Go to the first page (index 1)
        Start_btn.hide();  // Hide the start button
        updateButtons();    // Show next/back buttons if needed

        //middleground background music
        //spacesinbetween.play();
        if (!spacesinbetween.isPlaying()) {
            spacesinbetween.loop();
        }
    });

    // Create the "Next" button
    Next_btn = createButton('>>');
    Next_btn.style('background-color', 'rgba(30, 30, 30, 0.7)')
    Next_btn.style('color', 'white')
    Next_btn.style('border', 'none')
    Next_btn.style('font-size', '18px');
    Next_btn.size(200, 100);
    Next_btn.position(windowWidth - Next_btn.width, (windowHeight / 2) - Next_btn.height);

    // When "Next" is clicked:
    Next_btn.mousePressed(() => {
        let currentPages = getCurrentPages();

        // Only go forward if we’re not on the last page
        if (pagenum < currentPages.length - 1) {
            pagenum++;        // Move to the next page
            updateButtons();  // Adjust button visibility
        } else {
            if (currentPath !== 'main') {
                currentPath = 'main'; // return to main story
                pagenum = returnPage;         // RETURN to where you left off
                updateButtons();
            } else {
                // continue story normally
                pagenum++;
                updateButtons();
            }
        }

        // Music logic AFTER pagenum has changed:
        if (pagenum === 21) {
            if (spacesinbetween.isPlaying())
                spacesinbetween.stop();
            //dearlittlebrother.play();
            if (!dearlittlebrother.isPlaying())
                dearlittlebrother.loop();
        } else if (pagenum === 31) {
            if (dearlittlebrother.isPlaying())
                dearlittlebrother.stop();
            //calm.play();
            if (!calm.isPlaying())
                calm.loop();
        } else if (pagenum === 37) {
            if (calm.isPlaying())
                calm.stop();
            //dearlittlebrother.play();
            if (!dearlittlebrother.isPlaying())
                dearlittlebrother.loop();
        }

    });

    // Create the "Back" button
    Back_btn = createButton('<<');
    Back_btn.style('background-color', 'rgba(30, 30, 30, 0.7)')
    Back_btn.style('color', 'white')
    Back_btn.style('border', 'none')
    Back_btn.style('font-size', '18px');
    Back_btn.size(200, 100);
    Back_btn.position(0, (windowHeight / 2) - Back_btn.height);

    // When "Back" is clicked:
    Back_btn.mousePressed(() => {
        // Only go back if we’re not on the first page
        if (pagenum > 0) {
            pagenum--;        // Move to the previous page
            updateButtons();  // Adjust button visibility
        }
    });

    // Create the "Menu" button
    Menu_btn = createButton('Menu');
    Menu_btn.style('background-color', 'rgba(30, 30, 30, 1)')
    Menu_btn.style('color', 'white')
    Menu_btn.style('font-size', '18px');
    Menu_btn.size(150, 50);
    Menu_btn.position(0, 0); // Top-left corner
    Menu_btn.mousePressed(showMenu);



    // Create confirmation message and buttons (hidden initially)
    menuMessage = createP('Go back to the start?');
    menuMessage.position((windowWidth - 200) / 2, windowHeight / 2.5);
    menuMessage.style('font-size', '24px');
    menuMessage.hide();

    // Hide navigation buttons until Start is clicked
    Next_btn.hide();
    Back_btn.hide();
    Menu_btn.hide();

    // Create the "Yes" button
    Yes_btn = createButton('Yes');
    Yes_btn.position((windowWidth / 2) - 80, windowHeight / 2);
    Yes_btn.size(70, 40);
    Yes_btn.mousePressed(goBackToStart);
    Yes_btn.hide();

    // Create the "No" button
    No_btn = createButton('No');
    No_btn.position((windowWidth / 2) + 10, windowHeight / 2);
    No_btn.size(70, 40);
    No_btn.mousePressed(() => {
        hideMenu();
        if (currentPath === 'main' && (pagenum === 7 || pagenum === 19 || pagenum === 39))
            showChoices();
    });
    No_btn.hide();

    //create two choice buttons but hide them at first
    ChoiceA_btn = createButton('');
    ChoiceA_btn.style('background-color', 'white')
    ChoiceA_btn.style('color', 'black')
    ChoiceA_btn.style('border', '5px solid black');
    ChoiceA_btn.style('border-radius', '20px');
    ChoiceA_btn.style('font-size', '20px')
    ChoiceA_btn.style('font-weight', 'bold')
    ChoiceA_btn.size(windowWidth / 5, windowHeight / 7);
    ChoiceA_btn.position(windowWidth / 4, windowHeight * 3 / 4);
    ChoiceA_btn.hide();

    ChoiceA_btn.mousePressed(() => {
        returnPage = pagenum + 1;
        choosePath(choiceAPath);
    });

    ChoiceB_btn = createButton('');
    ChoiceB_btn.style('background-color', 'white');
    ChoiceB_btn.style('color', 'black');
    ChoiceB_btn.style('border', '5px solid black');
    ChoiceB_btn.style('border-radius', '20px');
    ChoiceB_btn.style('font-size', '20px')
    ChoiceB_btn.style('font-weight', 'bold')
    ChoiceB_btn.size(windowWidth / 5, windowHeight / 7);
    ChoiceB_btn.position((windowWidth * 3 / 4) - ChoiceB_btn.width, windowHeight * 3 / 4);
    ChoiceB_btn.hide();

    ChoiceB_btn.mousePressed(() => {
        returnPage = pagenum + 1;
        choosePath(choiceBPath);
    });
}

function draw() {
    //  background(9, 21, 31);
    background(0);
    spacesinbetween.setVolume(slider.value())
    dearlittlebrother.setVolume(slider.value());
    calm.setVolume(slider.value());

    let currentPages = getCurrentPages();

    if (currentPages.length > 0 && pagenum < currentPages.length) {
        // image(currentPages[pagenum], 50, 0, currentPages[pagenum].width * 0.5, currentPages[pagenum].height *0.5);

        //16:9 aspect ratio
        // let w = min(windowWidth * 0.9, (windowHeight * 0.9) * (16 / 9));
        // let h = w / (16 / 9);
        // image(currentPages[pagenum], (windowWidth - w) / 2, (windowHeight - h) / 2, w, h);

        // image(currentPages[pagenum], 0, 0);

        //A4 aspect ratio
        let img = currentPages[pagenum];

        let imgAspect = img.width / img.height;
        let maxW = windowWidth * 1;
        let maxH = windowHeight * 1;
        let w = maxW;
        let h = w / imgAspect;

        if (h > maxH) {
            h = maxH;
            w = h * imgAspect;
        }

        let x = (windowWidth - w) / 2;
        let y = (windowHeight - h) / 2;
        image(img, x, y, w, h);
    }

    // Show choices when reaching a decision point; pagenum can change depending on where the choice happen
    if (currentPath === 'main' && pagenum === 7) {
        ChoiceA_btn.html('Find a way out');
        ChoiceB_btn.html('Wait for more information');
        choiceAPath = '7a';
        choiceBPath = '7b';
        showChoices()
    } else if (currentPath === 'main' && pagenum === 19) {
        ChoiceA_btn.html('Go through portal');
        ChoiceB_btn.html('deliberate more');
        choiceAPath = '19a';
        choiceBPath = '19b';
        showChoices()
    } else if (currentPath === 'main' && pagenum === 39) {
        ChoiceA_btn.html('Go back to sleep');
        ChoiceB_btn.html('Find out more');
        choiceAPath = '39a';
        choiceBPath = '39b';
        showChoices()
    }
}

function showChoices() {
    // Show the choices and hides next/back buttons
    Next_btn.hide();
    Back_btn.hide();
    if (menuopen === true) {
        ChoiceA_btn.hide();
        ChoiceB_btn.hide();
    } else {
        ChoiceA_btn.show();
        ChoiceB_btn.show();
    }
}

// Function to show/hide navigation buttons based on current page
function updateButtons() {
    let currentPages = getCurrentPages(); //so that it works in all branches

    if (currentPath === 'main') {
        // --- MAIN STORY ---

        if (pagenum === 0) {
            // cover page
            Next_btn.hide();
            Back_btn.hide();
            Menu_btn.hide();
        } else if (pagenum === 1) {
            // first page
            Back_btn.hide();
            Next_btn.show();
            Menu_btn.show();
        } else if (pagenum < currentPages.length - 1) {
            // In the middle of the main story
            Next_btn.show();
            Menu_btn.show();
            Back_btn.show();
        } else {
            // Last page of the main story
            Next_btn.hide();
            Menu_btn.show();
            Back_btn.show();
        }

    } else {
        // --- BRANCH / PATH ---

        if (pagenum === 0) {
            // First page of a branch
            Next_btn.show();
            Back_btn.hide();
            Menu_btn.show();
        } else if (pagenum < currentPages.length - 1) {
            // Middle of branch
            Next_btn.show();
            Back_btn.show();
            Menu_btn.show();
        } else {
            // Last page of branch
            Back_btn.show();
            Menu_btn.show();
        }
    }

    // Special case: after returning from branch
    if (currentPath === 'main' && pagenum === returnPage) {
        Back_btn.hide();
    }

    // // If we're on the very first page (start screen), hide everything
    // if (pagenum === 0) {
    //   Next_btn.hide();
    //   Back_btn.hide();
    //   Menu_btn.hide();
    // } else {
    //   // If not on the last page, show "Next"
    //   if (pagenum < currentPages.length - 1) {
    //     Next_btn.show();
    //     Menu_btn.show();
    //   } else {
    //     Next_btn.hide(); // Hide "Next" on the last page
    //   }

    // If not on the first actual page, show "Back"
    // if (pagenum > 1) {
    //   // Special case: after returning from branch
    //   if (currentPath === 'main' && pagenum === returnPage) {
    //     Back_btn.hide();
    //   } else {
    //     Back_btn.show();
    //   }
    //   Menu_btn.show();
    // } else {
    //   Back_btn.hide(); // Hide "Back" on the start screen
    // }

}

function showMenu() {
    // Show the message and Yes/No buttons
    menuopen = true
    menuMessage.show();
    Yes_btn.show();
    No_btn.show();
}

function hideMenu() {
    // Just hide the menu confirmation popup
    menuopen = false
    menuMessage.hide();
    Yes_btn.hide();
    No_btn.hide();
}

function goBackToStart() {
    // Reset everything back to the initial state
    pagenum = 0;
    Start_btn.show(); // Show the Start button again
    Next_btn.hide();
    Back_btn.hide();
    Menu_btn.hide()
    hideMenu(); // Hide the confirmation popup
    StopMusic()
    currentPath = 'main';
    returnPage = 0;
}

function StopMusic() {
    // Stop all music
    if (spacesinbetween.isPlaying())
        spacesinbetween.stop();
    if (dearlittlebrother.isPlaying())
        dearlittlebrother.stop();
    if (calm.isPlaying())
        calm.stop();
}


function getCurrentPages() {
    if (currentPath === 'main') {
        return pages_main;
    } else if (currentPath === '7a') {
        return pages_7a;
    } else if (currentPath === '7b') {
        return pages_7b;
    } else if (currentPath === '19a') {
        return pages_19a;
    } else if (currentPath === '19b') {
        return pages_19b;
    } else if (currentPath === '39a') {
        return pages_39a;
    } else if (currentPath === '39b') {
        return pages_39b;
    } else {
        return []; // Safe fallback
    }
}

function choosePath(path) {
    //after a choice has been made go back to main storyline
    currentPath = path;
    pagenum = 0;
    ChoiceA_btn.hide();
    ChoiceB_btn.hide();
    updateButtons();
    Next_btn.show()
}
