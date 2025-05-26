import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

/**
 * YouTube 동영상 전사 API
 * YouTube 내장 자막을 사용하거나 없는 경우 외부 서비스로 전사를 시도합니다.
 */
export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: '동영상 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    try {
      // YouTube 내장 자막 가져오기 시도
      console.log(`YouTube 동영상 ${videoId} 자막 가져오기 시도 중...`);
      
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (transcriptItems && transcriptItems.length > 0) {
        // 자막 텍스트 결합
        const transcriptText = transcriptItems
          .map(item => item.text)
          .join(' ');
        
        console.log('YouTube 자막 가져오기 완료');
        
        // 전사 결과 반환
        return NextResponse.json({
          message: '전사 완료',
          transcript: transcriptText,
          source: 'youtube_captions'
        });
      } else {
        throw new Error('YouTube 자막을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('YouTube 자막 가져오기 실패:', error);
      
      // 자막을 찾을 수 없는 경우
      return NextResponse.json({ 
        error: 'YouTube 자막을 찾을 수 없습니다. 현재 직접 전사는 지원하지 않습니다.',
        transcript: '',
        source: 'none'
      }, { status: 404 });
    }
  } catch (error: any) {
    console.error('전사 처리 오류:', error);
    
    return NextResponse.json({ 
      error: `전사 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      transcript: '',
      source: 'error'
    }, { status: 500 });
  }
} 