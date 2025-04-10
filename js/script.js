$(function () {
  /* 비주얼 slide 구현 */
  let visualSlide = new Swiper(".visual-slide", {
    speed: 1000, // 슬라이드 전환 속도
    allowTouchMove: true, // 사용자가 마우스 또는 손가락으로 슬라이드할 수 있게 허용
    loop: true, // 슬라이프가 마지막에 도달해도 다시 처음으로 돌아가면서 무한반복
    loopAdditionalSlides: 1, // 루프 기능에서 추가 슬라이드를 만들어 원활한 루프 보장
    watchSlidesProgress: true, // 슬라이드 진행 상태를 추적
    mousewheel: false, // 마우스 휠로 슬라이드를 이동하지 않게 설정
    autoplay: {
      delay: 3000,
      disableOnInteraction: false, // 사용자가 슬라이드를 터치해도 자동 재생을 멈추지 않음
    },

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
});
