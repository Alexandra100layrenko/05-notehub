import type { Note } from '../../types/note';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  readonly movies: Movie[];
  readonly onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies.length) return null;

  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
            <button
              className={styles.card}
              onClick={() => onSelect(movie)}
              type="button"
            >
                <img
                className={styles.image}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
                />
                <h2 className={styles.title}>{movie.title}</h2>
            </button>
        </li>
      ))}
    </ul>
  );
}
