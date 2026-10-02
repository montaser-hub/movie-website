import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http-service';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../safe-url-pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-movie-details-component',
  templateUrl: './movie-details-component.html',
  styleUrl: './movie-details-component.css',
  imports: [CommonModule, SafeUrlPipe],
  standalone: true,
})
export class MovieDetailsComponent {
  movie: any;
  trailerUrl: string | null = null;
  apiKey = environment.tmdb.apiKey;
  language = localStorage.getItem('lang');

  constructor(private route: ActivatedRoute, private http: HttpService) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const movieId = params['id'];
      this.http.get(`movie/${movieId}`, { language: this.language }).subscribe((data) => {
        this.movie = data;
      });
    });
  }

  getStars(vote: number): string[] {
    const stars: string[] = [];
    const rating = Math.round(vote / 2);
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'bi-star-fill text-warning' : 'bi-star');
    }
    return stars;
  }

  loadTrailer(movieId: number) {
    this.http
      .get(`movie/${movieId}/videos`, { language: this.language })
      .subscribe((data: any) => {
        const trailer = data.results.find(
          (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );
        if (trailer) {
          this.trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
        }
      });
  }
}
