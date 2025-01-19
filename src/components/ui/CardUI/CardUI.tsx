import { Heart } from 'lucide-react';
import style from './style.module.scss';

type CardProps = {
  onClick: () => void;
  image: string;
  isLiked: boolean;
}

export function CardUI({ onClick, image, isLiked }: CardProps) {
  return(
    <div className={style.card__container}>
      <img src={image} alt='' />
      <Heart
        className={`${style.card__like__button} ${isLiked ? style.active : ''}`}
        onClick={onClick}
      />
    </div>
  )
}