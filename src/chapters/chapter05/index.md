# 第5章：Deploymentとロールアウト

Deployment は、Pod を直接運用する代わりに「レプリカ維持」「更新」「ロールバック」を提供する基本リソースです。

## 学習目標
- Deployment / ReplicaSet / Pod の関係を説明できる
- ロールアウトの進行を観測し、失敗時にロールバックできる
- 更新戦略（maxSurge/maxUnavailable）の意味を説明できる

## 扱う範囲 / 扱わない範囲

### 扱う範囲
- Deployment の基本構造
- RollingUpdate の考え方
- rollout status/history/undo の基本
- スケール（replicas）

### 扱わない範囲
- Blue-Green/Canary の高度な戦略（ツール含む）
- HPA/VPA の設計

## Deployment の役割
- 望ましいレプリカ数（desired replicas）を維持します。
- Pod template の変更を検知し、段階的に更新します。
- 過去リビジョンを保持し、ロールバックできます。

## ロールアウトの観測
主に以下を利用します。

- `kubectl -n demo rollout status deploy/web`
- `kubectl -n demo rollout history deploy/web`
- `kubectl -n demo describe deploy web`

## ハンズオン：ロールアウトとロールバック（annotation で更新を発生させる）
1) `web` Deployment を作成します（第3章/付録B のものを利用してください）。

2) ロールアウト状態を確認します。

```bash
kubectl -n demo rollout status deploy/web
kubectl -n demo get rs
```

3) Pod template に annotation を追加して更新を発生させます。

```bash
kubectl -n demo patch deploy web -p '{"spec":{"template":{"metadata":{"annotations":{"rollme":"1"}}}}}'
kubectl -n demo rollout status deploy/web
kubectl -n demo get rs
```

4) 履歴を確認します。

```bash
kubectl -n demo rollout history deploy/web
```

5) ロールバックします。

```bash
kubectl -n demo rollout undo deploy/web
kubectl -n demo rollout status deploy/web
```

## よくある落とし穴
- Pod を直接作って更新しようとする（再現性が崩れる）
- rollout が完了する前に次の変更を入れ、状態が読めなくなる
- readiness が整備されていない状態でローリングアップデートし、サービス品質を落とす

## まとめ / 次に読む
- 次に読む: [第6章：Serviceと名前解決](../chapter06/)
