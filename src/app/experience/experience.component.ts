import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnInit{

  constructor() { }

  ngOnInit() {  
  const word = document.getElementById("word");
  if (word == null) {
    throw new Error("No word found");
  }
  var letters = word.getElementsByTagName("p");

  var timeHovered = 0;

  setInterval(function () {
    if (getComputedStyle(word).getPropertyValue("--hovered") == "1") {
      if (timeHovered <= letters.length) {
        timeHovered += 1;
      }
      for (let i = 0; i < letters.length; i++) {
        if (timeHovered > i) {
          letters[i].style.fontFamily = "aurebesh";
        }
      }
    } else {
      if (timeHovered >= -1) {
        timeHovered -= 1;
      }
      for (let i = 0; i < letters.length; i++) {
        if (timeHovered < i) {
          letters[letters.length - 1 - i].style.fontFamily = "bebas";
        }
      }
    }
  }, 50);
  }
}

