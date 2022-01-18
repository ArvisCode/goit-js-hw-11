import axios from 'axios';

export default async function fetch(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '25297650-5438b7c22050d2ff2890b9a1d';
  const filter = `key=${key}&q=${value}&image_type=photo&min_width=640&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${url}?${filter}`).then(response => response.data);
}
