export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Tailwind CSS 테스트 페이지
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">카드 1</h2>
            <p className="text-gray-600">
              이 카드가 제대로 스타일링되어 보인다면 Tailwind CSS가 작동하고 있습니다.
            </p>
          </div>
          
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">카드 2</h2>
            <p>
              파란색 배경과 흰색 텍스트가 보여야 합니다.
            </p>
          </div>
          
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">카드 3</h2>
            <p>
              초록색 배경과 흰색 텍스트가 보여야 합니다.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">그라디언트 테스트</h2>
          <p className="text-lg">
            보라색에서 분홍색으로 그라디언트가 보여야 합니다.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
            버튼 테스트
          </button>
          
          <div className="flex space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              배지 1
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              배지 2
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              배지 3
            </span>
          </div>
        </div>
        
        <div className="mt-8 p-4 border-l-4 border-yellow-400 bg-yellow-50">
          <p className="text-yellow-800">
            <strong>알림:</strong> 모든 스타일이 제대로 보인다면 Tailwind CSS가 정상 작동하고 있습니다!
          </p>
        </div>
      </div>
    </div>
  )
} 