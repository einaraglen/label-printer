# Label Printer for IFS

This is a "plug-in" for IFS that can be used to print labels from the item-lists found in IFS

It works by being used as a Output program that accepts temporary XML files generated from IFS on output

## Startup

On first startup you will be presented with something similar to this:

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1628546888/readme/error_erv0ga.png "Statup with no template file")

If you hover the red icon next to the template button, some text will display and tell you to check your template file,

You can now click on the button and select a xml file containing the code generated from the DYMO Connect program.

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1628546928/readme/good_xjhm75.png "Statup with good template")

After choosing a temlpate file and reopening the program from IFS, you will se your template filled-out with the infromation from the line you selected.

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1628546969/readme/printer_hmwakm.png "Select printer")

Then you can select which printer to use, since the program is based on the DYMO JavaScript framework [`dymojs`](https://github.com/dsandor/dymojs) you should select your DYMO printer

![alt text](https://res.cloudinary.com/sushi-panel-images/image/upload/v1628546950/readme/printing_qgamys.png "Select printer")

After everything checks out, you can press the "Print" button. You should then see "1 of n" Labels being printed in the Button text,

After printing all labels program will display text "Print complete" and auto-close
