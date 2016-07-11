// Copyright 2016. HansolLim All Right Reserved.
(function(base){
    base.GlobalString = function(language){
        var _gs = this;
        _gs.language = language ? language.toUpperCase() : "KOR";
        _gs.strings = {
            _supported: ["KOR","ENG"],
            _errors:{
                LANGUAGE_NOT_SUPPORTED:{
                    KOR:"지원하지 않는 언어입니다.",
                    ENG:"The language is not supported."
                },
                PLEASE_INSERT_NAME: {
                    KOR:"이름을 입력해주세요.",
                    ENG:"Please insert your name first."
                },
                PLEASE_INSERT_EMAIL: {
                    KOR:"메일을 입력해주세요,",
                    ENG:"Please insert your e-mail."
                },
                PLEASE_INSERT_CONTENTS: {
                    KOR:"내용을 입력해주세요.",
                    ENG:"Please insert any contents."
                }
            },
            title:{
                KOR:"안녕하세요, <br class='media768'><span class='text_green'>임한솔</span> 입니다.",
                ENG:"Hello World, I'm <span class='text_green'>HansolLim</span>"
            },
            sub_title:{
                KOR:"아마추어의 창의력과 프로의 기술을 가진 사람",
                ENG:"With amateur creativity and professional skills."
            },
            personal:{
                KOR:"프로필",
                ENG:"Profile"
            },
            name:{
                KOR:"이름",
                ENG:"Name"
            },
            name_value:{
                KOR:"임한솔",
                ENG:"HansolLim"
            },
            birth:{
                KOR:"출생년도",
                ENG:"Birth"
            },
            birth_value:{
                KOR:"1996년 05월 20일",
                ENG:"1996.05.20"
            },
            email:{
                KOR:"이메일",
                ENG:"E-Mail"
            },
            homepage:{
                KOR:"홈페이지",
                ENG:"Homepage"
            },
            language:{
                KOR:"언어",
                ENG:"Language"
            },
            skills: {
                KOR:"보유기술",
                ENG: "Skills"
            },
            web: {
                KOR:"웹",
                ENG:"Web"
            },
            mobile: {
                KOR: "모바일",
                ENG: "Mobile"
            },
            frontend: {
                KOR: "프론트엔드",
                ENG: "Front-End"
            },
            backend: {
                KOR: "백엔드",
                ENG: "Back-End"
            },
            tools: {
                KOR: "프로그램",
                ENG: "Tools"
            },
            develop: {
                KOR: "개발",
                ENG: "Develop"
            },
            documents: {
                KOR: "문서작성",
                ENG: "Documents"
            },
            design: {
                KOR: "디자인",
                ENG: "Design"
            },
            database: {
                KOR: "DB",
                ENG: "Database"
            },
            portfolio: {
                KOR: "포트폴리오",
                ENG: "Portfolio"
            },
            period: {
                KOR: "개발기간",
                ENG: "Period"
            },
            role: {
                KOR: "역할",
                ENG: "Role"
            },
            link: {
                KOR: "바로가기",
                ENG: "link"
            },
            month: {
                KOR: "개월",
                ENG: "Month"
            },
            day: {
                KOR: "일",
                ENG: "Day"
            },
            experience: {
                KOR: "경험 및 수상",
                ENG: "Experience"
            },
            googlehackathon: {
                KOR: "구글 학생 개발자 해커톤",
                ENG: "Google Student Developer Hackathon"
            },
            datahackathon: {
                KOR: "2014 빅데이톤 경진대회(수상)",
                ENG: "2014 Big-data Hackathon(Awards)"
            },
            blog: {
                KOR: "블로그",
                ENG: "Blog"
            },
            education: {
                KOR: "교육",
                ENG: "Education"
            },
            sunrin: {
                KOR: "선린 인터넷고등학교 졸업",
                ENG: "Graduated from Sunrin Internet High School."
            },
            yonhi: {
                KOR: "연희중학교 졸업.",
                ENG: "Graduated from Yonhi Middle School."
            },
            bukgajwa: {
                KOR: "북가좌초등학교 졸업.",
                ENG: "Graduated from Bukgajwa Elementary School."
            },
            contact: {
                KOR: "연락하기",
                ENG: "Contact"
            },
            contact_submit: {
                KOR: "보내기",
                ENG: "Submit"
            },
            sent_ok: {
                KOR: "성공적으로 전송 되었습니다.",
                ENG: "Message was sent OK"
            },
            erdmodeling: {
                KOR: "ERD를 이용한 DB 모델링",
                ENG: "Database modeling by using ERD"
            },
            facebookmeetup: {
                KOR: "페이스북 개발자 그룹의 첫 번째 미트업",
                ENG: "First meet-up for Korean facebook developer group"
            },
            teheranmeet: {
                KOR: "테헤란로 커피클럽(아침에 하는 스타트업 네트워킹 모임)_36th",
                ENG: "Teheran-ro Coffee Club(Venture Networking meeting)_36th"
            },
            android: {
                KOR: "안드로이드",
                ENG: "Android"
            },
            ios: {
                KOR: "아이폰",
                ENG: "iOS"
            },
            nexters: {
                KOR: "넥스터즈 9기 활동",
                ENG: "NEXTERS 9th membership"
            }
        };

        _gs.setGlobalString = function(language, pair){
            var language = language ? language.toUpperCase() : "KOR";

            if(_gs.strings._supported.indexOf(language) < 0){
                console.error(_gs.strings._errors.LANGUAGE_NOT_SUPPORTED);
                return false;
            }else{
                _gs.strings[pair.key][language] = pair.value;
                return true;
            }
        };

        _gs.getGlobalString = function(language, key){
            return _gs.strings[key][language || _gs.language];
        };

        _gs.setAllGlobalValue = function(){
            var tag = document.getElementsByTagName("*");
            for (var i= 0; i < tag.length; i++) {
                if(tag[i].dataset){
                    if(tag[i].dataset.global){
                        if(_gs.strings[tag[i].dataset.global]){
                            tag[i].innerHTML = _gs.strings[tag[i].dataset.global][_gs.language];
                        }
                    }
                }
            }
        }
    };
})(window);