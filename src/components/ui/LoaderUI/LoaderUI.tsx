import { Oval } from 'react-loader-spinner';
import style from './styles.module.scss';

export function LoaderUI () {
  return (
    <div className={style.card__list__loader__container}>
      <Oval color='#2196F3' secondaryColor='#C1DFF7' />
      <p>Загружаем еще котиков</p>
    </div>
  )
}