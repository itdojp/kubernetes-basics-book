---
layout: book
order: 16
title: "付録D：実務チェックリストとトラブルシュート導線"
---
# 付録D：実務チェックリストとトラブルシュート導線

この付録は、Kubernetes の基礎を実務に持ち込む前に確認する checklistPack と、問題が起きたときの troubleshootingFlow をまとめたものです。
作業前の Issue、手順書、またはレビュー依頼に貼り付け、未確認事項を残したまま変更しないための入口として使います。

## 使い方

1. 対象 namespace、クラスタ、アプリケーション、変更内容を明記する。
2. 「作業前チェックリスト」を埋める。
3. 問題が出た場合は「トラブルシュートの入口」に沿って、事実と仮説を分けて記録する。
4. 復旧後に「記録と次アクション」を残す。

## 作業前チェックリスト

| 観点 | 確認すること | 記録欄 |
| --- | --- | --- |
| 対象 | クラスタ名、context、namespace、対象リソース名を記録した | |
| 権限 | ServiceAccount / RBAC / namespace の責任範囲を確認した | |
| 変更内容 | 適用する YAML、変更理由、期待する状態を説明できる | |
| 依存関係 | ConfigMap、Secret、Service、Ingress、PVC などの依存先を確認した | |
| 安全性 | Secret 相当値を Git、Issue、ログへ貼らない方針を確認した | |
| 戻し方 | `kubectl rollout undo`、前回 manifest、または再適用手順を用意した | |
| 観測 | `kubectl get`、`describe`、`events`、`logs` で確認する順序を決めた | |

## トラブルシュートの入口

| 症状 | 最初に見るもの | 次に確認すること |
| --- | --- | --- |
| Pod が起動しない | `kubectl -n <ns> describe pod <pod>` | Events、ImagePull、Probe、resources、Secret / ConfigMap の参照 |
| Pod が Pending のまま | `kubectl -n <ns> get pod <pod> -o wide` | node selector、requests、PVC、スケジューリング制約 |
| アプリが再起動を繰り返す | `kubectl -n <ns> logs <pod> --previous` | 起動引数、環境変数、Probe、依存サービス |
| Service に到達できない | `kubectl -n <ns> get svc,endpointslice` | selector、targetPort、Pod label、namespace、DNS 名 |
| Ingress で到達できない | `kubectl -n <ns> describe ingress <name>` | IngressClass、Controller、Service、TLS secret、host / path |
| 設定変更が反映されない | `kubectl -n <ns> describe deploy <name>` | rollout 状態、ConfigMap / Secret の参照方法、Pod 再作成の有無 |

## 最小コマンドセット

```bash
kubectl config current-context
kubectl -n <ns> get all
kubectl -n <ns> get events --sort-by=.lastTimestamp
kubectl -n <ns> describe pod <pod>
kubectl -n <ns> logs <pod>
kubectl -n <ns> get svc,endpointslice,ingress
```

`events` の時刻順が期待どおりでない場合は、次のように creationTimestamp で並べ替えます。

```bash
kubectl -n <ns> get events --sort-by=.metadata.creationTimestamp
```

## 記録と次アクション

トラブルシュートの結果は、次の4点に分けて Issue または作業メモへ残します。

- 事実: 実行したコマンド、出力、時刻、対象 namespace
- 仮説: 何が原因と考えたか、どの証跡で判断したか
- 対応: 変更した manifest、再起動、ロールバック、確認結果
- 再発防止: checklist、README、手順書、監視、アラートへ反映する内容

## 関連ページ

- [第10章：基本トラブルシューティング](../../chapters/chapter10/)
- [付録A：kubectlクイックリファレンス](../appendix-a/)
- [付録B：マニフェストスニペット集](../appendix-b/)
