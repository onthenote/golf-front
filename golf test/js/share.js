
Kakao.init(key);
console.log(key);


  Kakao.Share.createDefaultButton({
    container: '#kakaotalk-sharing-btn',
    objectType: 'feed',
    content: {
      title: '골프 스타일 테스트',
      description: '나의 골프 스타일은 어떤 유형일까 ?!',
      imageUrl:
        './img/main.png',
      link: {
        // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
        webUrl: 'https://golftest.onthenote.com',
      },
    },
    buttons: [
      {
        title: '테스트 하러가기',
        link: {
          webUrl: 'https://golftest.onthenote.com',
        },
      }
    ],
});