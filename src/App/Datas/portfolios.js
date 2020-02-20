import { languageConst } from "../Library/Global"
import moment from 'moment'

const SKILL = {
   DB: {
      MYSQL: 'MySQL',
      MARIADB: 'MariaDB',
      MSSQL: 'MS-SQL',
      ORACLE: 'Oracle',
      MONGODB: 'MongoDB'
   },
   LANG: {
      PYTHON: 'Python',
      DJANGO: 'Django',
      PHP: 'PHP',
      SPRING: 'Java Spring',
      JSP: 'JSP',
      ASP: 'ASP',
      NET: '.NET Framework',
      JAVASCRIPT: 'javascript',
      REACT: 'React',
      HTMLCSS: 'Html & Css',
      ANDROID: 'Java Android',
      OBJECTIVEC: 'Objective-C'
   },
   TOOL: {
      DOCKER: 'Docker',
      APACHE: 'Apache',
      AWS: 'AWS'
   }
};

export class Portfolio {
   constructor() {
      this.title = '';
      this.subtitle = '';
      this.link = '';

      this.about = '';

      this.startDate = null;
      this.endDate = null;

      this.period = '';

      this.images = [];
      this.languages = [];
   }

   static create(title) {
      return (new Portfolio).setTitle(title);
   }

   setLanguages(languages) {
      this.languages = languages;

      return this;
   }

   setStartDate(startDate) {
      this.startDate = moment(startDate);

      return this;
   }

   setEndDate(endDate) {
      this.endDate = moment(endDate);

      return this;
   }

   setPeriod(startDate = null, endDate = null) {
      if (moment(startDate, 'YYYY-MM-DD', true).isValid()) {
         this.setStartDate(startDate)
      } else {
         this.startDate = startDate;
      }

      if (moment(endDate, 'YYYY-MM-DD', true).isValid()) {
         this.setEndDate(endDate)
      } else {
         this.endDate = endDate;
      }

      if (moment.isMoment(startDate) && moment.isMoment(endDate)) {
         this.period = moment.duration(this.startDate.diff(this.endDate), 'day').locale('ko').humanize();
      } else {
         this.period = [this.startDate, this.endDate].filter(date => date !== null).join(' ~ ')
      }

      return this;
   }

   setTitle(title) {
      this.title = title;

      return this;
   }

   setSubtitle(subtitle) {
      this.subtitle = subtitle;

      return this;
   }

   setLink(link) {
      this.link = link;

      return this;
   }

   addImage(image) {
      if (image.indexOf('/') === -1) {
         image = `/images/portfolios/${image}`;
      }

      this.images.push(image);

      return this;
   }

   setAbout(about) {
      this.about = about;

      return this;
   }
}

export default {
   [languageConst.KR]: [
      Portfolio.create('키키와 포포의 특허검색')
         .setLink('http://kcloud.or.kr/?p=3064')
         .addImage('kikipopo.jpg')
         .setLanguages([SKILL.LANG.HTMLCSS, SKILL.LANG.JAVASCRIPT])
         .setPeriod('2014')
         .setSubtitle('캐릭터를 활용한 특허검색 포탈사이트')
         .setAbout('검색창에 입력한 키워드를 형태소 분석, 특허청 공공 API 를 사용하여 해당하는 결과목록 출력'),

      Portfolio.create('내 친구 밍기뉴 (Mingginyua)')
         .setLink('https://github.com/Nexters/mingginyu')
         .addImage('mingginyu.jpg')
         .setLanguages([SKILL.LANG.HTMLCSS, SKILL.LANG.JAVASCRIPT, SKILL.LANG.SPRING])
         .setPeriod('2016')
         .setSubtitle('IoT 스마트 화분')
         .setAbout('웹 기반 관리 시스템이 탑재된 디스플레이가 달려있으며 실시간으로 센서 서버와 연결하여 현재 상태를 출력.\n' +
            'Spring REST API Controller 작성, 라즈베리 디스플레이 해상도의 컨트롤 판넬 웹 페이지 개발\n'),

      Portfolio.create('씨엔티테크㈜ 홈페이지')
         .setLink('http://www.cntt.co.kr')
         .addImage('cnttech.png')
         .setLanguages([SKILL.LANG.HTMLCSS, SKILL.LANG.JAVASCRIPT, SKILL.LANG.ASP, SKILL.DB.MSSQL])
         .setPeriod('2015')
         .setSubtitle('당시 재직중이던 회사의 홈페이지 개발')
         .setAbout('입사 후 처음 맡게된 프로젝트로 일부 랜딩 페이지 개발과 게시판에 대한 관리 페이지를 신규 개발하였습니다\n' +
            '게시글은 MS-SQL 로 CRUD하며 페이지는 ASP 로 작성하였습니다.\n' +
            'SI 성 업무가 종료되고는 후속 작업으로aside 영역 개발에 서버 개발자로 참여하였습니다.\n'),

      Portfolio.create('피자알볼로 홈페이지 & 주문시스템')
         .setLink('https://www.pizzaalvolo.co.kr')
         .addImage('pizzaalvolo.jpg')
         .setLanguages([SKILL.LANG.HTMLCSS, SKILL.LANG.JAVASCRIPT, SKILL.LANG.ASP, SKILL.DB.MSSQL])
         .setPeriod('2015', '2016')
         .setSubtitle('홈페이지 및 온라인 주문시스템 개발')
         .setAbout('조직 내에서 각 개발자마다 담당 브랜드가 정해지는데, 저는 피자알볼로였습니다.\n' +
            '기존에 존재하던 피자알볼로 홈페이지의 유지보수를 맡게 되었고 유지보수 기간이 긴 만큼 그 동안 진행한 비교적 큰 태스크를 추리면 다음과 같습니다.\n' +
            '-\t매장 찾기에 네이버 지도 API 적용 및 geo api 활용하여 내 근처 매장찾기 개발\n' +
            '-\t홈페이지 메인의 유투브 동영상 첨부 및 유투브 재생 통계 집계 및 관리 페이지 개발\n' +
            '-\t홈페이지 메인 배너 클릭 수 집계 및 관리 페이지 개발\n' +
            '-\t기존 주문시스템에 PG 사 추가작업\n' +
            '-\t퍼포먼스 향상을 위한 주문 로직 리팩토링\n' +
            '또한 유지보수 이외에 모바일 사이트 신규 개발을 진행하였습니다.\n'),

      Portfolio.create('피자마루 홈페이지')
         .setLink('http://www.pizzamaru.co.kr')
         .addImage('pizzamaru.jpg')
         .setLanguages([SKILL.LANG.HTMLCSS, SKILL.LANG.JAVASCRIPT, SKILL.LANG.NET, SKILL.DB.MSSQL])
         .setPeriod('2015', '2016')
         .setSubtitle('홈페이지 개발')
         .setAbout('당시 서버개발팀에 있었으나 프로젝트 일정이 빠듯하여 퍼블리싱 단계부터 참여하게 되었습니다.\n' +
            'IE8 까지의 호환성을 목표로 하여 퍼블리싱 하였으며 개발언어는 .NET, DB 는 MS-SQL 을 사용하여 역시 Windows Server 2008 IIS 로 호스팅하였습니다.\n' +
            '홈페이지 이외에도 “점주광장” 이라는 관리 페이지 또한 개발하여 홈페이지 계정정보를 사용하되 권한에 따라 접근여부를 결정하였고\n' +
            '각 매장의 테이크아웃, 배달가능, 이벤트 여부 등을 직접 수정하고 wysiwyg을 탑재하여 소개를 작성하거나 매장 위치 또한 지정하여 지도 API 로 노출 하도록 하였습니다.\n'),

      Portfolio.create('모스버거 주문시스템')
         .setLink('http://delivery.moskorea.kr/')
         .addImage('mosburger.jpg')
         .setLanguages([SKILL.LANG.HTMLCSS, SKILL.LANG.JAVASCRIPT, SKILL.LANG.NET, SKILL.DB.MSSQL])
         .setPeriod('2015', '2016')
         .setSubtitle('홈페이지, 주문시스템 개발')
         .setAbout('중간에 고객사의 일정 조율로 홀딩 된 관계로 프로젝트 전체 기간이 굉장히 오래 걸렸습니다.\n' +
            '결제 및 주문 로직에 대한 히스토리 로깅을 타인이 구현해놓은 내부 프레임워크에 맞추어 짜내는 작업을 하였습니다.\n' +
            'TO-GO(테이크 아웃) 과 Delivery(배달) 의 주문 조건이 많은 차이를 가지고 있었기 때문에 기억에 남는 작업이 되었습니다.\n'),

      Portfolio.create('처갓집치킨 홈페이지')
         .setLink('http://www.cheogajip.co.kr')
         .addImage('cheogajip.png')
         .setLanguages([SKILL.LANG.HTMLCSS, SKILL.LANG.JAVASCRIPT, SKILL.LANG.NET, SKILL.DB.MSSQL])
         .setPeriod('2016')
         .setSubtitle('홈페이지 개발')
         .setAbout('기존 ASP 와 플래시로 작성된 홈페이지를 유지보수 및 리뉴얼하는 업무를 진행하였습니다.\n' +
            '유지보수 중 가장 큰 태스크는 엑셀로 수합 중이었던 유저 데이터를 DB 로 이관 및 정규화하는 작업이었습니다.\n' +
            '리뉴얼 프로젝트는 각 메뉴의 특징과 분류를 입력할 수 있는 관리자 페이지와 뱃지로 표기하는 메뉴 페이지와 D3 로\n' +
            '한반도를 표현한 오픈소스를 사용하여 각 매장의 위치를 표기하도록 하는 작업들을 메인테이닝 하였습니다.\n'),

      Portfolio.create('피자알볼로 웹 애플리케이션')
         .setLink('https://play.google.com/store/apps/details?id=m.pizzaalvolo&hl=ko')
         .addImage('pizzaalvolo.png')
         .setLanguages([SKILL.LANG.ANDROID, SKILL.LANG.OBJECTIVEC])
         .setPeriod('2016')
         .setSubtitle('웹 애플리케이션 개발')
         .setAbout('당시 팀 내에 모바일 앱 개발이 가능한 인력이 없어 노 베이스부터 시작하여 진행한 프로젝트입니다.\n' +
            '처음에는 Eclipse maven 빌드로 개발하였으나 이후 gradle 빌드로 포팅하면서 새로 간단한 웹 애플리케이션을 위한 프레임워크를 개발하여 적용합니다.\n' +
            '해당 프레임워크는 다음 링크에 공유 해두었습니다.\n' +
            'https://github.com/hsol/Android_WebAppBase\n' +
            '이후 사내에서 제가 개발한 프레임워크로 안드로이드 애플리케이션을 개발하게 되었습니다("보안" 상 github 버전과 사내 버전이 다릅니다)\n' +
            '퇴사 이후로 모바일 앱 개발자를 채용했다는 소식이 없었기 때문인지 없던 오류가 만발하여 재직 중 3.4점이던 앱 평점이 이직 후 2.9 까지 내려갔다는 것이 초기 개발자로써는 아쉽고 서운한 점입니다.\n'),

      Portfolio.create('미스터피자 웹 애플리케이션')
         .setLink('https://play.google.com/store/apps/details?id=com.mrpizza.android')
         .addImage('mrpizza.png')
         .setLanguages([SKILL.LANG.ANDROID, SKILL.LANG.OBJECTIVEC])
         .setPeriod('2016')
         .setSubtitle('웹 애플리케이션 개발')
         .setAbout('기존에 운영중이던 앱이 존재하여 유지보수성 업무를 하였습니다.\n' +
            '안드로이드는 피자알볼로 웹 애플리케이션 개발 시 만들어 둔 프레임워크로 큰 문제 없이 포팅하여 운영하였습니다.\n' +
            'iOS 는 웹 애플리케이션이다 보니 웹뷰 성능이 문제가 되어 웹뷰 라이브러리를 UIWebview 에서 WKWebview 로 변경하였습니다.\n'),

      Portfolio.create('더 콘테스트')
         .setLink('https://play.google.com/store/apps/details?id=kr.co.thecontest.theconapp')
         .addImage('thecontest.png')
         .setLanguages([SKILL.LANG.ANDROID, SKILL.LANG.OBJECTIVEC])
         .setPeriod('2016')
         .setSubtitle('네이티브 애플리케이션 개발')
         .setAbout('처음부터 개발에 참여하여 백엔드 로직은 타 팀에서 서버개발을 담당하시는 분이 있고\n' +
            '안드로이드/iOS 레이아웃 및 모바일 UI 개발 및 서버 API 호출 개발을 메인테이닝 하였습니다.\n' +
            '여태까지는 웹 애플리케이션 개발만 했던 저에게 온 네이티브 앱 프로젝트는 여태까지 중 가장 큰 도전이었습니다.\n' +
            '안드로이드, iOS 모두 성공적으로 런칭하였고 지금도 원활하게 운영되고 있습니다. 퇴사 전 마지막 프로젝트로 유지보수 하였습니다.\n'),

      Portfolio.create('모순 키워드 관리 애플리케이션')
         .setLink('https://admin.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT])
         .setPeriod('2017')
         .setSubtitle('Ridibooks CMS 유지 및 신규기능개발')
         .setAbout('도서에 할당되는 키워드에 대해 성격이 모순되는 키워드(ex: 나쁜남자, 순정남) 로 CP 또는 내부직원이 잘못 입력하는 상황을 막기 위해 미리 지정할 수 있는 애플리케이션\n' +
            '기존에 엑셀로 관리하던 점을 참고하여 그 양식과 같은 레이아웃을 유지하여 개발하였습니다.\n'),

      Portfolio.create('<비오는날> 이벤트를 위한 자동화 시스템')
         .setLink('https://admin.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT])
         .setPeriod('2017')
         .setSubtitle('Ridibooks CMS 유지 및 신규기능개발')
         .setAbout('리디북스에는 강수량에 따른 할인 이벤트가 있습니다.\n' +
            '이 시스템 도입 전까지는 담당직원이 그날 강수량을 체크하여 비가 왔을 경우 이벤트 게시물을 직접 올리는 형식으로 진행되었는데,\n' +
            '이 태스크에서 기상청 데이터를 파싱하여 담당직원에게 메일을, 그리고 이벤트 예정 푸시 메시지를 전송하도록 자동화하였습니다.'),

      Portfolio.create('도서통합정보패널')
         .setLink('https://admin.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT])
         .setPeriod('2018')
         .setSubtitle('Ridibooks CMS 유지 및 신규기능개발')
         .setAbout('도서정보가 필요한 페이지들이 점점 늘어남에 따라 단순히 조회만을 위한 페이지에 범용으로 사용할 수 있는 모듈 개발.\n' +
            '도서 ID 를 자동으로 인식하도록 하여 어느 곳이든 도서 ID 만 있다면 프론트엔드 상에서도 손쉽게 적용할 수 있도록 개발자 편의성을 고려하였습니다.'),

      Portfolio.create('CPS 도서 사전검증 시스템')
         .setLink('https://admin.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT])
         .setPeriod('2018')
         .setSubtitle('Ridibooks CMS 유지 및 신규기능개발')
         .setAbout('담당 직원이 매번 기계적으로 검사해왔던 검증내용들을 자동화하여 선택한 도서에 대한 검증을 수행하는 애플리케이션.\n' +
            '이 태스크로 인해 담당 직원들의 업무효율성을 증대 시켰습니다.'),

      Portfolio.create('CP 에서의 키워드 요청 애플리케이션')
         .setLink('https://cp.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT])
         .setPeriod('2018')
         .setSubtitle('Ridibooks CP 사이트 유지 및 신규개발 ')
         .setAbout('도서에 할당되는 키워드를 CP 가 직접 입력할 수 있도록 하여 관련 업무 효율성 증대\n' +
            'MSA 에 입각하여 최대한 모듈화 한 결과 같은 코드를 CP 사이트와 CMS 에 동시 적용할 수 있었습니다.\n'),

      Portfolio.create('저자 DB 입력 모듈')
         .setLink('https://cp.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT])
         .setPeriod('2018')
         .setSubtitle('Ridibooks CP 사이트 유지 및 신규개발 ')
         .setAbout('기존 시스템은 여러 event call 이 스파게티화 된 형태라 해당 영역 리뉴얼을 통해 모듈화하여 해결함.\n' +
            '동시에 CP 측에서도 저자 정보를 입력할 수 있도록 하여 작가 매칭 업무담당 직원의 불편함을 해소해 주었습니다.'),

      Portfolio.create('CP사이트 REACT 포팅')
         .setLink('https://cp.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT, SKILL.LANG.REACT])
         .setPeriod('2018')
         .setSubtitle('Ridibooks CP 사이트 유지 및 신규개발 ')
         .setAbout('2010년 이전 개발되어 당시 유행이던 RequireJS, jQuery 기반으로 작동하는 코드는 각 기능들의 상관관계와 빌드 시 버전 관리에 어려움을 주었습니다.\n' +
            '때문에 코드 퀄리티 향상을 위해 Webpack4 를 도입하였고 퍼포먼스 향상 및 코드 모듈화를 위해 REACT 를 적용하는 작업을 메인테이닝 하였습니다.\n' +
            '이 과정에서 프론트엔드에 익숙하지 않는 개발자들까지 편하게 개발할 수 있도록 설계하기 위해 SPA의 특징과 MPA 의 특징을 모두 살려 진행하였습니다.'),

      Portfolio.create('대량등록 로직 개선')
         .setLink('https://cp.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT, SKILL.LANG.REACT])
         .setPeriod('2018')
         .setSubtitle('Ridibooks CP 사이트 유지 및 신규개발 ')
         .setAbout('총 3단계로 구성된 큰 규모의 태스크였습니다. 기존 시스템은 검증과 등록의 로직이 여기저기 섞여있어\n' +
            '유지보수하기 어려웠기 떄문에 먼저 검증 성격의 작업과 등록 성격의 작업을 분리하는 등의 작업으로 로직을 간소화 시켰습니다.\n' +
            '두 번째로는 대량등록 특성 상 코드를 벗어나 엑셀을 다루기 때문에 테스트가 미흡한 점이 있었습니다.\n' +
            '유닛 테스트를 보완하고 엑셀을 직접 생성하여 테스트하는 e2e 테스트를 추가 개발하였습니다.\n' +
            '마지막으로는 등록 그룹의 각 작업들을 샤딩하여 병렬실행하도록 하였습니다. 이 과정 중 발생한 Duplicate 에러 대응이 특히 까다로웠던 것으로 기억됩니다.\n' +
            '결과는 만족스럽게도 퍼포먼스는 50% 이상 향상되었으며 특히 검증 부 속도를 중점으로 올린 덕에 빠른 피드백을 받은 여러 CP 측에서도 만족 의견을 전달 해 주셨습니다.\n'),

      Portfolio.create('리디셀렉트 도서공급 시스템')
         .setLink('https://cp.ridibooks.com')
         .setLanguages([SKILL.LANG.PHP, SKILL.DB.MYSQL, SKILL.LANG.JAVASCRIPT, SKILL.LANG.REACT])
         .setPeriod('2018')
         .setSubtitle('Ridibooks CP 사이트 유지 및 신규개발 ')
         .setAbout('리디의 첫 구독 서비스인 리디셀렉트의 도서 공급 파트를 전담하였습니다.\n' +
            '이미 가지고 있는 리디북스의 도서 정보를 최대한 활용하되 리디북스에 대한 종속성을 해결하기 위해 여러 방면으로 노력하였습니다.\n' +
            '도서를 등록하는 CMS 페이지들과 타 팀으로 전달하기 위한 API 를 개발하였으며 특정 시간마다 구동되는 CRON 으로 도서를 동기화 하도록 하여 모든 도서의 유효기간을 일괄 관리할 수 있도록 하였습니다.\n'),
   ]
}
