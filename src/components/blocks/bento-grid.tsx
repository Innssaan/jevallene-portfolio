import Bento1 from "@/components/blocks/bento-1";
import Bento2 from "@/components/blocks/bento-2";
import Bento3 from "@/components/blocks/bento-3";
import Bento30 from "@/components/blocks/bento-30";
import Bento25 from "@/components/blocks/bento-25";
import Bento26 from "@/components/blocks/bento-26";
import Bento13 from "@/components/blocks/bento-13";
import Bento11 from "@/components/blocks/bento-11";

/**
 * Bento grid composed with the React Bits Bento Builder.
 *
 * The span classes live on the wrappers, never on the tiles, so any tile can
 * be moved to any cell by editing this file alone. The grid uses dense
 * auto-flow: reorder the wrappers or change a span and the browser re-packs
 * the layout at every breakpoint.
 */
export default function BentoGrid() {
  return (
    <section className="w-full min-h-[var(--rb-section-min-h,100vh)] flex items-start lg:items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(220px,auto)] grid-flow-dense">
          <div>
            <Bento1 />
          </div>
          <div className="lg:col-start-2 lg:row-start-1">
            <Bento2 />
          </div>
          <div className="lg:col-start-3 lg:row-start-1">
            <Bento3 />
          </div>
          <div className="lg:col-start-2 lg:row-start-2">
            <Bento30 />
          </div>
          <div className="lg:col-start-3 lg:row-start-2">
            <Bento25 />
          </div>
          <div className="lg:col-start-1 lg:row-start-2">
            <Bento26 />
          </div>
          <div>
            <Bento13 />
          </div>
          <div className="lg:col-start-2 lg:row-start-3">
            <Bento11 />
          </div>
        </div>
      </div>
    </section>
  );
}
