export class HoverScrollingText {

  private currentPosition: number = 0;
  private animationRunning: boolean = false;
  private elementWidth: any = null;
  private elementCopy: any = null;
  private elementHasCopy: boolean = false;
 
  constructor() {  
    this.initElements();
  } 

  private initElements() {
    
    let self = this;
    let scrollElement: NodeListOf<HTMLElement> = document.querySelectorAll('[data-horizontal-scroll-hover]');

    // repeat scrolling text mechanism for every instance on the page
    scrollElement.forEach((element: HTMLElement) => {

      // add non breaking space as flexbox ignores whitespace
      element.innerHTML += '&nbsp;';

      // create the clone
      self.elementCopy = element.cloneNode(true);


      if (!this.elementHasCopy) {

        // determine element width once
        self.elementWidth = element.clientWidth;
        
        // append the clone if not already there
        element.parentNode.appendChild(self.elementCopy);
        this.elementHasCopy = true;
      }
      
      // add EventListeners to both the original and the clone
      [element, self.elementCopy].forEach(index => {
        
        index.addEventListener('mouseover', () => {
        
          if (!this.animationRunning) {
            this.updatePosition(element);
          }
        }); 
      });
    });
  }
  
  private updatePosition(element: HTMLElement) {

    let self = this;
    let animationID: any = null;

    startAnimation();

    function startAnimation() {
      self.animationRunning = true;
      self.currentPosition = self.currentPosition - 2; 
      animationID = requestAnimationFrame(startAnimation);

      element.setAttribute('style', `text-indent: ${self.currentPosition}px`);

      if (self.currentPosition < -self.elementWidth) {
        self.currentPosition = 0;
      }
    }

    [element, this.elementCopy].forEach(index => {

      index.addEventListener('mouseleave', () => {

        cancelAnimationFrame(animationID); 
        this.animationRunning = false; 
      });
    });
  }
}