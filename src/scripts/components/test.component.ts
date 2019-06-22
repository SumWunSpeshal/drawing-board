export class Student {
  private x:number;
  private y:number;
 
  constructor(x?:number, y?:number) {
    this.x = x; 
    this.y = y;
    this.draw();
  } 

  private draw() {
    document.body.innerHTML = (`X is ${this.x}, Y is${this.y}`)
  }
}