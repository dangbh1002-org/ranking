var config = {
    apiKey: "AIzaSyDWMxEvXQ_dSBfXZ98kwcu3pVkS2pf-Fco",
    authDomain: "ranking-323a9.firebaseapp.com",
    databaseURL: "https://ranking-323a9.firebaseio.com",
    storageBucket: "ranking-323a9.appspot.com",
    messagingSenderId: "358238196288"
};
firebase.initializeApp(config);

$(document).ready(function() {

    if (window.location.pathname.indexOf('profile.php') !== -1) {
        var userId = window.location.search.split('?id=')[1].split('&')[0];
        var displayName = document.getElementsByClassName('_391s')[0].textContent;
        var username = userId;
        var searching = userId;

        chrome.runtime.sendMessage({
            title: 'getMyId',
            data: {userId: userId, displayName: displayName, username: username, searching: searching}
        });

    }

    if (window.location.pathname.indexOf('/search/top/') !== -1) {

        var element = document.getElementsByClassName('_5w3n')[0];
        var userId = element && JSON.parse(element.getAttribute("data-store")).result_id;
        var displayName = document.getElementsByClassName('_5w3i')[0].textContent;
        var username = element.href.split('?')[0].split('facebook.com/')[1];
        var searching = window.location.search.slice(3, window.location.search.length).split('&')[0];

        chrome.runtime.sendMessage({
            title: 'getMyId',
            data: {userId: userId, displayName: displayName, username: username, searching: searching}
        });

    }


    //scan liked pages
    if (window.location.pathname.indexOf('/pages-liked/intersect') !== -1) {


        var interval = setInterval(function () {
            if (document.getElementsByClassName("_2jre").length) {
                var likedPages = [];
                var elements = document.getElementsByClassName("_5w3g");

                for (var i = 0; i < elements.length; i++) {
                    var pageId = JSON.parse(elements[i].getAttribute("data-xt").slice(3, elements[i].getAttribute("data-xt").length)).result_id;
                    var pageName = elements[i].querySelector('._5w3i').textContent;

                    var pageCategory = elements[i].querySelector('._5w3k').textContent;
                    var pageLikes = elements[i].querySelector('._5w3l').textContent.split(' ')[0];

                    likedPages.push(
                        {id: pageId, name: pageName, category: pageCategory, likes: pageLikes}
                    );

                }

                if (i == elements.length) {
                    var userId = window.location.pathname.split('/')[2];
                    chrome.runtime.sendMessage({title: 'pagesScaned', data: {userId: userId, likedPages: likedPages}});
                }

                clearInterval(interval);
            }

            if (document.getElementsByClassName("_1s_y").length) {
                chrome.runtime.sendMessage({title: 'pagesScaned', data: {userId: userId, likedPages: []}});
            }

            window.scrollTo(0, document.body.scrollHeight);

            chrome.runtime.sendMessage({title: 'activeMe'});

        }, 1000);

    }
});





