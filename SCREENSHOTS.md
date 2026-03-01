# スクリーンショット方針（本書）

本書は Markdown の code block を一次情報とし、スクリーンショットは「実行すると何が表示されるか」「どこを確認すべきか」を補助する目的で追加する。

## 対象環境（推奨）

- OS: Ubuntu 24.04 LTS
- 端末: 1カラム + Light（例: GNOME Terminal）
- フォント: JetBrains Mono 14pt（相当の等幅フォントで可）
- 画面幅: 横スクロールが発生しない幅（目安: 1200px 以上）

※ 取得環境が異なる場合でも、コマンド出力とキャプションで差分が出ないように調整する。

## マスキング（必須）

スクリーンショットに写り得る以下の情報は必ず無害化する。

- 組織名、プロジェクト名、チーム名などの識別子
- クラスタ名、コンテキスト名
- ユーザー名、ホームパス
- メールアドレス、アカウントID、社員番号などの個人識別子
- 社内ドメイン、内部ホスト名（FQDN を含む）、IP
- トークン、APIキー、Cookie、セッションID
- レジストリURL、クラウドアカウントID
- Namespace 名、テナントID 等（必要に応じて）

補足:
- `kubectl config view` 等、秘密情報が出やすいコマンドは原則スクリーンショット化しない。

## 配置と命名

- 配置: `src/chapters/chapterXX/images/`（章ごとに配置し、相対パスで参照する）
  - `npm run build` で `src/` 配下の画像（非 Markdown ファイル）を `docs/` に同期するため、`dist/` にも含まれる
- 形式: PNG（必要に応じて WebP）
- 命名: `chXX-<topic>-NN.png`
  - `XX`: 章番号（2桁）
  - `topic`: 英小文字の kebab-case（例: `kind-create`）
  - `NN`: 2桁（章内の並び順）
  - 例: `ch02-kind-create-01.png`

## 本文への埋め込み

- 画像には alt text と短いキャプション（「何を示すか」「どこを見るか」）を付ける。
- 「作業 → 確認 → 結果」が 1 セットの最小単位になるように配置する。
- 余計なUI（ブラウザタブ、通知、プロンプト履歴など）は写さず、要点が読める範囲でトリミングする。

## 追加後の確認

1. 画像を配置し、本文から参照を追加
2. `npm run build`
3. `npm run serve` で表示崩れ/リンク切れがないことを確認

## スクリーンショット候補チェックリスト（章別）

本セクションは Issue #7 の内容を、本文の手順に沿って「何を撮るか」「前提状態」を章別に整理したチェックリストです（画像追加は別PRで実施）。

補足:
- CLI 例は `kubectl -n demo ...` のように namespace を明示し、コンテキスト依存を減らす。
- `demo` namespace / `web` Deployment / `web` Service は複数章で共通に登場するため、スクリーンショット取得前に状態を揃える。

### 第0章：コンテナ基礎ダイジェスト

前提（例）:
- Docker または Podman が利用可能
- Nginx イメージ取得が可能（ネットワーク/プロキシ等）

- [ ] 端末: `docker version` / `podman version` の出力（実行環境が分かる）
- [ ] 端末: pull → run →（到達確認）→ logs → stop の最小フロー（Nginx で HTTP 応答が返る）

### 第1章：Kubernetesの全体像

前提（例）:
- `kubectl` インストール済み
- クラスタへ接続できる kubeconfig/context が選択済み

- [ ] 端末: `kubectl version --client`（クライアント確認）
- [ ] 端末: `kubectl cluster-info`（接続先確認）
- [ ] 端末: `kubectl get nodes`（ノード一覧）

### 第2章：ローカル環境とkubectl

前提（例）:
- `kind` が利用可能
- kind の port mapping（`8080/8443`）を含む `kind.yaml` を作成する

- [ ] エディタ: `kind.yaml` の作成（port mapping が分かる）
- [ ] 端末: `kind create cluster --config kind.yaml` の実行結果
- [ ] 端末: `kubectl cluster-info` / `kubectl get nodes -o wide`（クラスタ作成後の最小確認）
- [ ] 端末: namespace 一覧/指定の例（`kubectl get ns` / `kubectl -n demo get ...`）
- [ ] （任意）GUI: kind ノードコンテナが見える画面（Docker Desktop / Podman Desktop の Containers 画面）

### 第3章：YAML基礎とメタデータ設計

前提（例）:
- `demo` namespace にサンプルの Deployment 等を作成できる状態

- [ ] エディタ: YAML の構造（`apiVersion/kind/metadata/spec`）が分かる状態
- [ ] エディタ: labels と selector の対応関係が分かる状態
- [ ] 端末: `kubectl -n demo get deploy,pod --show-labels`（labels の確認）

### 第4章：Pod設計

前提（例）:
- `demo` namespace に対象 Pod が存在し、describe で情報が取れる

- [ ] 端末: `kubectl -n demo describe pod ...` の主要部（Probe/resources/Conditions/Events）

### 第5章：Deploymentとロールアウト

前提（例）:
- `demo` namespace に Deployment `web` が存在し、ロールアウトが発生する差分を適用できる

- [ ] 端末: `kubectl -n demo rollout status deploy/web`（進行状況）
- [ ] 端末: `kubectl -n demo rollout history deploy/web`（履歴）
- [ ] 端末: `kubectl -n demo get rs,pod`（ReplicaSet と Pod の切替が分かる状態）

### 第6章：Serviceと名前解決

前提（例）:
- `demo` namespace に Service `web` が存在し、Pod から名前解決できる

- [ ] 端末: `kubectl -n demo get svc` / `kubectl -n demo describe svc web`
- [ ] 端末: `kubectl -n demo get endpointslice`（エンドポイント確認）
- [ ] 端末: Pod 内での名前解決確認（`kubectl -n demo exec ... -- nslookup web` 等）

### 第7章：Ingress

前提（例）:
- kind の port mapping によりホスト側 `8080/8443` で到達できる
- ingress-nginx が導入済みで Ready
- `demo` namespace に `web` Deployment/Service が存在

- [ ] 端末: `kubectl -n ingress-nginx get pod`（Ready が分かる）
- [ ] 端末: `kubectl -n demo get ingress` / `kubectl -n demo describe ingress web`
- [ ] 端末: 到達確認（`curl -fsS -H 'Host: web.local' http://localhost:8080/` の結果）
- [ ] （任意）ブラウザ: `http://web.local:8080/` の表示（hosts 追記を行う場合）

### 第8章：ConfigMapとSecret

前提（例）:
- `demo` namespace に ConfigMap/Secret を作成済み
- Pod に環境変数注入/ファイルマウントが設定済み

- [ ] 端末: `kubectl -n demo get configmap,secret`
- [ ] 端末: ConfigMap の反映確認（`kubectl exec ... -- env` 等で該当箇所が見える）
- [ ] 端末: Secret のマウント確認（`kubectl exec` でマウントファイルを確認。値は極力表示しない）

### 第9章：ストレージ基礎

前提（例）:
- `demo` namespace で PVC を作成し、PV と binding される環境（例: kind の標準 StorageClass）

- [ ] 端末: `kubectl -n demo get pvc,pv` / `kubectl -n demo describe pvc ...`
- [ ] 端末: Events（Binding/Attach/Mount）が分かる状態

### 第10章：基本トラブルシューティング

前提（例）:
- 意図的に異常状態を再現できる（例: 存在しない image、誤った設定、リソース不足等）

- [ ] 端末: `kubectl get pod` の典型異常状態（CrashLoopBackOff / ImagePullBackOff / Pending 等）
- [ ] 端末: `kubectl describe pod ...` の Events 抜粋（原因の手掛かりが分かる）
- [ ] 端末: `kubectl logs ...` の典型例（エラーが分かる）
- [ ] 端末: `kubectl get events --sort-by=...`（時系列/優先度で追える）
