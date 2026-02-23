# 第9章：ストレージ基礎

PV/PVC/StorageClass、Statefulの入口

## 学習目標
- （例）この章の主要概念を説明できる
- （例）最小構成のマニフェストを読み書きできる

## 扱う範囲 / 扱わない範囲

### 扱う範囲
- （例）基本概念、代表的な設計判断、最低限の動作確認

### 扱わない範囲
- （例）クラスタ設計/運用の深掘り（別冊「Kubernetesクラスタ設計・運用実践ガイド」を参照）

## 前提知識・準備
- kubectl の基本操作（未習の場合は第2章を先に参照）
- （推奨）コンテナ基礎（詳細は Podman 本を参照）: https://itdojp.github.io/podman-book/

## 章の要点
- （要点）
- （要点）
- （要点）

## ハンズオン（最小）

### 1. 状態確認
```bash
kubectl version --client
kubectl get ns
```

### 2. 最小マニフェスト（例）
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello
spec:
  containers:
    - name: hello
      image: nginx:stable
      ports:
        - containerPort: 80
```

## よくある落とし穴
- （例）Label/Selector の不整合により、意図した Service 配下にならない
- （例）Probe/Resource 未設定のまま本番相当で運用してしまう

## まとめ / 次に読む
- 次に読む: 第10章：基本トラブルシューティング（/chapters/chapter10/）
