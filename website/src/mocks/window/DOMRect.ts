class DOMRect {
  bottom = 0;
  left = 0;
  right = 0;
  top = 0;
  x = 0;
  y = 0;
  width = 0;
  height = 0;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.left = x;
    this.right = x + width;
    this.top = y;
    this.bottom = y + height;
  }

  static fromRect(other?: DOMRectInit): DOMRect {
    return new DOMRect(other?.x, other?.y, other?.width, other?.height);
  }

  toJSON() {
    return JSON.stringify(this);
  }
}

export default DOMRect;
