type Props = {
  balloonLine1: string;
  balloonLine2: string;
};

export function NotFoundIllustration({
  balloonLine1,
  balloonLine2,
}: Props): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 214"
      role="img"
      aria-label="ロードマップの道の上に旗が立ち、大きな雲のキャラクターが右下で手を振って下のリンクへ案内している"
      className="mx-auto w-full max-w-sm sm:max-w-md"
    >
      {/* 背景 */}
      <rect x="0" y="0" width="480" height="150" fill="#f8fafc" />
      {/* 地面 楕円 */}
      <ellipse cx="230" cy="178" rx="210" ry="24" fill="#e2e8f0" opacity="0.45" />

      {/* ロードマップ小径 — 道の塗り */}
      <path
        d="M 24 170 Q 80 156 140 150 Q 200 144 240 140 Q 290 134 340 128 Q 390 122 440 118"
        stroke="#cbd5e1"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* 道の中央線（点線） */}
      <path
        d="M 24 170 Q 80 156 140 150 Q 200 144 240 140 Q 290 134 340 128 Q 390 122 440 118"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeDasharray="8 6"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* チェックポイント 1 */}
      <circle cx="96" cy="157" r="5" fill="#0ea5e9" opacity="0.5" />
      <path
        d="M 93 157 l 2.5 2.5 l 4 -4"
        stroke="white"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* チェックポイント 2 */}
      <circle cx="158" cy="148" r="5" fill="#0ea5e9" opacity="0.5" />
      <path
        d="M 155 148 l 2.5 2.5 l 4 -4"
        stroke="white"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* ピン ポール（高く伸ばす） */}
      <line
        x1="232"
        y1="140"
        x2="232"
        y2="58"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* ピン pennant（三角旗） */}
      <path d="M 232 58 L 258 65 L 232 72 Z" fill="#38bdf8" />

      {/* 吹き出し */}
      <g className="mascot-balloon">
        <rect
          x="236"
          y="80"
          width="132"
          height="44"
          rx="13"
          fill="#f0f9ff"
          stroke="#7dd3fc"
          strokeWidth="1.4"
        />
        {/* 吹き出しのしっぽ（マスコット方向へ延長） */}
        <path
          d="M 356 122 L 386 152 L 366 124 Z"
          fill="#f0f9ff"
          stroke="#7dd3fc"
          strokeWidth="1.4"
        />
        <text
          x="302"
          y="100"
          textAnchor="middle"
          fontFamily="'Hiragino Sans',system-ui,sans-serif"
          fontSize="13"
          fill="#0369a1"
          fontWeight="700"
        >
          {balloonLine1}
        </text>
        <text
          x="302"
          y="116"
          textAnchor="middle"
          fontFamily="'Hiragino Sans',system-ui,sans-serif"
          fontSize="13"
          fill="#0369a1"
          fontWeight="700"
        >
          {balloonLine2}
        </text>
      </g>

      {/* 雲マスコット（1.5x / 右下 / 頬の赤み） */}
      <g>
        {/* 影 */}
        <ellipse cx="404" cy="186" rx="52" ry="13" fill="#0ea5e9" opacity="0.12" />
        {/* 雲の本体（3 円） */}
        <circle cx="405" cy="180" r="33" fill="#fff" stroke="#cbd5e1" strokeWidth="1.6" />
        <circle cx="432" cy="186" r="25" fill="#fff" stroke="#cbd5e1" strokeWidth="1.6" />
        <circle cx="380" cy="185" r="24" fill="#fff" stroke="#cbd5e1" strokeWidth="1.6" />
        {/* 底面を塞ぐ rect */}
        <rect x="356" y="190" width="98" height="24" fill="#fff" />
        {/* 底辺ライン */}
        <line x1="356" y1="214" x2="454" y2="214" stroke="#cbd5e1" strokeWidth="1.6" />
        {/* 目 */}
        <circle cx="398" cy="180" r="3.8" fill="#334155" />
        <circle cx="414" cy="180" r="3.8" fill="#334155" />
        {/* 笑顔 */}
        <path
          d="M 393 190 Q 406 200 419 190"
          stroke="#334155"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* 頬の赤み */}
        <ellipse cx="389" cy="188" rx="4" ry="2.5" fill="#fca5a5" opacity="0.55" />
        <ellipse cx="423" cy="188" rx="4" ry="2.5" fill="#fca5a5" opacity="0.55" />
        {/* 右腕（手を振る） */}
        <path
          d="M 446 174 Q 463 150 455 133"
          stroke="#cbd5e1"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          className="mascot-arm"
        />
        {/* 右腕の手 */}
        <circle cx="455" cy="130" r="7" fill="#fff" stroke="#cbd5e1" strokeWidth="1.6" />
        {/* 左腕 */}
        <path
          d="M 370 188 Q 358 198 363 209"
          stroke="#cbd5e1"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
