// upon clicking a link that your friend sent you, it will automatically decrypt it for you, using localhost (otherwise it will display random text)
// https://www.sitepoint.com/get-url-parameters-with-javascript/

var timeSensitive = false;
const inputs = document.getElementById('inputs')
const chat = document.getElementById('chat')
const sendBtn = document.getElementById('send-btn')
const encryptInput = document.getElementById('encrypt-input')
const decryptInput = document.getElementById('decrypt-input')
const chatMenu = document.getElementById('chat-menu')
var decrypted;
var code = localStorage.getItem('code') ? JSON.parse(localStorage.getItem('code')) : [];
var chatHistory = localStorage.getItem('chat') ? JSON.parse(localStorage.getItem('chat')) : [];

var today = new Date();
var h = today.getHours();
var m = today.getMinutes();
var time;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function category(type) {
    var url;

    if (type == 'animals') {
        url = 'scripts/animalList.json'
    }
    if (type == 'lorem') {
        url = 'scripts/lorem.json'
    }
    else if (type == 'colours') {
        url = 'https://jonasjacek.github.io/colors/data.json'
    }

    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {

            shuffleArray(data)

            for (i = 0; i < 63; i++) {
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
// if (window.location.href.indexOf('hey') > 0) {
//     console.log(window.location.href)
// }

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
    for (var i = 0; i < 63; i++) {
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
    for (var i = 0; i < 63; i++) {
        document.getElementById('char-' + i).value = JSON.parse(localStorage.getItem('code'))[i];
    }
}

function encrypt() {
    decryptArr = [];
    encryptArr = [];

    today = new Date();
    h = today.getHours();
    m = today.getMinutes();

    if (chatHistory.length > 0) {
        if (chatHistory[chatHistory.length - 1][0] == 0) {
            chat.removeChild(chat.childNodes[chat.children.length - 1]);
            chat.removeChild(chat.childNodes[chat.children.length - 1]);
            chatHistory.pop();
        }
    }

    if (encryptInput.value != '') {
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
            // capital letters
            else if(letterPos >= -32 && letterPos <= -6){
                encryptArr.push(code[letterPos + 69])
            }
            else {
                encryptArr.push(code[letterPos])
            }

            decrypted = encryptArr.join(" ")
        }
        // console.log(encryptArr)

        sendBtn.innerText = 'Copied to clipboard'
        encryptInput.placeholder = "Type another message to replace"
        // setTimeout(function () { sendBtn.innerText = 'Replace text'; }, 3000);

        // send message to screen
        toScreen('send')
        updateChatPreview()

        encryptInput.value = ''

        //copy link to clipboard

        share('msg')
        saveChat()
    }

}


function updateChatPreview() {
    document.getElementById('chat-1-preview-text').innerHTML = encryptInput.value;
    document.getElementById('chat-1-preview-time').innerHTML = time;
}

function toScreen(f) {
    var p = document.createElement("p");
    var span = document.createElement("span");

    if (m < 10) {
        time = `${h}:0${m}`;
    } else {
        time = `${h}:${m}`;
    }

    // go to left side
    if (f == 'send') {
        p.innerHTML = encryptInput.value;
        p.setAttribute("class", "message send");
        span.setAttribute("class", "time send");
    }

    // go to right side
    else if (f == 'receive') {
        p.innerHTML = decryptedArr.join("");
        p.setAttribute("class", "message receive");
        span.setAttribute("class", "time receive");
    }

    span.innerHTML = time;

    chat.appendChild(p);
    chat.appendChild(span);
}

function decrypt() {
    encryptArr = []
    decryptArr = [];
    decryptedArr = [];
    // take encrypted value
    // code.indexOf("Blue")

    // for (var i=0;i<decrypted.split(' ').length;i++){
    // var letterPos = decrypted[i].charCodeAt() - 97;
    // console.log(letterPos)
    decryptArr.push(decrypted.split(' '))
    // console.log(String.fromCharCode(97 + i))
    // }


    console.log(decryptArr)

    for (var i = 0; i < decryptArr[0].length; i++) {

        // var magic1 = code.indexOf(decryptArr[0][i])

        // var magic2 = String.fromCharCode(97 + code.indexOf(decryptArr[0][magic1]))

        if (code.indexOf(decryptArr[0][i]) == 36) {
            decryptedArr.push(" ")
        }
        //numbers
        else if (code.indexOf(decryptArr[0][i]) >= 26 && code.indexOf(decryptArr[0][i]) <= 35) {
            decryptedArr.push(String.fromCharCode(22 + code.indexOf(decryptArr[0][i])))
        }
        //capital letters
        else if (code.indexOf(decryptArr[0][i]) >= 35 && code.indexOf(decryptArr[0][i]) <= 62) {
            decryptedArr.push(String.fromCharCode(28 + code.indexOf(decryptArr[0][i])))
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
        var span = document.createElement("span")

        if (chatHistory[i][0] == 0) {
            p.innerHTML = chatHistory[i][1];
            p.setAttribute("class", "message send");
            span.innerHTML = chatHistory[i][2];
            span.setAttribute("class", "time send");
        }
        else if (chatHistory[i][0] == 1) {
            p.innerHTML = chatHistory[i][1];
            p.setAttribute("class", "message receive");
            span.innerHTML = chatHistory[i][2];
            span.setAttribute("class", "time receive");
        }

        chat.appendChild(p);
        chat.appendChild(span);


        // update chat preview
        document.getElementById('chat-1-preview-text').innerHTML = chatHistory[chatHistory.length - 1][1]
        document.getElementById('chat-1-preview-time').innerHTML = chatHistory[chatHistory.length - 1][2]
    }

    // here goes change placeholder if last message sent by you
    if (chatHistory[chatHistory.length - 1][0] == 0) {
        encryptInput.placeholder = 'Type another message to replace'
    }
}



// try it out!
// follow url with ?msg= then type message, using + for spaces
// console.log(getAllUrlParams().msg)

if (getAllUrlParams().msg) {

    if (localStorage.getItem('code')) {
        // dont bother putting it in the decrypt input, just convert subito
        // console.log("there's a msg in the URL")
        decrypted = getAllUrlParams().msg.replace(/%20/g, " ");

        decrypt()
        saveChat()
        // put in chat
    }

    // instead match the same amount of words as the url 
    else {
        encryptInput.value = "Don't be nosy.";
        decrypted = getAllUrlParams().msg;
    }


    // !!!!!!!!!!!!!!!!!activate this when it's on its own domain
    window.history.replaceState({}, document.title, "/");
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
        // console.log('http://127.0.0.1:5500/?msg=' + decrypted.replace(/\s/g, '%20'))

        // link = 'https://my-encryption.github.io/?msg=' + decrypted.replace(/\s/g, '%20');
        link = '127.0.0.1:5500/?msg=' + decrypted.replace(/\s/g, '%20');



        // /* Select the text field */
        // decryptInput.select();
        // decryptInput.setSelectionRange(0, 99999); /*For mobile devices*/

        // /* Copy the text inside the text field */
        // document.execCommand("copy");

    }

    else if (type == 'code') {
        // console.log('share code url')
        // console.log('http://127.0.0.1:5500/?code=' + code.join("%20"))

        // link = 'https://my-encryption.github.io/?code=' + code.join("%20");
        link = '127.0.0.1:5500/?code=' + code.join("%20");
        document.getElementById('share-link').innerText = 'Copied to clipboard';
        setTimeout(function () { document.getElementById('share-link').innerText = 'Share chat key'; }, 3000);



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

        // send
        if (chat.getElementsByTagName('p')[i].className == 'message send') {
            //write a double arr with 0 (main user)
            // chatHistory.push([chat.getElementsByTagName('p')[i].innerText, 0])
            chatHistory.push([0, chat.getElementsByTagName('p')[i].innerText, chat.getElementsByTagName('span')[i].innerText])
        }
        // recieve
        else {
            //write a double arr with 1 (other user)
            chatHistory.push([1, chat.getElementsByTagName('p')[i].innerText, chat.getElementsByTagName('span')[i].innerText])
        }


        localStorage.setItem('chat', JSON.stringify(chatHistory));
    }
    console.log(chatHistory)
}



// Execute a function when the user releases a key on the keyboard
encryptInput.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        sendBtn.click();

        // then focus on the input box
        encryptInput.focus();
        encryptInput.select();
    }
});

function updateBtn() {
    sendBtn.innerText = "Send"
}

function downloadChat() {
    var title = document.getElementById('screen-chat').getElementsByTagName("h1")[0].innerText;
    var preface = `\n0 = you, 1 = not you \n\n`;
    var content = chatHistory.map(x => `${x[2]} - ${x[0]}: ${x[1]}\n`).join("")

    var a = document.body.appendChild(
        document.createElement("a")
    );
    a.download = "chat.txt";
    a.href = "data:text/txt," + (title + preface + content);
    a.click();
}

function openChatMenu() {
    if (chatMenu.className == 'closed') {
        chatMenu.style.display = 'block';
        chatMenu.classList.add("opened")
        chatMenu.classList.remove("closed")
    } else {
        chatMenu.style.display = 'none';
        chatMenu.classList.add("closed")
        chatMenu.classList.remove("opened")
    }
}