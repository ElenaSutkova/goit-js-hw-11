import axios from "axios";

export default async function gettingGalery(searchQuery, page) {
    const BASE_API_URL = 'https://pixabay.com/api/';
    const API_KEY = '40450680-17c279c7abde5535240169683';

    const params = new URLSearchParams({
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: horizontal,
        safesearch: true,
        per_page: 40,
        page
    });

    return await axios.get(`${BASE_API_URL}`, {
        params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(resp => {
            console.log('Fetch data: ', resp);
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }
            return resp.data
    })
}