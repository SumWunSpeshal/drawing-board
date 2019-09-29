import {debounce} from '../helpers/debounce.helpers'; 

export class TruncateText { 
  
  private wordsToClip: number = 2;
  private allContents: Array<Array<String>> = [];

  constructor() {
    this.saveAllContents();
    this.truncateText();

    window.addEventListener('resize', debounce(() => {
      this.truncateText();
    }, 100));
  } 

  private truncateText() {
    let items: NodeListOf<HTMLElement> = document.querySelectorAll('[data-truncate-text]');

    items.forEach((item, key) => {

      this.generateContent(item, key);
    });
  }

  private generateContent(item: HTMLElement, key: number) {
    const allowedLines: number = parseInt(item.getAttribute('data-truncate-text'));
    let currentPosition: number = 0;
    let lines: number = 0;

    // clear [data-truncate-text] before generating content
    item.innerText = '';

    for (let index of this.allContents[key]) {

      // create a span for every word in the text
      const span = document.createElement('span');
      span.innerHTML = index + ' ';
      item.append(span);

      // get top position of every span
      let spanY = span.getBoundingClientRect().top;

      // keep track of the current number of total lines
      if (currentPosition != spanY) { 
        lines++;
        currentPosition = spanY;
      }

      // if allowed maximum has been reached, remove the last added item, add dots, show container and stop execution
      if (lines > allowedLines) {

        let lastItems = Array.prototype.slice.call(span.parentNode.querySelectorAll('span')).splice(-this.wordsToClip);

        for (let i in lastItems) {
          span.parentNode.removeChild(lastItems[i]);
        }

        item.innerText += '...';
        item.classList.remove('is-invisible');
        return;
      }  
    }
  }

  // save all Contents to immutable Array
  private saveAllContents() {
    let items: NodeListOf<HTMLElement> = document.querySelectorAll('[data-truncate-text]');
    
    items.forEach(item => {
      this.allContents.push(item.innerText.split(' '));
    });
  }
}