var messageText = document.getElementById("message");
var errorText = document.getElementById("textError");
var canvas;
var ctx;
var imageData;
var data;

function draw(img) {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  data = imageData.data;
}

var encryptbtn = document.getElementById('encryptbtn');
encryptbtn.addEventListener('click', encrypt);
var decryptbtn = document.getElementById('decryptbtn');
decryptbtn.addEventListener('click', decrypt);

function encrypt() {
    try{
        errorText.style.display = "none";
        var message = messageText.value;
        var messageLength = message.length;
        var pixelsNeeded = (messageLength + 1) * 8; // max 255 characters
        var binaryMessage = convert(message);
        var binaryLength = messageLength.toString(2);
        binaryLength = new Array(9 - binaryLength.length).join('0') + binaryLength;
        binaryMessage = binaryLength + binaryMessage;
        var currentBit = 0;
        var pixelOdd = false;
        for (var i = 0; i < pixelsNeeded * 4; i += 4) {
            pixelOdd = isOdd(data[i]);

            if (binaryMessage.charAt(currentBit) == 1 && !pixelOdd) {
            data[i] = ++data[i];

            } else if (binaryMessage.charAt(currentBit) == 0 && pixelOdd) {
            data[i] = --data[i];
            }
            currentBit++;
        }
        var binaryLength = '';
        for (var i = 0; i < 32; i += 4) {
            if (isOdd(data[i])) {
            binaryLength += '1';
            } else {
            binaryLength += '0';
            }
        }
        ctx.putImageData(imageData, 0, 0);
        messageText.value = '';
    }
    catch(e){
        errorText.style.display = "block";
        errorText.innerHTML = "<strong>Error!</strong> Please restrict message to allowed characters.";
    }
  
}

function decrypt() {
  var binaryLength = '';
  for (var i = 0; i < 32; i += 4) {
    if (isOdd(data[i])) {
      binaryLength += '1';
    } else {
      binaryLength += '0';
    }
  }
  var pixelsNeeded = parseInt(binaryLength, 2) * 8;
  var binaryMessage = '';
  for (var i = 32; i < pixelsNeeded * 4 + 32; i += 4) {
    if (isOdd(data[i])) {
      binaryMessage += '1';
    } else {
      binaryMessage += '0';
    }
  }
  var decryptedMessage = '';
  for (var k = 0; k < binaryMessage.length; k += 8) {
    decryptedMessage += binarytoString(binaryMessage.slice(k, k + 8));
  }
  messageText.value = decryptedMessage;
}

function convert(message) {
  var output = '';
  for (i = 0; i < message.length; i++) {
    var binary = message[i].charCodeAt(0).toString(2);
    binary = new Array(9 - binary.length).join('0') + binary; // pad to eight bits
    output += binary;
  }
  return output;
}

function binarytoString(str) {
  return str.split(/\s/).map(function(val) {
    return String.fromCharCode(parseInt(val, 2));
  }).join("");
}

function isOdd(x) {
  return (x & 1) ? true : false;
}

$(function() {
  $(":file").change(function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(this.files[0]);
      reader.onload = imageIsLoaded;
    }
  });
});

function imageIsLoaded(e) {
  var img = new Image();
  img.src = e.target.result;
  img.crossOrigin = "Anonymous"
  img.onload = function() {
    draw(this);
  };
};

$("#message").keydown(function(e)
{
  var allowed = /^[\x00-\x7F]*$/; //regex
  var value = String.fromCharCode(e.keyCode); //get the charcode and convert to char
  if (!value.match(allowed)) { 
     return false;
  }       
});