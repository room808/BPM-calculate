document.addEventListener('DOMContentLoaded', () => {
    const tapButton = document.getElementById('tapButton');
    const resetButton = document.getElementById('resetButton');
    const bpmValueDisplay = document.getElementById('bpmValue');

    let tapTimes = []; // 탭이 발생한 시간을 저장할 배열
    let tapIntervals = []; // 탭 간의 시간 간격(밀리초)을 저장할 배열
    let lastTapTimestamp = 0; // 마지막 탭의 타임스탬프
    let autoResetTimeout; // 자동 초기화 타이머 ID

    const MAX_TAP_INTERVALS = 10; // 평균 계산에 사용할 최대 탭 간격 수
    const RESET_THRESHOLD_MS = 2000; // 2초 (자동 초기화 기준 시간, 밀리초)

    // BPM 계산 및 화면 업데이트 함수
    function calculateBpm() {
        if (tapIntervals.length < 2) { // 최소 2개 간격 (3번 탭)이 있어야 의미 있는 계산 가능
            bpmValueDisplay.textContent = '0';
            return;
        }

        // 탭 간격의 평균 계산
        const sumIntervals = tapIntervals.reduce((sum, interval) => sum + interval, 0);
        const averageIntervalMs = sumIntervals / tapIntervals.length;

        // BPM 계산 (60000ms / 평균_간격_ms)
        const bpm = 60000 / averageIntervalMs;

        // 소수점 둘째 자리까지 표시
        bpmValueDisplay.textContent = bpm.toFixed(2);
    }

    // 탭 버튼 클릭 이벤트 핸들러
    function handleTap() {
        const currentTime = Date.now(); // 현재 시간(밀리초 타임스탬프)

        // 자동 초기화 타이머 클리어
        clearTimeout(autoResetTimeout);

        // 마지막 탭 이후 일정 시간(RESET_THRESHOLD_MS)이 지났으면 초기화
        if (lastTapTimestamp > 0 && (currentTime - lastTapTimestamp) > RESET_THRESHOLD_MS) {
            resetBpmCalculator();
        }

        // 첫 탭이 아니면 간격 계산 및 추가
        if (lastTapTimestamp !== 0) {
            const interval = currentTime - lastTapTimestamp;
            tapIntervals.push(interval);

            // 최대 간격 수 초과 시 가장 오래된 간격 제거
            if (tapIntervals.length > MAX_TAP_INTERVALS) {
                tapIntervals.shift(); // 배열의 첫 번째 요소 제거
            }
        }

        lastTapTimestamp = currentTime; // 마지막 탭 시간 업데이트

        calculateBpm(); // BPM 계산 및 화면 업데이트

        // 일정 시간 후 자동 초기화 타이머 설정
        autoResetTimeout = setTimeout(resetBpmCalculator, RESET_THRESHOLD_MS);
    }

    // 리셋 버튼 클릭 이벤트 핸들러 또는 자동 초기화 시 호출될 함수
    function resetBpmCalculator() {
        tapTimes = [];
        tapIntervals = [];
        lastTapTimestamp = 0;
        bpmValueDisplay.textContent = '0'; // BPM 표시 초기화
        clearTimeout(autoResetTimeout); // 혹시 모를 타이머 클리어
        console.log("BPM 계산기가 초기화되었습니다.");
    }

    // 이벤트 리스너 연결
    tapButton.addEventListener('click', handleTap);
    resetButton.addEventListener('click', resetBpmCalculator);

    // 키보드 Spacebar로 탭 기능 추가 (선택 사항)
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !event.repeat) { // Spacebar를 누르고 반복 키가 아닐 때
            tapButton.click(); // 버튼 클릭 이벤트 트리거
            event.preventDefault(); // 스페이스바의 기본 동작 (스크롤) 방지
        }
    });

    // 키보드 'R' 키로 리셋 기능 추가 (선택 사항)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'R') {
            resetButton.click();
        }
    });

    // 초기 로드 시 BPM 0으로 설정
    bpmValueDisplay.textContent = '0';
});