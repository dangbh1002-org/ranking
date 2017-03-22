var config = {
    apiKey: "AIzaSyDWMxEvXQ_dSBfXZ98kwcu3pVkS2pf-Fco",
    authDomain: "ranking-323a9.firebaseapp.com",
    databaseURL: "https://ranking-323a9.firebaseio.com",
    storageBucket: "ranking-323a9.appspot.com",
    messagingSenderId: "358238196288"
};
firebase.initializeApp(config);

$(document).ready(function () {


    //get User From Right Click
    function getUserFromRightClick(e) {
        e = e || window.event;
        switch (e.which) {
            case 3:
                if (e.target.getAttribute("data-hovercard")) {
                    var userId = e.target.getAttribute("data-hovercard").split('id=')[1].split('&')[0];
                    var displayName = e.target.textContent;
                    var username = e.target.href.split('facebook.com/')[1].split('?')[0];

                    var r = confirm("Bạn có muốn thêm người dùng này vào tệp khách hàng nghiên cứu?");
                    if (r == true) {
                        chrome.runtime.sendMessage({
                            title: 'getMyIdNow',
                            data: {userId: userId, displayName: displayName, username: username}
                        }, function (response) {

                        });
                    }
                }

                break;
        }
    }

    function initRightClick() {
        $('a').off('mousedown').on('mousedown', function (event) {
            getUserFromRightClick(event)
        });
    }

    initRightClick();
    $('em._4qba').on('click', function (event) {
        setTimeout(function () {
            initRightClick();
        }, 2000);
    });


    var timeout;
    $(window).scroll(function (event) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            initRightClick();
        }, 2000);
    });

    //get user from mobile view
    if (window.location.href.indexOf('m.facebook.com/') !== -1 && window.location.pathname.indexOf('/pages-liked/intersect') == -1) {
        var userId = document.getElementsByClassName('_39pi')[0].href.split('&id=')[1].split('&')[0];
        var displayName = document.getElementsByClassName('_391s')[0].textContent;

        if (window.location.href.indexOf('profile.php') !== -1) {
            var username = window.location.search.split('?id=')[1].split('&')[0];
            var searching = userId;
        } else {
            username = window.location.href.split('m.facebook.com/')[1].split('?')[0];
            searching = username;
        }

        chrome.runtime.sendMessage({
            title: 'getMyId',
            data: {userId: userId, displayName: displayName, username: username, searching: searching}
        });
    }

    //scan liked pages
    if (window.location.pathname.indexOf('/pages-liked/intersect') !== -1) {

        var interval = setInterval(function () {
            if (document.getElementsByClassName("phm _64f").length) {
                var likedPages = [];
                var elements = document.getElementsByClassName("_3u1 _gli _5und");

                for (var i = 0; i < elements.length; i++) {
                    var pageId = JSON.parse(elements[i].getAttribute("data-bt")).id;
                    var pageName = elements[i].querySelector('._gll ._5d-5').textContent;

                    var pageInfo = elements[i].querySelector('._pac').childNodes;
                    if (pageInfo.length == 4) {
                        var pageCategory = pageInfo[0].textContent;
                        var pageLikes = pageInfo[2].textContent.split(' ')[0];
                    } else {
                        pageCategory = pageInfo[1].textContent;
                        pageLikes = pageInfo[3].textContent.split(' ')[0];
                    }

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

            window.scrollTo(0, document.body.scrollHeight);

            chrome.runtime.sendMessage({title: 'activeMe'}, function (response) {
                if (response && response.title == 'activeDone') {
                    console.log('Thanks!');
                }
            });

        }, 1000);

    }
});





