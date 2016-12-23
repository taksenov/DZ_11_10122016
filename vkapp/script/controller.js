var Controller = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    groupsRoute: function() {
        return Model.getGroups().then(function(groups) {
            results.innerHTML = View.render('groups', {list: groups.items});
        });
    },
    photosRoute: function() {
        return Model.getPhotos().then(





            // TODO избавиться от callback-hell сделать через цепочку промисов
            function(photos) {

                // очередь запросов к VK api
                function queueRequests(curr, max) {
                    if (curr >= max) return;
                    Model.getPhotosComments( photos.items[curr].owner_id, photos.items[curr].id ).then(
                        function(comments) {
                            var res = JSON.stringify(comments);
                            var obj = JSON.parse(res);
                            console.log(obj);
                            if ( obj.count > 0 ) {
                                photos.items[curr].customComments = obj;
                                console.log('photos.items[curr]', photos.items[curr]);
                            }
                            // установка задержки в 1/3 секунды, чтоб ВК не забанил
                            // рекурсивный вызов
                            setTimeout(
                                function() { queueRequests(curr+1, max) } , 333
                            );
                        }
                    );
                };
                // queueRequests

                queueRequests(0, photos.items.length);



        })
        .then(
            function(customPhotos) {
                results.innerHTML = View.render('photos', {list: customPhotos.items});

            }
        )
        ;
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    }
};
