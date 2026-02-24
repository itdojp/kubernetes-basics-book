# 付録A：kubectlクイックリファレンス

本付録は、本文中で頻出する kubectl の操作を目的別に整理します。  
コマンドは例であり、namespace は適宜 `-n` で指定してください。

## 表記
- `<ns>`: namespace
- `<name>`: リソース名
- `-A`: 全namespace（all namespaces）

## 観測（一覧/詳細）

| 目的 | コマンド例 |
| --- | --- |
| リソース一覧 | `kubectl -n <ns> get all` |
| Pod 一覧（詳細） | `kubectl -n <ns> get pod -o wide` |
| YAML 出力 | `kubectl -n <ns> get deploy <name> -o yaml` |
| 詳細表示 | `kubectl -n <ns> describe pod <name>` |
| イベント | `kubectl -n <ns> get events --sort-by=.lastTimestamp` |
| ラベル表示 | `kubectl -n <ns> get pod --show-labels` |
| ラベル検索 | `kubectl -n <ns> get pod -l key=value` |

補足:
- `kubectl get all` はすべてのリソースを表示しません（Ingress/ConfigMap/Secret 等は含まれません）。
- `--sort-by=.lastTimestamp` が期待どおりでない場合は、`--sort-by=.metadata.creationTimestamp` を試してください。

## 適用（作成/更新/削除）

| 目的 | コマンド例 |
| --- | --- |
| 適用 | `kubectl apply -f <file-or-dir>` |
| 削除 | `kubectl delete -f <file-or-dir>` |
| 差分確認 | `kubectl diff -f <file-or-dir>` |

## デバッグ

| 目的 | コマンド例 |
| --- | --- |
| ログ | `kubectl -n <ns> logs <pod>` |
| ログ（複数Pod） | `kubectl -n <ns> logs deploy/<name> --all-containers=true` |
| シェル | `kubectl -n <ns> exec -it <pod> -- sh` |
| port-forward | `kubectl -n <ns> port-forward svc/<svc> 8080:80` |

## 仕様確認（API）

| 目的 | コマンド例 |
| --- | --- |
| リソース一覧 | `kubectl api-resources` |
| マニフェストの説明 | `kubectl explain deployment.spec.template.spec.containers` |

## よく使うオプション
- `-n <ns>`: namespace 指定
- `-A`: 全namespace
- `-o wide|yaml|json`: 出力形式
- `--context <ctx>`: 対象クラスタ/コンテキスト指定
- `--sort-by=<jsonpath>`: ソート

## 参考
- kubectl コマンドリファレンス: https://kubernetes.io/docs/reference/kubectl/
