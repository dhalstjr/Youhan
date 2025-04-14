$(function () {
  /* 비주얼 slide 구현 */
  let visualSlide = new Swiper(".visual-slide", {
    speed: 1000, // 슬라이드 전환 속도
    allowTouchMove: true, // 사용자가 마우스 또는 손가락으로 슬라이드할 수 있게 허용
    loop: true, // 슬라이프가 마지막에 도달해도 다시 처음으로 돌아가면서 무한반복

    // loopAdditionalSlides : 1을 줬을 때 슬라이드가 사라지는 현상이 발생하는 이유
    // loopAdditionalSlides는 슬라이드 앞 뒤에 복제 슬라이드를 몇 개를 추가할 지 결정하는 옵션인데
    // 근데 이미지가 비동기 로딩이거나, CSS/JS와 함께 렌더링 타이밍이 안 맞으면 복제 슬라이드가 렌더링 되지않거나 비어 보이는 현상이 발생한다
    // 이로 인해 '슬라이드 하나가 사라진 것처럼' 보이는 문제가 생기는 거예요.
    // 슬라이드 개수가 적을 때(예 : 3개)는 loopAdditionalSlides를 줄이거나 0으로 하는 것이 안정적이다.
    // loopAdditionalSlides는 보통 슬라이드 5개 이상일 때 사용하는 것이 적당하다.
    loopAdditionalSlides: 0, // 루프 기능에서 추가 슬라이드를 만들어 원활한 루프 보장
    watchSlidesProgress: true, // 슬라이드 진행 상태를 추적
    mousewheel: false, // 마우스 휠로 슬라이드를 이동하지 않게 설정
    /*     autoplay: {
      delay: 3000,
      disableOnInteraction: false, // 사용자가 슬라이드를 터치해도 자동 재생을 멈추지 않음
    },
 */
    // 이벤트 처리 (on 옵션)
    on: {
      /* progress 이벤트 */
      // swiper 슬라이드의 이동을 부드럽게 애니메이션을 보여주기 위한 코드
      //슬라이드가 이동하는 동안 실시간으로 발생하는 이벤트
      progress: function () {
        // this.slides는 Swiper 슬라이드 요소들 ('.visual-slide' 안의 각 슬라이드를 의미)
        // 슬라이드 개수만큼 반복문을 돌면서, 각 슬라이드의 애니메이션을 개별적으로 처리
        for (var i = 0; i < this.slides.length; i++) {
          // 슬라이드 진행 상황
          // Swiper는 각 슬라이드에 대해 .progress 값을 제공.
          // 이 값은 현재 슬라이드가 얼마나 이동했는지 나타내는 값
          var slideProgress = this.slides[i].progress;

          // 오프셋 계산(innerOffset)
          // this.width : 현재 Swiper의 전체 넓이.
          // 0.5를 곱했으니, 슬라이드 전체 넓이의 절반을 의미(50%)
          // 즉, innerOffset은 슬라이드 이동 범위를 줄이기 위해 설정된 값
          // 슬라이드 이동을 부드럽게 보이게 하거나, 배경의 움직임을 조금 더 자연스럽게 만들기 위해 사용
          var innerOffset = this.width * 0.5;

          // 변환값 계산(innerTranslate)
          // 슬라이드의 progress 값과 innerOffset을 곱해서 애니메이션 효과를 위해 움직일 거리를 계산
          var innerTranslate = slideProgress * innerOffset;

          // 스타일 적용
          // translate3d를 사용해서 슬라이드를 좌우로 이동시키는 효과
          // 슬라이드 이동 시 배경을 자연스럽게 움직이는 패럴럭스 효과를 만들 때 유용
          this.slides[i].querySelector(
            ".bg"
          ).style.transform = `translate3d(${innerTranslate}px,0,0)`;
        }
      },

      // setTransition과 progress와 함께 사용되면서 자연스러운 애니메이션 효과를 만들어 내는 부분
      // 이벤트 핸들러 setTransition은 Swiper가 슬라이드를 넘길 때 슬라이드와 그 안의 요소들이 얼마나 부드럽게 이동할 지를 설정하는 함수
      setTransition: function (swiper, speed /* 매개변수 */) {
        // Swiper 슬라이드 목록(this.slides)을 모두 반복해서 접근
        for (var i = 0; i < this.slides.length; i++) {
          // 각 슬라이드 요소에 .swiper-slide transition 스타일 적용
          this.slides[i].style.transition = speed + "ms";
          // .bg 요소에 대해서도 동일하게 transition 효과를 적용
          this.slides[i].querySelector(".bg").style.transition = speed + "ms";
        }
      },
      // 이벤트 핸들러 slideChange -> 이벤트 콜백 함수 중 하나, 슬라이드 변경될 때마다 호출
      slideChange: function () {
        // this.realIndex란 현재 보여지고 있는 슬라이드의 인덱스 번호를 의미
        // 보통 Swiper에서 loop 옵션을 사용할 때 , 원본 배열 기준의  인덱스를 제공하기 위해 사용
        /* 슬라이드 페이징 처리 */
        $(".visual-slide .slide-paging li")
          .eq(this.realIndex) // 현재 활성화된 슬라이드를 찾기 위해 사용
          .addClass("active") // 현재 슬라이드에 active 클래스를 추가해서 스타일 변경
          .siblings() // 다른 모든 형제 요소의
          .removeClass("active on"); // active와 on클래스를 제거해서 횔성화 스타일 적용X

        $(".visual-slide .slogan span")
          .eq(this.realIndex)
          .addClass("active")
          .siblings()
          .removeClass("active");

        /* 특정 요소 활성화 처리 */
        // 슬라이드가 변경될 떄 스타일 적용되는 방식(holding의 span이 바뀜)

        $(".visual-slide .holding .change")
          .eq(this.realIndex)
          .addClass("on")
          .siblings()
          .removeClass("on");
      },

      slideChangeTransitionEnd: function () {
        $(".slide-paging li").eq(this.realIndex).addClass("on");
      },
    },
  });

  // img-box와 text 연동해서 하나씩 보이게 하기
  // 대상 찾아서 첫 대상 다음 전부부 안보이게 하기
  const imgBox = $(".sec03 .analects-box .img-box img:first-child")
    .nextAll() // 선택한 요소의 다음에 위치한 형제 요소 전부 선택, nextElementSiblings()
    .hide();

  console.log(imgBox);

  // 텍스트 대상을 찾기 (배열 수) length를 뺴면 text p를 찾음
  // 배열의 수를 찾아 그 중에서 랜덤으로 하나를 선택
  let analectsLength = $(".sec03 .analects-box .analects-text p").length,
    analectsNumber = Math.floor(Math.random() * analectsLength);
  // Math.floor() -> 소수점 아래를 버리고 정수로 만들어줌 (내림처리)
  // Math.random() -> 0 이상 1 미만의  무작위 소수로 반환 (0.0 <= 값 < 1.0)
  // 이 둘을 같이 사용하면 소수점으로 나온 값을 내림처리 하여 정수로 변환시켜 0,1,2 과 같은 수의 값을 도출
  // 그럼 Math.floor(Math.random() * analectsLength)는 analectsLength 배열의 수는 5이므로
  // 나올 수 있는 값은 0.0 ~ 4.999 사이의 값이다. Math.floor를 사용하여 내림처리하면
  // 결국 나올 수 있는 값으 0 , 1 , 2 ,3 , 4 이다.

  console.log(analectsLength, analectsNumber);

  // p의 부모인 대상을 찾고 새로운 엘리멘트를 추가하기 위해 .append() 함수 사용
  const analectsAppend = $(".sec03 .analects-box .analects-text").append(
    // p의 형제 요소에 analectsNumber의 인덱스 값에 해당하는 요소를 찾고 해당 요소 이전에 대상을 전부 선택
    $(".sec03 .analects-box .analects-text p").eq(analectsNumber).prevAll()
  );

  // 해당 값 0에 맞는 요소 외에 안보이게 하기 위해 e
  // eq(0)을 사용해서 해당 요소를 찾고
  // 그 외에 다른 요소를 전부를 hide()해서 안보이게
  // 0값에 해당하지 않으면 안보임 (랜덤으로 나옴)
  const randomNumber = $(".sec03 .analects-box .analects-text p")
    .eq(0)
    .nextAll()
    .hide();
  console.log(analectsAppend, randomNumber);

  // 이제 img-box에 img와 text들이 랜덤으로 나오게 하기
  $(function () {
    // setInterval() 함수는 애니메이션과 같이 반복해서 실행되는 함수의 지연을 설정하는 데 사용
    // !! 어떤 코드를 일정한 시간 간격을 두고 반복해서 실행하고 싶을 때 사용한다.
    // setInterval() 와 setTimeout() 함수도 있다.
    // setTimeout() 함수는 일정 시간이 지난 후에 실행
    setInterval(() => {
      // 첫 img의 요소를 변수로 저장을 하고
      let FirstImg = $(".sec03 .analects-box .img-box img").eq(0);
      // img가 0에 해당하는 다음 요소를 보여주기
      FirstImg.eq(0).fadeOut(1000).next().fadeIn(1000);

      // 이미 존재하는 요소를 다시 .append() 함수를 추가로 실행하면 기존 위치 내에서 맨 뒤로 이동한다.
      // 새로운 요소를 추가할 때는 다르게 이미 존재하는 요소에 추가할 때는 이런 함수의 기능이 있다.
      $(".sec03 .analects-box .img-box").append(FirstImg);
      /*     console.log(FirstImg); */

      // text도 이미지와 같이 바꾸기
      // 0에 해당하는 텍스트를 변수에 저장
      let FirstText = $(".sec03 .analects-box .analects-text p").eq(0);
      // 보여지는 text가 사라지고 다음 text 보여지게
      FirstText.eq(0).fadeOut(1000).next().fadeIn(1000);

      $(".sec03 .analects-box .analects-text").append(FirstText);

      /*       console.log(FirstText); */
    }, 4000);
  });

  // 버튼을 누를 시 슬라이드를 이동시키는
  // 버튼의 요소를 찾고 click 이벤트를 만들어준다.
  $(".slide-paging li button").on("click", function () {
    // 변수를 만들어서 (this는 바로 위에 클릭이벤트를 설정한 요소)
    // 요소의 부모를 찾아서 선택하고 인덱스를 반환 (몇번째인지)
    let thisIndex = $(this).parent().index();
    console.log(thisIndex);

    // li에 button를 클릭 시 슬라이드 이동
    // slideToLoop 는 Swiper의 API 함수.
    // slideToLoop(index)는  무한 루프(loop : true)를 사용할 때, 원본 슬라이드의 인덱스를 기반으로 이동하도록 해주는 함수
    // 일반적으로 .slideTo()는 루프가 걸려있을 때는 정확히 작동하지 않을 수 있기 때문에
    // loop 모드에서는 slideToLoop()를 사용한다.
    visualSlide.slideToLoop(thisIndex);
  });

  // brand-tab에 클릭 이벤트를 만들어서 효과 구현
  $(".sec02 .tab-box .brand-tab").on("click", function () {
    // 클릭된 탭에 따라 index 계산
    // 여기에서 1을 더해주는 이유는 클래스 이름이나 요소 이름이 1부터 시작되기 때문에
    let thisIndex = Number($(this).index()) + 1;

    // 1. 탭 활성화 클래스 조정
    // 클릭한 인덱스에 클래스를 부여하고 다른 모든 형제 요소에게는 클래스를 삭제
    $(this).addClass("active").siblings().removeClass("active");

    // 2. 마스크효과를 활용하기 위한 클래스 부여 및 삭제
    const Check = $(".sec02 .mask-text")
      // mask-text에 있는 모든 type1,2,3의 클래스를 제거
      .removeClass("type1 type2 type3")
      // 클릭한 탭에 해당하는 클래스를 추가 thisIndex는 1를 더했으니 1부터 시작.(1,2,3 인덱스의 숫자로 배열)
      .addClass("type" + thisIndex)
      // find() 함수는 배열에서 특정 조건을 만족하는 요소를 찾아 첫번째 요소로 반환하는 함수
      // find를 사용해 zoom-circle1,2,3를 찾고
      .find(".zoom-circle" + thisIndex)
      // on 클래스를 추가
      .addClass("on")
      // 댜른 형제 요소들에게는 on 클래스 제거
      .siblings()
      .removeClass("on");

    // 3. 탭박스 클릭 시 텍스트 변화
    const chEck = $(".sec02 .match-box .match-text")
      .eq(thisIndex - 1)
      .addClass("active")
      .siblings()
      .removeClass("active");

    // 클릭 시 thisIndex에 값이 1더해서 나옴
    console.log(chEck);

    // 버튼 클릭 시 link-box의 링크가 바뀌게 하기
    // 먼저 기본 경로 값을 빈 문자열로 초기화.
    let route = "";
    // 부등 비교 연산자(!=)는 두 값이 다른 값을 갖는지 비교. (값과 데이터 타입 상관X)
    // 값이 다르면 true, 같으면 false
    // lang은 현재 페이지(예 : 'en' ,'jp' 등)의 언어를 저장한 변수라고 볼 수 있다.
    // 만약 현재 언어가 한국어가 아니라면 route를 해당 언어로 변환
    if (lang != "ko") route = lang;

    // 사용자가 클릭한 탭 번호에 따라 링크를 다르게 설정
    if (thisIndex === 1) {
      // 링크의 href 속성을 변경
      $(".sec02 .link-box a").attr(
        "href",
        route + "/corporation/about_yuhancare"
      );
    } else if (thisIndex === 2) {
      $(".sec02 .link-box a").attr("href", route + "/value/brand");
    } else {
      $(".sec02 .link-box a").attr("href", route + "/culture/talent");
    }
    console.log(route);
  });

  // lang의 변수 html태그 안에 lang 속성
  let lang = $("html").attr("lang");
  console.log(lang);

  //pc의 header 서브메뉴 펼치기(gnb-open)
  // Jquery -> mouseenter는 hover 효과임 but 자식 요소는 감지 하지않음.
  $("#header")
    .on("mouseenter", function () {
      // innerWidth는 픽셀로 창 내부의 너비를  반환(스크롤 막대 포함)
      // outerWidth는 창의 두께까지 포함한 너비(스크롤 포함)
      // 1200px 이상일 때 gnb-open 클래스를 가진다. 이하일 떄는 클래스를 가지지 않는다.
      if (window.innerWidth > 1200) {
        // addClass할 때는 .을 사용하지 않는다.
        $("html").addClass("gnb-open");
      }
    })
    .on("mouseleave", function () {
      // mouseleave와 mouseout의 차이점은 mouseleave는 자식 요소를 포함하여 유지.
      // mouseout은 자식 요소를 포함하지 않아 자식 요소에 들어가게 되면 서브 메뉴가 사라진다.
      if (window.innerWidth > 1200) {
        $("html").removeClass("gnb-open");
      }
    });

  // 스크롤 위치에 따라b body에 속성(data-top)을 다르게 주는 코드

  // 1. 현재 위치의 스크롤 값을 구하기 (스크롤 값이 맨 위를 찾기 위해서.)
  // Jquery에서 사용하는 방식 (window).scrollTop()
  // javascript는 addEventListener("scroll" , function(){})
  var thisTop = $(document).scrollTop();
  // 현재 스크롤 값이 0보다 클 때
  if (thisTop > 0) {
    // 스크롤이 내려가있다면 data-top = no-top 속성 부여
    // 헤더 색상, 버튼 위치, 애니메이션등 스크롤 여부에 따라 스타일 제어에 사용
    $("body").attr("data-top", "no-top");
  }
  console.log(thisTop);

  // 2. 스크롤 이벤트
  // 사용자가 스크롤할 때마다 이벤트가 발생.

  // 실수로 "window"로 해서 안먹음 (유의사항.)
  const CHH = $(window).scroll(function () {
    thisTop = $(document).scrollTop();

    if (thisTop > 0) {
      // 스크롤이 맨 위에 있지않고 조금이라도 내려가있다면 no-top
      $("body").attr("data-top", "no-top");
    } else {
      // 스크롤이 맨위에 위치한다면 top
      $("body").attr("data-top", "top");
    }

    console.log(CHH);
  });

  // 스크롤 업다운에 따른 변화.
  // 1. 변수를 선언 -> 두 변수의 차이를 이용해 스크롤 방향을 판단.
  let nowScrollTop = 0, //nowScrollTop = 현재 스크롤 위치를 저장하는 변수
    prevScrollTop = 0; // prevScrollTop = 이전 스크롤 위치릴 저장하는 변수

  // 2.스크롤 방향 판단 함수
  let wheelMove = function () {
    // return는 함수가 실행될 때 결과값을 반환하는 명령어
    // 이 함수는 결과값이 'up' , 'down' 이 있기 때문에 둘 중 하나만 결과값으로 반환한다.
    // ?는 심향 연산자를 말한다.
    // 삼향 연산자는 (조건식 ? A : B) if-else 문법을 짧게 쓴 문법이다.
    // 참이면 up 거짓이면 down 으로 둘 중 하나로 결과값이 도출된다.
    // 이 함수는 이전 스크롤 값과 현재 스크롤 값을 비교하여
    // 즉 이전 위치가 현재보다 크면 -> 스크롤이 위로 올라간 것이므로 'up' 을 반횐
    // prevScrollTop(300) - nowScrollTop(100) = +200 이므로 결과값이 +이므로 스크롤이 올라간 것을 의미한다.
    return prevScrollTop - nowScrollTop > 0 ? "up" : "down";
  };

  // 3.스크롤 핸들러 이벤트 실행
  $(window).scroll(function () {
    // 스크롤이 맨 위(0)가 아닐 때만 동작하도록 설정.
    if ($(document).scrollTop() > 0) {
      nowScrollTop = $(document /* this도 가능 */).scrollTop(); // 현재 위치를 저장

      // 스크롤 방향 판단하여 클래스 부여 및 제거
      // wheelMove() 함수를 통해 스크롤 방향을 판단.
      if (wheelMove() === "up") {
        // 스크롤 방향이 "up" 이면 사용자가 위로 스크롤한다면 "scroll-down" 클래스 제거
        $("html").removeClass("scroll-down");
      } else {
        // 스크롤 방향이 "down" 이면 사용자가 아래로 스크롤했기에 "scroll-down" 클래스 부여
        $("html").addClass("scroll-down");
      }

      prevScrollTop = nowScrollTop;
      console.log(nowScrollTop, prevScrollTop); // 스크롤시 콘솔창에 나타남.
    } else {
      // 스크롤이 맨 위(0)라면 "scroll-down" 클래스 제거
      $("html").removeClass("scroll-down");
    }
  });

  /* 패밀리 사이트 메뉴 */
  $(".link_open").on("click", function () {
    if ($(this).hasClass("on")) {
      $(this).removeClass("on").siblings("ul").removeClass("active");
    } else {
      $(this).addClass("on").siblings("ul").addClass("active");
    }
  });
});
