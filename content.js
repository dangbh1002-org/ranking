var config = {
    apiKey: "AIzaSyDWMxEvXQ_dSBfXZ98kwcu3pVkS2pf-Fco",
    authDomain: "ranking-323a9.firebaseapp.com",
    databaseURL: "https://ranking-323a9.firebaseio.com",
    storageBucket: "ranking-323a9.appspot.com",
    messagingSenderId: "358238196288"
};
firebase.initializeApp(config);


document.onreadystatechange = function () {
    if (document.readyState == "complete") {

        //get user id
        if(window.location.pathname.split('/')[1] !== 'search'){

            var element = document.querySelector('meta[property="al:ios:url"]');
            var userId = element && element.getAttribute("content").split('/')[3];
            var displayName = document.getElementsByClassName('_1frb')[0].value;
            var username = window.location.pathname.split('/')[1];

            chrome.runtime.sendMessage({title: 'getMyId', data: {userId: userId, displayName: displayName, username: username}}, function(response) {
                if(response.title == 'getMyIdDone'){
                    console.log('Thanks!');
                }
            });
        }


        //scan liked pages
        if(window.location.pathname.split('/')[1] == 'search'){
            var interval = setInterval(function () {
                if (document.getElementsByClassName("phm _64f").length) {
                    var likedPages = [];
                    var elements = document.getElementsByClassName("_3u1 _gli _5und");
                    for (var i = 0; i < elements.length; i++) {
                        var pageId = JSON.parse(elements[i].getAttribute("data-bt")).id;
                        var pageName = elements[i].querySelector('._gll ._5d-5').textContent;

                        var pageInfo = elements[i].querySelector('._pac').childNodes;
                        if(pageInfo.length == 4){
                            var pageCategory = pageInfo[0].textContent;
                            var pageLikes = pageInfo[2].textContent.split(' ')[0];
                        } else {
                            var pageCategory = pageInfo[1].textContent;
                            var pageLikes = pageInfo[3].textContent.split(' ')[0];
                        }


                        likedPages.push(
                            {id: pageId, name: pageName, category: pageCategory, likes: pageLikes}
                        );
                        if (i == elements.length - 1) {
                            var displayName = document.getElementsByClassName('_1frb')[0].value;
                            var userId = window.location.pathname.split('/')[2];
                            firebase.database().ref().child('userScaned/'+userId).update({displayName: displayName, likedPages: likedPages}, function(error) {
                                if (error) {
                                    console.log("Data could not be saved." + error);
                                } else {
                                    chrome.runtime.sendMessage({title: 'closeMe'}, function(response) {
                                    });
                                }
                            });

                        }
                    }

                    clearInterval(interval);
                }

                window.scrollTo(0, document.body.scrollHeight);

                chrome.runtime.sendMessage({title: 'activeMe'}, function(response) {
                    if(response && response.title == 'activeDone'){
                        console.log('Thanks!');
                    }
                });

            }, 1000);
        }

    }
};





