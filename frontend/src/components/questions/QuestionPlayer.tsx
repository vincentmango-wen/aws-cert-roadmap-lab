"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChoiceId, Question } from "../../types/question";

/**
 * サーバー側で解決済みの関連リンク情報。
 * server component (`questions/[questionId]/page.tsx`) が存在チェックを行い、
 * この型で QuestionPlayer に渡す。
 * これにより "use client" な QuestionPlayer が termGuards (terms.json 85KB) を
 * client bundle に引き込まない。
 */
export type ResolvedLink = {
  id: string;
  exists: boolean;
};

type QuestionPlayerProps = {
  question: Question;
  previousQuestionId?: string;
  nextQuestionId?: string;
  resolvedServices?: ResolvedLink[];
  resolvedTerms?: ResolvedLink[];
  resolvedComparisons?: ResolvedLink[];
};

export function QuestionPlayer({
  question,
  previousQuestionId,
  nextQuestionId,
  resolvedServices,
  resolvedTerms,
  resolvedComparisons,
}: QuestionPlayerProps): React.JSX.Element {
  const [selectedChoiceId, setSelectedChoiceId] = useState<ChoiceId | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const selectedChoice = useMemo(() => {
    return question.choices.find((choice) => choice.choiceId === selectedChoiceId) ?? null;
  }, [question.choices, selectedChoiceId]);

  const correctChoice = useMemo(() => {
    return (
      question.choices.find((choice) => choice.choiceId === question.correctChoiceId) ?? null
    );
  }, [question.choices, question.correctChoiceId]);

  const isCorrect = selectedChoiceId === question.correctChoiceId;

  const difficultyLabel = getDifficultyLabel(question.difficulty);

  const handleSelectChoice = (choiceId: ChoiceId) => {
    if (isSubmitted) {
      return;
    }

    setSelectedChoiceId(choiceId);
  };

  const handleSubmit = () => {
    if (!selectedChoiceId) {
      return;
    }

    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedChoiceId(null);
    setIsSubmitted(false);
  };

  const getChoiceClassName = (choiceId: ChoiceId): string => {
    const baseClass =
      "w-full rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-slate-500";

    if (!isSubmitted) {
      if (selectedChoiceId === choiceId) {
        return `${baseClass} border-slate-900 bg-slate-100`;
      }

      return `${baseClass} border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50`;
    }

    if (choiceId === question.correctChoiceId) {
      return `${baseClass} border-green-600 bg-green-50`;
    }

    if (choiceId === selectedChoiceId && !isCorrect) {
      return `${baseClass} border-red-600 bg-red-50`;
    }

    return `${baseClass} border-slate-200 bg-white opacity-70`;
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-slate-600" aria-label="パンくず">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:underline">
              ホーム
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/questions" className="hover:underline">
              模擬問題
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/questions/clf" className="hover:underline">
              CLF-C02
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-900">{question.questionId.toUpperCase()}</li>
        </ol>
      </nav>

      <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            {question.exam}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {question.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            難易度：{difficultyLabel}
          </span>
        </div>

        <p className="mb-2 text-sm font-semibold text-slate-500">
          {question.questionId.toUpperCase()}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {question.question}
        </h1>
      </header>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-950">選択肢</h2>

        <div className="space-y-3">
          {question.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.choiceId;

            return (
              <button
                key={choice.choiceId}
                type="button"
                className={getChoiceClassName(choice.choiceId)}
                onClick={() => handleSelectChoice(choice.choiceId)}
                aria-pressed={isSelected}
                disabled={isSubmitted}
              >
                <span className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm font-bold">
                    {choice.choiceId}
                  </span>
                  <span className="text-sm leading-7 text-slate-900 sm:text-base">
                    {choice.text}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={handleSubmit}
            disabled={!selectedChoiceId || isSubmitted}
          >
            回答する
          </button>

          {isSubmitted ? (
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              onClick={handleRetry}
            >
              もう一度選ぶ
            </button>
          ) : null}
        </div>
      </section>

      {isSubmitted ? (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-950">回答結果</h2>

          <div
            className={
              isCorrect
                ? "mb-5 rounded-xl border border-green-600 bg-green-50 p-4"
                : "mb-5 rounded-xl border border-red-600 bg-red-50 p-4"
            }
          >
            <p className="text-base font-bold text-slate-950">
              {isCorrect ? "正解です。" : "不正解です。"}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-800">
              あなたの回答：
              <span className="font-bold">
                {selectedChoice ? `${selectedChoice.choiceId}. ${selectedChoice.text}` : "未選択"}
              </span>
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-800">
              正解：
              <span className="font-bold">
                {correctChoice
                  ? `${correctChoice.choiceId}. ${correctChoice.text}`
                  : question.correctChoiceId}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-base font-bold text-slate-950">解説</h3>
            <p className="leading-7 text-slate-800">{question.explanation}</p>
          </div>

          {question.choiceExplanations ? (
            <div>
              <h3 className="mb-3 text-base font-bold text-slate-950">選択肢ごとの解説</h3>
              <div className="space-y-3">
                {question.choices.map((choice) => {
                  const explanation = question.choiceExplanations?.[choice.choiceId];

                  if (!explanation) {
                    return null;
                  }

                  return (
                    <div
                      key={choice.choiceId}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="mb-1 text-sm font-bold text-slate-950">
                        {choice.choiceId}. {choice.text}
                      </p>
                      <p className="text-sm leading-6 text-slate-700">{explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-950">関連リンク</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 関連サービス: 実在するもののみ表示。1件もなければセクションごと非表示 */}
          {resolvedServices && resolvedServices.some(({ exists }) => exists) ? (
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-700">関連サービス</h3>
              <ul className="flex flex-wrap gap-2">
                {resolvedServices
                  .filter(({ exists }) => exists)
                  .map(({ id: serviceId }) => (
                    <li key={serviceId}>
                      <Link
                        href={`/terms/${serviceId}`}
                        className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold !text-slate-700 hover:bg-slate-50"
                      >
                        {serviceId.toUpperCase()}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {/* 関連用語: 実在するもののみ表示。1件もなければセクションごと非表示 */}
          {resolvedTerms && resolvedTerms.some(({ exists }) => exists) ? (
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-700">関連用語</h3>
              <ul className="flex flex-wrap gap-2">
                {resolvedTerms
                  .filter(({ exists }) => exists)
                  .map(({ id: termId }) => (
                    <li key={termId}>
                      <Link
                        href={`/terms/${termId}`}
                        className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold !text-slate-700 hover:bg-slate-50"
                      >
                        {termId}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {/* 関連比較記事: 実在するもののみ表示。1件もなければセクションごと非表示 */}
          {resolvedComparisons && resolvedComparisons.some(({ exists }) => exists) ? (
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-700">関連比較記事</h3>
              <ul className="flex flex-wrap gap-2">
                {resolvedComparisons
                  .filter(({ exists }) => exists)
                  .map(({ id: slug }) => (
                    <li key={slug}>
                      <Link
                        href={`/comparisons/${slug}`}
                        className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold !text-slate-700 hover:bg-slate-50"
                      >
                        {slug}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <nav
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        aria-label="問題ナビゲーション"
      >
        <div>
          {previousQuestionId ? (
            <Link
              href={`/questions/${previousQuestionId}`}
              className="inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              前の問題へ
            </Link>
          ) : (
            <span className="inline-flex rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-400">
              前の問題なし
            </span>
          )}
        </div>

        <Link
          href="/questions/clf"
          className="inline-flex justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          一覧に戻る
        </Link>

        <div>
          {nextQuestionId ? (
            <Link
              href={`/questions/${nextQuestionId}`}
              className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              次の問題へ
            </Link>
          ) : (
            <span className="inline-flex rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-400">
              次の問題なし
            </span>
          )}
        </div>
      </nav>
    </article>
  );
}

function getDifficultyLabel(difficulty: Question["difficulty"]): string {
  switch (difficulty) {
    case "easy":
      return "やさしい";
    case "normal":
      return "標準";
    case "hard":
      return "難しい";
  }
}