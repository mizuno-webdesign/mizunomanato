import SiteFrame from "@/components/SiteFrame";

// 段階1（土台）の確認用プレースホルダー。TOP の8カードは段階2で作る。
export default function Home() {
  return (
    <SiteFrame>
      <div className="grid gap-4 sm:grid-cols-3">
        <section className="rounded-card bg-surface p-6 sm:col-span-2">
          <h1 className="text-lg font-bold">Manato Mizuno</h1>
          <p className="mt-2 text-[17px] leading-[1.8] font-medium sm:text-xl">
            Shopify を中心に、ECサイト専門家として新規構築・改修・運用支援を行っています。
          </p>
          <p className="mt-4 text-[13px] text-ink-sub">
            段階1（土台）の確認用ページです。TOP のカードは段階2で作ります。
          </p>
        </section>
        <section className="rounded-card bg-surface p-6">
          <h2 className="text-lg font-bold">トークン確認</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
            <span className="rounded-full bg-sunken px-3 py-0.5 text-ink-sub">補足</span>
            <span className="rounded-full bg-accent px-3 py-0.5 font-bold text-white">操作</span>
            <span className="rounded-full bg-sunken px-3 py-0.5 font-bold text-ok">受付中</span>
            <span className="rounded-full bg-sunken px-3 py-0.5 font-bold text-ng">停止中</span>
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}
