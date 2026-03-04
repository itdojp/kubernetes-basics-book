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
- 複数リソースを 1 ファイルで管理する場合は `---` で区切ります。

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

置換ポイント（例）:
- `metadata.name` / `metadata.namespace`
- `spec.rules[].host`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
  namespace: demo
spec:
  ingressClassName: nginx
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

補足:
- `ingressClassName` の要否や値は環境により異なります（デフォルトの IngressClass が設定済み、別の Controller を利用、など）。

## ConfigMap（環境変数で注入）

構成:
- ConfigMap
- Deployment（環境変数の注入例）

置換ポイント（例）:
- ConfigMap: `metadata.name` / `metadata.namespace` / `data`
- Deployment: `metadata.name` / `metadata.namespace` / 参照する ConfigMap 名（`envFrom.configMapRef.name`）

### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: web-config
  namespace: demo
data:
  APP_ENV: "dev"
```

### Deployment 側（envFrom で注入）
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

### まとめて apply したい場合（multi-doc YAML）
ConfigMap と Deployment を `---` で区切って、まとめて適用できます。

```bash
kubectl apply -f - <<'YAML'
apiVersion: v1
kind: ConfigMap
metadata:
  name: web-config
  namespace: demo
data:
  APP_ENV: "dev"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: demo
spec:
  replicas: 1
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
          ports:
            - containerPort: 80
YAML
```

## Secret（ファイルとしてマウント）

構成:
- Secret
- Deployment（マウント例）

置換ポイント（例）:
- Secret: `metadata.name` / `metadata.namespace` / `stringData`
- Deployment: `metadata.name` / `metadata.namespace` / 参照する Secret 名（`volumes[].secret.secretName`）

### Secret
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

### Deployment 側（volumeMounts / volumes）
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

### まとめて apply したい場合（multi-doc YAML）
Secret と Deployment を `---` で区切って、まとめて適用できます。

```bash
kubectl apply -f - <<'YAML'
apiVersion: v1
kind: Secret
metadata:
  name: web-secret
  namespace: demo
type: Opaque
stringData:
  password: "change-me"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: demo
spec:
  replicas: 1
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
          ports:
            - containerPort: 80
      volumes:
        - name: secret
          secret:
            secretName: web-secret
YAML
```

## 注意
- `nginx:stable` は学習用途の例です。本番ではイメージの固定（digest 参照等）を検討してください。
- Ingress の到達確認方法は環境により異なります（本書の第7章を参照してください）。
