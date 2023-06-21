figma.showUI(__html__);

figma.ui.onmessage = (pluginMessage: {
  type: string;
  width: number;
  height: number;
  size: number;
  scale: number;
}) => {
  if (pluginMessage.type === "create-shapes") {
    const { width, height, size, scale } = pluginMessage;
    const rowCount = Math.floor(+height / scale);
    const colCount = Math.floor(+width / scale);
    const mainFrame = figma.createFrame();
    mainFrame.resize(width, height);
    mainFrame.fills = [{
      color: { r: 1, g: 1, b: 1 },
      type: "SOLID",
      opacity: 0
    }]
    for (let i = 0; i < rowCount; i++) {
      const y = i * scale + scale / 2 - size / 2;
      for (let j = 0; j < colCount; j++) {
        const x = j * scale + scale / 2 - size / 2;
        const dot = figma.createEllipse();
        dot.resize(size, size);
        dot.fills = [{
          color: { r: 1, g: 1, b: 1 },
          type: "SOLID",
          opacity: 0.2
        }]
        mainFrame.appendChild(dot);
        dot.x = x;
        dot.y = y;
      }
    }
    //delete next 3 lines
    const parentFrame = figma.root.findOne(node => node.type === "FRAME" && node.name === "Frame 14741") as FrameNode;
    if (parentFrame) parentFrame.appendChild(mainFrame);
    else console.log("Frame not found")
    figma.viewport.scrollAndZoomIntoView([mainFrame])

  }

  figma.closePlugin()
};
