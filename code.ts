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
    const maxDistance = calculateMaxDistance(width, height, rootX, rootY);

    radiusLinearRandomGeneration(
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

const radiusExponentialRandomGeneration = (
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

    addEllipseToFrame(frame, dotX, dotY, size);
    radius = radius * rCoef;
  }
};

const radiusLinearRandomGeneration = (
  frame: FrameNode,
  width: number,
  height: number,
  maxDistance: number,
  totalCount: number,
  rootX: number,
  rootY: number,
  size: number
) => {
  const coefficient = 5;
  const circlesCount = Math.floor(totalCount / coefficient);
  const rCoef = maxDistance / circlesCount;
  let radius = rCoef;

  addEllipseToFrame(frame, rootX, rootY, size)
  for (let i = 0; i < circlesCount; i++) {
    for (let j = 0; j < coefficient; j++) {
      const deg = Math.random() * 2 * Math.PI;
      const deltaY = radius * Math.cos(deg);
      const dotY = rootY + deltaY;
      const deltaX = radius * Math.sin(deg);
      const dotX = rootX + deltaX;

      addEllipseToFrame(frame, dotX, dotY, size)
    }

    radius = radius + rCoef;
  }
};

const addEllipseToFrame = (frame: FrameNode, x: number, y: number, size: number) => {
  const dot = figma.createEllipse();
  dot.resize(size, size);
  dot.fills = [
    {
      color: { r: 0, g: 0, b: 0 },
      type: "SOLID",
    },
  ];
  frame.appendChild(dot);
  dot.x = x;
  dot.y = y;
}
