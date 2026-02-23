---
layout: book
order: 10
title: "第8章：ConfigMapとSecret"
---
# 第8章：ConfigMapとSecret

アプリケーション設定をコンテナイメージに埋め込むと、環境差分や秘密情報の取り扱いが困難になります。  
Kubernetes では ConfigMap/Secret を使い、設定を外部化して注入します。

## 学習目標
- ConfigMap と Secret の目的と違いを説明できる
- 環境変数/ファイルマウントの注入パターンを使い分けられる
- Secret を Git に平文で置かない運用の前提を理解する

## 扱う範囲 / 扱わない範囲

### 扱う範囲
- ConfigMap と Secret の基本
- 注入パターン（env / envFrom / volume mount）
- 変更時の注意点（再起動が必要になるケース）

### 扱わない範囲
- 外部シークレット管理（KMS/Vault/External Secrets 等）の詳細
- 暗号化 at rest の設計（運用編で扱う）

## ConfigMap
- 非秘密情報を扱います（設定値、フラグ、テンプレ等）。
- `data` はキー/値（文字列）です。
- サイズや更新頻度を考慮します（大きなバイナリは置きません）。

## Secret
- 秘密情報を扱います（パスワード、トークン等）。
- `data` は base64 で格納されますが、暗号化ではありません。
- Git にコミットする運用は原則避けます（少なくとも平文で管理しません）。

## 注入パターン
- env: 個別キーを環境変数へ注入
- envFrom: ConfigMap/Secret 全体をまとめて環境変数へ注入
- volume: ファイルとしてマウント（証明書等に向く）

## ハンズオン：ConfigMap/Secret を注入する
前提: `demo` namespace に Deployment `web` が存在していること。

1) ConfigMap を作成します。

```bash
kubectl -n demo create configmap web-config --from-literal=APP_ENV=dev
kubectl -n demo get configmap web-config
```

2) Secret を作成します。

```bash
kubectl -n demo create secret generic web-secret --from-literal=password=change-me
kubectl -n demo get secret web-secret
```

3) Deployment に注入します（`envFrom` と Secret の volume mount を追加します）。

```bash
kubectl -n demo patch deploy web --type strategic -p '{"spec":{"template":{"spec":{"containers":[{"name":"web","envFrom":[{"configMapRef":{"name":"web-config"}}],"volumeMounts":[{"name":"secret","mountPath":"/etc/secret","readOnly":true}]}],"volumes":[{"name":"secret","secret":{"secretName":"web-secret"}}]}}}}'
kubectl -n demo rollout status deploy/web
```

4) Pod で確認します。

```bash
POD=$(kubectl -n demo get pod -l app.kubernetes.io/name=web,app.kubernetes.io/instance=demo -o name | head -n 1)
kubectl -n demo exec -it "$POD" -- sh -c 'env | grep APP_ENV || true'
kubectl -n demo exec -it "$POD" -- sh -c 'ls -la /etc/secret && cat /etc/secret/password'
```

## よくある落とし穴
- Secret の base64 を暗号化と誤解し、平文に近い形で配布してしまう
- 設定変更時に Pod の再起動が必要なパターンを見落とす
- 設定を増やしすぎて、どこが正（source of truth）か分からなくなる

## まとめ / 次に読む
- 次に読む: [第9章：ストレージ基礎](../chapter09/)
