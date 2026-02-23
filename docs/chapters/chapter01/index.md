---
layout: book
order: 3
title: "第1章：Kubernetesの全体像"
---
# 第1章：Kubernetesの全体像

Kubernetes は「望ましい状態（Desired State）」を宣言し、コントローラが現在の状態を収束させることで、アプリケーションの配置・更新・回復を自動化します。

## 学習目標
- Kubernetes の宣言的管理とコントロールループを説明できる
- 主要リソース（Pod/Deployment/Service/Ingress）の役割分担を整理できる
- kubectl でリソースを観測し、仕様を調べる基本操作ができる

## 扱う範囲 / 扱わない範囲

### 扱う範囲
- 宣言的管理と収束（reconcile）の考え方
- Control Plane / Node の主要コンポーネントの役割
- 本書で扱う主要リソースの俯瞰
- kubectl による API の探索（api-resources / explain）

### 扱わない範囲
- クラスタの HA 設計、スケーリング、監視設計（運用編で扱う）
- CRD/Operator の設計

## Kubernetes が解決すること / しないこと

### 解決すること（代表例）
- アプリの配置（スケジューリング）
- 望ましいレプリカ数の維持（自己修復）
- ロールアウトとロールバック（Deployment）
- サービスディスカバリ（Service / DNS）

### しないこと（代表例）
- アプリのバグ修正
- リリース判断の自動化（設計しない限りは提供されない）
- アプリ固有の監視要件の定義（SLO/SLI は利用者側の責務）

## 宣言的管理とコントロールループ
- 利用者はマニフェストで「あるべき状態」を宣言します。
- Kubernetes は現在状態との差分を検知し、あるべき状態に近づけます（reconcile）。
- 収束を担うのがコントローラ（Deployment Controller 等）です。

この仕組みにより、ノード障害や Pod の異常終了が起きても、望ましい状態へ戻す動きが基本線になります。

## コンポーネントの俯瞰

### Control Plane（制御系）
- kube-apiserver: API の入口（状態を宣言/取得する）
- etcd: クラスタ状態の永続化
- kube-scheduler: Pod の配置先決定
- kube-controller-manager: 各種コントローラの実行

### Node（実行系）
- kubelet: ノード上で Pod を実行状態へ持ち上げる
- container runtime（例: containerd）: コンテナの実行
- kube-proxy: Service の到達性を実現（実装は環境で異なる）

## 主要リソース（本書で扱う範囲）
- Pod: コンテナ実行の最小単位
- Deployment: Pod のレプリカ維持とロールアウト
- Service: Pod 群への安定した到達点（仮想IP/DNS）
- Ingress: HTTP(S) ルーティング（Ingress Controller が必要）
- ConfigMap/Secret: 設定の外部化
- PV/PVC/StorageClass: 永続ストレージの抽象化（第9章）

## ハンズオン：API を探索する
```bash
kubectl api-resources | head
kubectl explain pod
kubectl explain deployment.spec.template.spec.containers
```

## よくある落とし穴
- 「Pod を直接作る」だけで運用し、更新・回復・スケールの仕組みを使わない
- Ingress を「単体機能」と誤解し、Ingress Controller の存在を見落とす

## まとめ / 次に読む
- 次に読む: [第2章：ローカル環境とkubectl](../chapter02/)
