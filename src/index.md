# Kubernetes入門：PodからIngressまで（基礎と実践）

Pod / Deployment / Service / Ingress を中心に、アプリケーションを Kubernetes に載せるための基礎と実践を整理します。

## 想定読者
- Kubernetes にアプリケーションを配置する基礎を体系的に学びたいエンジニア
- kubectl / YAML / 代表的なリソース（Pod/Deployment/Service/Ingress）の理解を整理したい方

## 本書のスコープ
- 本書は「アプリを Kubernetes に載せる基礎」として、Pod / Deployment / Service / Ingress を中心に扱います。
- コンテナ基礎（名前空間/cgroups、イメージ、ネットワーク、ボリューム等）は深掘りせず、必要に応じて Podman 本を参照します: https://itdojp.github.io/podman-book/
- クラスタ設計・運用の深掘り（HA、アップグレード、監視基盤、運用設計等）は別冊に委譲します: https://itdojp.github.io/kubernetes-cluster-ops-book/

## 実務適用前の Kubernetes 基礎レビューゲート

本書のサンプルをラボからチーム検証・準本番へ持ち込む前に、次の観点を確認してください。
2026-05-23（Asia/Tokyo）時点の Kubernetes 公式リリースでは、最新系列は v1.36、サポート対象のマイナー系列は v1.36 / v1.35 / v1.34 です。

- [ ] `kubectl version --client` と対象クラスタの `kube-apiserver` 版を記録し、kubectl が API server の前後 1 minor 以内であることを確認した
- [ ] 本書の v1.35 系ハンズオンを v1.36 系または管理クラスタで使う場合、公式リリースノートと version skew policy を確認した
- [ ] Namespace、Label/Selector、ServiceAccount/RBAC の責任範囲を決め、`default` namespace へ作業を集約しない
- [ ] Pod には Probe、resources、必要最小限の securityContext を検討し、Pod Security Admission / Pod Security Standards との関係を確認した
- [ ] Secret は base64 であって暗号化ではない前提で扱い、Git へ平文相当の値を残さない
- [ ] Ingress は Controller が必須であり、Ingress API が凍結されていることと Gateway API の位置づけを確認した

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
