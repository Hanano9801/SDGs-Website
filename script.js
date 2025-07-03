document.addEventListener('DOMContentLoaded', () => {
    // 1. 부드러운 스크롤 (Smooth Scroll) 개선
    document.querySelectorAll('nav ul li a, .btn').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) { // '#'으로 시작하는 링크만 처리
                e.preventDefault(); // 기본 앵커 동작 방지

                const targetId = href;
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerOffset = document.querySelector('#main-header').offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                    // 애니메이션 스크롤 함수
                    window.requestAnimationFrame(function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const duration = 700; // 스크롤 애니메이션 지속 시간 (ms)
                        let percentage = Math.min(progress / duration, 1);
                        let easing = 0.5 * (1 - Math.cos(Math.PI * percentage)); // Ease-in-out 효과

                        let currentScrollTop = window.pageYOffset;
                        let distanceToScroll = targetPosition - currentScrollTop;
                        window.scrollTo(0, currentScrollTop + distanceToScroll * easing);

                        if (percentage < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            // 스크롤 완료 후 모바일 메뉴 닫기 및 아이콘 변경
                            const mainNav = document.getElementById('main-nav');
                            const hamburger = document.querySelector('.hamburger');
                            if (mainNav.classList.contains('active')) {
                                mainNav.classList.remove('active');
                                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                            }
                        }
                    });

                    let startTime; // 애니메이션 시작 시간
                }
            }
        });
    });

    // 2. 스크롤 시 헤더 스타일 변경 (기존과 동일)
    const mainHeader = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // 3. 모바일 햄버거 메뉴 토글 (기존과 동일)
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.getElementById('main-nav');

    hamburger.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // 스크롤 감지 및 활성 메뉴 링크 강조 (기존과 동일)
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = mainHeader.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.clientHeight; // 섹션의 실제 높이
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('#main-nav ul li a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });
});