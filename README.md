# SIR Model Simulation

感染症の数理モデル（SIRモデル）のシミュレーション - Next.js実装

[![Deploy with Vercel](https://vercel.com/button)](https://sir-dynamic-simulation-by-nextjs.vercel.app/)

🌐 **Live Demo**: [https://sir-dynamic-simulation-by-nextjs.vercel.app/](https://sir-dynamic-simulation-by-nextjs.vercel.app/)

## 📊 概要

このプロジェクトは、感染症の広がりをシミュレーションする2つの異なるアプローチを実装しています：

- **常微分方程式によるSIRモデル（数値解法）**: 常微分方程式を4次ルンゲクッタ法で数値的に解く
- **個体ベースSIRモデル**: 個体レベルの相互作用を空間的にシミュレーション

## 🎬 デモ動画

<!-- 以下のいずれかの方法で動画を追加してください -->

<!-- 方法1: GIF動画 -->
<!-- ![デモ](./docs/demo.gif) -->

<!-- 方法2: YouTubeリンク -->
<!-- [![SIRシミュレーション](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID) -->

<!-- 方法3: 動画リンク -->
<!-- [📹 デモ動画を見る](https://youtube.com/watch?v=...) -->

## ✨ 機能

### 常微分方程式モデル（数値解法）
- 常微分方程式を4次ルンゲクッタ法で数値的に解く
- パラメータの動的調整（接触者数、感染率、回復日数）
- リアルタイムでのグラフ表示
- β, γ, R₀の自動計算

### 個体ベースモデル
- 2次元空間上での個体の動き
- 接触半径の可視化
- 確率的感染プロセス（ポアソン過程）
- リアルタイムチャートとメトリクス表示

### 理論ページ
- 両モデルの数理的背景
- パラメータ間の関係性
- モデル比較表
- KaTeXによる美しい数式表示

## 🚀 Getting Started

### 開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ページ構成

- `/works/sir-analytical` - 常微分方程式によるSIRモデル（数値解法）
- `/works/sir-simulation` - 個体ベースSIRモデル
- `/works/sir-theory` - 理論・解説ページ

## 📐 数理モデル

### 常微分方程式によるSIRモデル（数値解法）

```
dS/dt = -β S I
dI/dt = β S I - γ I
dR/dt = γ I
```

### パラメータ

- **β (beta)**: 感染率係数
- **γ (gamma)**: 回復率 = 1/(回復日数)
- **R₀**: 基本再生産数 = S(0)β/γ

### 個体ベースモデル

- 接触半径内の個体が感染リスクを持つ
- 感染確率: `P(感染) = 1 - exp(-β_agent × dt)`
- 回復確率: `P(回復) = 1 - exp(-γ × dt)`

## 🛠️ 技術スタック

- **Next.js 15** - Reactフレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Chart.js** - グラフ描画
- **KaTeX** - 数式表示
- **Zustand** - 状態管理

## 📚 参考文献

1. [IOP Conference Series (2018)](https://iopscience.iop.org/article/10.1088/1742-6596/1040/1/012021/pdf)
2. [東北大学 - SIRモデル](https://wagtail.cds.tohoku.ac.jp/coda/python/p-6-application-sup-ode-sir-model.html)
3. [日本内科学会雑誌 - 感染症の数理モデル (2020)](https://www.naika.or.jp/jsim_wp/wp-content/uploads/2020/11/nichinaishi-109-11-article_4.pdf)
4. [ルンゲクッタ法](http://pc-physics.com/rk1.html)
5. [Wikipedia - SIRモデル](https://ja.wikipedia.org/wiki/SIR%E3%83%A2%E3%83%87%E3%83%AB)

## 📄 ライセンス

このプロジェクトはオープンソースです。

## 👤 Author

SDNC hiro

---

Made with ❤️ using Next.js
