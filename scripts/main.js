// upon clicking a link that your friend sent you, it will automatically decrypt it for you, using localhost (otherwise it will display random text)
// https://www.sitepoint.com/get-url-parameters-with-javascript/

var timeSensitive = false;
const inputs = document.getElementById('inputs')
const chat = document.getElementById('chat')
const sendBtn = document.getElementById('send-btn')
const encryptInput = document.getElementById('encrypt-input')
const decryptInput = document.getElementById('decrypt-input')
var code = localStorage.getItem('code') ? JSON.parse(localStorage.getItem('code')) : [];
var chatHistory = localStorage.getItem('chat') ? JSON.parse(localStorage.getItem('chat')) : [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function category(type) {
    var url;

    if (type == 'animals') {
        url = 'https://ashley.how/cypher-maker/scripts/animalList.json'
    }
    else if (type == 'colours') {
        url = 'https://jonasjacek.github.io/colors/data.json'
    }

    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {

            shuffleArray(data)

            for (i = 0; i < 37; i++) {
                var charPos = document.getElementById('char-' + i);

                if (type == 'colours') {
                    charPos.value = data[i].name.toLowerCase();
                } else {
                    charPos.value = data[i].toLowerCase();;
                }
            }
        })
}

// function coder(input) {
//     input 
// }

// console.log(coder('hey there'))


// making sure that url hash starts with '#'
// e.g. website.com/#5fdsse35tg
if (window.location.href.indexOf('hey') > 0) {
    console.log(window.location.href)
}

// for (var i = 0; i < 37; i++) { // now includes a space
//     var letter = String.fromCharCode(97 + i);

//     var label = document.createElement("label")

//     // letters a-z
//     if (i < 26) {
//         label.innerHTML = letter;
//     }
//     // numbers 0-9
//     else if (i > 25 && i < 36) {
//         label.innerHTML = i - 26;
//     }
//     // space
//     else {
//         label.innerHTML = 'Space';
//     }

//     var input = document.createElement("input");
//     input.setAttribute("type", "text");
//     input.setAttribute("id", 'char-' + i);

//     inputs.appendChild(label);
//     inputs.appendChild(input);
//     inputs.appendChild(document.createElement("br"));
// }

function save() {
    if (localStorage.getItem('code')) {
        code = [];
    }
    for (var i = 0; i < 37; i++) {
        // replace all spaces with hyphen     
        code.push(document.getElementById('char-' + i).value.replace(/ +/g, '-'));


    }

    console.log(code)
    localStorage.setItem('code', JSON.stringify(code));
}

function reset() {
    localStorage.clear()
}

// if code is written in local storage, retrieve it and fill in inputs.

if (localStorage.getItem('code')) {
    for (var i = 0; i < 37; i++) {
        document.getElementById('char-' + i).value = JSON.parse(localStorage.getItem('code'))[i];
    }
}


function encrypt() {
    decryptArr = [];
    encryptArr = [];

    for (var i = 0; i < encryptInput.value.length; i++) {
        //take each letter, convert it into code, then spit out the output
        // or use .replace() 
        // 'word'.charCodeAt() - 97
        // var letter = String.fromCharCode(97 + i);

        var letterPos = encryptInput.value[i].charCodeAt() - 97;

        // -65 is a space
        if (letterPos == -65) {
            encryptArr.push(code[36])
        }
        // numbers from -49 to -40
        else if (letterPos >= -49 && letterPos <= -40) {
            encryptArr.push(code[letterPos + 75])
        }
        else {
            encryptArr.push(code[letterPos])
        }

        // console.log(letterPos)
        // console.log(code[letterPos])
        decryptInput.value = encryptArr.join(" ")
    }
    // console.log(encryptArr)

    sendBtn.innerText = 'Link copied'

    // send message to screen
    toScreen('send')

    encryptInput.value = ''

    //copy link to clipboard

    share('msg')
    saveChat()
}

function toScreen(f) {
    var p = document.createElement("p")


    // go to left side
    if (f == 'send') {
        p.innerHTML = encryptInput.value;
        p.setAttribute("class", "send");
    }

    // go to right side
    else if (f == 'receive') {
        p.innerHTML = decryptedArr.join("");
        p.setAttribute("class", "receive");
    }

    // var input = document.createElement("input");
    // input.setAttribute("type", "text");
    // input.setAttribute("id", 'test');

    chat.appendChild(p);
    // chat.appendChild(input);
    // chat.appendChild(document.createElement("br"));
}

function decrypt() {
    encryptArr = []
    decryptArr = [];
    decryptedArr = [];
    // take encrypted value
    // code.indexOf("Blue")

    // for (var i=0;i<decryptInput.value.split(' ').length;i++){
    // var letterPos = decryptInput.value[i].charCodeAt() - 97;
    // console.log(letterPos)
    decryptArr.push(decryptInput.value.split(' '))
    // console.log(String.fromCharCode(97 + i))
    // }


    console.log(decryptArr)

    for (var i = 0; i < decryptArr[0].length; i++) {

        // var magic1 = code.indexOf(decryptArr[0][i])

        // var magic2 = String.fromCharCode(97 + code.indexOf(decryptArr[0][magic1]))

        if (code.indexOf(decryptArr[0][i]) == 36) {
            decryptedArr.push(" ")
        }
        else if (code.indexOf(decryptArr[0][i]) >= 26 && code.indexOf(decryptArr[0][i]) <= 35) {
            decryptedArr.push(String.fromCharCode(22 + code.indexOf(decryptArr[0][i])))
        }
        else {
            decryptedArr.push(String.fromCharCode(97 + code.indexOf(decryptArr[0][i])))

        }
    }
    // console.log(magic1)
    // console.log(decryptedArr)
    // encryptInput.value = decryptedArr.join("")

    toScreen('receive')
}




function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}


// if chatHistory exists, bring it up
// wait, how does it know which is the right and left sides of the chat
// use a double arr? message then user 0 and 1
if (localStorage.getItem('chat')) {
    for (var i = 0; i < chatHistory.length; i++) {

        var p = document.createElement("p")

        // [i][j] if j is 0 send to left. if 1 send to right
        if (chatHistory[i][1] == 0) {
            p.innerHTML = chatHistory[i][0];
            p.setAttribute("class", "send");
        }
        else if (chatHistory[i][1] == 1) {
            p.innerHTML = chatHistory[i][0];
            p.setAttribute("class", "receive");
        }

        chat.appendChild(p);
    }
}



// try it out!
// follow url with ?msg= then type message, using + for spaces
// console.log(getAllUrlParams().msg)

if (getAllUrlParams().msg) {

    if (localStorage.getItem('code')) {
        // dont bother putting it in the decrypt input, just convert subito
        // console.log("there's a msg in the URL")
        decryptInput.value = getAllUrlParams().msg.replace(/%20/g, " ");

        decrypt()

        // put in chat
    }

    // instead match the same amount of words as the url 
    else {
        encryptInput.value = "Don't be nosy.";
        decryptInput.value = getAllUrlParams().msg;
    }


    // !!!!!!!!!!!!!!!!!activate this when it's on its own domain
    // window.history.replaceState({}, document.title, "/");
}

if (getAllUrlParams().code) {
    console.log("there's a code in the URL") // ?code=
    code = getAllUrlParams().code.replace(/%20/g, " ").split(" ")
    localStorage.setItem('code', JSON.stringify(code));

    //fill in inputs using for
    for (var i = 0; i < code.length; i++) {
        document.getElementById(`char-${i}`).value = code[i]
    }

    // !!!!!!!!!!!!!!!!!activate this when it's on its own domain
    // window.history.replaceState({}, document.title, "/");
}


// create URL-friendly link and copies to clipboard
function share(type) {
    var link;

    if (type == 'msg') {
        // this is the opposite
        // 'olive%20grey39%20orange1'.replace(/%20/g, " ")
        // console.log('http://127.0.0.1:5500/?msg=' + decryptInput.value.replace(/\s/g, '%20'))

        link = 'http://localhost:5500/?msg=' + decryptInput.value.replace(/\s/g, '%20');



        // /* Select the text field */
        // decryptInput.select();
        // decryptInput.setSelectionRange(0, 99999); /*For mobile devices*/

        // /* Copy the text inside the text field */
        // document.execCommand("copy");

    }

    else if (type == 'code') {
        // console.log('share code url')
        // console.log('http://127.0.0.1:5500/?code=' + code.join("%20"))

        link = 'http://localhost:5500/?code=' + code.join("%20");

        // console.log('http://127.0.0.1:5500/?code=' + getAllUrlParams().code.replace(/\s/g, '%20'))
    }

    copyStringToClipboard(link);
}


function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = { position: 'absolute', left: '-9999px' };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}

function saveChat() {
    chatHistory = [];

    for (var i = 0; i < chat.getElementsByTagName('p').length; i++) {
        // console.log(chat.getElementsByTagName('p')[i].innerText)

        if (chat.getElementsByTagName('p')[i].className == 'send') {
            //write a double arr with 0 (main user)
            chatHistory.push([chat.getElementsByTagName('p')[i].innerText, 0])
        }
        else {
            //write a double arr with 1 (other user)
            chatHistory.push([chat.getElementsByTagName('p')[i].innerText, 1])
        }


        localStorage.setItem('chat', JSON.stringify(chatHistory));
    }
    console.log(chatHistory)
}

