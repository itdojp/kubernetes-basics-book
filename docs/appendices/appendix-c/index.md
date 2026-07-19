---
layout: book
order: 15
title: "付録C：参考リンク集"
---
# 付録C：参考リンク集

本書の内容を補完するための、一次情報（公式ドキュメント）と周辺ツールのリンク集です。実装の保守状況、API の版、conformance の結果は変動するため、利用時点で公式情報を確認してください。

## Kubernetes 公式ドキュメント
- 概要（Concepts）: https://kubernetes.io/docs/concepts/
- リリース情報: https://kubernetes.io/releases/
- Version skew policy: https://kubernetes.io/releases/version-skew-policy/
- ワークロード（Workloads）: https://kubernetes.io/docs/concepts/workloads/
- サービス/ネットワーク: https://kubernetes.io/docs/concepts/services-networking/
- Pod Security Admission: https://kubernetes.io/docs/concepts/security/pod-security-admission/
- Pod Security Standards: https://kubernetes.io/docs/concepts/security/pod-security-standards/
- kubectl リファレンス: https://kubernetes.io/docs/reference/kubectl/
- API リファレンス: https://kubernetes.io/docs/reference/

## ローカルクラスタ
- kind: https://kind.sigs.k8s.io/
- minikube: https://minikube.sigs.k8s.io/docs/

## Ingress / Gateway API の現行方針
- Ingress: https://kubernetes.io/docs/concepts/services-networking/ingress/
- Gateway API: https://kubernetes.io/docs/concepts/services-networking/gateway/
- Gateway API implementation 一覧（implementation ごとの対応版・profile・conformance 状況）: https://gateway-api.sigs.k8s.io/docs/implementations/list/
- Gateway API conformance（release channel、support level、conformance test/report）: https://gateway-api.sigs.k8s.io/docs/concepts/conformance/
- Ingress NGINX の retirement 発表: https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/

この本の ingress-nginx controller-v1.14.3 は、2026年3月に retired となった**歴史的な学習用（historical lab-only）**の例です。以後はリリース、bugfix、**セキュリティ修正が提供されず、本番利用は推奨しません**。新規の学習・本番設計では Gateway API を出発点とし、保守中の implementation の公式ドキュメントと、上記の公式 implementation/conformance 情報を照合してください。本書は特定製品を推奨しません。

旧版の手順や成果物を参照する場合も、現行構成と混同せず、セキュリティポリシー、サポート期間、対象 bundle/profile/Route の適合性を別途確認してください。

## 周辺ツール（任意）
- k9s（TUI）: https://k9scli.io/
- kubectx / kubens（context/namespace 切替）: https://github.com/ahmetb/kubectx

## 次に読む
- Kubernetes クラスタ設計・運用実践ガイド（運用編）: https://itdojp.github.io/kubernetes-cluster-ops-book/
- Podman完全ガイド（コンテナ基礎）: https://itdojp.github.io/podman-book/

## 関連ページ
- [付録D：実務チェックリストとトラブルシュート導線](../appendix-d/)
- [付録E：図版索引](../appendix-e/)
