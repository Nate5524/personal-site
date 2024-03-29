import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticGuiFunctionsService {

  constructor() { }

}

export class FontTransformations{
  static toggleFont(letterList:HTMLCollectionOf<HTMLElement>, font1:string, font2:string){
    let i = 0;
    setInterval(function(){
      if(i>=letterList.length){
        return;
      }
      if (letterList[i].style.fontFamily == font1){
        letterList[i].style.fontFamily = font2;
      } else{
        letterList[i].style.fontFamily = font1;
      }
      i++;
    }, 60);
  }
}