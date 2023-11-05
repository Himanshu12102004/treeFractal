const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = innerHeight;
canvas.width = innerWidth;
let calcScale =
  innerWidth > innerHeight ? innerHeight / 5 - 50 : innerWidth / 5 - 50;
const scale = { x: calcScale, y: calcScale };
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor(root) {
    this.root = root;
  }
  insertRight(node, nodeToInsert) {
    const newNode = new Node(nodeToInsert);
    node.right = newNode;
  }
  insertLeft(node, nodeToInsert) {
    const newNode = new Node(nodeToInsert);

    node.left = newNode;
  }
  traverse(root) {
    if (root) {
      this.traverse(root.left);
      this.traverse(root.right);
    }
  }
  traverseAndDraw(root) {
    if (root) {
      root.data.update();
      this.traverseAndDraw(root.left);
      this.traverseAndDraw(root.right);
    }
  }
  traverseAndUpdate(root) {
    if (root) {
      root.data.update();
      this.traverseAndUpdateChild(root, root.left, "left");
      this.traverseAndUpdateChild(root, root.right, "right");
    }
  }
  traverseAndUpdateChild(root, child, identifier) {
    if (child) {
      child.data.start.x = root.data.end.x;
      child.data.start.y = root.data.end.y;
      console.log(child.data.start.y);
      child.data.length = root.data.length * treeSpecifications.lengthDamping;
      child.data.thickness =
        root.data.thickness * treeSpecifications.widthDamping;
      if (identifier === "left") {
        child.data.angle = root.data.angle - treeSpecifications.angle1;
      } else if (identifier === "right") {
        child.data.angle = root.data.angle + treeSpecifications.angle2;
      }
      this.traverseAndUpdate(child);
    }
  }
}
class Line {
  constructor(start, length, angle, color, thickness) {
    this.start = start;
    this.length = length;
    this.color = color;
    this.thickness = thickness;
    this.angle = angle;
    this.end = {
      x: this.start.x + this.length * Math.cos((this.angle * Math.PI) / 180),
      y: this.start.y + this.length * Math.sin((this.angle * Math.PI) / 180),
    };
    this.startForComputer = { x: null, y: null };
    this.startForComputer.x = canvas.width / 2 + scale.x * this.start.x;
    this.startForComputer.y = canvas.height - scale.y * this.start.y;
    this.endForComputer = { x: null, y: null };
    this.endForComputer.x =
      this.startForComputer.x +
      this.length * Math.cos((this.angle * Math.PI) / 180) * scale.x;
    this.endForComputer.y =
      this.startForComputer.y -
      this.length * Math.sin((this.angle * Math.PI) / 180) * scale.y;
  }
  update() {
    this.end.x =
      this.start.x + this.length * Math.cos((this.angle * Math.PI) / 180);
    this.end.y =
      this.start.y + this.length * Math.sin((this.angle * Math.PI) / 180);
    this.startForComputer.x = canvas.width / 2 + scale.x * this.start.x;
    this.startForComputer.y = canvas.height - scale.y * this.start.y;
    this.endForComputer = { x: null, y: null };
    this.endForComputer.x =
      this.startForComputer.x +
      this.length * Math.cos((this.angle * Math.PI) / 180) * scale.x;
    this.endForComputer.y =
      this.startForComputer.y -
      this.length * Math.sin((this.angle * Math.PI) / 180) * scale.y;
    this.draw();
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.startForComputer.x, this.startForComputer.y);
    ctx.lineTo(this.endForComputer.x, this.endForComputer.y);
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.stroke();
  }
}

const gui = new dat.GUI();
const treeSpecifications = {
  rootLength: 2,
  rootWidth: 3,
  angle1: 60,
  angle2: 60,
  branches: 2,
  level: 5,
  widthDamping: 0.6,
  lengthDamping: 0.8,
};
if (innerHeight > innerWidth) {
  treeSpecifications.angle1 = 20;
  treeSpecifications.angle2 = 20;
  treeSpecifications.rootLength = 5;
}
const tree = gui.addFolder("Tree");
const colorFolder = gui.addFolder("Color");
const color = { r: 0, g: 250, b: 0 };

tree.open();
colorFolder.add(color, "r", 0, 255);
colorFolder.add(color, "g", 0, 255);
colorFolder.add(color, "b", 0, 255);

const lengthcontroller = tree.add(treeSpecifications, "rootLength", 0.5, 10);
const widthController = tree.add(treeSpecifications, "rootWidth", 1, 20);
const angle1Controller = tree.add(treeSpecifications, "angle1", 0, 360);
const angle2Controller = tree.add(treeSpecifications, "angle2", 0, 360);
// const brachController = tree.add(treeSpecifications, "branches", 1, 5);
const levelController = tree.add(treeSpecifications, "level", 0, 12, 1);
const widthDampingController = tree.add(
  treeSpecifications,
  "widthDamping",
  0,
  1
);
const lengthDampingController = tree.add(
  treeSpecifications,
  "lengthDamping",
  0,
  1
);

lengthcontroller.onChange(minorTreeChange);
widthController.onChange(minorTreeChange);
angle1Controller.onChange(minorTreeChange);
angle2Controller.onChange(minorTreeChange);
widthDampingController.onChange(minorTreeChange);
lengthDampingController.onChange(minorTreeChange);
levelController.onChange(majorTreeChange);
function majorTreeChange() {
  binaryTree = new BinaryTree(rootNode);
  generateTree(rootNode, 0);
}
const scaleFolder = gui.addFolder("Scale");
function minorTreeChange() {
  binaryTree.root.data.length = treeSpecifications.rootLength;
  binaryTree.root.data.thickness = treeSpecifications.rootWidth;
  console.log(binaryTree.root.data);
  binaryTree.traverseAndUpdate(rootNode);
  console.log(
    "-----------------------------------------------------------------"
  );
  binaryTree.traverse(rootNode);
}
scaleFolder.add(scale, "x", 50, 500);
scaleFolder.add(scale, "y", 50, 500);

console.log(gui);
const treeLines = [];
const gridYAxesLine = new Line(
  { x: 0, y: 0 },
  canvas.height / scale.y,
  90,
  "red",
  1
);
const gridXAxesLine = new Line(
  { x: -canvas.width / 2 / scale.x, y: 0 },
  canvas.width / scale.x,
  0,
  "red",
  1
);
const gridLinesYArray = [gridYAxesLine];
const gridLinesXArray = [gridXAxesLine];

function gridLines() {
  for (
    let i = 1;
    gridLinesYArray[gridLinesYArray.length - 1].endForComputer.x < canvas.width;
    i++
  ) {
    const line2 = new Line(
      { x: -i, y: 0 },
      canvas.height / scale.y,
      90,
      "white",
      1
    );
    gridLinesYArray.push(line2);
    const line1 = new Line(
      { x: i, y: 0 },
      canvas.height / scale.y,
      90,
      "white",
      1
    );
    gridLinesYArray.push(line1);
  }
  for (
    let i = 1;
    i < gridLinesXArray[gridLinesXArray.length - 1].endForComputer.y > 0;
    i++
  ) {
    const line = new Line(
      { x: -canvas.width / 2 / scale.x, y: i },
      canvas.width / scale.x,
      0,
      "white",
      1
    );
    gridLinesXArray.push(line);
  }
}
// gridLines();
const root = new Line(
  { x: 0, y: 0 },
  treeSpecifications.rootLength,
  90,
  `rgb(${color.r}, ${color.g}, ${color.b})`,
  treeSpecifications.rootWidth
);
const rootNode = new Node(root);
let binaryTree = new BinaryTree(rootNode);
function generateTree(root, level) {
  if (level >= treeSpecifications.level) return;
  const branch1 = new Line(
    { x: root.data.end.x, y: root.data.end.y },
    root.data.length * treeSpecifications.lengthDamping,
    root.data.angle - treeSpecifications.angle1,
    `rgb(${color.r}, ${color.g}, ${color.b})`,
    root.data.thickness * treeSpecifications.widthDamping
  );
  binaryTree.insertRight(root, branch1);
  generateTree(root.right, level + 1);
  const branch2 = new Line(
    { x: root.data.end.x, y: root.data.end.y },
    root.data.length * treeSpecifications.lengthDamping,
    root.data.angle + treeSpecifications.angle2,
    `rgb(${color.r}, ${color.g}, ${color.b})`,
    root.data.thickness * treeSpecifications.widthDamping
  );
  binaryTree.insertLeft(root, branch2);

  generateTree(root.left, level + 1);
}
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  binaryTree.traverseAndDraw(rootNode);

  // gridLinesXArray.forEach((elem) => {
  //   elem.update();
  // });
  // gridLinesYArray.forEach((elem) => {
  //   elem.update();
  // });
}
animate();
console.log(root);
generateTree(rootNode, 0);
console.log(treeLines);
binaryTree.traverse(rootNode);
