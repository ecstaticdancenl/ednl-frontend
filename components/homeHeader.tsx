export function HomeHeader() {
  return (
    <header className={"text-center sm:py-12 py-1 mx-5 pointer-events-none"}>
      <h1 className={"flex flex-col items-center font-medium tracking-widest"}>
        <span
          className={
            "uppercase tracking-very-wide font-black sm:text-5xl text-4xl pointer-events-auto"
          }
        >
          Ecstatic Dance
        </span>
        <span className={"pointer-events-auto text-lg"}>in</span>
        <span className={"pointer-events-auto text-2xl"}>Nederland</span>
      </h1>
    </header>
  );
}
