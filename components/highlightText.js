export const getHighlightedText = (text, highlight) => {
  // Split on highlight term and include term into parts, ignore case
  if (highlight.length < 3) return text;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toLowerCase() === highlight.toLowerCase() &&
            highlight.length > 2
              ? "bg-white/20"
              : ""
          }
        >
          {part}
        </span>
      ))}{" "}
    </span>
  );
};
