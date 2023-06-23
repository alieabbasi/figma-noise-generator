figma.showUI(__html__);

figma.ui.resize(300, 300);

figma.ui.onmessage = (pluginMessage: {
  type: string;
  width: number;
  height: number;
  size: number;
  scale: number;
  x: number;
  y: number;
}) => {
  if (pluginMessage.type === "create-shapes") {
    const { width, height, size, scale, x: rootX, y: rootY } = pluginMessage;

    const rowCount = Math.floor(+height / scale);
    const colCount = Math.floor(+width / scale);
    const mainFrame = figma.createFrame();

    mainFrame.resize(width, height);
    mainFrame.fills = [
      {
        color: { r: 1, g: 1, b: 1 },
        type: "SOLID",
        opacity: 0,
      },
    ];

    const totalCount = rowCount * colCount;
    const maxDistance = calculateMaxDistance(width, height, rootX, rootY)

    radiusRandomGeneration(
      mainFrame,
      width,
      height,
      maxDistance,
      totalCount,
      rootX,
      rootY,
      size
    );

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

const calculateMaxDistance = (
  width: number,
  height: number,
  rootX: number,
  rootY: number
) => {
  const d1 = Math.sqrt(Math.pow(rootX, 2) + Math.pow(rootY, 2));
  const d2 = Math.sqrt(Math.pow(width - rootX, 2) + Math.pow(rootY, 2));
  const d3 = Math.sqrt(Math.pow(rootX, 2) + Math.pow(height - rootY, 2));
  const d4 = Math.sqrt(
    Math.pow(width - rootX, 2) + Math.pow(height - rootY, 2)
  );
  return Math.max(d1, d2, d3, d4);
};

const radiusRandomGeneration = (
  frame: FrameNode,
  width: number,
  height: number,
  maxDistance: number,
  totalCount: number,
  rootX: number,
  rootY: number,
  size: number
) => {
  const rCoef = Math.pow(maxDistance, 1 / totalCount);
  // const rCoef = maxDistance / totalCount;
  let radius = rCoef;

  for (let i = 0; i < totalCount; i++) {
    const deg = Math.random() * 2 * Math.PI;
    const deltaY = radius * Math.cos(deg);
    const dotY = rootY + deltaY;
    const deltaX = radius * Math.sin(deg);
    const dotX = rootX + deltaX;

    if (
      dotX > width + size ||
      dotX < 0 - size ||
      dotY > height + size ||
      dotY < 0 - size
    ) {
      i--;
      continue;
    }

    const dot = figma.createEllipse();
    dot.resize(size, size);
    dot.fills = [
      {
        color: { r: 1, g: 1, b: 1 },
        type: "SOLID",
      },
    ];
    // dot.effects = [{
    //   type: "LAYER_BLUR",
    //   radius: 0.5,
    //   visible: true
    // }]
    frame.appendChild(dot);
    dot.x = dotX;
    dot.y = dotY;
    radius = radius * rCoef;
  }
};
