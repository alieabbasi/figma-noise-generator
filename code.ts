figma.showUI(__html__);

figma.ui.onmessage = (pluginMessage: {
  type: string;
  width: number;
  height: number;
  size: number;
  scale: number;
}) => {
  if (pluginMessage.type === "create-shapes") {
    const { width, height, size } = pluginMessage;
    const num = 5;
    const scale = pluginMessage.scale * num;
    const rowCount = Math.floor(+height / scale);
    const colCount = Math.floor(+width / scale);
    console.log("rowCount", rowCount);
    console.log("colCount", colCount);
    
    const mainFrame = figma.createFrame();
    mainFrame.resize(width, height);
    mainFrame.fills = [
      {
        color: { r: 1, g: 1, b: 1 },
        type: "SOLID",
        opacity: 0,
      },
    ];
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        for (let k = 0; k < Math.pow(num, 2); k++) {
          const x = Math.random() * scale + j * scale - size / 2;
          const y = Math.random() * scale + i * scale - size / 2;
          const dot = figma.createEllipse();
          dot.resize(size, size);
          dot.fills = [
            {
              color: { r: 0, g: 0, b: 0 },
              type: "SOLID",
            },
          ];
          mainFrame.appendChild(dot);
          dot.x = x;
          dot.y = y;
        }
      }
    }
    //delete next 3 lines
    const parentFrame = figma.root.findOne(
      (node) => node.type === "FRAME" && node.name === "Frame 14741"
    ) as FrameNode;
    if (parentFrame) parentFrame.appendChild(mainFrame);
    else console.log("Frame not found");

    figma.viewport.scrollAndZoomIntoView([mainFrame]);
  }

  figma.closePlugin();
};
