# Kubernetes入門：PodからIngressまで（基礎と実践）

Pod / Deployment / Service / Ingress を中心に、アプリケーションを Kubernetes に載せるための基礎と実践を整理します。

## 想定読者
- Kubernetes にアプリケーションを配置する基礎を体系的に学びたいエンジニア
- kubectl / YAML / 代表的なリソース（Pod/Deployment/Service/Ingress）の理解を整理したい方

## 本書のスコープ
- 本書は「アプリを Kubernetes に載せる基礎」として、Pod / Deployment / Service / Ingress を中心に扱います。
- コンテナ基礎（名前空間/cgroups、イメージ、ネットワーク、ボリューム等）は深掘りせず、必要に応じて Podman 本を参照します: https://itdojp.github.io/podman-book/
- クラスタ設計・運用の深掘り（HA、アップグレード、監視基盤、運用設計等）は別冊に委譲します: https://itdojp.github.io/kubernetes-cluster-ops-book/

## 学習成果
- Kubernetes の宣言的管理と主要リソースの役割を理解する
- 最小構成のマニフェストを読み書きし、ローカルクラスタで動作確認できる
- 設計判断（ラベル設計、Probe、ロールアウト等）の論点を説明できる

## 前提知識
- Linux の基本操作（シェル、ファイル、ネットワークの基礎）
- HTTP の基本（ポート、ホスト名、TLS の概要）
- （推奨）コンテナの概念（イメージ/コンテナ、ポート、ボリューム）

## 所要時間
- 通読: 約2〜2.5時間（本文量ベース概算。コードブロック除外、400〜600文字/分換算）
- 章末のハンズオンまで実施する場合は、ローカル環境や試行回数により変動します。

## 目次
- [はじめに](introduction/)

## 本編

- [第0章：コンテナ基礎ダイジェスト](chapters/chapter00/)
- [第1章：Kubernetesの全体像](chapters/chapter01/)
- [第2章：ローカル環境とkubectl](chapters/chapter02/)
- [第3章：YAML基礎とメタデータ設計](chapters/chapter03/)
- [第4章：Pod設計](chapters/chapter04/)
- [第5章：Deploymentとロールアウト](chapters/chapter05/)
- [第6章：Serviceと名前解決](chapters/chapter06/)
- [第7章：Ingress](chapters/chapter07/)
- [第8章：ConfigMapとSecret](chapters/chapter08/)
- [第9章：ストレージ基礎](chapters/chapter09/)
- [第10章：基本トラブルシューティング](chapters/chapter10/)

## 付録

- [付録A：kubectlクイックリファレンス](appendices/appendix-a/)
- [付録B：マニフェストスニペット集](appendices/appendix-b/)
- [付録C：参考リンク集](appendices/appendix-c/)

## あとがき
- [あとがき](afterword/)

## ライセンス
本書は CC BY-NC-SA 4.0 で公開されています。商用利用は別途契約が必要です。
