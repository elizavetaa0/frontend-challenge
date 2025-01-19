import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { getCats } from '../../../services/api';
import { CardUI, HeaderUI } from '../../ui';
import { Oval } from 'react-loader-spinner';

type Cat = {
  id: string;
  url: string;
};

export function CardList() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [likedCats, setLikedCats] = useState<Cat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const fetchCats = async () => {
    try {
      setLoading(true);
      const data = await getCats();

      const likedCats = JSON.parse(localStorage.getItem('likedCats') || '[]') as Cat[];

      const updatedCats = data.map((cat: Cat) => ({
        ...cat,
        isLiked: likedCats.some((likedCat) => likedCat.id === cat.id),
      }));

      setCats(updatedCats);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
    const savedLikedCats = JSON.parse(localStorage.getItem('likedCats') || '[]');
    setLikedCats(savedLikedCats);
  }, []);

  const handleAllCatsClick = () => {
    fetchCats();
    setActiveTab('all');
  };

  const handleFavoriteCatsClick = () => {
    const savedLikedCats = JSON.parse(localStorage.getItem('likedCats') || '[]') as Cat[];
    setCats(savedLikedCats);
    setActiveTab('favorites');
  };

  const handleLikeClick = (cat: Cat) => {
    const likedCats = JSON.parse(localStorage.getItem('likedCats') || '[]') as Cat[];
  
    const isLiked = likedCats.some((likedCat) => likedCat.id === cat.id);
  
    let updatedLikedCats;
    if (isLiked) {
      updatedLikedCats = likedCats.filter((likedCat) => likedCat.id !== cat.id);
    } else {
      updatedLikedCats = [...likedCats, cat];
    }
  
    localStorage.setItem('likedCats', JSON.stringify(updatedLikedCats));
    setLikedCats(updatedLikedCats);

    setCats((prevCats) => 
      prevCats.map((prevCat) => 
        prevCat.id === cat.id ? { ...prevCat, isLiked: !isLiked } : prevCat
      )
    );
  };

  if (loading) {
    return (
      <>
      <HeaderUI
        onAllCatsClick={handleAllCatsClick}
        onFavoriteCatsClick={handleFavoriteCatsClick}
        activeTab={activeTab}
      />
      <div className={style.card__list__loader__container}>
        <Oval color='#2196F3' secondaryColor='#C1DFF7' />
        <p>Загружаем котиков</p>
      </div>
      </>

    );
  }

  if (error) {
    return <div className={style.error}>Ошибка: {error}</div>;
  }

  return (
    <div>
      <HeaderUI
        onAllCatsClick={handleAllCatsClick}
        onFavoriteCatsClick={handleFavoriteCatsClick}
        activeTab={activeTab}
      />
      <div className={style.card__list}>
        {cats.map((cat) => {
          const isLiked = likedCats.some((likedCat) => likedCat.id === cat.id);
          return (
            <CardUI
              key={cat.id}
              image={cat.url}
              onClick={() => handleLikeClick(cat)}
              isLiked={isLiked}
            />
          );
        })}
      </div>
    </div>
  );
}
