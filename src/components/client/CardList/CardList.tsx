import { useEffect, useState } from 'react';
import { getCats } from '../../../services/api';
import { CardListUI, ErrorUI, HeaderUI, LoaderUI } from '../../ui';

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCats = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setCats([]);
      }

      setLoading(true);
      const data = await getCats(page);

      if (data.length === 0) {
        setHasMore(false);
      }

      const likedCats = JSON.parse(localStorage.getItem('likedCats') || '[]') as Cat[];

      const updatedCats = data.map((cat: Cat) => ({
        ...cat,
        isLiked: likedCats.some((likedCat) => likedCat.id === cat.id),
      }));

      setCats((prevCats) => (isLoadMore ? [...prevCats, ...updatedCats] : updatedCats));
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

  useEffect(() => {
    if (page > 1) {
      fetchCats(true);
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

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

    if (activeTab === 'favorites') {
      setCats((prevCats) => prevCats.filter((prevCat) => prevCat.id !== cat.id));
    } else {
      setCats((prevCats) =>
        prevCats.map((prevCat) =>
          prevCat.id === cat.id ? { ...prevCat, isLiked: !isLiked } : prevCat
        )
      );
    }
  };

  if (loading && cats.length === 0) {
    return (
      <>
        <HeaderUI
          onAllCatsClick={handleAllCatsClick}
          onFavoriteCatsClick={handleFavoriteCatsClick}
          activeTab={activeTab}
        />
        <LoaderUI />
      </>
    );
  }

  if (error) {
    return <ErrorUI error={error} />;
  }

  return (
    <div>
      <HeaderUI
        onAllCatsClick={handleAllCatsClick}
        onFavoriteCatsClick={handleFavoriteCatsClick}
        activeTab={activeTab}
      />
      <CardListUI
        cats={cats}
        likedCats={likedCats}
        handleLikeClick={handleLikeClick}
      />
      {loading && <LoaderUI />}
    </div>
  );
}
