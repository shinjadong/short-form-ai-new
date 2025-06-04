// YouTube Data API를 사용하여 쇼츠 검색 및 트렌드 분석을 위한 유틸리티 함수들

// YouTube API 키 (환경 변수에서 가져옴)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * YouTube API를 사용하여 쇼츠 영상 검색 (최근 7일 내 결과만)
 * @param query 검색어
 * @param maxResults 최대 결과 수
 * @returns 검색 결과 배열
 */
export async function searchYouTubeShorts(query: string, maxResults: number = 15): Promise<any[]> {
  try {
    // 사용자가 입력한 검색어 그대로 사용
    const searchQuery = query;
    
    // 최근 7일 전 날짜 계산
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const publishedAfter = sevenDaysAgo.toISOString();
    
    // YouTube Data API v3의 search 엔드포인트 사용 (최근 7일 필터링 추가)
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&maxResults=${maxResults}&type=video&videoDuration=short&order=viewCount&publishedAfter=${publishedAfter}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API 검색 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("YouTube 쇼츠 검색 중 오류:", error);
    return [];
  }
}

/**
 * YouTube API를 사용하여 동영상 상세 정보 가져오기 (조회수, 좋아요 등 포함)
 * @param videoIds 비디오 ID 배열
 * @returns 동영상 상세 정보 배열
 */
export async function getVideoDetails(videoIds: string[]): Promise<any[]> {
  try {
    if (videoIds.length === 0) return [];

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(
        ","
      )}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API 비디오 정보 조회 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("YouTube 비디오 정보 조회 중 오류:", error);
    return [];
  }
}

/**
 * 유튜브 비디오 오디오 추출 및 Whisper를 통한 전사
 * @param videoId 비디오 ID
 * @returns 전사 텍스트
 */
export async function getVideoTranscript(videoId: string): Promise<string> {
  try {
    // 상대 경로 대신 전체 URL 사용 (상대 경로가 작동하지 않는 문제 해결)
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';
      
    const apiUrl = `${baseUrl}/api/direct/extract-audio-transcript`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId }),
    });
    
    if (!response.ok) {
      throw new Error(`전사 API 오류: ${response.status}`);
    }
    
    const data = await response.json();
    return data.transcript || '';
  } catch (error) {
    console.error(`비디오 ${videoId} 전사 중 오류:`, error);
    return '';
  }
}

/**
 * 인기 쇼츠 제목에서 트렌드 키워드 추출
 * @param titles 제목 배열
 * @returns 키워드 빈도수 맵
 */
export function extractKeywordsFromTitles(titles: string[]): Record<string, number> {
  // 불용어 (제외할 일반적인 단어)
  const stopWords = new Set([
    "the", "and", "a", "in", "to", "of", "is", "it", "that", "this", "with", "for", "on", "at", 
    "by", "from", "up", "about", "into", "over", "after",
    "shorts", "short", "#shorts", "#short", "youtube", "video", "new", "how", "what", "why", "when",
    "내", "나의", "우리", "저의", "제", "나는", "저는", "나", "너", "너의", "당신", "제가",
    "이", "그", "저", "이런", "그런", "어떤", "어떻게", "왜", "언제", "어디서", "누가", "누구",
    "을", "를", "에", "에서", "으로", "로", "와", "과", "이나", "거나", "하고", "이랑", "랑", "와",
    "은", "는", "이", "가", "의", "도", "만", "만큼", "처럼", "같이", "같은", "보다", "라고", "라는",
    "라면", "더", "매우", "정말", "진짜", "완전", "너무", "아주", "굉장히", "엄청", "되게"
  ]);

  // 키워드 빈도 계산
  const keywordFrequency: Record<string, number> = {};

  for (const title of titles) {
    // 특수문자 제거 및 단어 분리
    const words = title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ') // 특수문자 제거 (유니코드 인식)
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.has(word.toLowerCase()));

    // 단일 단어 키워드 빈도 계산
    for (const word of words) {
      keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
    }

    // 2단어 연속 구문 (바이그램) 처리
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      keywordFrequency[bigram] = (keywordFrequency[bigram] || 0) + 1;
    }
  }

  return keywordFrequency;
}

/**
 * 유튜브 쇼츠 정보 가져오기 (제목, 조회수, 상위 3개 영상 전사본 포함)
 * @param query 검색어
 * @returns 트렌드 정보와 영상 전사본
 */
export async function getYouTubeTrendKeywords(query: string): Promise<any> {
  try {
    // 1. 쇼츠 검색 (최근 7일)
    const searchResults = await searchYouTubeShorts(query);
    if (searchResults.length === 0) return { titles: [query], transcripts: [] };

    // 2. 비디오 ID 추출
    const videoIds = searchResults.map(item => item.id.videoId);
    
    // 3. 비디오 상세 정보 가져오기
    const videoDetails = await getVideoDetails(videoIds);
    
    // 4. 조회수를 기준으로 상위 10개 영상 선택
    const topVideos = videoDetails
      .sort((a, b) => {
        const viewsA = parseInt(a.statistics?.viewCount || '0');
        const viewsB = parseInt(b.statistics?.viewCount || '0');
        return viewsB - viewsA;
      })
      .slice(0, 10);
    
    // 5. 제목 추출
    const titles = topVideos.map(video => video.snippet.title);
    
    // 디버깅을 위해 제목 출력
    console.log("분석할 상위 영상 제목들:", titles);
    
    // 6. 상위 3개 동영상의 전사본 가져오기 시도
    const topThreeVideos = topVideos.slice(0, 3);
    const transcriptPromises = topThreeVideos.map(async (video) => {
      try {
        // 전사 시도
        let transcript = '';
        try {
          transcript = await getVideoTranscript(video.id);
        } catch (transcriptError) {
          console.error(`비디오 ${video.id} 전사 시도 중 오류:`, transcriptError);
          // 전사 실패 시에도 비디오 정보는 반환
        }

        return {
          videoId: video.id,
          title: video.snippet.title,
          viewCount: video.statistics?.viewCount || 0,
          transcript
        };
      } catch (error) {
        console.error(`비디오 ${video.id} 처리 중 오류:`, error);
        // 오류가 발생해도 기본 정보는 반환
        return {
          videoId: video.id,
          title: video.snippet.title,
          viewCount: video.statistics?.viewCount || 0,
          transcript: ''
        };
      }
    });
    
    // 병렬로 전사 작업 실행
    const transcripts = await Promise.all(transcriptPromises);
    
    // 7. 결과 반환
    return {
      titles,
      transcripts: transcripts.filter(t => t) // null이 아닌 것만 필터링
    };
  } catch (error) {
    console.error("트렌드 키워드 추출 중 오류:", error);
    // 오류 발생 시 원본 검색어라도 반환
    return { titles: [query], transcripts: [] };
  }
}

// 트렌드 분석 요청 함수 예시 추가 (필요시)
export async function getTrendSuggestion(query: string): Promise<any> {
  try {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/direct/content-analyzer/suggest-content`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`트렌드 분석 API 오류: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('트렌드 분석 요청 중 오류:', error);
    return null;
  }
} 