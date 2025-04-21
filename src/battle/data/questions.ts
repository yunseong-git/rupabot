export type Question = {
    id: number;
    subject: string;
    question: string;
    answer: string;
};

export const CS_QUESTIONS: Question[] = [
    {
        id: 1,
        subject: "소프트웨어 공학",
        question: "외부 서비스의 장애로 인한 연쇄적 장애 전파를 막기 위해 자동으로 외부서비스와 연결을 차단 및 복구하는 것:",
        answer: "서킷 브레이커"
    },
    {
        id: 2,
        subject: "데이터베이스",
        question: "데이터베이스에서 특정 컬럼에 중복된 값이 없도록 보장하는 제약 조건은?",
        answer: "unique"
    },
    {
        id: 3,
        subject: "웹",
        question: "HTTP 상태 코드 404는 어떤 의미인가?",
        answer: "Not Found"
    },
    {
        id: 4,
        subject: "웹",
        question: "브라우저가 서버에 요청할 때 현재 페이지의 상태를 유지하며 새 데이터만 가져오는 기술은?",
        answer: "ajax"
    },
    {
        id: 5,
        subject: "네트워크",
        question: "네트워크에서 데이터를 가장 짧은 시간에 전송하는 경로를 찾는 프로토콜은?",
        answer: "라우팅 프로토콜"
    },
    {
        id: 6,
        subject: "운영체제",
        question: "프로세스 간 자원을 경쟁하지 않도록 하나씩 접근하게 만드는 동기화 도구는?:",
        answer: "세마포어"
    },
    {
        id: 7,
        subject: "운영체제",
        question: "메모리에서 데이터가 영구적으로 저장되지 않고 전원이 꺼지면 사라지는 메모리는?",
        answer: "휘발성 메모리"
    },
    {
        id: 8,
        subject: "운영체제",
        question: "운영체제에서 프로세스가 CPU를 할당받아 실행 중인 상태를 무엇이라 하는가?",
        answer: "실행 상태"
    },
    {
        id: 9,
        subject: "네트워크",
        question: "TCP/IP 모델에서 데이터 링크 계층의 주요 프로토콜은?",
        answer: "이더넷"
    },
    {
        id: 10,
        subject: "소프트웨어 공학",
        question: "소프트웨어 개발에서 코드 변경 사항을 저장하고 추적하는 시스템은?",
        answer: "버전 관리 시스템"
    },
    {
        id: 11,
        subject: "데이터베이스",
        question: "데이터베이스에서 여러 테이블을 연결하여 하나의 결과 집합을 만드는 연산은?",
        answer: "조인"
    },
    {
        id: 12,
        subject: "웹",
        question: "HTTP 요청 메서드 중 리소스를 생성하거나 업데이트하는 데 주로 사용되는 것은?",
        answer: "POST"
    },
    {
        id: 13,
        subject: "알고리즘",
        question: "알고리즘의 시간 복잡도를 분석할 때 최악의 경우를 나타내는 표기법은?",
        answer: "빅오 표기법"
    },
    {
        id: 14,
        subject: "네트워크",
        question: "네트워크에서 동일한 네트워크 내 장치 간 통신을 가능하게 하는 장비는?",
        answer: "스위치"
    },
    {
        id: 15,
        subject: "객체지향 프로그래밍",
        question: "객체지향 프로그래밍에서 클래스의 속성과 메서드를 다른 클래스에 전달하는 개념은?",
        answer: "상속"
    },
    {
        id: 16,
        subject: "운영체제",
        question: "운영체제에서 여러 프로세스가 동시에 실행되는 것처럼 보이게 하는 기술은?",
        answer: "멀티태스킹"
    },
    {
        id: 17,
        subject: "웹",
        question: "웹 페이지의 구조를 정의하는 마크업 언어는?",
        answer: "HTML"
    },
    {
        id: 18,
        subject: "데이터베이스",
        question: "데이터베이스에서 트랜잭션이 모두 성공하거나 실패하도록 보장하는 속성은?",
        answer: "원자성"
    },
    {
        id: 19,
        subject: "네트워크",
        question: "네트워크에서 IP 주소를 도메인 이름으로 변환하는 시스템은?",
        answer: "DNS"
    },
    {
        id: 20,
        subject: "소프트웨어 공학",
        question: "소프트웨어 테스트에서 코드 내부 구조를 분석하여 테스트하는 방법은?",
        answer: "화이트박스 테스트"
    },
    {
        id: 21,
        subject: "운영체제",
        question: "운영체제에서 파일 시스템의 데이터를 일관성 있게 유지하기 위한 구조는?",
        answer: "저널링"
    },
    {
        id: 22,
        subject: "웹",
        question: "HTTP 상태 코드 500은 어떤 의미인가?",
        answer: "내부 서버 오류"
    },
    {
        id: 23,
        subject: "알고리즘",
        question: "자료구조에서 데이터가 먼저 들어간 것이 먼저 나오는 구조는?",
        answer: "큐"
    },
    {
        id: 24,
        subject: "소프트웨어 공학",
        question: "클라우드 컴퓨팅에서 필요에 따라 자원을 동적으로 할당하는 기술은?",
        answer: "오토스케일링"
    },
    {
        id: 25,
        subject: "객체지향 프로그래밍",
        question: "프로그래밍에서 동일한 이름의 메서드가 다른 동작을 하도록 하는 기법은?",
        answer: "오버로딩"
    },
    {
        id: 26,
        subject: "네트워크",
        question: "네트워크에서 패킷 손실을 감지하고 재전송을 요청하는 프로토콜은?",
        answer: "TCP"
    },
    {
        id: 27,
        subject: "소프트웨어 공학",
        question: "소프트웨어 개발에서 요구사항 분석부터 배포까지의 전체 과정을 무엇이라 하는가?",
        answer: "소프트웨어 개발 생명주기"
    },
    {
        id: 28,
        subject: "데이터베이스",
        question: "데이터베이스에서 데이터 무결성을 보장하기 위해 참조되는 키는?",
        answer: "외래키"
    },
    {
        id: 29,
        subject: "웹",
        question: "웹 애플리케이션에서 클라이언트와 서버 간 데이터를 비동기적으로 교환하는 기술은?",
        answer: "웹소켓"
    },
    {
        id: 30,
        subject: "알고리즘",
        question: "알고리즘에서 정렬된 배열에서 데이터를 빠르게 찾는 방법은?",
        answer: "이진 탐색"
    },
    {
        id: 31,
        subject: "운영체제",
        question: "운영체제에서 프로세스가 필요로 하는 메모리를 동적으로 할당하는 기법은?",
        answer: "가상 메모리"
    },
    {
        id: 32,
        subject: "네트워크",
        question: "네트워크에서 서로 다른 네트워크 간 데이터를 전달하는 장비는?",
        answer: "라우터"
    },
    {
        id: 33,
        subject: "객체지향 프로그래밍",
        question: "객체지향 프로그래밍에서 객체의 세부 구현을 숨기는 개념은?",
        answer: "캡슐화"
    },
    {
        id: 34,
        subject: "알고리즘",
        question: "소프트웨어에서 동일한 작업을 반복적으로 실행하도록 설계된 패턴은?",
        answer: "루프"
    },
    {
        id: 35,
        subject: "데이터베이스",
        question: "데이터베이스에서 동일한 데이터가 불필요하게 중복 저장되는 것을 방지하는 과정은?",
        answer: "정규화"
    },
    {
        id: 36,
        subject: "보안",
        question: "웹 보안에서 악성 스크립트를 삽입하여 공격하는 기법은?",
        answer: "크로스사이트 스크립팅"
    },
    {
        id: 37,
        subject: "알고리즘",
        question: "그래프에서 모든 노드를 한 번씩 방문하며 사이클이 없는 경로를 탐색하는 알고리즘은?",
        answer: "위상 정렬"
    },
    {
        id: 38,
        subject: "네트워크",
        question: "인터넷에서 패킷을 빠르게 전달하기 위해 사용하는 경로 캐싱 기술은?",
        answer: "콘텐츠 전송 네트워크"
    },
    {
        id: 39,
        subject: "데이터베이스",
        question: "데이터베이스에서 쿼리 성능을 향상시키기 위해 자주 사용되는 저장 구조는?",
        answer: "인덱스"
    },
    {
        id: 40,
        subject: "운영체제",
        question: "프로세스가 필요 이상으로 오래 기다리는 상태를 방지하기 위한 스케줄링 기법은?",
        answer: "라운드 로빈"
    },
    {
        id: 41,
        subject: "웹",
        question: "웹 페이지에서 사용자 입력을 동적으로 검증하고 처리하는 스크립트 언어는?",
        answer: "자바스크립트"
    },
    {
        id: 42,
        subject: "소프트웨어 공학",
        question: "소프트웨어 개발에서 짧은 주기로 피드백을 받아 개선하는 방법론은?",
        answer: "애자일"
    },
    {
        id: 43,
        subject: "보안",
        question: "데이터를 암호화하여 제3자가 읽을 수 없도록 보호하는 기술은?",
        answer: "암호화"
    },
    {
        id: 44,
        subject: "객체지향 프로그래밍",
        question: "동일한 인터페이스를 통해 서로 다른 객체를 동적으로 처리하는 기법은?",
        answer: "다형성"
    },
    {
        id: 45,
        subject: "컴파일러",
        question: "고급 언어를 기계어로 변환하는 과정에서 구문 분석을 담당하는 단계는?",
        answer: "파싱"
    },
    {
        id: 46,
        subject: "인공지능",
        question: "기계 학습에서 모델이 학습 데이터에 과도하게 적합해지는 현상은?",
        answer: "과적합"
    },
    {
        id: 47,
        subject: "네트워크",
        question: "네트워크에서 장치의 고유 식별을 위해 사용되는 주소 체계는?",
        answer: "MAC 주소"
    },
    {
        id: 48,
        subject: "데이터베이스",
        question: "데이터베이스에서 여러 쿼리를 한 번에 실행하도록 묶는 작업 단위는?",
        answer: "트랜잭션"
    },
    {
        id: 49,
        subject: "운영체제",
        question: "운영체제에서 하드웨어와 소프트웨어 간의 인터페이스를 제공하는 구성 요소는?",
        answer: "커널"
    },
    {
        id: 50,
        subject: "알고리즘",
        question: "두 개의 정렬된 배열을 하나로 병합하는 알고리즘은?",
        answer: "머지 소트"
    }
];