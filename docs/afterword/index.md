---
layout: book
order: 16
title: "あとがき"
---
# あとがき

本書では、アプリケーションを Kubernetes に載せるための基礎として、Pod / Deployment / Service / Ingress を中心に整理しました。  
実務では、ここに加えて「運用（監視/ログ/復旧/変更管理）」を標準化しない限り、継続的な改善が難しくなります。

## まとめ
- Kubernetes の基本は「望ましい状態を宣言し、差分を収束させる」ことです。
- 主要リソースの役割分担（Pod/Deployment/Service/Ingress）を分けて考えると、設計判断が明確になります。
- YAML と metadata（Label/Selector/Namespace）の品質が、運用性に直結します。

## 次に読む
- [Kubernetesクラスタ設計・運用実践ガイド（運用編）](https://itdojp.github.io/kubernetes-cluster-ops-book/)
- [Podman完全ガイド（コンテナ基礎）](https://itdojp.github.io/podman-book/)

## フィードバック
- Issue: [GitHub Issues](https://github.com/itdojp/kubernetes-basics-book/issues)
- Email: knowledge@itdo.jp
