"use client";

interface MysticalButtonProps {
  children: string;
  onClick?: () => void;
  showArrow?: boolean;
  className?: string;
}

/**
 * MysticalButton — Nút CTA huyền bí với hiệu ứng hào quang phát sáng.
 * Gồm 3 layer: aura (nền gradient), ring (viền sáng), text + arrow.
 * Tất cả đồng bộ nhịp breathing 3.5s.
 */
export default function MysticalButton({
  children,
  onClick,
  showArrow = true,
  className = "",
}: MysticalButtonProps) {
  return (
    <button className={`btn-begin ${className}`} onClick={onClick}>
      <span className="btn-begin__aura" />
      <span className="btn-begin__ring" />
      <span className="btn-begin__text">{children}</span>
      {showArrow && (
        <span className="btn-begin__arrow">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      )}
    </button>
  );
}
