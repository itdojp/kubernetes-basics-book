# 第9章：ストレージ基礎

Pod は短命であり、コンテナのファイルシステムは原則として揮発的です。  
永続化が必要なデータ（DB、キュー、アップロードファイル等）は、Volume/PV/PVC を用いて管理します。

## 学習目標
- PV/PVC/StorageClass の役割分担を説明できる
- 動的プロビジョニングの概念を説明できる
- 学習環境（kind）でストレージ検証する際の注意点を理解する

## 扱う範囲 / 扱わない範囲

### 扱う範囲
- Volume/PV/PVC/StorageClass の基本
- 動的プロビジョニング（概念と入口）
- Stateful ワークロードの入口（StatefulSet の位置付け）

### 扱わない範囲
- 特定ストレージ製品の詳細設計（性能/冗長/バックアップ機構の深掘り）
- 本番のデータ保護設計（運用編で扱う）

## 用語整理（最小）
- Volume: Pod にマウントされるストレージ（抽象）
- PersistentVolume（PV）: クラスタ側のストレージリソース
- PersistentVolumeClaim（PVC）: 利用側（namespace 側）の要求
- StorageClass: 動的プロビジョニングのクラス（どのプロビジョナで作るか）

## 動的プロビジョニング
クラウド環境では、PVC を作成すると StorageClass に応じて PV が自動作成される構成が一般的です。  
一方、学習用のローカルクラスタ（kind 等）では、ストレージプロビジョナが入っていないことがあります。

## ハンズオン（任意）: kind で動的プロビジョニングを有効化する
kind では、学習用途として local-path-provisioner を導入する方法があります。

1) local-path-provisioner を導入します。

```bash
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.34/deploy/local-path-storage.yaml
kubectl get storageclass
```

2) StorageClass `local-path` をデフォルトに設定します（必要な場合）。

```bash
kubectl patch storageclass local-path -p '{\"metadata\":{\"annotations\":{\"storageclass.kubernetes.io/is-default-class\":\"true\"}}}'
kubectl get storageclass
```

3) PVC を作成します。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: web-pvc
  namespace: demo
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: local-path
```

4) PVC が Bound になることを確認します。

```bash
kubectl -n demo get pvc web-pvc
```

## よくある落とし穴
- 学習環境にストレージプロビジョナがなく、PVC が Pending のままになる
- 永続化が必要なデータを emptyDir に置いてしまう（再スケジュールで消える）
- ストレージの責任範囲（バックアップ、復旧、SLA）を曖昧にしたまま本番運用する

## まとめ / 次に読む
- 次に読む: [第10章：基本トラブルシューティング](../chapter10/)
