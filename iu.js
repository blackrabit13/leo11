const request = require('request-promise');
const cheerio = require('cheerio');
const q = require('q');
const fs = require('fs');
let articleArr = JSON.parse(fs.readFileSync('./HotArticles.json', 'utf8'));
let promises = [];
let urls = [];

for (let index = 0; index < articleArr.length; index++) {
    urls.push({
        uri: articleArr[index].articleLink,
        transform: (body) => {
            return cheerio.load(body);
        }
    });
    // 這是 request-promise 的變化型
}
console.log(urls);
let fetchPages = (urls) => {
    // forEach 寫起來是不是簡潔多了
    urls.forEach((url) => {
        promises.push(request(url));
    });
    
    // q 是一個 queue
    return q.all(promises);
    
}
let writeJSON = () => {
    console.log(articleArr);
    fs.writeFile('HotBeauties.json', JSON.stringify(articleArr), function (err) {
        if (err)
            console.log(err);
        else
            console.log('File ' + 'HotBeauties.json' + ' written!');
    })
}

fetchPages(urls).then((pages) => {
    let articleImages = [];
    console.log(pages.length);
    // [0]('#main-content a')[0].attribs.href
    for (let pgI = 0; pgI < pages.length; pgI++) {
        let $ = pages[pgI];
        // console.log($)
        let imgLinks = [];
        imgArr = $('#main-content a');
        // console.log(imgArr.length)
        for (let imgI = 0; imgI < imgArr.length; imgI++) {
            // console.log(imgI.toString())
            let imgUrl = imgArr[imgI.toString()].attribs.href;
            if (!(imgUrl == "" || imgUrl.indexOf(".jpg") == -1)) {
                // console.log(imgUrl)
                imgLinks.push(imgUrl);
            }
        }
        // let title = articleArr[pgI].articleName;
        // console.log('>>\n' + title);
        // console.log(articleArr[pgI].articleLink)
        articleArr[pgI].articleImages = imgLinks;
        // console.log(articleArr[pgI].articleImages.length)
        // console.log(articleArr[pgI].articleImages);
        // articleImages.push(imgLinks);
    }
    writeJSON();
});