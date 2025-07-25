import * as fabric from 'fabric';
import type { TOptions } from 'fabric';

type GuideSide = 'top' | 'left' | 'centerX' | 'centerY' | 'right' | 'bottom';

export class SnappyRect extends fabric.Rect {
  // Use a static property for the type, used by Fabric.js for serialization.
  static type = "snappyRect";
  public guides: { [key in GuideSide]?: fabric.Line } = {};

  // Use the 'TOptions' type as suggested by the error message.
  constructor(options?: TOptions<fabric.RectProps>) {
    super(options);
  }

  // Override the _render method. The parameter `ctx` needs a type.
  _render(ctx: CanvasRenderingContext2D): void {
    super._render(ctx);
    this._drawObjectGuides();
  }

  private _drawObjectGuides(): void {
    // It's crucial to check if the object is on a canvas.
    if (!this.canvas) {
      return;
    }
    const w = this.getScaledWidth();
    const h = this.getScaledHeight();

    // Use nullish coalescing (??) to safely handle potentially undefined top/left values.
    this._drawGuide("top", this.top ?? 0);
    this._drawGuide("left", this.left ?? 0);
    this._drawGuide("centerX", (this.left ?? 0) + w / 2);
    this._drawGuide("centerY", (this.top ?? 0) + h / 2);
    this._drawGuide("right", (this.left ?? 0) + w);
    this._drawGuide("bottom", (this.top ?? 0) + h);
    this.setCoords();
  }

  // Add types for the method parameters.
  private _drawGuide(side: GuideSide, pos: number): void {
    if (!this.canvas || typeof this.canvas.width === 'undefined' || typeof this.canvas.height === 'undefined') {
        return;
    }

    let ln: fabric.Line;
    const color = "rgb(178, 207, 255)";
    const lineProps = {
      stroke: color,
      selectable: false,
      evented: false, // Guides typically shouldn't capture events.
      opacity: 1
    };

    // Correctly handle horizontal vs. vertical lines.
    switch (side) {
      case "top":
      case "bottom":
      case "centerY": // Horizontal lines
        ln = new fabric.Line(
          [0, 0, this.canvas.width, 0],
          { ...lineProps, left: 0, top: pos }
        );
        break;

      case "left":
      case "right":
      case "centerX": // Vertical lines (fixed the original code's duplicate case)
        ln = new fabric.Line(
          [0, 0, 0, this.canvas.height],
          { ...lineProps, left: pos, top: 0 }
        );
        break;
      
      default:
        return; // Should not be reached with the GuideSide type
    }
    
    // If a guide line already exists, remove it before adding the new one.
    if (this.guides[side]) {
      this.canvas.remove(this.guides[side]!);
    }

    this.guides[side] = ln;
    this.canvas.add(ln);
  }
}
fabric.classRegistry.setClass(SnappyRect);