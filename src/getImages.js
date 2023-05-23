import axios from 'axios';

export async function getImage(search, pagecount) {

 
  const SEARCH_PARAMS = new URLSearchParams({
      image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: pagecount,
    per_page: 40,
  });
  
  try{  const response =
    await axios.get(`https://pixabay.com/api/?key=34960745-b530bdf219145f51506c30578&q=${search}&${SEARCH_PARAMS}`);
    return response.data;
  }
  catch(error) {console.log(error)}


}
  // 