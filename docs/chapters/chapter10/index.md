---
layout: book
order: 12
title: "第10章：基本トラブルシューティング"
---
# 第10章：基本トラブルシューティング

本章では、Kubernetes での障害切り分けを「観測→仮説→検証→復旧」の型で整理し、kubectl の代表的な確認ポイントをまとめます。

## 学習目標
- 症状/影響/変更点を整理し、切り分けの順序を組み立てられる
- `get/describe/events/logs/exec` を使って状況を把握できる
- よくある障害（CrashLoopBackOff、ImagePullBackOff、Pending、Service 到達不可）の入口を理解する

## 扱う範囲 / 扱わない範囲

### 扱う範囲
- kubectl による観測（get/describe/events）
- ログ確認（logs）
- 侵入調査（exec）
- 疎通確認（port-forward）
- 典型障害のパターンと確認観点

### 扱わない範囲
- 高度なデバッグ（プロファイリング、eBPF 等）
- 監視基盤やアラート設計（運用編で扱う）

## 切り分けの型（最小）
1) 影響範囲（ユーザー影響、対象 namespace、対象コンポーネント）を整理する  
2) 直近の変更（デプロイ、設定変更、クラスタ変更）を確認する  
3) 事実の収集（events/logs/状態）  
4) 仮説を立て、最短で検証できる順に試す  

## よく使う観測コマンド
```bash
kubectl -n demo get all
kubectl -n demo describe pod <pod-name>
kubectl -n demo get events --sort-by=.lastTimestamp
kubectl -n demo logs <pod-name>
```

## 典型障害（入口）
- CrashLoopBackOff: アプリ起動失敗、設定/依存先未準備、Probe の誤設定など
- ImagePullBackOff: イメージ名/タグ誤り、レジストリ認証、ネットワーク
- Pending: リソース不足、ノード制約、PVC Pending
- Service 到達不可: selector 不整合、targetPort 誤り、DNS

## ハンズオン：Service の selector 不整合を切り分ける
Service の selector が間違うと Endpoints が空になり、到達できなくなります。

1) 現状を確認します。

```bash
kubectl -n demo get svc web
kubectl -n demo get endpointslice -l kubernetes.io/service-name=web
```

2) selector を誤らせて Endpoints を空にします（学習用途）。

```bash
kubectl -n demo patch svc web -p '{\"spec\":{\"selector\":{\"app.kubernetes.io/name\":\"web-wrong\"}}}'
kubectl -n demo get endpointslice -l kubernetes.io/service-name=web
```

3) Service の詳細で原因を確認し、selector を戻します。

```bash
kubectl -n demo describe svc web
kubectl -n demo patch svc web -p '{\"spec\":{\"selector\":{\"app.kubernetes.io/name\":\"web\",\"app.kubernetes.io/instance\":\"demo\"}}}'
kubectl -n demo get endpointslice -l kubernetes.io/service-name=web
```

## よくある落とし穴
- events を見ずにログだけ追い、原因特定に時間がかかる
- namespace を誤り、別環境を見てしまう
- 暫定復旧（再起動）だけで終わり、恒久対応（原因の除去）が残る

## まとめ / 次に読む
- 次に読む: 付録A（kubectlクイックリファレンス）や付録B（スニペット集）も参照してください。
