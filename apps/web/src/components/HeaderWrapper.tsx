export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="container mx-auto p-6">{children}</main>;
}
