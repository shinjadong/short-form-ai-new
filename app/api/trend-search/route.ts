import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getYouTubeTrendKeywords } from '@/lib/youtube-api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, source = 'youtube' } = body

    if (!query) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 소스에 따라 다른 방식으로 트렌드 검색
    let trendKeywords: string[] = [];
    let contentSuggestions: any[] = [];
    let sourceUsed = '';
    let youtubeTitles: string[] = [];
    // 전사본을 임시 저장할 변수 추가
    let transcriptsStore: any[] = [];

    // YouTube API를 사용한 트렌드 검색 시도
    if (source === 'youtube' || source === 'both') {
      const youtubeApiKey = process.env.YOUTUBE_API_KEY;
      
      if (youtubeApiKey) {
        try {
          console.log(`YouTube API를 사용하여 "${query}" 트렌드 검색 중...`);
          
          // 변경된 함수 호출 - 이제 제목과 전사 결과를 모두 반환
          const youtubeResult = await getYouTubeTrendKeywords(query);
          youtubeTitles = youtubeResult.titles || [];
          
          if (youtubeTitles.length > 0 && youtubeTitles[0] !== query) {
            // YouTube 제목들을 OpenAI로 분석
            const apiKey = process.env.OPENAI_API_KEY;
            
            if (apiKey) {
              try {
                const openai = new OpenAI({ apiKey });
                
                console.log('YouTube 인기 쇼츠 제목을 OpenAI로 분석 중...');
                
                // OpenAI에게 제목 리스트를 분석하도록 요청 - 모델 변경
                const analysis = await openai.chat.completions.create({
                  model: "gpt-4o",
                  messages: [
                    {
                      role: "system",
                      content: "당신은 유튜브 트렌드 분석 전문가입니다. 제공된 유튜브 영상 제목들을 분석해 현재 트렌드와 핵심 주제를 파악해야 합니다."
                    },
                    {
                      role: "user",
                      content: `다음은 "${query}" 검색어로 찾은 인기 있는 유튜브 쇼츠 영상들의 제목입니다. 이 제목들을 분석하여 현재 인기 있는 트렌드, 주제, 밈, 챌린지 등을 파악하고, 숏폼 콘텐츠 제작에 활용할 수 있는 핵심 키워드나 주제를 5-8개 추출해주세요. 제목들의 맥락과 의미를 고려하여 분석해주세요:
                      
                      ${youtubeTitles.join('\n')}
                      
                      각 키워드나 주제는 짧고 간결하게 정리해주세요. 숏폼 콘텐츠 제작자에게 도움이 될 수 있는 구체적인 트렌드를 찾아주세요.`
                    }
                  ],
                  temperature: 0.3,
                  max_tokens: 300,
                });
                
                const content = analysis.choices[0].message.content;
                
                // 분석 결과에서 키워드 추출
                if (content) {
                  // 번호 매기기, 줄바꿈, 콤마, 불릿 포인트 등의 다양한 구분자 처리
                  const cleanedText = content
                    .replace(/^\d+\.\s*/gm, '') // 번호 제거 (예: "1. ")
                    .replace(/^[-•*]\s*/gm, '') // 불릿 포인트 제거 (예: "- ", "• ")
                    
                  // 줄바꿈 또는 콤마로 분리
                  const splitByLines = cleanedText.split(/\r?\n/);
                  
                  // 각 라인이 여러 키워드를 콤마로 구분하고 있는 경우 처리
                  let extractedArray: string[] = [];
                  for (const line of splitByLines) {
                    if (line.trim()) {
                      const commaItems = line.split(',').map(item => item.trim()).filter(Boolean);
                      extractedArray.push(...commaItems);
                    }
                  }
                  
                  if (extractedArray.length > 0) {
                    trendKeywords = extractedArray;
                    sourceUsed = 'youtube';
                    console.log(`YouTube 제목 분석에서 ${trendKeywords.length}개의 키워드를 찾았습니다.`);
                  }
                }
                
                // 전사본이 있는 경우, 콘텐츠 제작 방향 분석
                const transcripts = youtubeResult.transcripts || [];
                if (transcripts.length > 0) {
                  console.log(`${transcripts.length}개의 동영상 전사본 분석 중...`);
                  
                  // 전사본 저장
                  transcriptsStore = transcripts;
                  
                  // 각 전사본에 대해 콘텐츠 방향 분석
                  const contentAnalysisPromises = transcripts.map(async (item: any) => {
                    try {
                      // 전사본이 없으면 건너뛰기
                      if (!item.transcript) return null;
                      
                      // 전사본이 너무 길면 앞부분만 사용
                      const transcript = item.transcript.length > 1500 
                        ? item.transcript.substring(0, 1500) + "..." 
                        : item.transcript;
                      
                      // OpenAI에게 전사본 분석 요청 - 모델 변경 및 프롬프트 수정
                      const analysis = await openai.chat.completions.create({
                        model: "gpt-4o",
                        messages: [
                          {
                            role: "system",
                            content: "당신은 숏폼 콘텐츠 전략가입니다. 유튜브 쇼츠 영상의 전사본을 분석하여 콘텐츠 구조를 이해하고, 이 콘텐츠의 장점을 취하면서도 더 창의적이고 독특한 관점으로 발전시킬 수 있는 방법을 제안합니다."
                          },
                          {
                            role: "user",
                            content: `다음은 인기 있는 유튜브 쇼츠 영상의 제목과 전사본입니다. 이 콘텐츠의 구조와 소재를 분석하되, 단순히 모방하지 않고 더 혁신적인 방식으로 재해석하여 조회수를 높일 수 있는 전략을 제시해주세요:
                            
                            제목: ${item.title}
                            조회수: ${Number(item.viewCount).toLocaleString()}회
                            
                            전사본:
                            ${transcript}
                            
                            분석에 다음을 포함해주세요:
                            1. 콘텐츠 핵심 주제와 이를 더 강력하게 발전시킬 방법
                            2. 콘텐츠 구성 방식과 이를 개선할 수 있는 대안적 구조
                            3. 시청자의 관심을 더 효과적으로 끌 수 있는 요소
                            4. 이 콘텐츠를 계승하면서도 뛰어넘을 수 있는 콘텐츠 아이디어 3개
                            
                            응답은 실용적이고 구체적으로 작성해주세요.`
                          }
                        ],
                        temperature: 0.7,
                        max_tokens: 500,
                      });
                      
                      return {
                        videoId: item.videoId,
                        title: item.title,
                        viewCount: item.viewCount,
                        analysis: analysis.choices[0].message.content
                      };
                    } catch (error) {
                      console.error(`비디오 ${item.videoId} 분석 오류:`, error);
                      return null;
                    }
                  });
                  
                  // 병렬로 분석 작업 실행
                  const analysisResults = await Promise.all(contentAnalysisPromises);
                  contentSuggestions = analysisResults.filter(Boolean); // null 제거
                  
                  console.log(`${contentSuggestions.length}개의 콘텐츠 방향 분석 완료`);
                  
                  // 전사본을 기반으로 제목 생성 (저장된 전사본 활용)
                  if (transcriptsStore.length > 0 && trendKeywords.length > 0) {
                    try {
                      // 전사본 텍스트 모음
                      const combinedTranscripts = transcriptsStore
                        .filter(item => item.transcript)
                        .map(item => item.transcript.substring(0, 500)) // 각 전사본 앞부분만 사용
                        .join("\n\n");
                      
                      if (combinedTranscripts) {
                        // 전사본을 기반으로 제목 생성
                        const titleGeneration = await openai.chat.completions.create({
                          model: "gpt-4o",
                          messages: [
                            {
                              role: "system",
                              content: "당신은 소셜 미디어 마케팅 전문가로, 높은 클릭률을 가진 숏폼 영상 제목을 생성하는 전문가입니다. 벤치마킹한 인기 영상의 내용을 분석하고, 이를 더 효과적으로 변형하여 더 큰 호기심과 관심을 유발하는 제목을 만듭니다."
                            },
                            {
                              role: "user",
                              content: `다음은 "${query}" 키워드로 찾은 인기 있는 유튜브 쇼츠 영상들의 전사본과 분석된 트렌드 키워드입니다. 이 내용을 참고하여, 기존 영상보다 더 클릭을 유도하는 매력적인 제목 5개를 생성해주세요.

                              트렌드 키워드:
                              ${trendKeywords.join(', ')}
                              
                              참고 전사본:
                              ${combinedTranscripts}
                              
                              제목 생성 시 다음을 고려해주세요:
                              1. 기존 영상과 비슷하면서도 더 독창적이고 눈에 띄어야 함
                              2. 호기심을 자극하는 미스터리 요소 또는 감정적 반응을 이끌어낼 것
                              3. 숫자, 이모지, 감탄사 등을 전략적으로 사용할 것
                              4. 30자 이내로 간결하게 작성할 것
                              
                              응답은 제목만 나열해주세요. 번호나 설명 없이 각 줄에 하나의 제목만 작성해주세요.`
                            }
                          ],
                          temperature: 0.8,
                          max_tokens: 500,
                        });
                        
                        // 생성된 제목을 저장하여 반환하기 위한 로직 추가 가능
                        const generatedTitles = titleGeneration.choices[0].message.content;
                        if (generatedTitles) {
                          // 생성된 제목을 응답에 추가하기 위한 필드 생성
                          return NextResponse.json({
                            message: '트렌드 검색 완료',
                            trendKeywords: trendKeywords,
                            contentSuggestions: contentSuggestions,
                            generatedTitles: generatedTitles.split('\n').filter(Boolean),
                            source: sourceUsed
                          });
                        }
                      }
                    } catch (error) {
                      console.error('제목 생성 오류:', error);
                    }
                  }
                }
              } catch (error) {
                console.error('YouTube 제목 OpenAI 분석 오류:', error);
              }
            }
          } else {
            console.log('YouTube API에서 제목을 찾지 못했습니다.');
          }
        } catch (error) {
          console.error('YouTube API 트렌드 검색 오류:', error);
        }
      } else {
        console.log('YouTube API 키가 설정되지 않았습니다.');
      }
    }
    
    // YouTube API에서 키워드를 찾지 못했거나 OpenAI 웹 검색을 요청한 경우
    if ((trendKeywords.length === 0 && (source === 'openai' || source === 'both')) || source === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (apiKey) {
        try {
          console.log(`OpenAI 웹 검색을 사용하여 "${query}" 트렌드 검색 중...`);
          
          const openai = new OpenAI({ apiKey });
          
          // 웹 검색을 사용하여 최신 트렌드 분석 (모델 변경)
          const response = await openai.responses.create({
            model: "gpt-4o",
            tools: [{ 
              type: "web_search_preview",
              search_context_size: "low" // 가장 저렴한 컨텍스트 크기 사용
            }],
            input: `${query}에 대한 최신 정보를 검색해주세요. 현재 유튜브나 소셜미디어에서 어떤 트렌드가 있는지, 인기 있는 주제나 핵심 키워드를 찾아주세요. 결과는 핵심 키워드 위주로 간결하게 요약해주세요.`,
          });
          
          // 웹 검색 결과에서 키워드 추출 (모델 변경)
          const extractedKeywords = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "당신은 트렌드 키워드 추출 전문가입니다. 제공된 텍스트에서 숏폼 영상 제작에 유용한 핵심 키워드와 트렌드를 추출해야 합니다."
              },
              {
                role: "user",
                content: `다음 텍스트에서 숏폼 영상 제작에 활용할 수 있는, 가장 관련성 높은 키워드와 트렌드를 5-8개 추출해주세요. 각 키워드는 짧고 명확하게 정리해주세요: 
                
                ${response.output_text}`
              }
            ],
            temperature: 0.2,
            max_tokens: 200,
          });
          
          // OpenAI 응답에서 키워드 추출 처리
          const content = extractedKeywords.choices[0].message.content;
          
          // 결과 텍스트에서 키워드 추출 로직
          if (content) {
            // 번호 매기기, 줄바꿈, 콤마, 불릿 포인트 등의 다양한 구분자 처리
            const cleanedText = content
              .replace(/^\d+\.\s*/gm, '') // 번호 제거 (예: "1. ")
              .replace(/^[-•*]\s*/gm, '') // 불릿 포인트 제거 (예: "- ", "• ")
              
            // 줄바꿈 또는 콤마로 분리
            const splitByLines = cleanedText.split(/\r?\n/);
            
            // 각 라인이 여러 키워드를 콤마로 구분하고 있는 경우 처리
            let extractedArray: string[] = [];
            for (const line of splitByLines) {
              if (line.trim()) {
                const commaItems = line.split(',').map(item => item.trim()).filter(Boolean);
                extractedArray.push(...commaItems);
              }
            }
            
            if (extractedArray.length > 0) {
              trendKeywords = extractedArray;
              sourceUsed = sourceUsed || 'openai'; // 이미 YouTube 결과가 있으면 그대로 유지
              console.log(`OpenAI 웹 검색에서 ${trendKeywords.length}개의 키워드를 찾았습니다.`);
              
              // 웹 검색으로 키워드를 찾았지만 전사본이 없는 경우, 웹 검색 기반으로 제목 생성
              if (transcriptsStore.length === 0) {
                try {
                  // 웹 검색 결과를 기반으로 제목 생성
                  const titleGeneration = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                      {
                        role: "system",
                        content: "당신은 소셜 미디어 마케팅 전문가로, 높은 클릭률을 가진 숏폼 영상 제목을 생성하는 전문가입니다. 최신 트렌드와 키워드를 활용하여 시청자의 호기심을 자극하는 제목을 만듭니다."
                      },
                      {
                        role: "user",
                        content: `다음은 "${query}" 키워드에 관한 최신 트렌드 키워드입니다. 이 키워드를 활용하여 숏폼 영상에 적합한 매력적인 제목 5개를 생성해주세요.

                        트렌드 키워드:
                        ${trendKeywords.join(', ')}
                        
                        제목 생성 시 다음을 고려해주세요:
                        1. 시청자의 호기심을 자극하고 클릭을 유도할 것
                        2. 감정을 불러일으키는 표현과 느낌표, 이모지 등을 적절히 활용할 것
                        3. 숫자나 통계, 비교 표현 등을 활용하여 신뢰감과 구체성을 높일 것
                        4. 30자 이내로 간결하게 작성할 것
                        
                        응답은 제목만 나열해주세요. 번호나 설명 없이 각 줄에 하나의 제목만 작성해주세요.`
                      }
                    ],
                    temperature: 0.8,
                    max_tokens: 500,
                  });
                  
                  // 생성된 제목을 저장하여 반환하기 위한 로직
                  const generatedTitles = titleGeneration.choices[0].message.content;
                  if (generatedTitles) {
                    return NextResponse.json({
                      message: '트렌드 검색 완료',
                      trendKeywords: trendKeywords,
                      contentSuggestions: contentSuggestions,
                      generatedTitles: generatedTitles.split('\n').filter(Boolean),
                      source: sourceUsed
                    });
                  }
                } catch (error) {
                  console.error('제목 생성 오류:', error);
                }
              }
            }
          }
        } catch (error) {
          console.error('OpenAI 웹 검색 트렌드 분석 오류:', error);
        }
      } else {
        console.log('OpenAI API 키가 설정되지 않았습니다.');
      }
    }

    // 중복 제거 및 정제
    trendKeywords = [...new Set(trendKeywords)]
      .filter(keyword => keyword.length > 1 && keyword.length < 30) // 너무 짧거나 긴 키워드 제외
      .slice(0, 8); // 최대 8개로 제한
    
    if (trendKeywords.length === 0 && contentSuggestions.length === 0) {
      return NextResponse.json({
        message: '트렌드 키워드를 찾을 수 없습니다.',
        trendKeywords: [],
        contentSuggestions: [],
        source: 'none'
      });
    }

    // 모든 처리 후 결과 반환
    return NextResponse.json({
      message: '트렌드 검색 완료',
      trendKeywords: trendKeywords,
      contentSuggestions: contentSuggestions,
      source: sourceUsed
    });
  } catch (error: any) {
    console.error('트렌드 검색 오류:', error);
    return NextResponse.json(
      { 
        error: `트렌드 검색 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}` 
      },
      { status: 500 }
    );
  }
} 
