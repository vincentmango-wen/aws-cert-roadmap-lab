# AIDD 合作型試點 v0.2

這是一個 repo、一份任務契約、一個驗證 profile、一個固定 CLI 與一份任務 evidence bundle。不是 Supervisor、安全沙箱或自動部署平台。規約要求 Agent 遵守範圍；CLI 只管理自己的驗證，不攔截整個聊天的寫入。

## 執行前

使用 Node **22.13.0** 和 npm **10.9.2**（隨該 Node 版本）。不修改部署環境或另一份 pnpm lockfile。先確認工作區／既有變更並使用隔離 checkout。契約位於 `docs/aidd/task.json`，profile 位於 `tools/aidd/profile.json`；新任務必須由使用者批准契約與唯一任務 ID，不能重命名原任務來重置額度。 任務歸屬與獨立額度依下方已核准規則辦理；PR 與其對應 issue 視為同一任務。

本機驗證清除任意繼承環境，只保留基本 OS 路徑及明列的 CI、telemetry 設定；不記錄完整環境或憑證。含實際 dotenv 的驗證工作區會受阻。此 profile 不重現遠端 API/site/analytics 環境，Windows 通過不代表 Ubuntu CI 通過或可部署。

## 固定入口

人工觸發的三語內容／新增題任務可使用 [內容契約](content-contract.md)。`init` 可在 ROOT 後指定 repo 內的契約路徑；未指定時沿用以下預設。這不啟動排程或發布。

在 repo 根目錄使用下列命令（bundle 可放忽略的 `tmp/` 或 repo 外；不要將它公開提交）：

```powershell
node tools/aidd/cli.mjs init tmp/aidd-evidence .
node tools/aidd/cli.mjs verify tmp/aidd-evidence baseline
# 已批准範圍內實作。必要時在開始修復前登記：
node tools/aidd/cli.mjs repair tmp/aidd-evidence "問題" "修正假設" "預期結果"
node tools/aidd/cli.mjs verify tmp/aidd-evidence candidate
node tools/aidd/cli.mjs status tmp/aidd-evidence
```

驗證每次執行 `npm ci --no-audit --no-fund` 以 lockfile 重建依賴，然後跑 Harness fixtures、lint、typecheck、Vitest JSON、build（含 locale seal）、HTML lang check。略過的是 npm 安裝時的 audit 查詢與募資提示，不是既有工程驗收。安全性 audit 為另行評估項目。

profile 中的單一命令逾時是試點技術預設，不是已批准的任務總時間限制。沒有 30 分鐘硬限制；每個檢查記錄實測耗時，Agent 在下一輪前須保留完整最終驗證時間。

## 修復與狀態

### 已審查的基線 revision

使用者已核准必要測試／契約調整時，可先產生審查快照，再執行最小 `rebaseline`。這不是批准命令，也不是重置修復次數的手段；同一任務 ID、registry、全部 repairs 及歷史 evidence 必須保留。

```powershell
node tools/aidd/cli.mjs review-rebaseline tmp/weekly-evidence docs/aidd/tasks/weekly-2026-11-09.json "Reviewed article contracts and authorized Harness extension"
# 將輸出保存於忽略的 tmp/，檢查完整 changes、sourceHash、previousTaskHash、contract。
# assertionReplacements 只接受每個 check 內明列的一對一更名；不得刪除或合併原測試要求。
node tools/aidd/cli.mjs rebaseline tmp/weekly-evidence tmp/rebaseline-review.json
node tools/aidd/cli.mjs verify tmp/weekly-evidence baseline
```

審查快照產生後，來源或 task metadata 改變會使快照失效。Profile 變更、缺少成功原基線、active operation、STOP_UNCONFIRMED、replay bundle 均拒絕。新基線必須保留所有既有 assertion；原先通過的不能消失或變 skip，新 assertion 必須通過。既有 skip 身分保留且可轉為 passed，不默許新增 skip。前一 revision 未完成成功基線前不能再 rebaseline。

每次 revision 封存舊 contract/profile/engine/initial/content baseline/task、審查快照與所有歷史 run seals。status 仍驗證這些歷史證據。切換中斷會保留 exclusive active marker，需人工調解；不得刪 marker 假裝完成。此機制仍為合作型 hash 漂移偵測，不是防竄改安全邊界。

限制：目前 `replay` 只選取最新 revision 的 baseline/latest。歷史 revision 保留可檢查的來源與 seals，但尚無 CLI 選取舊 revision 重跑的功能；不要把封存完整性宣稱成歷史 replay 通過。一般 verify/status 仍拒絕未審查的目前 engine drift。

基線失敗先暫停功能實作；範圍內可用同一任務剩餘額度修復，範圍外／需要改驗收或擴權則停止報告。一次修復從開始一組修正動作算起，包含其驗證；中斷仍占次數。新方案算下一次。純診斷和未變更重跑不算修復，仍應留紀錄。修 bug 任務第一次修正也計次。

### 任務歸屬與修復額度（2026-11-16 核准）

- 每個範圍獨立且經使用者授權的 PR 或 issue 任務，各有三次修復額度，包含該任務基線與驗證工具的修正。實作前須記錄目標、驗收條件、相關 PR／issue、前置任務及修復紀錄。PR 與其對應 issue 是同一任務，不是兩份額度。多個 issue 若以同一組完整變更處理，須共用一份額度。
- 任務身分依實際問題與驗收條件判定，不依標籤或承載方式判定。同一未解決工作即使延續、重開、替換、拆分，或移至另一個 issue、PR、分支、執行批次、bundle、worktree 或 clone，也不會取得新額度。審查修正及該工作造成的回歸問題仍歸屬原任務。即使在同一對話中，真正獨立的目標仍可有自己的額度，但須記錄其獨立原因。若歸屬不明，先診斷，並在修正前取得使用者釐清。
- 修 bug 任務的第一次修正也計次。一次修復從開始一組修正動作算起，包含其驗證；中斷仍占用該次額度。採用不同修正方案時，開始計算下一次。純診斷、未變更重跑，以及負向測試 fixture 中預期發生的失敗不占修復額度，但仍須記錄。
- 超過任務的三次額度前，須回報證據、原因、擬議修正與風險，並取得使用者對範圍明確之額外一次修復的明確授權。提交或審查不會重置次數。一次性例外不代表授權後續修復。
- 本規則自明確核准後向前適用。保留全部既有次數、例外及證據；不得追溯拆分或重新編號已記錄的修復。進行中任務若要轉換適用方式，須由使用者明確決定，並連同既有歷史一併記錄。

實作前，在已審查的契約或附屬紀錄中記載任務歸屬。比較它與前置任務的目標、驗收條件及因果關係；只有新識別碼不能證明獨立性。PR 與其對應 issue 須連至同一份修復紀錄。CLI 保留 `maxRepairs: 3`，不提供重置或增加額度的命令；實質獨立性與任何範圍明確的例外都須經人工審查。保留比較連結／Blog 任務原有的 3/3，以及已授權的第 4、5 次例外，不授予該任務更多修復額度。

目前唯一正式規則來源為專案根目錄的 [AGENTS.md](../../AGENTS.md)。本檔依使用者於 2026-11-16 的明確要求使用繁體中文；保留必要技術名詞與指令。

同一 Git common directory 以任務 ID 登記 bundle，重開 bundle 或 linked worktree 不能重設該任務。這仍是合作型限制：另 clone／改 ID 或手動改紀錄不是強制防護能阻止的事，規約禁止如此繞過。重跑快照繼承修復計數與原始測試身分。

Replay bundle 僅供驗證，拒絕 `repair`，不能分叉原任務的剩餘修復額度。狀態查詢同時檢查基線與最新證據的完整性。

狀態：`CREATED` → `BASELINE_READY` → `AUTO_VERIFIED_AWAITING_HUMAN`。修復為 `REPAIRING`；失敗／能力缺口為 `BLOCKED_BASELINE`、`CHECKS_FAILED`、`VERIFICATION_BLOCKED`；越界為 `NEEDS_DECISION`；來源漂移為 `INPUT_DRIFT`；證據遺失或改變為 `EVIDENCE_INVALID`。

人工驗收永遠單列 pending，沒有 Agent 可呼叫的「使用者接受」命令。程序中斷留下 `active.json`，狀態為 `INTERRUPTED`，拒絕疊加執行。人須確認遺留程序、契約與檔案，再保存說明後調解狀態；不能單純刪紀錄來假裝完成。

命令逾時只嘗試終止直接子程序，不能證明所有後代已停，回報 `STOP_UNCONFIRMED` 並禁止重跑。這是明列能力缺口，強制程序樹管理留待 Supervisor。

## 證據與重跑

bundle 保存契約/profile、固定 engine、初始 manifest、修復及事件紀錄；每 run 有來源快照、驗證前後 manifest、受限環境識別、原始 stdout/stderr、檢查退出碼／耗時、Vitest 身分／狀態和 seal。未提交及未追蹤來源納入，刪除由 manifest 缺項表示。既有非任務修改不清理、不覆蓋。`.next`、`out` 等批准生成物與證據本身不當成來源。

必要測試的身分與 skip 狀態對照成功基線；未知格式、空報告、重複身分或非預期 skip 受阻，不以退出碼零取代完整驗收。驗證器、helper、設定、lockfile、必要測試變更需審查及重建基線，不能自行豁免。

使用 bundle 內固定 engine 重跑已封存的 latest 或 baseline run；目的地必須不存在，會建立獨立來源與證據並安裝依賴：

```powershell
node tmp/aidd-evidence/engine/cli.mjs replay tmp/aidd-evidence RUN_ID C:/path/to/new-replay-directory
```

重跑需要相同 Node/npm、Git、網路和對應平台套件。內容 hash 只是漂移偵測；同帳號可修改 bundle，不能宣稱防竄改。原始輸出及來源可能有業務資料，公開前必須人工檢查；不收集密碼/token，不把敏感值 hash 當作保密措施。

重跑只在新建的拋棄式 Git repo 強制建立快照索引，以保留原本已追蹤但符合 ignore 規則的輸入；在執行檢查前必須與封存 manifest 完全一致。這不會 stage 原工作區。

## 發布邊界

CLI 不執行 Git 發布。Agent 可在已授權任務中 commit、push 並建立 draft PR，但先查 remote、head/base、workflow、分支保護及外部整合。draft 不阻止 Actions 或部署。不得推至 master 或 review 前會觸發部署的分支。若無法證明安全，停在本機提交。

本機通過、遠端 CI 通過、PR 可 review、使用者接受、合併授權和部署授權為不同狀態。PR approval 不是合併／部署指令；不開 auto-merge。dev/update 分流、降低 CI 額度、Supervisor 和多 Agent 平台不在此版。

## 試點驗收

`node --test tools/aidd/pilot.test.mjs` 僅在 OS 暫存的拋棄式 Git fixtures 製造故障，不改真實產品。驗收包含修復上限、來源／證據漂移、必要測試 skip、缺失報告、保留既有修改、生成物、中斷、逾時及重跑。

值得繼續投入的條件：fixture 不誤報成功、bundle 可重跑、原修改保留、每項驗收可追溯，且實測證據成本可接受。若不滿足，先修正試點缺口，不擴大平台。
