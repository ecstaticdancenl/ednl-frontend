export const getHighlightedText = (text, highlight) => {
  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toLowerCase() === highlight.toLowerCase() &&
            highlight.length > 2
              ? "bg-white/20" //"decoration-2 underline-offset-2 underline decoration-white/50 text-blue-100"
              : ""
          }
        >
          {part}
        </span>
      ))}{" "}
    </span>
  );
};
