import React, { useState } from 'react';
import { KeyRound, CheckCircle2, Trash2, ExternalLink, HelpCircle } from 'lucide-react';

interface ApiSettingsPanelProps {
  youtubeApiKey: string;
  onSaveApiKey: (key: string) => void;
  onBackToAnalyze: () => void;
}

export const ApiSettingsPanel: React.FC<ApiSettingsPanelProps> = ({
  youtubeApiKey,
  onSaveApiKey,
  onBackToAnalyze,
}) => {
  const [draftKey, setDraftKey] = useState(youtubeApiKey);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(draftKey.trim());
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleClear = () => {
    setDraftKey('');
    onSaveApiKey('');
    setSavedNotice(false);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-saas-display)' }}
            >
              Cài đặt YouTube Data API v3
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Key được lưu cục bộ trên trình duyệt (localStorage) để quét dữ liệu kênh YouTube công khai theo thời gian thực.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 border ${
              youtubeApiKey
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{youtubeApiKey ? 'Đã lưu Key cục bộ' : 'Chưa cấu hình Key'}</span>
          </span>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="settings-yt-key"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              YouTube Data API Key (Google Cloud)
            </label>
            <input
              id="settings-yt-key"
              type="password"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Lưu API Key
            </button>
            {youtubeApiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-4 h-4 text-slate-500" />
                <span>Xóa Key đã lưu</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBackToAnalyze}
              className="ml-auto px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Quay về màn hình phân tích
            </button>
          </div>

          {savedNotice && (
            <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3.5 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Đã lưu YouTube Data API Key vào trình duyệt thành công.</span>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
            <HelpCircle className="w-4 h-4 text-[#2563EB]" />
            <span>Hướng dẫn lấy YouTube Data API Key miễn phí trong 1 phút</span>
          </div>
          <ol className="space-y-2.5 text-sm text-slate-600 list-decimal list-inside">
            <li>
              Truy cập{' '}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline inline-flex items-center gap-1 font-medium"
              >
                Google Cloud Console
                <ExternalLink className="w-3.5 h-3.5" />
              </a>{' '}
              và tạo hoặc chọn một Project bất kỳ.
            </li>
            <li>
              Vào mục <strong>APIs &amp; Services &rarr; Library</strong>, tìm kiếm{' '}
              <strong>YouTube Data API v3</strong> và bấm <strong>Enable</strong>.
            </li>
            <li>
              Chuyển sang <strong>APIs &amp; Services &rarr; Credentials</strong> &rarr; bấm{' '}
              <strong>Create Credentials &rarr; API Key</strong>.
            </li>
            <li>
              Sao chép chuỗi Key (bắt đầu bằng <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">AIza...</code>) và dán vào ô phía trên. Quota miễn phí mặc định là 10.000 đơn vị/ngày (đủ quét hàng trăm kênh).
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
