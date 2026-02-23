---
layout: book
order: 14
title: "付録B：マニフェストスニペット集"
---
# 付録B：マニフェストスニペット集

本文中で利用する代表的な YAML パターンを、コピペ可能な形でまとめます。  
本付録は「最小構成」を優先し、実運用で必要となる追加項目（監視/セキュリティ/ポリシー等）は運用編で扱います。

## 使い方
- まず `metadata.name` / `metadata.namespace` / labels を自分の環境に合わせて置換します。
- Selector に使う labels は、Deployment/Service/Ingress で整合させます。
- 複数リソースを1ファイルで管理する場合は `---` で区切ります。

## Namespace
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: demo
```

## 共通ラベル（推奨）
```yaml
metadata:
  labels:
    app.kubernetes.io/name: web
    app.kubernetes.io/instance: demo
```

## Deployment（最小）
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: demo
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
```

## Deployment（Probe + Resources の入口）
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: demo
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
          resources:
            requests:
              cpu: 50m
              memory: 64Mi
            limits:
              cpu: 200m
              memory: 256Mi
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
```

## Service（ClusterIP）
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web
  namespace: demo
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: web
    app.kubernetes.io/instance: demo
  ports:
    - name: http
      port: 80
      targetPort: 80
```

## Ingress（HTTP ルーティングの最小）
前提: Ingress Controller がクラスタに導入済みであること。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
  namespace: demo
spec:
  rules:
    - host: web.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web
                port:
                  number: 80
```

## ConfigMap（環境変数で注入）
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: web-config
  namespace: demo
data:
  APP_ENV: "dev"
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: demo
spec:
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
          envFrom:
            - configMapRef:
                name: web-config
```

## Secret（ファイルとしてマウント）
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: web-secret
  namespace: demo
type: Opaque
stringData:
  password: "change-me"
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: demo
spec:
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
          volumeMounts:
            - name: secret
              mountPath: /etc/secret
              readOnly: true
      volumes:
        - name: secret
          secret:
            secretName: web-secret
```

## 注意
- `nginx:stable` は学習用途の例です。本番ではイメージの固定（digest 参照等）を検討してください。
- Ingress の到達確認方法は環境により異なります（本書の第7章を参照してください）。
