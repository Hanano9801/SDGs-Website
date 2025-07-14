document.addEventListener('DOMContentLoaded', () => {
    // 1. 부드러운 스크롤 (Smooth Scroll)
    document.querySelectorAll('nav ul li a, .btn').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();

                const targetId = href;
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerOffset = document.querySelector('#main-header').offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                    let startTime;
                    window.requestAnimationFrame(function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const duration = 700;
                        let percentage = Math.min(progress / duration, 1);
                        let easing = 0.5 * (1 - Math.cos(Math.PI * percentage));

                        let currentScrollTop = window.pageYOffset;
                        let distanceToScroll = targetPosition - currentScrollTop;
                        window.scrollTo(0, currentScrollTop + distanceToScroll * easing);

                        if (percentage < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            const mainNav = document.getElementById('main-nav');
                            const hamburger = document.querySelector('.hamburger');
                            if (mainNav.classList.contains('active')) {
                                mainNav.classList.remove('active');
                                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
                            }
                        }
                    });
                }
            }
        });
    });

    // 2. 스크롤 시 헤더 스타일 변경
    const mainHeader = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // 3. 모바일 햄버거 메뉴 토글
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

    // 4. 스크롤 감지 및 활성 메뉴 링크 강조
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = mainHeader.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.clientHeight;
            // 스크롤 위치가 섹션 범위 내에 있을 때 해당 섹션을 현재 섹션으로 설정
            if (pageYOffset >= sectionTop - 100 && pageYOffset < sectionTop + sectionHeight - 100) { // 약간의 여유값 추가
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('#main-nav ul li a').forEach(a => {
            a.classList.remove('active');
            // 링크의 href가 현재 섹션 ID를 포함하는지 확인
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // --- 5. 기술 스택 버튼-콘텐츠 전환 로직 ---
    const skillTabButtons = document.querySelectorAll('.skill-tab-btn');
    const skillDetailContents = document.querySelectorAll('.skill-detail-content');

    skillTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 모든 버튼에서 active 클래스 제거
            skillTabButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            button.classList.add('active');

            // 모든 상세 내용을 숨김 (display: none 처리)
            skillDetailContents.forEach(content => {
                content.classList.remove('active'); // active 클래스 제거 (애니메이션 역재생)
                // CSS 트랜지션이 완료된 후에 display: none 처리
                setTimeout(() => {
                    if (!content.classList.contains('active')) { // 다시 활성화되지 않았다면
                        content.style.display = 'none';
                    }
                }, 500); // CSS transition 시간(0.5s)과 맞춰줍니다.
            });

            // 클릭된 버튼의 data-content-id에 해당하는 내용을 표시
            const targetContentId = button.dataset.contentId;
            const activeContent = document.getElementById(targetContentId);

            if (activeContent) {
                activeContent.style.display = 'block'; // 먼저 보이게 설정
                // display: block 후에 Reflow가 발생하도록 짧은 딜레이를 준 후 active 클래스 추가
                setTimeout(() => {
                    activeContent.classList.add('active'); // active 클래스 추가로 opacity와 transform 변경 트리거
                }, 10);
            }
        });
    });

    // 페이지 로드 시 첫 번째 탭 활성화 (초기 설정)
    const initialActiveButton = document.querySelector('.skill-tab-btn.active');
    if (initialActiveButton) {
        initialActiveButton.click(); // 초기 active 버튼을 클릭하여 내용 표시
    } else if (skillTabButtons.length > 0) {
        // active 클래스가 지정되지 않았을 경우, 첫 번째 버튼을 기본으로 활성화
        skillTabButtons[0].click();
    }
}); // 모든 JavaScript 코드는 이 하나의 DOMContentLoaded 안에 있어야 합니다.