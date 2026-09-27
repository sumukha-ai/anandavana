// Custom outline icons for concepts lucide doesn't cover; they accept the same props as lucide icons

function OutlineIcon({ size = 24, strokeWidth = 2, children, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

// Gopura-style temple: finial, stepped tiers, walls and an arched doorway
export function TempleIcon(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M12 2.5v2.5" />
      <path d="M10.5 7a1.5 1.5 0 0 1 3 0" />
      <path d="M10 7h4l1 3H9z" />
      <path d="M8 10h8l1 3H7z" />
      <path d="M6 13v8M18 13v8" />
      <path d="M10 21v-3a2 2 0 0 1 4 0v3" />
      <path d="M3 21h18" />
    </OutlineIcon>
  );
}

// One ancestor branching into three descendants
export function FamilyTreeIcon(props) {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5V11" />
      <path d="M5 16v-5h14v5" />
      <path d="M12 11v5" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="12" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
    </OutlineIcon>
  );
}

