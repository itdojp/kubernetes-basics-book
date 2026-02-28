---
layout: book
order: 1
title: "はじめに"
---
# はじめに

本書「Kubernetes入門：PodからIngressまで（基礎と実践）」は、アプリケーションを Kubernetes に載せるために必要となる最小限の概念と、代表的なリソース（Pod / Deployment / Service / Ingress）を中心に、実務で再利用できる形で整理します。

## 本書の目的
- Kubernetes の宣言的管理と主要リソースの役割を理解する
- 最小構成のマニフェストを読み書きし、ローカルクラスタで動作確認できる
- 設計判断（ラベル設計、Probe、ロールアウト等）の論点を説明できる

## 扱う範囲 / 扱わない範囲

### 扱う範囲
- kubectl の基本操作
- YAML と metadata 設計（Label/Selector/Namespace）
- Pod 設計（Probe/Resources の入口）
- Deployment のロールアウト
- Service と名前解決
- Ingress の基本（Ingress Controller 前提、TLS は入口）

### 扱わない範囲
- コンテナ基礎の深掘り（名前空間/cgroups、イメージ管理の詳細等）
  - 必要に応じて Podman 本を参照: [Podman完全ガイド](https://itdojp.github.io/podman-book/)
- クラスタ設計・運用の深掘り（HA、アップグレード、監視基盤、運用設計等）
  - 別冊: [Kubernetesクラスタ運用（別冊）](https://itdojp.github.io/kubernetes-cluster-ops-book/)

## 前提知識・準備
- Linux の基本操作（シェル、ファイル、ネットワークの基礎）
- HTTP の基本（ポート、ホスト名、TLS の概要）
- （推奨）コンテナの概念（イメージ/コンテナ、ポート、ボリューム）

## 学習環境（動作確認）
本書のコマンド例は、以下の構成で動作確認します。

- Kubernetes: v1.35 系（2026-02-23 時点の stable は v1.35.1）
- kubectl: v1.35 系
- ローカルクラスタ: kind v0.31.0
- Ingress Controller: ingress-nginx controller-v1.14.3

補足:
- kind 以外（minikube など）でも実行できますが、Storage/Ingress など一部の章では差分が出ます。
- 本書の YAML は可能な限り基本 API に寄せ、特定ベンダ固有の拡張は扱いません。

## 参照方針
- 一次情報は Kubernetes 公式ドキュメントを優先します。
- 外部記事は背景理解の補助として最小限に留めます（リンク切れリスクの低減）。

## 表記ルール
- コマンド例は bash を前提とし、`<...>` はプレースホルダを表します。
- YAML は原則として 2 スペースインデントで記載します。
- 本書内リンクは `chapters/.../` の相対パス（ディレクトリ形式）を前提に記載します（先頭 `/` の絶対パスは避けます）。

## 例題（共通ハンズオン）の命名規則
本書のハンズオンでは、原則として以下を使用します（章の目的により例外あり）。

- Namespace: `demo`
- Workload 名: `web`
- Service 名: `web`
- 共通ラベル（例）:
  - `app.kubernetes.io/name: web`
  - `app.kubernetes.io/instance: demo`

## 読み方ガイド
- コンテナに不慣れな場合は、第0章→第1章→第2章→第3章→第4章→第5章→第6章→第7章の順に進めてください（既にコンテナを扱える場合は第0章はスキップ可）。
- 既に kubectl を扱える場合は、第3章（metadata 設計）から読み始めても問題ありません。
- まず動かすことを優先する場合は、第2章→第5章→第6章→第7章を先行し、必要に応じて概念章へ戻ってください。

## ハンズオン（環境チェック）
```bash
kubectl version --client
kind version
kubectl config current-context
```

## フィードバック
- Issue: [GitHub Issues](https://github.com/itdojp/kubernetes-basics-book/issues)
- Email: knowledge@itdo.jp

## 次に読む
- [第0章：コンテナ基礎ダイジェスト](../chapters/chapter00/)（本書で深掘りしない範囲の整理）
