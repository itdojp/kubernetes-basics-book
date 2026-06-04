# Kubernetes入門：PodからIngressまで（基礎と実践）

Pod / Deployment / Service / Ingress を中心に、アプリケーションをKubernetesに載せるための基礎と実践を整理する。

## オンライン版
- [Kubernetes入門：PodからIngressまで（基礎と実践）](https://itdojp.github.io/kubernetes-basics-book/)

## 対象読者
- Kubernetes をこれから学ぶソフトウェアエンジニア/インフラエンジニア
- 代表的なリソース（Pod/Deployment/Service/Ingress）を扱う必要がある方

## 実務参照の入口

公開版では、トップページからチェックリスト / トラブルシュート導線へ進める入口を用意しています。

- [実務チェックリストとトラブルシュート導線](https://itdojp.github.io/kubernetes-basics-book/appendices/appendix-d/)
- [基本トラブルシューティング](https://itdojp.github.io/kubernetes-basics-book/chapters/chapter10/)

## 開発（ローカル）

### 前提
- Node.js 20+（CI は Node.js 20 を使用）
- npm

### セットアップ
```bash
npm ci
```

### src → docs 同期
```bash
npm run sync
```

### ビルド
```bash
npm run build
```

### 品質チェック
```bash
# npm 依存関係のセキュリティ監査
npm run check:security

# src → docs 同期と dist 生成の確認
npm test
```

### ローカルプレビュー
```bash
npm run dev
```

## フィードバック
- Issue: [itdojp/kubernetes-basics-book の Issues](https://github.com/itdojp/kubernetes-basics-book/issues)
- Email: [knowledge@itdo.jp](mailto:knowledge@itdo.jp)

## ライセンス
- CC-BY-NC-SA-4.0（商用利用は別途契約が必要）
- 詳細は `LICENSE.md` を参照
