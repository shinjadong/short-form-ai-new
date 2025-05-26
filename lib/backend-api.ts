// 백엔드 API 클라이언트
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface VideoScriptRequest {
  video_subject: string;
  video_language?: string;
  paragraph_number?: number;
}

export interface VideoScriptResponse {
  status: number;
  message: string;
  data: {
    video_script: string;
  };
}

export interface VideoTermsRequest {
  video_subject: string;
  video_script: string;
  amount?: number;
}

export interface VideoTermsResponse {
  status: number;
  message: string;
  data: {
    video_terms: string[];
  };
}

export interface VideoParams {
  video_subject: string;
  video_script: string;
  video_terms?: string[] | string;
  video_aspect?: '16:9' | '9:16' | '1:1';
  video_concat_mode?: 'random' | 'sequential';
  video_clip_duration?: number;
  video_count?: number;
  video_source?: string;
  video_language?: string;
  voice_name?: string;
  voice_volume?: number;
  voice_rate?: number;
  bgm_type?: string;
  bgm_file?: string;
  bgm_volume?: number;
  subtitle_enabled?: boolean;
  subtitle_position?: 'top' | 'bottom' | 'center';
  font_name?: string;
  text_fore_color?: string;
  text_background_color?: boolean | string;
  font_size?: number;
  stroke_color?: string;
  stroke_width?: number;
}

export interface TaskResponse {
  status: number;
  message: string;
  data: {
    task_id: string;
  };
}

export interface TaskStatus {
  state: number;
  progress: number;
  videos?: string[];
  combined_videos?: string[];
  script?: string;
  terms?: string[];
  audio_file?: string;
  audio_duration?: number;
  subtitle_path?: string;
  materials?: string[];
  error?: string;
}

export interface TaskQueryResponse {
  status: number;
  message: string;
  data: TaskStatus;
}

// 스크립트 생성 API
export async function generateScript(params: VideoScriptRequest): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/scripts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`스크립트 생성 실패: ${response.status}`);
    }

    const data: VideoScriptResponse = await response.json();
    return data.data.video_script;
  } catch (error) {
    console.error('스크립트 생성 오류:', error);
    throw error;
  }
}

// 키워드 생성 API
export async function generateTerms(params: VideoTermsRequest): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/terms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`키워드 생성 실패: ${response.status}`);
    }

    const data: VideoTermsResponse = await response.json();
    return data.data.video_terms;
  } catch (error) {
    console.error('키워드 생성 오류:', error);
    throw error;
  }
}

// 비디오 생성 API
export async function createVideo(params: VideoParams): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`비디오 생성 실패: ${response.status}`);
    }

    const data: TaskResponse = await response.json();
    return data.data.task_id;
  } catch (error) {
    console.error('비디오 생성 오류:', error);
    throw error;
  }
}

// 태스크 상태 확인 API
export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${taskId}`);

    if (!response.ok) {
      throw new Error(`태스크 상태 확인 실패: ${response.status}`);
    }

    const data: TaskQueryResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('태스크 상태 확인 오류:', error);
    throw error;
  }
}

// 오디오 생성 API
export async function createAudio(params: {
  video_script: string;
  video_language?: string;
  voice_name?: string;
  voice_volume?: number;
  voice_rate?: number;
  bgm_type?: string;
  bgm_file?: string;
  bgm_volume?: number;
}): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`오디오 생성 실패: ${response.status}`);
    }

    const data: TaskResponse = await response.json();
    return data.data.task_id;
  } catch (error) {
    console.error('오디오 생성 오류:', error);
    throw error;
  }
}

// BGM 목록 조회 API
export async function getBgmList(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/musics`);

    if (!response.ok) {
      throw new Error(`BGM 목록 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.data.files;
  } catch (error) {
    console.error('BGM 목록 조회 오류:', error);
    throw error;
  }
}

// 태스크 진행 상황을 실시간으로 모니터링하는 함수
export function monitorTask(
  taskId: string,
  onProgress: (progress: number) => void,
  onComplete: (result: TaskStatus) => void,
  onError: (error: string) => void,
  interval: number = 3000
): () => void {
  const checkStatus = async () => {
    try {
      const status = await getTaskStatus(taskId);
      
      onProgress(status.progress || 0);
      
      if (status.state === 2) { // 완료
        onComplete(status);
        clearInterval(intervalId);
      } else if (status.state === 3) { // 오류
        onError(status.error || '알 수 없는 오류가 발생했습니다.');
        clearInterval(intervalId);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : '상태 확인 중 오류가 발생했습니다.');
      clearInterval(intervalId);
    }
  };

  const intervalId = setInterval(checkStatus, interval);
  
  // 즉시 한 번 실행
  checkStatus();
  
  // cleanup 함수 반환
  return () => clearInterval(intervalId);
}
