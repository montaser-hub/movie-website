import { Component, inject, Input } from '@angular/core';
import { MovieModel } from '../../models/movie-model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonServices } from '../../services/common-services';

@Component({
  selector: 'app-card-components',
  imports: [CommonModule, RouterLink],
  templateUrl: './card-components.html',
  styleUrl: './card-components.css',
})
export class CardComponents {
  @Input() movies: MovieModel[] = [];

  
  constructor(public services: CommonServices) {
 
  }

 
}
