const fs = require('fs');
let content = fs.readFileSync('src/components/sclass/SovereignMobileHUD.tsx', 'utf8');

const DOCK_MARKER = '      {/* \u2500\u2500\u2500 DOCK';
const dockIdx = content.indexOf(DOCK_MARKER);
if (dockIdx === -1) { console.error('Dock marker not found!'); process.exit(1); }

// Find the closing </nav> after the dock start
const navCloseTag = '      </nav>';
const navCloseIdx = content.indexOf(navCloseTag, dockIdx) + navCloseTag.length;

console.log('Dock starts at byte:', dockIdx);
console.log('Dock ends at byte:', navCloseIdx);

const newDock = `      {/* \u2500\u2500\u2500 DOCK \u00danico (z-80) \u00b7 3 items: Men\u00fa \u00b7 Astra (10s) \u00b7 Contacto \u2500\u2500\u2500 */}\r
      <nav\r
        aria-label="Navegaci\u00f3n m\u00f3vil unificada"\r
        className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 lg:hidden"\r
      >\r
        <div className="mx-auto flex max-w-sm items-stretch gap-0.5 rounded-[26px] border border-white/10 bg-[#09090d]/95 px-1.5 py-1.5 shadow-[0_-14px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl">\r
          {/* 1 \u00b7 MEN\u00da \u2014 abre el panel exclusivo ear-mobile-menu-sheet */}\r
          <button\r
            type="button"\r
            onClick={() => toggleSheet('menu')}\r
            aria-expanded={sheet === 'menu'}\r
            aria-controls="ear-mobile-menu-sheet"\r
            className={dockItemClass(sheet === 'menu')}\r
          >\r
            {sheet === 'menu' ? (\r
              <X size={18} strokeWidth={2.2} />\r
            ) : (\r
              <Menu size={18} strokeWidth={2.2} />\r
            )}\r
            <span>Men\u00fa</span>\r
          </button>\r
\r
          {/* 2 \u00b7 ASTRA \u2014 10 s long-press activa cockpit \u00b7 tap simple \u2192 WhatsApp */}\r
          <button\r
            type="button"\r
            onPointerDown={startAstraLongPress}\r
            onPointerUp={handleAstraTap}\r
            onPointerLeave={clearAstraLongPress}\r
            onPointerCancel={clearAstraLongPress}\r
            onContextMenu={(e) => { if (astraLongPressFired.current) e.preventDefault(); }}\r
            aria-label="Astra \u2014 mant\u00e9n 10 s para abrir el Or\u00e1culo"\r
            className="flex min-h-[56px] w-[70px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-300 ease-out active:scale-95 touch-manipulation select-none"\r
          >\r
            <span\r
              className="flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ease-out"\r
              style={{\r
                backgroundColor: sheet === 'cockpit' ? accentColor : '#1a1a22',\r
                boxShadow: sheet === 'cockpit' ? \`0 0 22px \${accentColor}66\` : 'none',\r
                border: \`1px solid \${accentColor}44\`,\r
              }}\r
            >\r
              <Sparkles size={19} strokeWidth={2.4} style={{ color: sheet === 'cockpit' ? '#030305' : accentColor }} />\r
            </span>\r
            <span\r
              className="font-mono text-[8px] font-bold uppercase tracking-wider"\r
              style={{ color: accentColor }}\r
            >\r
              Astra\r
            </span>\r
          </button>\r
\r
          {/* 3 \u00b7 CONTACTO DIRECTO */}\r
          <button\r
            type="button"\r
            onClick={() => toggleSheet('contact')}\r
            aria-expanded={sheet === 'contact'}\r
            aria-label="Contacto directo"\r
            className={dockItemClass(sheet === 'contact')}\r
          >\r
            <Phone size={18} strokeWidth={2.2} />\r
            <span>Contacto</span>\r
          </button>\r
        </div>\r
      </nav>`;

content = content.slice(0, dockIdx) + newDock + content.slice(navCloseIdx);
fs.writeFileSync('src/components/sclass/SovereignMobileHUD.tsx', content);
console.log('Dock patched successfully. New file size:', content.length);
