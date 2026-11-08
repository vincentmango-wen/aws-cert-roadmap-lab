# AIDD 合作型試點 v0.2

這是一個 repo、一份任務契約、一個驗證 profile、一個固定 CLI 與一份任務 evidence bundle。不是 Supervisor、安全沙箱或自動部署平台。規約要求 Agent 遵守範圍；CLI 只管理自己的驗證，不攔截整個聊天的寫入。

## 執行前

使用 Node **22.13.0** 和 npm **10.9.2**（隨該 Node 版本）。不修改部署環境或另一份 pnpm lockfile。先確認工作區／既有變更並使用隔離 checkout。契約位於 `docs/aidd/task.json`，profile 位於 `tools/aidd/profile.json`；新任務必須由使用者批准契約與唯一任務 ID，不能重命名原任務來重置額度。

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

基線失敗先暫停功能實作；範圍內可用同一任務剩餘額度修復，範圍外／需要改驗收或擴權則停止報告。一次修復從開始一組修正動作算起，包含其驗證；中斷仍占次數。新方案算下一次。純診斷和未變更重跑不算修復，仍應留紀錄。修 bug 任務第一次修正也計次。

三次為任務共用上限，包含基線與 Harness 缺陷。重新開 run、worktree 或中斷不重置；第四次前需報告證據、原因、方案和風險，取得明確授權。本 CLI 刻意不提供重置或追加額度命令，超額由人審查後另設後續方案。fixture 預期故障不是實際修復嘗試。

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
