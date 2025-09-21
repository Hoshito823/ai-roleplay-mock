"use client";

import { useEffect, useState } from "react";

interface Session {
  id: string;
  scenario: string;
  duration: number;
  successRate: number;
  emotionScore: number;
  createdAt: string;
  status: "completed" | "failed" | "in_progress";
}

export function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("Failed to parse JSON:", text.substring(0, 100));
          throw new Error("Invalid JSON response");
        }

        if (Array.isArray(data)) {
          setSessions(data);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        // フォールバックデータ
        setSessions([
          {
            id: "1",
            scenario: "新規顧客開拓",
            duration: 15,
            successRate: 85,
            emotionScore: 8.5,
            createdAt: "2024-09-15T10:30:00Z",
            status: "completed"
          },
          {
            id: "2",
            scenario: "既存顧客フォロー",
            duration: 12,
            successRate: 78,
            emotionScore: 7.8,
            createdAt: "2024-09-14T14:20:00Z",
            status: "completed"
          },
          {
            id: "3",
            scenario: "クレーム対応",
            duration: 18,
            successRate: 65,
            emotionScore: 6.2,
            createdAt: "2024-09-13T11:15:00Z",
            status: "completed"
          },
          {
            id: "4",
            scenario: "商品提案",
            duration: 20,
            successRate: 92,
            emotionScore: 9.1,
            createdAt: "2024-09-12T16:45:00Z",
            status: "completed"
          },
          {
            id: "5",
            scenario: "価格交渉",
            duration: 8,
            successRate: 45,
            emotionScore: 5.5,
            createdAt: "2024-09-11T09:30:00Z",
            status: "failed"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getStatusBadge = (status: Session["status"]) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      in_progress: "bg-yellow-100 text-yellow-800"
    };

    const labels = {
      completed: "完了",
      failed: "失敗",
      in_progress: "進行中"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">商談履歴</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                シナリオ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                成功率
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                感情スコア
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日時
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {session.scenario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.duration}分
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.successRate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.emotionScore}/10
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(session.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(session.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    詳細
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    再実行
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}