# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LG LD290EJS-FPN1 (1920x540) 向けのデジタルサイネージWebアプリ。時計・カレンダー・天気予報を1画面に横並びで表示する。Vite + TypeScript で構成されたフロントエンドのみのSPA（バックエンド無し）。

## Build & Dev Commands

```bash
npm install        # 依存関係インストール
npm run dev        # Vite 開発サーバー起動
npm run build      # tsc && vite build（dist/ に出力）
npm run preview    # ビルド済みの dist/ をプレビュー
```

テストフレームワークは未導入。リンターも無し。

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) で main ブランチへの push 時に GitHub Pages へ自動デプロイ。`vite.config.ts` の `base: "/otak-lg329/"` がデプロイパスに対応。

## Architecture

`src/main.ts` がエントリポイント。`setInterval(renderAll, 1000)` で毎秒メインループを実行し、各モジュールを呼び出す。

### モジュール構成

| ファイル | 役割 |
|---|---|
| `config.ts` | 共有定数（座標・曜日名・設定）と `pad()` ユーティリティ |
| `clock.ts` | 時刻表示（固定幅digit span、コロン点滅） |
| `calendar.ts` | 当月・翌月カレンダー描画（祝日ハイライト対応） |
| `holidays.ts` | 日本の祝日計算（固定祝日・ハッピーマンデー・春分秋分・振替休日） |
| `weather.ts` | Open-Meteo API から現在天気＋7日予報取得・描画。ブラウザ Geolocation 対応 |
| `weather-icons.ts` | WMO天気コードに対応するインラインSVGアイコン生成 |
| `chime.ts` | Web Audio API で毎正時にチャイム音を鳴らす |
| `style.css` | 全スタイル（1920x540固定レイアウト、横3カラム構成） |

### レイアウト構成（左から右）

`時計セクション | divider | カレンダー（当月＋翌月） | divider | 天気セクション`

### 主な設計ポイント

- **解像度固定**: viewport 1920x540px、`overflow: hidden`。レスポンシブ対応なし
- **外部API**: Open-Meteo のみ（APIキー不要）。`CONFIG.weatherRefreshMinutes`（デフォルト30分）間隔で再取得
- **音声制御**: ブラウザのAutoplay制限回避のため、初回タップでAudioContextをunlockする仕組み（`audio-unlock` overlay）
- **フルスクリーン**: 初回タップ時に `requestFullscreen` も呼ぶ
- **日付変更検知**: `lastRenderedDate` で日付が変わった時のみカレンダー再描画
- **DOM操作**: フレームワーク不使用。innerHTML で直接描画
