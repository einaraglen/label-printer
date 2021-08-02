const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Dymo = require("dymojs");
const printer = new Dymo();

require("@electron/remote/main").initialize();

let window;

const createWindow = () => {
    // Create the browser window.
    window = new BrowserWindow({
        width: 420,
        height: 200,
        fullscreenable: false,
        frame: false,
        resizable: false,
        transparent: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubFrames: true,
        },
    });

    window.on("close", () => {
        window = null;
    });

    // and load the index.html of the app.
    window.loadURL("http://localhost:3000");

    window.webContents.openDevTools();
};

var labelXml = `<?xml version="1.0" encoding="utf-8"?>
<DesktopLabel Version="1">
  <DYMOLabel Version="3">
    <Description>DYMO Label</Description>
    <Orientation>Portrait</Orientation>
    <LabelName>S0722540 multipurpose</LabelName>
    <InitialLength>0</InitialLength>
    <BorderStyle>SolidLine</BorderStyle>
    <DYMORect>
      <DYMOPoint>
        <X>0.03999997</X>
        <Y>0.06</Y>
      </DYMOPoint>
      <Size>
        <Width>2.17</Width>
        <Height>1.13</Height>
      </Size>
    </DYMORect>
    <BorderColor>
      <SolidColorBrush>
        <Color A="1" R="0" G="0" B="0"></Color>
      </SolidColorBrush>
    </BorderColor>
    <BorderThickness>1</BorderThickness>
    <Show_Border>False</Show_Border>
    <DynamicLayoutManager>
      <RotationBehavior>ClearObjects</RotationBehavior>
      <LabelObjects>
        <TextObject>
          <Name>ITextObject5</Name>
          <Brushes>
            <BackgroundBrush>
              <SolidColorBrush>
                <Color A="0" R="0" G="0" B="0"></Color>
              </SolidColorBrush>
            </BackgroundBrush>
            <BorderBrush>
              <SolidColorBrush>
                <Color A="1" R="0" G="0" B="0"></Color>
              </SolidColorBrush>
            </BorderBrush>
            <StrokeBrush>
              <SolidColorBrush>
                <Color A="1" R="0" G="0" B="0"></Color>
              </SolidColorBrush>
            </StrokeBrush>
            <FillBrush>
              <SolidColorBrush>
                <Color A="0" R="0" G="0" B="0"></Color>
              </SolidColorBrush>
            </FillBrush>
          </Brushes>
          <Rotation>Rotation0</Rotation>
          <OutlineThickness>1</OutlineThickness>
          <IsOutlined>False</IsOutlined>
          <BorderStyle>SolidLine</BorderStyle>
          <Margin>
            <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
          </Margin>
          <HorizontalAlignment>Center</HorizontalAlignment>
          <VerticalAlignment>Middle</VerticalAlignment>
          <FitMode>AlwaysFit</FitMode>
          <IsVertical>False</IsVertical>
          <FormattedText>
            <FitMode>AlwaysFit</FitMode>
            <HorizontalAlignment>Center</HorizontalAlignment>
            <VerticalAlignment>Middle</VerticalAlignment>
            <IsVertical>False</IsVertical>
            <LineTextSpan>
              <TextSpan>
                <Text>test</Text>
                <FontInfo>
                  <FontName>Segoe UI</FontName>
                  <FontSize>29.7</FontSize>
                  <IsBold>False</IsBold>
                  <IsItalic>False</IsItalic>
                  <IsUnderline>False</IsUnderline>
                  <FontBrush>
                    <SolidColorBrush>
                      <Color A="1" R="0" G="0" B="0"></Color>
                    </SolidColorBrush>
                  </FontBrush>
                </FontInfo>
              </TextSpan>
            </LineTextSpan>
          </FormattedText>
          <ObjectLayout>
            <DYMOPoint>
              <X>0.5825</X>
              <Y>0.3425</Y>
            </DYMOPoint>
            <Size>
              <Width>1.085</Width>
              <Height>0.565</Height>
            </Size>
          </ObjectLayout>
        </TextObject>
      </LabelObjects>
    </DynamicLayoutManager>
  </DYMOLabel>
  <LabelApplication>Blank</LabelApplication>
  <DataTable>
    <Columns></Columns>
    <Rows></Rows>
  </DataTable>
</DesktopLabel>
`;

//print method that renderer can acces via ipcRenderer
ipcMain.on("print-label", async (event, arg) => {
    //
    try {
        printer.print("DYMO LabelWriter Wireless", arg);
        //give label time to print
        //await new Promise(resolve => setTimeout(resolve, 2000));
        event.sender.send("print-response", arg);
    } catch (err) {
        console.log(err)
        event.sender.send("print-response", {
            status: false,
            message: err,
        });
    }
});

//MAC OS STUFF
app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
