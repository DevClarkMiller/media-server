import axios from 'axios';

export default axios.create({
    baseURL: 'http://drive.clarkmiller.ca/api'
});