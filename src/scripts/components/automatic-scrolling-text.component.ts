export class AutomaticScrollingText { 

  constructor() {  

    // run the initializer once on page load
    this.initElements();
  } 


  private initElements() {
    
    let scrollElement: NodeListOf<HTMLElement> = document.querySelectorAll('[data-horizontal-scroll]');

    // repeat scrolling text mechanism for every instance on the page
    scrollElement.forEach((element: HTMLElement) => {

      // add non breaking space as flexbox ignores whitespace
      element.innerHTML += '&nbsp;';

      // create the clone
      let elementCopy = element.cloneNode(true);

      // determine element width once
      var elementWidth: number = element.clientWidth;
      
      // append the clone if not already there
      element.parentNode.appendChild(elementCopy);
      
      this.updatePosition(element, elementWidth); 
    });
  }
  
  private updatePosition(element: HTMLElement, elementWidth: number) {

    let currentPosition: number = 0;

    // initially launch the function once
    startAnimation();

    // animation function definition
    function startAnimation() {
      currentPosition = currentPosition - 2; 

      // required CSS to offset the element via text-indent
      element.setAttribute('style', `text-indent: ${currentPosition}px`);

      // reset offset on completion 
      if (currentPosition < -elementWidth) {
        currentPosition = 0;
      }

      requestAnimationFrame(startAnimation);
    }
  }
}