// ══════════════════════════════════════════════════════════════════
//  src/components/CalicoAnimation.tsx
//
//  Self-contained calico cat SVG for the topbar.
//  Animations live in  src/styles/catAnim.css  (imported in main.tsx).
//
//  Usage:
//    import CalicoAnimation from './CalicoAnimation'
//    <CalicoAnimation />          ← drop anywhere in <header>
// ══════════════════════════════════════════════════════════════════

export default function CalicoAnimation() {
  return (
    <svg
      className="calico-cat"
      width="80"
      height="60"
      viewBox="0 0 96 72"
      fill="none"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      role="presentation"
    >

      {/* ════════════════════════════════════
          WALKING GROUP
      ════════════════════════════════════ */}
      <g className="cat-walk">

        {/* Walking tail — orange, long, curves back */}
        <path
          className="cat-walk-tail"
          d="M66 36 C76 26 88 12 85 2"
          stroke="#E87228" strokeWidth="3.5" fill="none" strokeLinecap="round"
        />

        {/* Body */}
        <path d="M22 26 C24 14 42 10 58 11 C70 12 76 20 76 32 C76 42 68 46 52 46 C36 46 22 42 20 34 C19 28 20 26 22 26 Z" fill="white"/>
        <path d="M20 31 C21 18 31 11 45 12 C53 13 57 21 55 33 C53 42 42 47 31 45 C21 43 18 37 20 31 Z" fill="#E87228" opacity="0.90"/>
        <path d="M51 11 C61 10 73 16 76 27 C78 35 73 43 63 45 C54 46 48 39 49 30 C50 19 49 12 51 11 Z" fill="#1E1412" opacity="0.90"/>
        <path d="M22 26 C24 14 42 10 58 11 C70 12 76 20 76 32 C76 42 68 46 52 46 C36 46 22 42 20 34 C19 28 20 26 22 26 Z" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.40"/>
        <path d="M24 34 Q31 37 38 35" stroke="white" strokeWidth="1.4" fill="none" opacity="0.50" strokeLinecap="round"/>

        {/* Neck */}
        <path d="M20 34 C17 29 17 22 20 18 C21 16 24 15 26 18 C28 21 27 28 26 33 Z" fill="white"/>

        {/* Head */}
        <circle cx="12" cy="17" r="11.5" fill="white"/>
        <path d="M2 11 C4 3 12 2 16 7 C19 11 18 18 14 20 C9 22 2 19 1 14 C1 12 1 11 2 11 Z" fill="#E87228" opacity="0.90"/>
        <path d="M13 9 C17 5 23 8 22 14 C21 18 17 20 14 18 C11 16 11 10 13 9 Z" fill="#1E1412" opacity="0.90"/>
        <circle cx="12" cy="17" r="11.5" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.42"/>

        {/* Ears */}
        <polygon points="2,9 6,-3 13,9" fill="#E87228"/>
        <polygon points="3.5,8.5 6.5,-0.5 11,8.5" fill="#F4A888" opacity="0.75"/>
        <polygon points="2,9 6,-3 13,9" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.38"/>
        <polygon points="11,9 17,-3 23,9" fill="#1E1412"/>
        <polygon points="12.5,8.5 17,-0.5 21.5,8.5" fill="#5A2030" opacity="0.60"/>
        <polygon points="11,9 17,-3 23,9" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.32"/>

        {/* Eyes */}
        <circle cx="8.5" cy="17" r="4.5" fill="#1A1210"/>
        <circle cx="8.5" cy="17" r="3.8" fill="#D4A820"/>
        <ellipse cx="8.5" cy="17" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="9.9" cy="15.4" r="1.3" fill="white" opacity="0.92"/>
        <circle cx="17.5" cy="17" r="4.5" fill="#1A1210"/>
        <circle cx="17.5" cy="17" r="3.8" fill="#D4A820"/>
        <ellipse cx="17.5" cy="17" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="18.9" cy="15.4" r="1.3" fill="white" opacity="0.92"/>

        {/* Nose + mouth */}
        <path d="M11.2 20 L12 21.5 L12.8 20 Z" fill="#F0A0B8"/>
        <line x1="12" y1="21.5" x2="12" y2="22.5" stroke="#D08898" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M12 22.5 Q10.2 24 9 23.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M12 22.5 Q13.8 24 15 23.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>

        {/* Whiskers */}
        <line x1="0.5" y1="20.5" x2="10" y2="21.5" stroke="#C8C0B8" strokeWidth="0.95"/>
        <line x1="0.5" y1="22.2" x2="10" y2="22.5" stroke="#C8C0B8" strokeWidth="0.85"/>
        <line x1="0.5" y1="23.9" x2="10" y2="23.5" stroke="#C8C0B8" strokeWidth="0.72"/>
        <line x1="14"  y1="21.5" x2="23.5" y2="20.5" stroke="#C8C0B8" strokeWidth="0.95"/>
        <line x1="14"  y1="22.5" x2="23.5" y2="22.2" stroke="#C8C0B8" strokeWidth="0.85"/>
        <line x1="14"  y1="23.5" x2="23.5" y2="23.9" stroke="#C8C0B8" strokeWidth="0.72"/>

        {/* Legs (animated) */}
        <path d="M21 43 Q20 44 20 53 Q20 55 22 55 Q24 55 24.5 53 Q24.5 44 23.5 43 Z"   fill="white"   stroke="#1A1210" strokeWidth="0.85" className="cat-leg-1"/>
        <path d="M29 44 Q28 45 28 53 Q28 55 30 55 Q32 55 32.5 53 Q32.5 45 31.5 44 Z"   fill="#EDE5DD" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-2"/>
        <path d="M55 43 Q54 44 54 52 Q54 54 56 54 Q58 54 58.5 52 Q58.5 44 57.5 43 Z"   fill="white"   stroke="#1A1210" strokeWidth="0.85" className="cat-leg-3"/>
        <path d="M63 44 Q62 45 62 52 Q62 54 64 54 Q66 54 66.5 52 Q66.5 45 65.5 44 Z"   fill="#1E1412" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-4"/>

        {/* Toe beans */}
        <ellipse cx="22.2" cy="54.5" rx="2.5" ry="1.1" fill="#F0A0B8" opacity="0.70"/>
        <ellipse cx="30.2" cy="54.5" rx="2.5" ry="1.1" fill="#F0A0B8" opacity="0.58"/>
        <ellipse cx="56.2" cy="53.5" rx="2.3" ry="1.0" fill="#F0A0B8" opacity="0.52"/>
        <ellipse cx="64.2" cy="53.5" rx="2.3" ry="1.0" fill="#7A4858" opacity="0.66"/>
      </g>

      {/* ════════════════════════════════════
          SITTING GROUP  (shifted 8u down to avoid ear clipping)
      ════════════════════════════════════ */}
      <g className="cat-sit" transform="translate(0, 8)">

        {/* Shadow */}
        <ellipse cx="22" cy="55.5" rx="18" ry="2" fill="#00000010"/>

        {/* Sitting tail — happy orange arc */}
        <path
          className="cat-sit-tail"
          d="M32 42 C42 54 26 62 14 56 C6 51 8 42 14 38"
          stroke="#E87228" strokeWidth="3.5" fill="none" strokeLinecap="round"
        />

        {/* Sitting body */}
        <path d="M9 49 C9 33 11 21 22 19 C33 17 35 29 35 43 C35 51 29 55 22 55 C15 55 9 53 9 49 Z" fill="white"/>
        <path d="M9 46 C9 33 11 22 20 20 C28 18 32 26 31 38 C30 48 24 54 16 53 C11 52 9 50 9 46 Z" fill="#E87228" opacity="0.88"/>
        <path d="M24 19 C32 19 35 28 35 38 C35 48 30 54 24 54 C22 54 22 46 22 38 C22 28 22 19 24 19 Z" fill="#1E1412" opacity="0.88"/>
        <path d="M9 49 C9 33 11 21 22 19 C33 17 35 29 35 43 C35 51 29 55 22 55 C15 55 9 53 9 49 Z" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.38"/>
        <path d="M12 40 Q18 43 24 41" stroke="white" strokeWidth="1.3" fill="none" opacity="0.45" strokeLinecap="round"/>

        {/* Sitting paws */}
        <ellipse cx="15" cy="53" rx="5.5" ry="3" fill="white"    stroke="#1A1210" strokeWidth="0.8" opacity="0.80"/>
        <ellipse cx="27" cy="53" rx="5.5" ry="3" fill="#F0E8DF"  stroke="#1A1210" strokeWidth="0.8" opacity="0.72"/>

        {/* Sitting neck */}
        <path d="M14 20 C12 16 12 11 15 8 C16 7 19 7 20 9 C21 11 20 16 19 20 Z" fill="white" opacity="0.90"/>

        {/* Sitting head */}
        <circle cx="17" cy="9" r="11.5" fill="white"/>
        <path d="M7 3 C9 -4 16 -5 20 0 C23 4 22 11 18 13 C13 15 6 12 5 8 C5 6 5 4 7 3 Z" fill="#E87228" opacity="0.88"/>
        <path d="M18 1 C22 -2 28 1 27 7 C26 11 22 13 19 11 C16 9 16 2 18 1 Z" fill="#1E1412" opacity="0.88"/>
        <circle cx="17" cy="9" r="11.5" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.42"/>

        {/* Sitting ears */}
        <polygon points="7,4 11,-8 18,4" fill="#E87228"/>
        <polygon points="8.5,3.5 11.5,-5 16,3.5" fill="#F4A888" opacity="0.72"/>
        <polygon points="7,4 11,-8 18,4" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.35"/>
        <polygon points="16,4 22,-8 28,4" fill="#1E1412"/>
        <polygon points="17.5,3.5 22,-5 26.5,3.5" fill="#5A2030" opacity="0.58"/>
        <polygon points="16,4 22,-8 28,4" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.30"/>

        {/* Sitting eyes */}
        <circle cx="13" cy="9" r="4.5" fill="#1A1210"/>
        <circle cx="13" cy="9" r="3.8" fill="#D4A820"/>
        <ellipse cx="13" cy="9" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="14.4" cy="7.4" r="1.3" fill="white" opacity="0.92"/>
        <circle cx="22"   cy="9" r="4.5" fill="#1A1210"/>
        <circle cx="22"   cy="9" r="3.8" fill="#D4A820"/>
        <ellipse cx="22"  cy="9" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="23.4" cy="7.4" r="1.3" fill="white" opacity="0.92"/>

        {/* Sitting nose + mouth */}
        <path d="M16.2 12 L17 13.5 L17.8 12 Z" fill="#F0A0B8"/>
        <line x1="17" y1="13.5" x2="17" y2="14.5" stroke="#D08898" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M17 14.5 Q15.2 16 14 15.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M17 14.5 Q18.8 16 20 15.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>

        {/* Sitting whiskers */}
        <line x1="5"  y1="12.5" x2="15" y2="13.5" stroke="#C8C0B8" strokeWidth="0.92"/>
        <line x1="5"  y1="14.2" x2="15" y2="14.5" stroke="#C8C0B8" strokeWidth="0.82"/>
        <line x1="5"  y1="15.9" x2="15" y2="15.5" stroke="#C8C0B8" strokeWidth="0.70"/>
        <line x1="19" y1="13.5" x2="29" y2="12.5" stroke="#C8C0B8" strokeWidth="0.92"/>
        <line x1="19" y1="14.5" x2="29" y2="14.2" stroke="#C8C0B8" strokeWidth="0.82"/>
        <line x1="19" y1="15.5" x2="29" y2="15.9" stroke="#C8C0B8" strokeWidth="0.70"/>
      </g>

    </svg>
  )
}