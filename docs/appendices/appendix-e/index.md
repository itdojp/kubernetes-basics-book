---
layout: book
order: 17
title: "付録E：図版索引"
---
# 付録E：図版索引

本付録は、本文で実際に参照している PNG 図版を章順に索引化したものです。図版を単独の設計仕様や運用手順として扱わず、必ずリンク先の前後の説明、コマンド、注意事項と合わせて確認してください。

## 使い方

1. 作業目的に合う章と図版を選び、図版リンクから本文の該当箇所へ移動します。
2. 図版のコマンド出力、リソース名、namespace、ラベル、到達性を自分の環境の値と照合します。
3. 画面例の値をそのまま転記せず、本文の手順を実行して得た観測結果と差分を記録します。

## 第0章：コンテナ基礎ダイジェスト

### 図E-01：podman version（例）

- **図版リンク**: [第0章の図版へ移動](../../chapters/chapter00/#figure-ch00-podman-version-01)
- **ファイル**: `ch00-podman-version-01.png`
- **目的**: Podman のクライアントとサーバーのバージョン情報を確認する入口です。
- **確認の観点**: 実行環境で `podman version` を実行し、クライアントとサーバーの情報が取得できるか、対象環境のランタイムであるかを確認します。

### 図E-02：Nginx の起動と疎通確認（例）

- **図版リンク**: [第0章の図版へ移動](../../chapters/chapter00/#figure-ch00-nginx-http-02)
- **ファイル**: `ch00-nginx-http-02.png`
- **目的**: コンテナ起動後に HTTP 応答とログを観測する最小の流れを示します。
- **確認の観点**: 起動したコンテナ、公開ポート、HTTP 応答、ログ出力が同じ対象を指していることを確認し、外部公開とコンテナ内ポートを混同しません。

## 第1章：Kubernetesの全体像

### 図E-03：kubectl で API を探索する（例）

- **図版リンク**: [第1章の図版へ移動](../../chapters/chapter01/#figure-ch01-kubectl-explore-01)
- **ファイル**: `ch01-kubectl-explore-01.png`
- **目的**: `kubectl api-resources` と `kubectl explain` による API 探索の出力例を示します。
- **確認の観点**: 対象クラスタの API で目的のリソースが利用可能かを確認し、マニフェストを書く前にフィールドの説明を `kubectl explain` で照合します。

## 第2章：ローカル環境とkubectl

### 図E-04：kind クラスタの作成と確認（例）

- **図版リンク**: [第2章の図版へ移動](../../chapters/chapter02/#figure-ch02-kind-bootstrap-01)
- **ファイル**: `ch02-kind-bootstrap-01.png`
- **目的**: `kind.yaml` の確認からクラスタ作成、Namespace 作成までの観測例を示します。
- **確認の観点**: 選択中の kubeconfig context、作成済みノード、Namespace を順に確認し、別クラスタや `default` namespace へ誤って操作しないようにします。

## 第3章：YAML基礎とメタデータ設計

### 図E-05：labels の確認（例）

- **図版リンク**: [第3章の図版へ移動](../../chapters/chapter03/#figure-ch03-kubectl-show-labels-01)
- **ファイル**: `ch03-kubectl-show-labels-01.png`
- **目的**: Deployment と Pod に付与された labels を観測する例を示します。
- **確認の観点**: Deployment の selector、Pod template の labels、Service が参照する labels を同じキーと値で照合し、意図しない Pod が選択されないことを確認します。

## 第4章：Pod設計

### 図E-06：kubectl describe pod（例）

- **図版リンク**: [第4章の図版へ移動](../../chapters/chapter04/#figure-ch04-kubectl-describe-pod-01)
- **ファイル**: `ch04-kubectl-describe-pod-01.png`
- **目的**: Probe、Resources、Conditions、Events を `kubectl describe pod` で確認する例を示します。
- **確認の観点**: readiness/liveness の設定、requests/limits、Pod の Conditions、直近 Events を分けて読み、再起動や未 Ready の原因を一つの表示だけで断定しません。

## 第5章：Deploymentとロールアウト

### 図E-07：ロールアウトと ReplicaSet の切り替え（例）

- **図版リンク**: [第5章の図版へ移動](../../chapters/chapter05/#figure-ch05-rollout-rs-01)
- **ファイル**: `ch05-rollout-rs-01.png`
- **目的**: Deployment 更新に伴う ReplicaSet の切り替えを観測する例を示します。
- **確認の観点**: `rollout status`、新旧 ReplicaSet、ready replicas、履歴を順に確認し、復旧が必要な場合に戻す対象の revision を記録します。

## 第6章：Serviceと名前解決

### 図E-08：Service と DNS の確認（例）

- **図版リンク**: [第6章の図版へ移動](../../chapters/chapter06/#figure-ch06-service-dns-01)
- **ファイル**: `ch06-service-dns-01.png`
- **目的**: EndpointSlice、名前解決、Service 到達性を確認する例を示します。
- **確認の観点**: Service の selector、EndpointSlice の endpoints、Pod の labels、DNS 名、targetPort を順に確認し、名前解決だけで到達性を判断しません。

## 第7章：Ingress

### 図E-09：ingress-nginx の導入と Host ルーティング（例）

- **図版リンク**: [第7章の図版へ移動](../../chapters/chapter07/#figure-ch07-ingress-nginx-01)
- **ファイル**: `ch07-ingress-nginx-01.png`
- **目的**: ingress-nginx の導入から Ingress 作成、Host ルーティングの疎通確認までを示します。
- **確認の観点**: IngressClass、Controller の稼働、host/path、バックエンド Service、TLS の要否を分けて確認し、Ingress リソースだけで公開できると判断しません。

## 第8章：ConfigMapとSecret

### 図E-10：ConfigMap/Secret の注入（例）

- **図版リンク**: [第8章の図版へ移動](../../chapters/chapter08/#figure-ch08-configmap-secret-01)
- **ファイル**: `ch08-configmap-secret-01.png`
- **目的**: ConfigMap と Secret の作成、Pod への注入、反映確認の例を示します。
- **確認の観点**: `APP_ENV` の値、Secret の mount 先、`readOnly`、参照名を確認し、Secret の実値を画面、ログ、Issue に出力しません。

## 第9章：ストレージ基礎

### 図E-11：PVC の作成とマウント（例）

- **図版リンク**: [第9章の図版へ移動](../../chapters/chapter09/#figure-ch09-pvc-mount-01)
- **ファイル**: `ch09-pvc-mount-01.png`
- **目的**: PVC 作成、Pod でのマウント、データ永続化の確認例を示します。
- **確認の観点**: PVC が `Bound` であること、Pod の mountPath、StorageClass、再作成後も期待したデータを読めることを確認します。

## 第10章：基本トラブルシューティング

### 図E-12：Service の selector 不整合の切り分け（例）

- **図版リンク**: [第10章の図版へ移動](../../chapters/chapter10/#figure-ch10-service-selector-debug-01)
- **ファイル**: `ch10-service-selector-debug-01.png`
- **目的**: Service selector の不整合により EndpointSlice が空になる事象の切り分け例を示します。
- **確認の観点**: EndpointSlice の endpoints、Service の selector、対象 Pod の labels、namespace を順に比較し、修正前後の観測結果と変更内容を記録します。

## 範囲

この索引は、`src` で参照される既存の 12 件の PNG 図版だけを対象にします。未参照のファイルや、将来追加する予定だけの図版は掲載しません。

## 関連ページ

- [付録D：実務チェックリストとトラブルシュート導線](../appendix-d/)
- [付録C：参考リンク集](../appendix-c/)
