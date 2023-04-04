export function HomeHeader() {
  return (
    <header className={"text-center sm:my-12 my-1 mx-5"}>
      <h1
        className={
          "flex flex-col font-medium tracking-widest pointer-events-none"
        }
      >
        <span
          className={
            "uppercase tracking-very-wide font-black sm:text-5xl text-4xl"
          }
        >
          Ecstatic Dance
        </span>
        <span>in</span>
        <span className={"text-2xl"}>Nederland</span>
      </h1>
    </header>
  );
}
