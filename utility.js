var fileSys = require('fs');

function loadInfo() {
    return JSON.parse(fileSys.readFileSync('data.json'));
}

function saved(info) {
    
    var obj = {blog_posts: info };
    fs.writeFileSync('data.json', JSON.stringify(obj));
}

function getTags(info) {
    var allTags = [];
    for(var i = 0; i < info.length; i++) {
        var tags = info[i].tags;
        for(var j = 0; j < tags.length; j++) {
            if(!~allTags.indexOf(tags[j])) allTags.push(tags[j]);
        }
    }
    return allTags;
}

module.exports = {
    loadInfo : loadInfo,
    saved: saved,
    getTags: getTags
}
