import style from './styles.module.scss';

type HeaderProps = {
  onAllCatsClick: () => void;
  onFavoriteCatsClick: () => void;
  activeTab: 'all' | 'favorites';
};

export function HeaderUI({ onAllCatsClick, onFavoriteCatsClick, activeTab }: HeaderProps) {
  return (
    <div className={style.header__container}>
      <button
        className={`${style.header__button} ${activeTab === 'all' ? style.active : ''}`}
        onClick={onAllCatsClick}
      >
        Все котики
      </button>
      <button
        className={`${style.header__button} ${activeTab === 'favorites' ? style.active : ''}`}
        onClick={onFavoriteCatsClick}
      >
        Любимые котики
      </button>
    </div>
  );
}
