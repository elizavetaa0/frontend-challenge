const baseUrl = process.env.REACT_APP_BASE_URL;
const apiKey = process.env.REACT_APP_API_KEY;

export const getCats = async (page: number = 1) => {
  const limit = 50;  // Количество котиков на странице
  const offset = (page - 1) * limit;  // Смещение для пагинации

  const response = await fetch(`${baseUrl}/images/search?limit=${limit}&offset=${offset}&api_key=${apiKey}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch images of cats: ${response.statusText}`);
  }

  return response.json();
};
