import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FontTransformations } from '../static-gui-functions.service';

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
  const word = document.getElementById("word")
  if (word != null){
    const letters = word.getElementsByTagName("h3");
    if (letters != null){
      word.addEventListener("mouseenter", ()=> {FontTransformations.toggleFont(letters, "aurebesh", "bebas");});
    }
  }
  }
}

