// Copyright 2016. HansolLim All Right Reserved.
(function(base){
    base._global = {};

    window.onload = function(){
        var global = new GlobalString(language);

        if (navigator.appName == 'Netscape')
            var language = navigator.language === "ko" ? "KOR" : "ENG";
        else
            var language = navigator.browserLanguage === "ko" ? "KOR" : "ENG";

        document.getElementsByName("language")[0].value = language;
        _global.setGlobalString(document.getElementsByName("language")[0].value);
        document.getElementsByName("language")[0].addEventListener("change", function(event){
            _global.setGlobalString(event.target.value);
        });

        _global.sheet = new sheetDB("1Sg50gui05y3559yXOm04eXRE9tJgxOyTZIb0Kjbwj48", "AKfycbzjpyb-BTuDnyQXPscDxePweVNNLWCtZ_w9nNXvsa0d6obwcfO7");
        _global.bg_profile = 200;

        document.getElementById("contact_submit").addEventListener("click", function(event){
            var userName = document.getElementsByName("userName")[0];
            var userEmail = document.getElementsByName("userEmail")[0];
            var desc = document.getElementsByName("desc")[0];

            console.log(global);

            if(!userName.value){
                alert(global.strings._errors.PLEASE_INSERT_NAME[_global.language]);
                return;
            }

            if(!userEmail.value){
                alert(global.strings._errors.PLEASE_INSERT_EMAIL[_global.language]);
                return;
            }

            if(!desc.value){
                alert(global.strings._errors.PLEASE_INSERT_CONTENTS[_global.language]);
                return;
            }

            var now = new Date();

            _global.sheet.putRow({
                regDate: now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(),
                userName: userName.value,
                userEmail: userEmail.value,
                desc: desc.value
            }, function(data){
                var data = JSON.parse(data);
                if(data.result === "success"){
                    var global = new GlobalString();
                    alert(global.getGlobalString(document.getElementsByName("language")[0].value, "sent_ok"));
                    userName.value = "";
                    userEmail.value = "";
                    desc.value = "";
                }
            });
        });

    };

    window.onscroll = function(){
        if(document.body.scrollTop > _global.lastScrollTop){
            // direction down
            if(document.body.scrollTop <= window.innerHeight){
                if(window.innerWidth > 1024)
                    document.getElementsByClassName("bg_profile")[0].style.backgroundSize = _global.bg_profile > 50 ? _global.bg_profile--  + "%" : "cover";
                else
                    document.getElementsByClassName("bg_profile")[0].style.backgroundSize = "cover";
            }
        } else {
            // direction up
            if(document.body.scrollTop <= window.innerHeight){
                if(window.innerWidth > 1024)
                    document.getElementsByClassName("bg_profile")[0].style.backgroundSize = _global.bg_profile < 200 ? _global.bg_profile++  + "%" : "200%";
                else
                    document.getElementsByClassName("bg_profile")[0].style.backgroundSize = "cover";
            }
        }
        _global.lastScrollTop = document.body.scrollTop;

        document.querySelector("nav#nav").style.backgroundColor = "rgba(0,0,0," + ((document.body.scrollTop > 200 ? document.body.scrollTop : 200) * 0.001) + ")";

        var article_01 = document.querySelector("section.article_01");
        if(article_01.offsetTop - window.innerHeight < document.body.scrollTop){
            if(article_01.offsetTop + article_01.clientHeight <= document.body.scrollTop){
                article_01.style.opacity = 1;
            } else {
                article_01.style.opacity = parseFloat(article_01.style.opacity || 0) + 0.1;
            }
        } else {
            article_01.style.opacity = 0.5;
        }

        var article_03 = document.querySelector("section.article_03");
        if(article_03.offsetTop - window.innerHeight < document.body.scrollTop){
            if(article_03.offsetTop + article_03.clientHeight <= document.body.scrollTop){
                article_03.style.opacity = 1;
            } else {
                article_03.style.opacity = parseFloat(article_03.style.opacity || 0) + 0.1;
            }
        } else {
            article_03.style.opacity = 0.5;
        }

        var article_05 = document.querySelector("section.article_05");
        if(article_05.offsetTop - window.innerHeight < document.body.scrollTop){
            if(article_05.offsetTop + article_05.clientHeight <= document.body.scrollTop){
                article_05.style.opacity = 1;
            } else {
                article_05.style.opacity = parseFloat(article_05.style.opacity || 0) + 0.1;
            }
        } else {
            article_05.style.opacity = 0.5;
        }
    };

    _global.setGlobalString = function(language){
        if(GlobalString && language) {
            var language = language.toUpperCase();
            var global = new GlobalString(language);
            global.setAllGlobalValue();

            _global.language = language;
        }else{
            console.error("Please import Global.js first.");
        }
    };
})(window);