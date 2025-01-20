import { CardUI } from '..';
import style from './style.module.scss';
import { v4 as uuidv4 } from 'uuid';

type Cat = {
  id: string;
  url: string;
};

type CardListUIProps = {
  cats: Cat[];
  likedCats: Cat[];
  handleLikeClick: (cat: Cat) => void;
};

export function CardListUI({ cats, likedCats, handleLikeClick }: CardListUIProps) {
  return (
    <div className={style.card__list}>
      {cats.map((cat) => {
        const isLiked = likedCats.some((likedCat) => likedCat.id === cat.id);
        return (
          <CardUI
            key={`${cat.id}-${uuidv4()}`}
            image={cat.url}
            onClick={() => handleLikeClick(cat)}
            isLiked={isLiked}
          />
        );
      })}
    </div>
  );
}
