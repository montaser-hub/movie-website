import { Component } from '@angular/core';
import { CardComponents } from '../card-components/card-components';
import { MovieDetailsComponent } from '../movie-details-component/movie-details-component';
import { HttpService } from '../../services/http-service';
import { MovieModel } from '../../models/movie-model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-details',
  imports: [CardComponents, MovieDetailsComponent],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  movies: MovieModel[] = [];
  movie: any;
  apiKey = environment.tmdb.apiKey;
  genres: any[] = [];
  movieId: any;
  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private LanguageService: LanguageService
  ) {}

  ngOnInit() {
  this.route.params.subscribe((params) => {
    this.movieId = params['id'];

    this.http
      .get(`movie/${this.movieId}?api_key=${this.apiKey}&language=${this.LanguageService.lang$}`)
      .subscribe((data) => {
        this.movie = data;
        console.log(this.movie);
      });
    this.getRecommendtions();
  });
}


 

  getRecommendtions() {
  this.http
    .get(`movie/${this.movieId}/recommendations?api_key=${this.apiKey}&language=${this.LanguageService.lang$}`)
    .subscribe({
      next: (movies: any) => {
        console.log(movies.results);
        this.movies = movies.results;
      },
    });
}
}
