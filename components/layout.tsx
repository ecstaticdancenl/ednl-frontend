export default function Layout({ children }: { children: any }) {
  return (
    <>
      <div className={"bg-blue-950 text-white min-h-screen"}>{children}</div>
    </>
  );
}
