require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req,res,next){
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next();
})

const MOVIES = require('./movies.json');



function getMovies(req,res){
    const {genre, country, avg_vote} = req.query;

    if(!genre && !country && !avg_vote){
        return res
        .status(400)
        .send('Please enter either genre, country or avg_vote');
    }
    let results;
    
    if(genre){
        results = MOVIES.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
    }
    if(country){
        results = MOVIES.filter(movie => movie.country.toLowerCase() === country.toLowerCase());
    }

    if(avg_vote){
        results = MOVIES.filter(movie => Number(movie.avg_vote) >= Number(avg_vote));
    }

    res.json(results);
}

app.get('/movies', getMovies);

app.use((error, req, res, next) => {
    let response;
    if(process.env.NODE_ENV === 'production'){
        response = {error: {message: 'server error'}}
    }
    else{
        response = {error}
    }

    res.status(500).json(response);
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>{
    
})
