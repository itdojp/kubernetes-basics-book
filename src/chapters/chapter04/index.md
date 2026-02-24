# 第4章：Pod設計

Pod は Kubernetes におけるコンテナ実行の最小単位です。本章では、Pod の設計における最低限の観点（複数コンテナ、Probe、Resources）を整理します。

## 学習目標
- Pod と Container の関係を説明できる
- readinessProbe / livenessProbe / startupProbe の違いと使い分けを説明できる
- requests/limits の目的と、最低限の設定方針を説明できる

## 扱う範囲 / 扱わない範囲

### 扱う範囲
- Pod/Container の構造
- Init Container / Sidecar の位置付け（入口）
- Probe（Readiness/Liveness/Startup）
- Resources（requests/limits、QoS の入口）

### 扱わない範囲
- 高度なサイドカー設計（サービスメッシュ等）
- ポリシーの全体設計（PSS/OPA 等）

## Pod とは
- Pod は「同じノード上で、同じネットワーク名前空間を共有するコンテナ群」をまとめる単位です。
- 同一 Pod 内のコンテナは `localhost` で通信できます。
- Pod は原則として短命です。直接運用の正にせず、Deployment 等で管理します。

## Init Container と Sidecar（入口）
- Init Container: アプリ起動前の準備（マイグレーション、設定生成等）
- Sidecar: アプリの補助（ログ転送、プロキシ等）

設計のポイント:
- 追加コンテナの依存関係と、失敗時のふるまい（再試行/停止/影響範囲）を明示します。

## Probe（Readiness/Liveness/Startup）
- Readiness: 「Service の宛先に入れてよいか」
- Liveness: 「プロセスが生存しているか」
- Startup: 「起動完了前の猶予」

最低限の指針:
- Service を使う場合、Readiness を優先して整備します。
- Liveness は誤検知すると再起動ループになるため、根拠のある条件のみ設定します。
- 起動に時間がかかる場合、StartupProbe を使って Readiness/Liveness の誤判定を避けます。

## Resources（requests/limits の入口）
- requests: スケジューリングの前提（この量を確保できるノードに配置されます）
- limits: 上限（メモリは超過すると OOMKill、CPU はスロットリング）
- requests/limits の組み合わせで QoS クラスが決まります（Guaranteed/Burstable/BestEffort）

最低限の指針:
- 最初は小さめの requests を置き、計測して調整します。
- メモリ limits は「上限として意味がある」値を置きます（低すぎると OOM が増えます）。

## ハンズオン：Probe と Resources を入れた Deployment
本節では、`demo` namespace に `web` Deployment を作り、Probe と Resources が反映されていることを確認します。

補足:
- 既に `web` Deployment が存在する場合は、以下を `apply` して更新します（`spec.selector` が一致していることが前提です）。

1) Deployment を適用します（Probe + Resources）。

```bash
kubectl apply -f - <<'YAML'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: demo
  labels:
    app.kubernetes.io/name: web
    app.kubernetes.io/instance: demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: web
      app.kubernetes.io/instance: demo
  template:
    metadata:
      labels:
        app.kubernetes.io/name: web
        app.kubernetes.io/instance: demo
    spec:
      containers:
        - name: web
          image: nginx:stable
          ports:
            - containerPort: 80
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 3
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 10
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
YAML
kubectl -n demo rollout status deploy/web
kubectl -n demo get pod -o wide
```

2) Pod の詳細を確認します。

```bash
kubectl -n demo describe pod -l app.kubernetes.io/name=web,app.kubernetes.io/instance=demo
```

## よくある落とし穴
- readinessProbe を設定せず、起動直後にトラフィックが入り障害になる
- livenessProbe を強くしすぎて、起動中や一時的な負荷で再起動ループになる
- requests を設定せず、ノード逼迫時にスケジューリングや安定性が崩れる

## まとめ / 次に読む
- 次に読む: [第5章：Deploymentとロールアウト](../chapter05/)
