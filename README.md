# Steggie

http://steggie.azurewebsites.net/

Steganography calculator used to encrypt and decrypt messages using images. The program alters pixel values slightly to hide bytes interpreted as ASCII characters, and these changes are not visible to the human eye.

![Steggie screenshot](https://github.com/karolien/steggie/blob/master/screenshot.png)

### Current Limitations 

* Only JPG images are stable
* Lossy compression applied to images corrupt messages
* Rudimentary encryption scheme

### TODO

* Fine-tune user input constraints
* Strengthen encryption scheme through use of secret keys
