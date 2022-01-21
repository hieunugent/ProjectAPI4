const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const newpapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base:''
  },
  {
    name: "theguardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base:'',
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base:"https://www.telegraph.co.uk"
  },
];


const articles = [];
newpapers.forEach(newpaper => {
    axios.get(newpaper.address).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        articles.push({
          title,
          url: newpaper.base+ url,
          source: newpaper.name,
        });
      });
    });


})
app.get('/hughclimate', (req, res) => {
    res.json('Welcome to My API Project')
})
app.get('/news', (req, res) => {
            res.json(articles)        
})
app.get('/news/:newpaperId', (req, res) => {
    const newpaperId = req.params.newpaperId;
    const newpaperAddress = newpapers.filter(newpaper => newpaper.name == newpaperId)[0].address;
    const newpaperBase = newpapers.filter(newpaper=> newpaper.name == newpaperId)[0].base
 
    axios.get(newpaperAddress)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificArticles =[]
        $('a:contains("climate")', html).each(function(){
            const title = $(this).text();
            const url = $(this).attr("href");
            specificArticles.push({
                title,
                url: newpaperBase+url,
                source:newpaperId
            })
        })
        res.json(specificArticles)

    }).catch(err => console.log(err))
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});