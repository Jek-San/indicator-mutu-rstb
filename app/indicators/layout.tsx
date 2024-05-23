import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/assets/images/light.png",
  },
  title: "Tambah Indicator | RSTB",
  description: "Learn more about RSTB and our mission.",
};
export default function IndicatorsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}

      {children}
    </section>
  );
}
