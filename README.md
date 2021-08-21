# Label Printer for IFS

The LabelPrinter program is a Plug-in for IFS.

It allows you to print DYMO Labels straight from the lines found in IFS.

You can configure the labels for different IFS pages to fit your needs.

This is all made possible with the following technologies:

- [`Node.js`](https://nodejs.org/en/) JavaScript Runtime Environment
- [`Electron.js`](https://www.electronjs.org/) JavaScript Framework for creating native Application
- [`React.js`](https://reactjs.org/) JavaScript Framework for Components and Application Logic
- [`dymojs`](https://github.com/dsandor/dymojs) JavaScript Library for printing DYMO Labels
- [`Material-UI`](https://material-ui.com/) Component Library for creating a professional Application
- [`GitHub`](https://github.com/) Version Control



## Installation

For the setup.exe go to [this](https://github.com/einaraglen/label-printer/releases/) link, and download the latest release

After completing the installation, the program will automatically open, and it might look like this:

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1629300312/readme/dymo_vpdftg.png "DYMO Connect Missing")

If your screen looks like the image above, please do as the program tells, 

download the [DYMO Connect Software](https://www.dymo.com/en_CA/dymo-connect-for-desktop-v1.3.2.html), install it and restart your computer before the next step

If not, you can go to the continue to Startup

## Startup

You can now Open the application from the shortcut created on your Desktop

The application will look something like the following picture on your first launch:

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1629302911/readme/error_deskfh.png "Bad Template")

If we hover the red icon next to the Template button, we wil be promted with the text "Check Template file"

This will be our next step.

## Creating Template

When Creating a new Template for our LabelPrinter, we have to create a new Label file in the DYMO Connect Software

So Open DYMO Connect and create something that looks like the image bellow:

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1629303267/readme/dymolabel_pqbaow.png "Creating Template")

It is very important to select the right Label Size for your printer (This is done when creating a new label file in the DYMO Software)

As you can see, the following information has to exist in the Template:

| Key | Type | Mandatory | Usage |
| --- | :-: | :-: | :-: |
| `_Number` | Single| `true` | Display Part number found in Lines |
| `_Description` | Single | `true` | Part description of other info |
| `_Info` | Multiple | `true` | Multiple columns from the Line (ProjectID, SubProjectID)|
| `_Extra` | Multiple | `false` | Same as  `_Info`|
| `_Quantity` | Single | `true` | Quantity found on the Line |

Important to remember if you have a Barcode or QR-code on your label

Always go to the text selection for the Code in DYMO Connect and write `_Number` there aswell:

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1629303899/readme/QR_oubd82.png "QR Code")

If not the Code will be un-usable

After this, simply save the file to a location that you will remember, then on the next step

## Prepare for IFS

Now that we have our Template saved where we can grab it, we go to our program, click the Template Button

Then locate the `.dymo` file we created from DYMO Connect, and simply select it

If all goes well, our program will look something like this:

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1629302911/readme/good_fitxhr.png "Good Template")

Next is to Select the DYMO Printer we want to use, in the top of our application you can see a Input Field containing "OneNote"

To select the DYMO Printer we want to use we simply click the Field and select the printer as seen bellow:

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1629302911/readme/printer_bfmmxi.png "Selecting a printer")

Thats it! now the LabelPrinter is usable, the next step would be to Configure the application to act as a Output program for IFS(in XML format)
