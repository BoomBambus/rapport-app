/* @ds-bundle: {"format":4,"namespace":"SchlossereiMengeDesignSystem_7d6d43","components":[{"name":"Band","sourcePath":"components/brand/Band.jsx"},{"name":"Eyebrow","sourcePath":"components/brand/Eyebrow.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Strich","sourcePath":"components/brand/Strich.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tabs","sourcePath":"components/display/Tabs.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/brand/Band.jsx":"18b43d9401f6","components/brand/Eyebrow.jsx":"2e9d04c5af83","components/brand/Logo.jsx":"ddc28c1f18f1","components/brand/Strich.jsx":"501068a275d4","components/display/Badge.jsx":"577a34838273","components/display/Card.jsx":"6a07d3ea1eee","components/display/Tabs.jsx":"d0cb00be45d1","components/feedback/Dialog.jsx":"9450396859f9","components/feedback/Toast.jsx":"b0c176ad810d","components/feedback/Tooltip.jsx":"6c0f98a6947a","components/forms/Button.jsx":"0957fb207da0","components/forms/Checkbox.jsx":"f9ad9af529f8","components/forms/Input.jsx":"f071fe34e5e4","components/forms/Radio.jsx":"3cb50501a7a5","components/forms/Select.jsx":"7f9e21bcfc6e","components/forms/Switch.jsx":"fdcbf5a111b2","ui_kits/website/Footer.jsx":"b132e80b51b0","ui_kits/website/Header.jsx":"a30ed590f274","ui_kits/website/HomeSections.jsx":"812f864d733f","ui_kits/website/KontaktPage.jsx":"63ad54a588f8","ui_kits/website/data.js":"d2fd62557002"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SchlossereiMengeDesignSystem_7d6d43 = window.SchlossereiMengeDesignSystem_7d6d43 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Band.jsx
try { (() => {
const TONES = {
  blau: 'var(--menge-blau)',
  hell: 'var(--blau-hell)',
  weiss: 'var(--weiss)'
};
function Band({
  tone = 'blau',
  stroke = false,
  strokeLength = 160,
  strokeWeight = 'gross',
  padding = 'var(--space-48)',
  children,
  style
}) {
  const h = strokeWeight === 'gross' ? 'var(--stroke-gross)' : 'var(--stroke-klein)';
  const w = typeof strokeLength === 'number' ? strokeLength + 'px' : strokeLength;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: TONES[tone] || tone,
      color: 'var(--tiefschwarz)',
      padding,
      borderRadius: 0,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, stroke && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      height: h,
      width: `calc(${w} + ${padding})`,
      marginLeft: `calc(-1 * ${padding})`,
      background: 'var(--signalrot)',
      marginBottom: 'var(--space-24)'
    }
  }), children);
}
Object.assign(__ds_scope, { Band });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Band.jsx", error: String((e && e.message) || e) }); }

// components/brand/Eyebrow.jsx
try { (() => {
function Eyebrow({
  as: Tag = 'div',
  children,
  style
}) {
  return /*#__PURE__*/React.createElement(Tag, {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--type-sperrsatz-size)',
      lineHeight: 'var(--type-sperrsatz-line)',
      fontWeight: 'var(--type-sperrsatz-weight)',
      letterSpacing: 'var(--type-sperrsatz-tracking)',
      textTransform: 'uppercase',
      color: 'var(--tiefschwarz)',
      margin: 0,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LOGO_SRC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTEyNSIgaGVpZ2h0PSI0MDIuMTUwMDA5IiB2aWV3Qm94PSIwIDAgMTEyNSA0MDIuMTUwMDA5Ij4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcC0wIj4KPHBhdGggY2xpcC1ydWxlPSJub256ZXJvIiBkPSJNIDEuMTg3NSAwIEwgMTEyMy44MTI1IDAgTCAxMTIzLjgxMjUgNDAxLjMwMDc4MSBMIDEuMTg3NSA0MDEuMzAwNzgxIFogTSAxLjE4NzUgMCAiPjwvcGF0aD4KPC9jbGlwUGF0aD4KPGNsaXBQYXRoIGlkPSJjbGlwLTEiPgo8cGF0aCBjbGlwLXJ1bGU9Im5vbnplcm8iIGQ9Ik0gMS4xODc1IDE0NiBMIDExMjMuODEyNSAxNDYgTCAxMTIzLjgxMjUgNDAxLjMwMDc4MSBMIDEuMTg3NSA0MDEuMzAwNzgxIFogTSAxLjE4NzUgMTQ2ICI+PC9wYXRoPgo8L2NsaXBQYXRoPgo8Y2xpcFBhdGggaWQ9ImNsaXAtMiI+CjxwYXRoIGNsaXAtcnVsZT0ibm9uemVybyIgZD0iTSAxLjE4NzUgMjU5IEwgNDM4IDI1OSBMIDQzOCAyODUgTCAxLjE4NzUgMjg1IFogTSAxLjE4NzUgMjU5ICI+PC9wYXRoPgo8L2NsaXBQYXRoPgo8L2RlZnM+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwLTApIj4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoMTAwJSwgMTAwJSwgMTAwJSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSAwLjgxMjUgLTAuMTQ4NDM4IEwgMTEyNC4xODc1IC0wLjE0ODQzOCBMIDExMjQuMTg3NSA0MDEuMzc4OTA2IEwgMC44MTI1IDQwMS4zNzg5MDYgWiBNIDAuODEyNSAtMC4xNDg0MzggIj48L3BhdGg+CjwvZz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtMSkiPgo8cGF0aCBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9InJnYig1NS4yOTMyNzQlLCA2Ny44NDIxMDIlLCA4My41MjgxMzclKSIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNIDAuODEyNSAxNDYuOTkyMTg4IEwgMTEyNC4xODc1IDE0Ni45OTIxODggTCAxMTI0LjE4NzUgNDAxLjM3ODkwNiBMIDAuODEyNSA0MDEuMzc4OTA2IFogTSAwLjgxMjUgMTQ2Ljk5MjE4OCAiPjwvcGF0aD4KPC9nPgo8cGF0aCBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9InJnYigxMy43MjUyODElLCAxMS43NjQ1MjYlLCAxMi41NDg4MjglKSIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNIDQzNC45Njg3NSAyMjMuOTI1NzgxIEMgNDI5LjgwNDY4OCAyMDYuODYzMjgxIDQxNS45NTcwMzEgMTk5Ljc1MzkwNiA0MTEuMDkzNzUgMTk4LjE4MzU5NCBDIDQwNS43MDcwMzEgMTk2LjMxMjUgMzk5LjQ5MjE4OCAxOTYuMDg1OTM4IDM5Ny45MjE4NzUgMTk2LjA4NTkzOCBDIDM3OS4xMzY3MTkgMTk2LjA4NTkzOCAzNjcuMzEyNSAyMDQuNzY1NjI1IDM2MS45OTYwOTQgMjEwLjUzMTI1IEMgMzU5LjUzMTI1IDIxMy4xNTIzNDQgMzU3LjUwNzgxMiAyMTYuMDY2NDA2IDM1My41NDI5NjkgMjIyLjM1NTQ2OSBDIDM1MC42MjUgMjE2LjU5Mzc1IDM0Ny41NTQ2ODggMjEwLjMwNDY4OCAzNDMuNTE1NjI1IDIwNi4xMTcxODggQyAzMzYuNjI1IDE5OS4zMDQ2ODggMzI0LjczMDQ2OSAxOTUuNjM2NzE5IDMxNi4yNjk1MzEgMTk1LjYzNjcxOSBDIDMwMi44NzEwOTQgMTk1LjYzNjcxOSAyODcuNjgzNTk0IDIwMi45Njg3NSAyNzguNzc3MzQ0IDIxNS4wOTc2NTYgQyAyNzUuNjI4OTA2IDIxOS4yODUxNTYgMjczLjE2NDA2MiAyMjQuMDAzOTA2IDI3Mi40ODgyODEgMjI1LjU3NDIxOSBMIDI3Mi4yNjE3MTkgMTk5LjgyODEyNSBMIDIzNC42OTE0MDYgMTk5LjgyODEyNSBMIDIzNC42OTE0MDYgMzM4LjEzNjcxOSBMIDI3NS4zMzIwMzEgMzM4LjEzNjcxOSBMIDI3NS4zMzIwMzEgMjc1LjY0NDUzMSBDIDI3NS40ODA0NjkgMjcwLjE3OTY4OCAyNzUuNTU0Njg4IDI2NS4wMTU2MjUgMjc2LjQ1NzAzMSAyNjAgQyAyNzcuMjAzMTI1IDI1NS44MTI1IDI3OC40NzY1NjIgMjUxLjc2OTUzMSAyODAuNzE4NzUgMjQ3LjgwMDc4MSBDIDI4Mi4yOTI5NjkgMjQ0Ljg3ODkwNiAyODguNTAzOTA2IDIzNS40NTMxMjUgMjk4LjE2MDE1NiAyMzUuNDUzMTI1IEMgMzAxLjk3NjU2MiAyMzUuNDUzMTI1IDMwNS43MTg3NSAyMzYuODAwNzgxIDMwOC42MzY3MTkgMjM5LjQyMTg3NSBDIDMxMy4yNzczNDQgMjQzLjIzNDM3NSAzMTQuODQ3NjU2IDI0OC44NDc2NTYgMzE1LjUyMzQzOCAyNjAgQyAzMTUuNTk3NjU2IDI2MS43OTY4NzUgMzE1LjY2Nzk2OSAyNjMuODE2NDA2IDMxNS43NSAyNjUuOTE0MDYyIEwgMzE1Ljc1IDMzOC4zNTkzNzUgTCAzNTYuODMyMDMxIDMzOC4zNTkzNzUgTCAzNTYuODMyMDMxIDI3My4wMjM0MzggQyAzNTYuOTg0Mzc1IDI2OC41MzUxNTYgMzU3LjIwNzAzMSAyNjQuMTE3MTg4IDM1Ny43MzQzNzUgMjYwIEMgMzU4Ljc4MTI1IDI1Mi41ODk4NDQgMzYxLjEwMTU2MiAyNDUuOTI5Njg4IDM2Ni44NjMyODEgMjQwLjc2NTYyNSBDIDM3MS44MDA3ODEgMjM2LjI3MzQzOCAzNzUuOTk2MDk0IDIzNS41MjM0MzggMzc4LjY5MTQwNiAyMzUuNTIzNDM4IEMgMzgyLjczMDQ2OSAyMzUuNTIzNDM4IDM4Ni45MjE4NzUgMjM3LjMyNDIxOSAzOTAuMDYyNSAyNDAuNzY1NjI1IEMgMzk1LjAwMzkwNiAyNDYuMTU2MjUgMzk2LjIwMzEyNSAyNTIuODkwNjI1IDM5Ni40MjU3ODEgMjYwIEMgMzk2LjUgMjYyLjMyMDMxMiAzOTYuNSAyNjQuNjQwNjI1IDM5Ni41IDI2Ni45NTcwMzEgTCAzOTYuNSAzMzguMzU5Mzc1IEwgNDM3LjU4OTg0NCAzMzguMzU5Mzc1IEwgNDM3LjU4OTg0NCAyNDguNTQ2ODc1IEMgNDM3LjE0MDYyNSAyMzUuMTUyMzQ0IDQzNi42OTE0MDYgMjMwLjIxMDkzOCA0MzQuOTY4NzUgMjIzLjkyNTc4MSBaIE0gNDM0Ljk2ODc1IDIyMy45MjU3ODEgIj48L3BhdGg+CjxwYXRoIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0icmdiKDEzLjcyNTI4MSUsIDExLjc2NDUyNiUsIDEyLjU0ODgyOCUpIiBmaWxsLW9wYWNpdHk9IjEiIGQ9Ik0gNTI4Ljc0NjA5NCAzMTEuMjY5NTMxIEMgNTEzLjEwNTQ2OSAzMTEuMjY5NTMxIDUwMy43NSAzMDQuMTU2MjUgNTAwLjM4MjgxMiAyOTguMTcxODc1IEMgNDk3LjkxMDE1NiAyOTMuOTgwNDY5IDQ5Ni43ODUxNTYgMjg4Ljc0MjE4OCA0OTUuNDQxNDA2IDI4My41MDM5MDYgTCA1NzguOTY0ODQ0IDI4My4yNzczNDQgQyA1NzguNzM4MjgxIDI3MS40NDkyMTkgNTc4LjI4OTA2MiAyNTguODc4OTA2IDU3Ni4wNDY4NzUgMjQ3LjM1MTU2MiBDIDU3My41NzgxMjUgMjM1LjMwNDY4OCA1NjguODYzMjgxIDIyNi4wOTc2NTYgNTY2LjY5MTQwNiAyMjIuNDI5Njg4IEMgNTU5LjgwODU5NCAyMTAuMDc4MTI1IDU0Ny40NTcwMzEgMTk1LjYzNjcxOSA1MTkuMTY0MDYyIDE5NS42MzY3MTkgQyA0OTEuNDcyNjU2IDE5NS42MzY3MTkgNDc3LjQwNjI1IDIwOS4wMzUxNTYgNDcwLjA3MDMxMiAyMTkuNTExNzE5IEMgNDU3LjEyMTA5NCAyMzcuNjIxMDk0IDQ1Ni40NDkyMTkgMjU4Ljg3ODkwNiA0NTYuNDQ5MjE5IDI2Ny4wMzkwNjIgQyA0NTYuNDQ5MjE5IDI4Mi4wMDc4MTIgNDU5LjM2NzE4OCAyOTcuNDk2MDk0IDQ2Ni4yNTM5MDYgMzEwLjM2NzE4OCBDIDQ3OS40MjU3ODEgMzM1LjI5Mjk2OSA1MDEuMjc3MzQ0IDM0Mi40MDIzNDQgNTI1LjIyNjU2MiAzNDIuNDAyMzQ0IEMgNTQ3LjUzMTI1IDM0Mi40MDIzNDQgNTU4LjA4MjAzMSAzMzcuMzkwNjI1IDU2OC4zMzk4NDQgMzMzLjE5NTMxMiBMIDU2Ny42NjQwNjIgMzAwLjYzNjcxOSBDIDU1NS4wODk4NDQgMzA1LjgwMDc4MSA1NDIuMTQ0NTMxIDMxMS4yNjk1MzEgNTI4Ljc0NjA5NCAzMTEuMjY5NTMxIFogTSA1MDcuMjY1NjI1IDIyOC44NjcxODggQyA1MTIuMjA3MDMxIDIyNS40MjE4NzUgNTE2LjYyMTA5NCAyMjUuMTk5MjE5IDUxOS4wODk4NDQgMjI1LjE5OTIxOSBDIDUyMS4zMzU5MzggMjI1LjE5OTIxOSA1MjUuNzUzOTA2IDIyNS40MjE4NzUgNTMwLjkxNzk2OSAyMjkuMDg5ODQ0IEMgNTM4LjY5OTIxOSAyMzQuNjI4OTA2IDU0MC4yNzM0MzggMjQyLjQ4ODI4MSA1NDAuOTQ1MzEyIDI0Ni40NTcwMzEgQyA1NDEuNjE3MTg4IDI0OS4zNzEwOTQgNTQxLjg0Mzc1IDI1Mi41MTU2MjUgNTQyLjI5Mjk2OSAyNTUuNjYwMTU2IEwgNDk0Ljk5NjA5NCAyNTUuNjYwMTU2IEMgNDk2Ljc4NTE1NiAyNDQuMTMyODEyIDQ5OC4zNjMyODEgMjM0LjYyODkwNiA1MDcuMjY1NjI1IDIyOC44NjcxODggWiBNIDUwNy4yNjU2MjUgMjI4Ljg2NzE4OCAiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoMTMuNzI1MjgxJSwgMTEuNzY0NTI2JSwgMTIuNTQ4ODI4JSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSA3MTcuODcxMDk0IDIyNi4yNSBDIDcxNS44NTE1NjIgMjE5Ljk2MDkzOCA3MDkuNDE3OTY5IDIwNS43NDIxODggNjkzLjk5NjA5NCAxOTkuNzUzOTA2IEMgNjg2LjgxMjUgMTk2LjYwOTM3NSA2ODAuMzc1IDE5Ni42MDkzNzUgNjc3LjQ1NzAzMSAxOTYuNjA5Mzc1IEMgNjU4LjY3MTg3NSAxOTYuNjA5Mzc1IDY0Ny4yOTY4NzUgMjA3LjYxMzI4MSA2NDIuNjU2MjUgMjEzLjM3MTA5NCBDIDYzOS4yODUxNTYgMjE3LjU2MjUgNjM2LjIxODc1IDIyMi44MDA3ODEgNjM1LjQ3MjY1NiAyMjQuMTUyMzQ0IEwgNjM1LjI0NjA5NCAyMDAuNTAzOTA2IEwgNTk3Ljk3NjU2MiAyMDAuNTAzOTA2IEwgNTk3Ljk3NjU2MiAzMzguMjg1MTU2IEwgNjM4LjYxMzI4MSAzMzguMjg1MTU2IEwgNjM4LjYxMzI4MSAyNzAuODU1NDY5IEMgNjM4LjgzOTg0NCAyNjUuODM1OTM4IDYzOC4zOTA2MjUgMjUwLjEyMTA5NCA2NDkuMzE2NDA2IDI0MC4xNjc5NjkgQyA2NTEuMTEzMjgxIDIzOC41OTc2NTYgNjU2LjA1MDc4MSAyMzQuNDAyMzQ0IDY2Mi40ODgyODEgMjM0LjQwMjM0NCBDIDY2NC43MzQzNzUgMjM0LjQwMjM0NCA2NjkuMTQ4NDM4IDIzNC42Mjg5MDYgNjczLjY0MDYyNSAyMzkuNDIxODc1IEMgNjgwLjgyNDIxOSAyNDYuNzUgNjgxLjA1MDc4MSAyNTYuNDgwNDY5IDY4MS4wNTA3ODEgMjY2LjczODI4MSBMIDY4MS4wNTA3ODEgMzM4LjY2MDE1NiBMIDcyMS45MTQwNjIgMzM4LjY2MDE1NiBMIDcyMS45MTQwNjIgMjUzLjc4OTA2MiBDIDcyMC45Mzc1IDIzOS4zNDc2NTYgNzIwLjExNzE4OCAyMzIuODMyMDMxIDcxNy44NzEwOTQgMjI2LjI1IFogTSA3MTcuODcxMDk0IDIyNi4yNSAiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoMTMuNzI1MjgxJSwgMTEuNzY0NTI2JSwgMTIuNTQ4ODI4JSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSA4MzMuNSAxOTkuMjI2NTYyIEwgODMzLjUgMjIwLjc4NTE1NiBDIDgyOS42ODM1OTQgMjE0LjcyMjY1NiA4MjcuOTYwOTM4IDIxMi40MDIzNDQgODI1LjQ5NjA5NCAyMDkuNzg1MTU2IEMgODEzLjQ0NTMxMiAxOTYuOTA2MjUgNzk4LjkyNTc4MSAxOTUuODU5Mzc1IDc5My4zMTI1IDE5NS44NTkzNzUgQyA3NzIuMTMyODEyIDE5NS44NTkzNzUgNzU5LjE4NzUgMjEwLjAwMzkwNiA3NTQuNDY4NzUgMjE2LjgxNjQwNiBDIDc0NC42NjQwNjIgMjMwLjk2MDkzOCA3NDAuNjI1IDI1MC45NDUzMTIgNzQwLjYyNSAyNjkuMjgxMjUgQyA3NDAuNjI1IDMxMC4yMTg3NSA3NTkuNjMyODEyIDMyOS45MDYyNSA3NzIuMTMyODEyIDMzNy4wMTU2MjUgQyA3ODAuMzYzMjgxIDM0MS43MjY1NjIgNzg3LjU0Njg3NSAzNDIuMDI3MzQ0IDc5MS4zNjcxODggMzQyLjAyNzM0NCBDIDgwMi41MTU2MjUgMzQyLjAyNzM0NCA4MTYuMzYzMjgxIDMzNy4wMTU2MjUgODI0LjY3MTg3NSAzMjguMTA5Mzc1IEMgODI4LjI2MTcxOSAzMjQuMTQwNjI1IDgzMS4xODM1OTQgMzE5LjQyNTc4MSA4MzIuMDAzOTA2IDMxNy44NTE1NjIgQyA4MzIuNDUzMTI1IDMyOC4zMjgxMjUgODMyLjY3OTY4OCAzMzkuNDA2MjUgODI5LjA4NTkzOCAzNDkuMzYzMjgxIEMgODI3Ljc0MjE4OCAzNTIuNTAzOTA2IDgyNi4xNjc5NjkgMzU1LjY0NDUzMSA4MjMuOTI1NzgxIDM1Ny43NDIxODggQyA4MTkuODgyODEyIDM2Mi4yMzQzNzUgODExLjIwMzEyNSAzNjcuOTk2MDk0IDc5Ny41NzgxMjUgMzY3Ljk5NjA5NCBDIDc4My4yODUxNTYgMzY3Ljk5NjA5NCA3NzAuNTU4NTk0IDM2MS45MzM1OTQgNzU3LjM5MDYyNSAzNTUuOTQ1MzEyIEwgNzU1LjU5Mzc1IDM5MS42NDg0MzggQyA3NjYuMjk2ODc1IDM5Ni4xNDA2MjUgNzc4Ljc5Mjk2OSA0MDAuODUxNTYyIDgwMi44OTA2MjUgNDAwLjg1MTU2MiBDIDgyMy42MjUgNDAwLjg1MTU2MiA4NDMuNTMxMjUgMzk3LjE4MzU5NCA4NTguMDUwNzgxIDM3OC4wMjM0MzggQyA4NzAuOTk2MDk0IDM2MS4yNTc4MTIgODcwLjc3MzQzOCAzNDIuNjI4OTA2IDg3MC45OTYwOTQgMzM0LjI0MjE4OCBMIDg3MC45OTYwOTQgMTk5LjIyNjU2MiBaIE0gODI0LjM3MTA5NCAyOTUuMjUgQyA4MTcuODU5Mzc1IDMwNC45ODA0NjkgODA5LjQwMjM0NCAzMDYuNTUwNzgxIDgwNS44MDg1OTQgMzA2LjU1MDc4MSBDIDc5OC4wMjM0MzggMzA2LjU1MDc4MSA3OTMuMDg1OTM4IDMwMS4zMTI1IDc5MS4wNjY0MDYgMjk4LjkxNzk2OSBDIDc4Ni4xMjg5MDYgMjkzLjM3ODkwNiA3ODEuMjY1NjI1IDI4NC43NzM0MzggNzgxLjcxMDkzOCAyNjcuNDEwMTU2IEMgNzgyLjM4NjcxOSAyNDcuMjAzMTI1IDc4OS4yNjk1MzEgMjM4LjUxOTUzMSA3OTUuNTU4NTk0IDIzNC42Mjg5MDYgQyA3OTcuMzU1NDY5IDIzMy41ODIwMzEgODAxLjM5NDUzMSAyMzEuNDg4MjgxIDgwNi43MTA5MzggMjMxLjQ4ODI4MSBDIDgxMy41OTM3NSAyMzEuNDg4MjgxIDgxOC41MzEyNSAyMzUuNDUzMTI1IDgyMC41NTQ2ODggMjM3LjU1MDc4MSBDIDgyOC4zMzU5MzggMjQ1LjE3OTY4OCA4MjkuNjgzNTk0IDI1NS4xMzY3MTkgODMwLjEzMjgxMiAyNTkuMTAxNTYyIEMgODMwLjgwODU5NCAyNjMuODE2NDA2IDgzMC44MDg1OTQgMjY5LjM1NTQ2OSA4MzAuODA4NTk0IDI3MC40MDYyNSBDIDgzMC44MDg1OTQgMjc0LjgxNjQwNiA4MzEuMDM1MTU2IDI4NS4yOTY4NzUgODI0LjM3MTA5NCAyOTUuMjUgWiBNIDgyNC4zNzEwOTQgMjk1LjI1ICI+PC9wYXRoPgo8cGF0aCBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9InJnYigxMy43MjUyODElLCAxMS43NjQ1MjYlLCAxMi41NDg4MjglKSIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNIDk2MS40ODA0NjkgMzExLjI2OTUzMSBDIDk0NS44MzU5MzggMzExLjI2OTUzMSA5MzYuNDg0Mzc1IDMwNC4xNTYyNSA5MzMuMTEzMjgxIDI5OC4xNzE4NzUgQyA5MzAuNjQ4NDM4IDI5My45ODA0NjkgOTI5LjUyMzQzOCAyODguNzQyMTg4IDkyOC4xNzU3ODEgMjgzLjUwMzkwNiBMIDEwMTEuNjk5MjE5IDI4My4yNzczNDQgQyAxMDExLjQ3NjU2MiAyNzEuNDQ5MjE5IDEwMTEuMDI3MzQ0IDI1OC44Nzg5MDYgMTAwOC43ODUxNTYgMjQ3LjM1MTU2MiBDIDEwMDYuMzEyNSAyMzUuMzA0Njg4IDEwMDEuNTkzNzUgMjI2LjA5NzY1NiA5OTkuNDI5Njg4IDIyMi40Mjk2ODggQyA5OTIuNTM5MDYyIDIxMC4wNzgxMjUgOTgwLjI2NTYyNSAxOTUuNjM2NzE5IDk1MS45MDIzNDQgMTk1LjYzNjcxOSBDIDkyNC4yMTA5MzggMTk1LjYzNjcxOSA5MTAuMTQwNjI1IDIwOS4wMzUxNTYgOTAyLjgwNDY4OCAyMTkuNTExNzE5IEMgODg5Ljg1OTM3NSAyMzcuNjIxMDk0IDg4OS4xODM1OTQgMjU4Ljg3ODkwNiA4ODkuMTgzNTk0IDI2Ny4wMzkwNjIgQyA4ODkuMTgzNTk0IDI4Mi4wMDc4MTIgODkyLjEwNTQ2OSAyOTcuNDk2MDk0IDg5OC45ODgyODEgMzEwLjM2NzE4OCBDIDkxMi4xNjAxNTYgMzM1LjI5Mjk2OSA5MzQuMDE1NjI1IDM0Mi40MDIzNDQgOTU3Ljk2NDg0NCAzNDIuNDAyMzQ0IEMgOTgwLjI2NTYyNSAzNDIuNDAyMzQ0IDk5MC44MjAzMTIgMzM3LjM5MDYyNSAxMDAxLjA3NDIxOSAzMzMuMTk1MzEyIEwgMTAwMC4zOTg0MzggMzAwLjYzNjcxOSBDIDk4Ny44MjgxMjUgMzA1LjgwMDc4MSA5NzQuODc4OTA2IDMxMS4yNjk1MzEgOTYxLjQ4MDQ2OSAzMTEuMjY5NTMxIFogTSA5NDAuMDAzOTA2IDIyOC44NjcxODggQyA5NDQuOTQxNDA2IDIyNS40MjE4NzUgOTQ5LjM1OTM3NSAyMjUuMTk5MjE5IDk1MS44MjQyMTkgMjI1LjE5OTIxOSBDIDk1NC4wNzAzMTIgMjI1LjE5OTIxOSA5NTguNTYyNSAyMjUuNDIxODc1IDk2My42NTIzNDQgMjI5LjA4OTg0NCBDIDk3MS40Mzc1IDIzNC42Mjg5MDYgOTczLjAwNzgxMiAyNDIuNDg4MjgxIDk3My42ODM1OTQgMjQ2LjQ1NzAzMSBDIDk3NC4zNTU0NjkgMjQ5LjM3MTA5NCA5NzQuNTc4MTI1IDI1Mi41MTU2MjUgOTc1LjAyNzM0NCAyNTUuNjYwMTU2IEwgOTI3LjcyNjU2MiAyNTUuNjYwMTU2IEMgOTI5LjUyMzQzOCAyNDQuMTMyODEyIDkzMS4wOTc2NTYgMjM0LjYyODkwNiA5NDAuMDAzOTA2IDIyOC44NjcxODggWiBNIDk0MC4wMDM5MDYgMjI4Ljg2NzE4OCAiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoMTMuNzI1MjgxJSwgMTEuNzY0NTI2JSwgMTIuNTQ4ODI4JSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSAyNjYuODAwNzgxIDc0LjE2Nzk2OSBMIDI2NS45ODA0NjkgODEuODA0Njg4IEMgMjYyLjMwODU5NCA4MC40NTMxMjUgMjU4Ljg2NzE4OCA3OS43ODEyNSAyNTUuNTc0MjE5IDc5Ljc4MTI1IEMgMjUyLjg4MjgxMiA3OS43ODEyNSAyNTAuNzEwOTM4IDgwLjIyNjU2MiAyNDkuMTQwNjI1IDgxLjIwMzEyNSBDIDI0Ny40ODgyODEgODIuMTc5Njg4IDI0Ni43NDIxODggODMuNDQ5MjE5IDI0Ni43NDIxODggODUuMDE5NTMxIEMgMjQ2Ljc0MjE4OCA4Ni41MTU2MjUgMjQ3LjM0Mzc1IDg3Ljc5Mjk2OSAyNDguNjEzMjgxIDg4LjgzNTkzOCBDIDI0OS44ODY3MTkgODkuODgyODEyIDI1Mi4zNTU0NjkgOTEuMDA3ODEyIDI1NS45NDkyMTkgOTIuMjAzMTI1IEMgMjYwLjczODI4MSA5My43NzczNDQgMjY0LjE3OTY4OCA5NS42NDg0MzggMjY2LjM1MTU2MiA5Ny43NDIxODggQyAyNjguNDQ1MzEyIDk5LjkxNDA2MiAyNjkuNTY2NDA2IDEwMi42Nzk2ODggMjY5LjU2NjQwNiAxMDYuMTI4OTA2IEMgMjY5LjU2NjQwNiAxMTAuNTM5MDYyIDI2Ny44NTE1NjIgMTE0LjEzMjgxMiAyNjQuMzI4MTI1IDExNi43NTM5MDYgQyAyNjAuODg2NzE5IDExOS4zNzEwOTQgMjU2LjE3MTg3NSAxMjAuNzIyNjU2IDI1MC4yNjE3MTkgMTIwLjcyMjY1NiBDIDI0NS40NzI2NTYgMTIwLjcyMjY1NiAyNDAuOTgwNDY5IDEyMC4wNDY4NzUgMjM2LjcxMDkzOCAxMTguNjk5MjE5IEwgMjM3LjY4NzUgMTEwLjQ2NDg0NCBDIDI0MS43MzA0NjkgMTEyLjI2MTcxOSAyNDUuNzY5NTMxIDExMy4xNjAxNTYgMjQ5LjczNDM3NSAxMTMuMTYwMTU2IEMgMjUyLjUwNzgxMiAxMTMuMTYwMTU2IDI1NC43NTM5MDYgMTEyLjYzNjcxOSAyNTYuNDcyNjU2IDExMS41ODk4NDQgQyAyNTguMTk1MzEyIDExMC41MzkwNjIgMjU5LjAxNTYyNSAxMDkuMTIxMDk0IDI1OS4wMTU2MjUgMTA3LjMyNDIxOSBDIDI1OS4wMTU2MjUgMTA1LjUyNzM0NCAyNTguMzQzNzUgMTA0LjEwNTQ2OSAyNTYuOTk2MDk0IDEwMi45ODA0NjkgQyAyNTUuNjQ4NDM4IDEwMS44NTkzNzUgMjUzLjAyNzM0NCAxMDAuNjY0MDYyIDI0OS4xNDA2MjUgOTkuMzEyNSBDIDI0NC41NzAzMTIgOTcuODE2NDA2IDI0MS4yMDMxMjUgOTYuMDIzNDM4IDIzOS4xODM1OTQgOTQgQyAyMzcuMTY0MDYyIDkxLjk4MDQ2OSAyMzYuMTE3MTg4IDg5LjI4OTA2MiAyMzYuMTE3MTg4IDg1Ljk5NjA5NCBDIDIzNi4xMTcxODggODEuODc4OTA2IDIzNy43NjE3MTkgNzguNjU2MjUgMjQxLjEyODkwNiA3Ni4xOTE0MDYgQyAyNDQuNDk2MDk0IDczLjcxODc1IDI0OC45MTQwNjIgNzIuNTIzNDM4IDI1NC40NTMxMjUgNzIuNTIzNDM4IEMgMjU4Ljk0MTQwNiA3Mi40NDkyMTkgMjYzLjA1ODU5NCA3My4wNDI5NjkgMjY2LjgwMDc4MSA3NC4xNjc5NjkgWiBNIDI2Ni44MDA3ODEgNzQuMTY3OTY5ICI+PC9wYXRoPgo8cGF0aCBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9InJnYigxMy43MjUyODElLCAxMS43NjQ1MjYlLCAxMi41NDg4MjglKSIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNIDM0OS44MDA3ODEgMTEwLjY5MTQwNiBMIDM1MC4xNzU3ODEgMTE4Ljc3MzQzOCBDIDM0Ni44ODI4MTIgMTE5LjgyMDMxMiAzNDIuOTE0MDYyIDEyMC4zNDc2NTYgMzM4LjE5OTIxOSAxMjAuMzQ3NjU2IEMgMzI5LjgxNjQwNiAxMjAuMzQ3NjU2IDMyMy4xNTIzNDQgMTE4LjI1IDMxOC4wNjY0MDYgMTEzLjk4NDM3NSBDIDMxMi45NzY1NjIgMTA5Ljc4OTA2MiAzMTAuNDI5Njg4IDEwMy45NTcwMzEgMzEwLjQyOTY4OCA5Ni41NDY4NzUgQyAzMTAuNDI5Njg4IDg5LjQzNzUgMzEyLjk3NjU2MiA4My42NzU3ODEgMzE4LjA2NjQwNiA3OS4zMzIwMzEgQyAzMjMuMTUyMzQ0IDc0Ljk4ODI4MSAzMjkuNjY3OTY5IDcyLjgyNDIxOSAzMzcuNTI3MzQ0IDcyLjgyNDIxOSBDIDM0Mi4yMzgyODEgNzIuODI0MjE5IDM0Ni40MzM1OTQgNzMuMzQzNzUgMzQ5Ljk0OTIxOSA3NC40Njg3NSBMIDM0OS4xOTkyMTkgODIuNTUwNzgxIEMgMzQ1Ljc1NzgxMiA4MS4xMjg5MDYgMzQyLjE2NDA2MiA4MC4zODI4MTIgMzM4LjM0NzY1NiA4MC4zODI4MTIgQyAzMzMuMTgzNTk0IDgwLjM4MjgxMiAzMjkuMDY2NDA2IDgxLjcyNjU2MiAzMjYgODQuNDk2MDk0IEMgMzIyLjkzMzU5NCA4Ny4yNjU2MjUgMzIxLjQzMzU5NCA5MS4xNjAxNTYgMzIxLjQzMzU5NCA5Ni4yNDYwOTQgQyAzMjEuNDMzNTk0IDEwMS4yNjE3MTkgMzIzLjA3ODEyNSAxMDUuMjI2NTYyIDMyNi4zMDA3ODEgMTA4LjE0NDUzMSBDIDMyOS41MTU2MjUgMTExLjA2NjQwNiAzMzMuNjMyODEyIDExMi40ODgyODEgMzM4LjU3NDIxOSAxMTIuNDg4MjgxIEMgMzQyLjYxMzI4MSAxMTIuNDg4MjgxIDM0Ni4zNTU0NjkgMTExLjg4NjcxOSAzNDkuODAwNzgxIDExMC42OTE0MDYgWiBNIDM0OS44MDA3ODEgMTEwLjY5MTQwNiAiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoMTMuNzI1MjgxJSwgMTEuNzY0NTI2JSwgMTIuNTQ4ODI4JSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSAzODguNTY2NDA2IDExOS44OTQ1MzEgTCAzODguNTY2NDA2IDczLjI2OTUzMSBMIDM5Ny45MjE4NzUgNzMuMjY5NTMxIEwgMzk3LjkyMTg3NSA5MS44MjgxMjUgTCA0MTYuNDEwMTU2IDkxLjgyODEyNSBMIDQxNi40MTAxNTYgNzMuMjY5NTMxIEwgNDI1Ljc2NTYyNSA3My4yNjk1MzEgTCA0MjUuNzY1NjI1IDExOS44OTQ1MzEgTCA0MTYuNDEwMTU2IDExOS44OTQ1MzEgTCA0MTYuNDEwMTU2IDk5Ljc2NTYyNSBMIDM5Ny45MjE4NzUgOTkuNzY1NjI1IEwgMzk3LjkyMTg3NSAxMTkuODk0NTMxIFogTSAzODguNTY2NDA2IDExOS44OTQ1MzEgIj48L3BhdGg+CjxwYXRoIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0icmdiKDEzLjcyNTI4MSUsIDExLjc2NDUyNiUsIDEyLjU0ODgyOCUpIiBmaWxsLW9wYWNpdHk9IjEiIGQ9Ik0gNDY3LjgyNDIxOSAxMTkuODk0NTMxIEwgNDY3LjgyNDIxOSA3My4yNjk1MzEgTCA0NzguMTU2MjUgNzMuMjY5NTMxIEwgNDc4LjE1NjI1IDExMS44MTY0MDYgTCA0OTcuOTg4MjgxIDExMS44MTY0MDYgTCA0OTcuOTg4MjgxIDExOS44MjAzMTIgTCA0NjcuODI0MjE5IDExOS44MjAzMTIgWiBNIDQ2Ny44MjQyMTkgMTE5Ljg5NDUzMSAiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoMTMuNzI1MjgxJSwgMTEuNzY0NTI2JSwgMTIuNTQ4ODI4JSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSA1NTkuMDU4NTk0IDcyLjQ0OTIxOSBDIDU2NS45NDE0MDYgNzIuNDQ5MjE5IDU3MS4zMzIwMzEgNzQuNjE3MTg4IDU3NS4zNzEwOTQgNzguODgyODEyIEMgNTc5LjQxNDA2MiA4My4xNDg0MzggNTgxLjQzNzUgODguOTg4MjgxIDU4MS40Mzc1IDk2LjMyMDMxMiBDIDU4MS40Mzc1IDEwMy43MzA0NjkgNTc5LjMzOTg0NCAxMDkuNjQ0NTMxIDU3NS4xNDg0MzggMTE0LjA1ODU5NCBDIDU3MC45NjA5MzggMTE4LjQ3NjU2MiA1NjUuNDE3OTY5IDEyMC42NDQ1MzEgNTU4LjQ1NzAzMSAxMjAuNjQ0NTMxIEMgNTUxLjU3NDIxOSAxMjAuNjQ0NTMxIDU0Ni4wMzUxNTYgMTE4LjQ3NjU2MiA1NDEuOTE3OTY5IDExNC4xMzI4MTIgQyA1MzcuODAwNzgxIDEwOS43ODkwNjIgNTM1Ljc4NTE1NiAxMDMuOTU3MDMxIDUzNS43ODUxNTYgOTYuNjIxMDk0IEMgNTM1Ljc4NTE1NiA4OC45MTQwNjIgNTM3LjgwMDc4MSA4MyA1NDEuODQzNzUgNzguNzMwNDY5IEMgNTQ1Ljg4NjcxOSA3NC40Njg3NSA1NTEuNzIyNjU2IDcyLjQ0OTIxOSA1NTkuMDU4NTk0IDcyLjQ0OTIxOSBaIE0gNTU4LjUzMTI1IDc5LjcwNzAzMSBDIDU1NC43ODkwNjIgNzkuNzA3MDMxIDU1MS43OTY4NzUgODEuMjc3MzQ0IDU0OS40NzY1NjIgODQuMzQzNzUgQyA1NDcuMTU2MjUgODcuNDE3OTY5IDU0Ni4wMzUxNTYgOTEuNTM1MTU2IDU0Ni4wMzUxNTYgOTYuNjIxMDk0IEMgNTQ2LjAzNTE1NiAxMDEuNzEwOTM4IDU0Ny4yMzA0NjkgMTA1Ljc1MzkwNiA1NDkuNTUwNzgxIDEwOC44MjAzMTIgQyA1NTEuODc1IDExMS44ODY3MTkgNTU1LjAxNTYyNSAxMTMuMzg2NzE5IDU1OC45MDYyNSAxMTMuMzg2NzE5IEMgNTYyLjY0ODQzOCAxMTMuMzg2NzE5IDU2NS43MTg3NSAxMTEuODE2NDA2IDU2OC4wMzkwNjIgMTA4Ljc0NjA5NCBDIDU3MC4zNTkzNzUgMTA1LjYwMTU2MiA1NzEuNTU0Njg4IDEwMS41NTg1OTQgNTcxLjU1NDY4OCA5Ni42MjEwOTQgQyA1NzEuNTU0Njg4IDkxLjQ1MzEyNSA1NzAuMzU5Mzc1IDg3LjMzOTg0NCA1NjguMDM5MDYyIDg0LjM0Mzc1IEMgNTY1LjU2NjQwNiA4MS4yNzczNDQgNTYyLjUgNzkuNzA3MDMxIDU1OC41MzEyNSA3OS43MDcwMzEgWiBNIDU1OC41MzEyNSA3OS43MDcwMzEgIj48L3BhdGg+CjxwYXRoIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0icmdiKDEzLjcyNTI4MSUsIDExLjc2NDUyNiUsIDEyLjU0ODgyOCUpIiBmaWxsLW9wYWNpdHk9IjEiIGQ9Ik0gNjUyLjAxMTcxOSA3NC4xNjc5NjkgTCA2NTEuMTg3NSA4MS44MDQ2ODggQyA2NDcuNTE5NTMxIDgwLjQ1MzEyNSA2NDQuMDc4MTI1IDc5Ljc4MTI1IDY0MC43ODUxNTYgNzkuNzgxMjUgQyA2MzguMDg5ODQ0IDc5Ljc4MTI1IDYzNS45MTc5NjkgODAuMjI2NTYyIDYzNC4zNDc2NTYgODEuMjAzMTI1IEMgNjMyLjcwMzEyNSA4Mi4xNzk2ODggNjMxLjk1NzAzMSA4My40NDkyMTkgNjMxLjk1NzAzMSA4NS4wMTk1MzEgQyA2MzEuOTU3MDMxIDg2LjUxNTYyNSA2MzIuNTUwNzgxIDg3Ljc5Mjk2OSA2MzMuODI4MTI1IDg4LjgzNTkzOCBDIDYzNS4wOTc2NTYgODkuODgyODEyIDYzNy41NjY0MDYgOTEuMDA3ODEyIDY0MS4xNTYyNSA5Mi4yMDMxMjUgQyA2NDUuOTQ5MjE5IDkzLjc3NzM0NCA2NDkuMzkwNjI1IDk1LjY0ODQzOCA2NTEuNTYyNSA5Ny43NDIxODggQyA2NTMuNjYwMTU2IDk5LjkxNDA2MiA2NTQuNzgxMjUgMTAyLjY3OTY4OCA2NTQuNzgxMjUgMTA2LjEyODkwNiBDIDY1NC43ODEyNSAxMTAuNTM5MDYyIDY1My4wNTg1OTQgMTE0LjEzMjgxMiA2NDkuNTQyOTY5IDExNi43NTM5MDYgQyA2NDYuMDk3NjU2IDExOS4zNzEwOTQgNjQxLjM4MjgxMiAxMjAuNzIyNjU2IDYzNS40NzI2NTYgMTIwLjcyMjY1NiBDIDYzMC42Nzk2ODggMTIwLjcyMjY1NiA2MjYuMTg3NSAxMjAuMDQ2ODc1IDYyMS45MjU3ODEgMTE4LjY5OTIxOSBMIDYyMi44OTQ1MzEgMTEwLjQ2NDg0NCBDIDYyNi45Mzc1IDExMi4yNjE3MTkgNjMwLjk4MDQ2OSAxMTMuMTYwMTU2IDYzNC45NDkyMTkgMTEzLjE2MDE1NiBDIDYzNy43MTQ4NDQgMTEzLjE2MDE1NiA2MzkuOTYwOTM4IDExMi42MzY3MTkgNjQxLjY4MzU5NCAxMTEuNTg5ODQ0IEMgNjQzLjQwMjM0NCAxMTAuNTM5MDYyIDY0NC4yMjY1NjIgMTA5LjEyMTA5NCA2NDQuMjI2NTYyIDEwNy4zMjQyMTkgQyA2NDQuMjI2NTYyIDEwNS41MjczNDQgNjQzLjU1NDY4OCAxMDQuMTA1NDY5IDY0Mi4yMDcwMzEgMTAyLjk4MDQ2OSBDIDY0MC44NTU0NjkgMTAxLjg1OTM3NSA2MzguMjM4MjgxIDEwMC42NjQwNjIgNjM0LjM0NzY1NiA5OS4zMTI1IEMgNjI5Ljc4NTE1NiA5Ny44MTY0MDYgNjI2LjQxNDA2MiA5Ni4wMjM0MzggNjI0LjM5MDYyNSA5NCBDIDYyMi4zNzUgOTEuOTgwNDY5IDYyMS4zMjQyMTkgODkuMjg5MDYyIDYyMS4zMjQyMTkgODUuOTk2MDk0IEMgNjIxLjMyNDIxOSA4MS44Nzg5MDYgNjIyLjk3MjY1NiA3OC42NTYyNSA2MjYuMzQzNzUgNzYuMTkxNDA2IEMgNjI5LjcxMDkzOCA3My43MTg3NSA2MzQuMTIxMDk0IDcyLjUyMzQzOCA2MzkuNjYwMTU2IDcyLjUyMzQzOCBDIDY0NC4xNTIzNDQgNzIuNDQ5MjE5IDY0OC4zMzk4NDQgNzMuMDQyOTY5IDY1Mi4wMTE3MTkgNzQuMTY3OTY5IFogTSA2NTIuMDExNzE5IDc0LjE2Nzk2OSAiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoMTMuNzI1MjgxJSwgMTEuNzY0NTI2JSwgMTIuNTQ4ODI4JSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSA3MjIuOTYwOTM4IDc0LjE2Nzk2OSBMIDcyMi4xNDA2MjUgODEuODA0Njg4IEMgNzE4LjQ3MjY1NiA4MC40NTMxMjUgNzE1LjAzMTI1IDc5Ljc4MTI1IDcxMS43MzQzNzUgNzkuNzgxMjUgQyA3MDkuMDQyOTY5IDc5Ljc4MTI1IDcwNi44NzEwOTQgODAuMjI2NTYyIDcwNS4zMDA3ODEgODEuMjAzMTI1IEMgNzAzLjY1MjM0NCA4Mi4xNzk2ODggNzAyLjkwMjM0NCA4My40NDkyMTkgNzAyLjkwMjM0NCA4NS4wMTk1MzEgQyA3MDIuOTAyMzQ0IDg2LjUxNTYyNSA3MDMuNTAzOTA2IDg3Ljc5Mjk2OSA3MDQuNzczNDM4IDg4LjgzNTkzOCBDIDcwNi4wNDY4NzUgODkuODgyODEyIDcwOC41MTU2MjUgOTEuMDA3ODEyIDcxMi4xMDkzNzUgOTIuMjAzMTI1IEMgNzE2LjkwMjM0NCA5My43NzczNDQgNzIwLjM0Mzc1IDk1LjY0ODQzOCA3MjIuNTE1NjI1IDk3Ljc0MjE4OCBDIDcyNC42MDU0NjkgOTkuOTE0MDYyIDcyNS43MzA0NjkgMTAyLjY3OTY4OCA3MjUuNzMwNDY5IDEwNi4xMjg5MDYgQyA3MjUuNzMwNDY5IDExMC41MzkwNjIgNzI0LjAxMTcxOSAxMTQuMTMyODEyIDcyMC40ODgyODEgMTE2Ljc1MzkwNiBDIDcxNy4wNDY4NzUgMTE5LjM3MTA5NCA3MTIuMzMyMDMxIDEyMC43MjI2NTYgNzA2LjQyMTg3NSAxMjAuNzIyNjU2IEMgNzAxLjYzMjgxMiAxMjAuNzIyNjU2IDY5Ny4xNDA2MjUgMTIwLjA0Njg3NSA2OTIuODcxMDk0IDExOC42OTkyMTkgTCA2OTMuODQ3NjU2IDExMC40NjQ4NDQgQyA2OTcuODkwNjI1IDExMi4yNjE3MTkgNzAxLjkzMzU5NCAxMTMuMTYwMTU2IDcwNS44OTQ1MzEgMTEzLjE2MDE1NiBDIDcwOC42Njc5NjkgMTEzLjE2MDE1NiA3MTAuOTE0MDYyIDExMi42MzY3MTkgNzEyLjYzMjgxMiAxMTEuNTg5ODQ0IEMgNzE0LjM1NTQ2OSAxMTAuNTM5MDYyIDcxNS4xNzU3ODEgMTA5LjEyMTA5NCA3MTUuMTc1NzgxIDEwNy4zMjQyMTkgQyA3MTUuMTc1NzgxIDEwNS41MjczNDQgNzE0LjUwMzkwNiAxMDQuMTA1NDY5IDcxMy4xNjAxNTYgMTAyLjk4MDQ2OSBDIDcxMS44MDg1OTQgMTAxLjg1OTM3NSA3MDkuMTkxNDA2IDEwMC42NjQwNjIgNzA1LjMwMDc4MSA5OS4zMTI1IEMgNzAwLjczMDQ2OSA5Ny44MTY0MDYgNjk3LjM2MzI4MSA5Ni4wMjM0MzggNjk1LjM0Mzc1IDk0IEMgNjkzLjMyNDIxOSA5MS45ODA0NjkgNjkyLjI3NzM0NCA4OS4yODkwNjIgNjkyLjI3NzM0NCA4NS45OTYwOTQgQyA2OTIuMjc3MzQ0IDgxLjg3ODkwNiA2OTMuOTIxODc1IDc4LjY1NjI1IDY5Ny4yODkwNjIgNzYuMTkxNDA2IEMgNzAwLjY1NjI1IDczLjcxODc1IDcwNS4wNzQyMTkgNzIuNTIzNDM4IDcxMC42MTMyODEgNzIuNTIzNDM4IEMgNzE1LjEwMTU2MiA3Mi40NDkyMTkgNzE5LjI5Mjk2OSA3My4wNDI5NjkgNzIyLjk2MDkzOCA3NC4xNjc5NjkgWiBNIDcyMi45NjA5MzggNzQuMTY3OTY5ICI+PC9wYXRoPgo8cGF0aCBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9InJnYigxMy43MjUyODElLCAxMS43NjQ1MjYlLCAxMi41NDg4MjglKSIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNIDc2Ny45NDE0MDYgMTE5Ljg5NDUzMSBMIDc2Ny45NDE0MDYgNzMuMjY5NTMxIEwgNzk4LjE3OTY4OCA3My4yNjk1MzEgTCA3OTguMTc5Njg4IDgwLjk3NjU2MiBMIDc3OC4xMTcxODggODAuOTc2NTYyIEwgNzc4LjExNzE4OCA5Mi4yMDMxMjUgTCA3OTYuNjA1NDY5IDkyLjIwMzEyNSBMIDc5Ni42MDU0NjkgOTkuNzY1NjI1IEwgNzc4LjExNzE4OCA5OS43NjU2MjUgTCA3NzguMTE3MTg4IDExMi4wMzUxNTYgTCA3OTguMzk4NDM4IDExMi4wMzUxNTYgTCA3OTguMzk4NDM4IDExOS44MjAzMTIgTCA3NjcuOTQxNDA2IDExOS44MjAzMTIgWiBNIDc2Ny45NDE0MDYgMTE5Ljg5NDUzMSAiPjwvcGF0aD4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoMTMuNzI1MjgxJSwgMTEuNzY0NTI2JSwgMTIuNTQ4ODI4JSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSA4MzkuNzg5MDYyIDExOS44OTQ1MzEgTCA4MzkuNzg5MDYyIDczLjI2OTUzMSBMIDg1NC42MDkzNzUgNzMuMjY5NTMxIEMgODYxLjQ5MjE4OCA3My4yNjk1MzEgODY2LjczMDQ2OSA3NC4xNjc5NjkgODcwLjI0NjA5NCA3NS45NjQ4NDQgQyA4NzMuNzY5NTMxIDc3Ljc2MTcxOSA4NzUuNTY2NDA2IDgwLjkwMjM0NCA4NzUuNTY2NDA2IDg1LjU0Njg3NSBDIDg3NS41NjY0MDYgODguNTM5MDYyIDg3NC42NjQwNjIgOTEuMDA3ODEyIDg3Mi43OTI5NjkgOTIuODc4OTA2IEMgODcwLjkyMTg3NSA5NC43NSA4NjguMzAwNzgxIDk1Ljk0NTMxMiA4NjQuODU5Mzc1IDk2LjU0Njg3NSBMIDg2NC44NTkzNzUgOTYuNjk1MzEyIEMgODY2LjU4NTkzOCA5Ny4wNjY0MDYgODY3Ljg1NTQ2OSA5Ny43NDIxODggODY4Ljc1IDk4LjY0NDUzMSBDIDg2OS42NTIzNDQgOTkuNTM5MDYyIDg3MC41NDY4NzUgMTAwLjk2MDkzOCA4NzEuMzcxMDk0IDEwMi45MDYyNSBMIDg3OS4zMDg1OTQgMTE5Ljg5NDUzMSBMIDg2Ny45Mjk2ODggMTE5Ljg5NDUzMSBMIDg2Mi4yNDIxODggMTA2LjY0ODQzOCBDIDg2MS4xMTcxODggMTA0LjEwNTQ2OSA4NTkuOTk2MDk0IDEwMi4zODY3MTkgODU4Ljk0OTIxOSAxMDEuNjM2NzE5IEMgODU3Ljg5ODQzOCAxMDAuODkwNjI1IDg1NS44Nzg5MDYgMTAwLjUxNTYyNSA4NTIuODEyNSAxMDAuNTE1NjI1IEwgODUwLjExNzE4OCAxMDAuNTE1NjI1IEwgODUwLjExNzE4OCAxMTkuODk0NTMxIFogTSA4NTAuMTE3MTg4IDgwLjYwMTU2MiBMIDg1MC4xMTcxODggOTMuMjUgTCA4NTMuMTEzMjgxIDkzLjI1IEMgODU3LjIzMDQ2OSA5My4yNSA4NjAuMjIyNjU2IDkyLjczMDQ2OSA4NjIuMDkzNzUgOTEuNjc5Njg4IEMgODYzLjk2NDg0NCA5MC42MzI4MTIgODY0LjkzMzU5NCA4OC45ODgyODEgODY0LjkzMzU5NCA4Ni42Njc5NjkgQyA4NjQuOTMzNTk0IDg0LjI2OTUzMSA4NjMuOTY0ODQ0IDgyLjYyNSA4NjIuMDkzNzUgODEuODA0Njg4IEMgODYwLjIyMjY1NiA4MC45NzY1NjIgODU3LjIzMDQ2OSA4MC41MjczNDQgODUzLjExMzI4MSA4MC41MjczNDQgTCA4NTAuMTE3MTg4IDgwLjUyNzM0NCBaIE0gODUwLjExNzE4OCA4MC42MDE1NjIgIj48L3BhdGg+CjxwYXRoIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0icmdiKDEzLjcyNTI4MSUsIDExLjc2NDUyNiUsIDEyLjU0ODgyOCUpIiBmaWxsLW9wYWNpdHk9IjEiIGQ9Ik0gOTE2LjIwMzEyNSAxMTkuODk0NTMxIEwgOTE2LjIwMzEyNSA3My4yNjk1MzEgTCA5NDYuNDM3NSA3My4yNjk1MzEgTCA5NDYuNDM3NSA4MC45NzY1NjIgTCA5MjYuMzc4OTA2IDgwLjk3NjU2MiBMIDkyNi4zNzg5MDYgOTIuMjAzMTI1IEwgOTQ0Ljg2NzE4OCA5Mi4yMDMxMjUgTCA5NDQuODY3MTg4IDk5Ljc2NTYyNSBMIDkyNi4zNzg5MDYgOTkuNzY1NjI1IEwgOTI2LjM3ODkwNiAxMTIuMDM1MTU2IEwgOTQ2LjY2NDA2MiAxMTIuMDM1MTU2IEwgOTQ2LjY2NDA2MiAxMTkuODIwMzEyIEwgOTE2LjIwMzEyNSAxMTkuODIwMzEyIFogTSA5MTYuMjAzMTI1IDExOS44OTQ1MzEgIj48L3BhdGg+CjxwYXRoIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0icmdiKDEzLjcyNTI4MSUsIDExLjc2NDUyNiUsIDEyLjU0ODgyOCUpIiBmaWxsLW9wYWNpdHk9IjEiIGQ9Ik0gOTg5LjU0Njg3NSA3My4yNjk1MzEgTCA5OTkuODc1IDczLjI2OTUzMSBMIDk5OS44NzUgMTE5Ljg5NDUzMSBMIDk4OS41NDY4NzUgMTE5Ljg5NDUzMSBaIE0gOTg5LjU0Njg3NSA3My4yNjk1MzEgIj48L3BhdGg+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwLTIpIj4KPHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSJyZ2IoOTIuOTM5NzU4JSwgMTAuNTg4MDc0JSwgMTQuMTE3NDMyJSkiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTSAxLjAzOTA2MiAyNTkuOTI1NzgxIEwgNDM3LjY2NDA2MiAyNTkuOTI1NzgxIEwgNDM3LjY2NDA2MiAyODQuMjUgTCAxLjAzOTA2MiAyODQuMjUgWiBNIDEuMDM5MDYyIDI1OS45MjU3ODEgIj48L3BhdGg+CjwvZz4KPC9zdmc+";
function Logo({
  width = 240,
  alt = 'Schlosserei Menge',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("img", _extends({
    src: LOGO_SRC,
    alt: alt,
    width: width,
    style: {
      display: 'block',
      height: 'auto',
      maxWidth: '100%',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/Strich.jsx
try { (() => {
function Strich({
  weight = 'klein',
  length = 96,
  bleed = 0,
  style
}) {
  const h = weight === 'gross' ? 'var(--stroke-gross)' : weight === 'klein' ? 'var(--stroke-klein)' : weight;
  const w = typeof length === 'number' ? length + 'px' : length;
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      height: h,
      width: bleed ? `calc(${w} + ${typeof bleed === 'number' ? bleed + 'px' : bleed})` : w,
      marginLeft: bleed ? typeof bleed === 'number' ? -bleed + 'px' : `calc(-1 * ${bleed})` : 0,
      background: 'var(--signalrot)',
      flex: 'none',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Strich });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Strich.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const V = {
  hell: ['var(--blau-hell)', 'var(--tiefschwarz)'],
  blau: ['var(--menge-blau)', 'var(--tiefschwarz)'],
  dunkel: ['var(--tiefschwarz)', 'var(--weiss)'],
  rahmen: ['var(--weiss)', 'var(--tiefschwarz)']
};
function Badge({
  variant = 'hell',
  children,
  style
}) {
  const [bg, fg] = V[variant] || V.hell;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 24,
      padding: '0 8px',
      background: bg,
      color: fg,
      border: variant === 'rahmen' ? '1px solid var(--tiefschwarz)' : '1px solid transparent',
      borderRadius: 'var(--radius-2)',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
const T = {
  rahmen: {
    background: 'var(--weiss)',
    border: '1px solid var(--linie)'
  },
  kasten: {
    background: 'var(--blau-hell)',
    border: '1px solid transparent'
  },
  band: {
    background: 'var(--menge-blau)',
    border: '1px solid transparent'
  }
};
function Card({
  variant = 'rahmen',
  eyebrow,
  title,
  image,
  imageAlt = '',
  stroke = false,
  footer,
  onClick,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...(T[variant] || T.rahmen),
      borderRadius: 'var(--radius-0)',
      color: 'var(--tiefschwarz)',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      borderColor: onClick && hover ? 'var(--tiefschwarz)' : undefined,
      ...style
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      display: 'block',
      width: '100%',
      aspectRatio: '3 / 2',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-16)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)',
      flex: 1
    }
  }, stroke && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      height: 'var(--stroke-klein)',
      width: 48,
      marginLeft: 'calc(-1 * var(--space-16))',
      background: 'var(--signalrot)'
    }
  }), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 600,
      letterSpacing: '0.3em',
      textTransform: 'uppercase'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: '26px',
      fontWeight: 700,
      textDecoration: onClick && hover ? 'underline' : 'none',
      textUnderlineOffset: 4
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: '24px'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 'var(--space-8)',
      fontSize: 13,
      lineHeight: '18px',
      color: variant === 'band' ? 'var(--tiefschwarz)' : 'var(--tiefschwarz-gedaempft)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const norm = items.map(i => typeof i === 'string' ? {
    value: i,
    label: i
  } : i);
  const [inner, setInner] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
  const cur = value !== undefined ? value : inner;
  const [hov, setHov] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 'var(--space-24)',
      borderBottom: '1px solid var(--linie)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, norm.map(t => {
    const on = t.value === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        if (value === undefined) setInner(t.value);
        onChange && onChange(t.value);
      },
      onMouseEnter: () => setHov(t.value),
      onMouseLeave: () => setHov(null),
      style: {
        appearance: 'none',
        background: 'none',
        border: 0,
        padding: '12px 0',
        marginBottom: -1,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 16,
        lineHeight: '24px',
        fontWeight: on ? 700 : 400,
        color: on || hov === t.value ? 'var(--tiefschwarz)' : 'var(--tiefschwarz-gedaempft)',
        boxShadow: on ? 'inset 0 -4px 0 var(--signalrot)' : hov === t.value ? 'inset 0 -2px 0 var(--tiefschwarz)' : 'none'
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = false,
  title,
  children,
  actions,
  onClose,
  width = 520,
  inline = false
}) {
  if (!open) return null;
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--weiss)',
      color: 'var(--tiefschwarz)',
      fontFamily: 'var(--font-sans)',
      borderRadius: 'var(--radius-0)',
      boxShadow: 'var(--shadow-float)',
      boxSizing: 'border-box',
      padding: 'var(--space-24)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      height: 'var(--stroke-klein)',
      width: 64,
      marginLeft: 'calc(-1 * var(--space-24))',
      background: 'var(--signalrot)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 24,
      lineHeight: '30px',
      fontWeight: 700
    }
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Schlie\xDFen",
    style: {
      appearance: 'none',
      border: 0,
      background: 'none',
      cursor: 'pointer',
      fontSize: 28,
      lineHeight: '28px',
      padding: 0,
      width: 32,
      height: 32,
      color: 'var(--tiefschwarz)',
      fontFamily: 'inherit'
    }
  }, "\xD7")), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: '24px'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-8)',
      paddingTop: 'var(--space-8)'
    }
  }, actions));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay)',
      display: 'grid',
      placeItems: 'center',
      padding: 'var(--space-24)',
      zIndex: 1000
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  title,
  children,
  tone = 'info',
  onClose,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-16)',
      width: 360,
      maxWidth: '100%',
      boxSizing: 'border-box',
      padding: 'var(--space-16)',
      background: 'var(--tiefschwarz)',
      color: 'var(--weiss)',
      borderRadius: 'var(--radius-2)',
      boxShadow: 'var(--shadow-float)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 16,
      height: 4,
      marginTop: 10,
      flex: 'none',
      background: tone === 'fehler' ? 'var(--signalrot)' : 'var(--menge-blau)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 700
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: '20px'
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Schlie\xDFen",
    style: {
      appearance: 'none',
      border: 0,
      background: 'none',
      color: 'var(--weiss)',
      cursor: 'pointer',
      fontSize: 22,
      lineHeight: '24px',
      padding: 0,
      fontFamily: 'inherit'
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  placement = 'top',
  open,
  children
}) {
  const [show, setShow] = React.useState(false);
  const vis = open !== undefined ? open : show;
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, children, vis && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      background: 'var(--tiefschwarz)',
      color: 'var(--weiss)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      lineHeight: '18px',
      padding: '6px 10px',
      borderRadius: 'var(--radius-2)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 10
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    h: 36,
    px: 14,
    fs: 14
  },
  md: {
    h: 44,
    px: 20,
    fs: 16
  },
  lg: {
    h: 52,
    px: 28,
    fs: 18
  }
};
const V = {
  primary: {
    bg: 'var(--tiefschwarz)',
    bgH: 'var(--tiefschwarz-hover)',
    fg: 'var(--weiss)',
    bd: 'var(--tiefschwarz)'
  },
  secondary: {
    bg: 'var(--menge-blau)',
    bgH: 'var(--menge-blau-hover)',
    fg: 'var(--tiefschwarz)',
    bd: 'var(--menge-blau)'
  },
  outline: {
    bg: 'var(--weiss)',
    bgH: 'var(--blau-hell)',
    fg: 'var(--tiefschwarz)',
    bd: 'var(--tiefschwarz)'
  },
  ghost: {
    bg: 'transparent',
    bgH: 'transparent',
    fg: 'var(--tiefschwarz)',
    bd: 'transparent'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md,
    v = V[variant] || V.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: `0 ${s.px}px`,
      fontFamily: 'var(--font-sans)',
      fontSize: s.fs,
      fontWeight: 600,
      lineHeight: 1,
      background: hover && !disabled ? v.bgH : v.bg,
      color: v.fg,
      border: `2px solid ${v.bd}`,
      borderRadius: 'var(--radius-2)',
      textDecoration: variant === 'ghost' && hover && !disabled ? 'underline' : 'none',
      textUnderlineOffset: 4,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transform: press && !disabled ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 12,
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: '24px',
      color: 'var(--tiefschwarz)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": on,
    tabIndex: disabled ? -1 : 0,
    onClick: e => {
      e.preventDefault();
      toggle();
    },
    onKeyDown: e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    },
    style: {
      width: 20,
      height: 20,
      marginTop: 2,
      flex: 'none',
      boxSizing: 'border-box',
      border: '2px solid var(--tiefschwarz)',
      borderRadius: 'var(--radius-2)',
      background: on ? 'var(--tiefschwarz)' : 'var(--weiss)',
      position: 'relative'
    }
  }, on && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 5,
      top: 1,
      width: 5,
      height: 10,
      borderRight: '2px solid var(--weiss)',
      borderBottom: '2px solid var(--weiss)',
      transform: 'rotate(45deg)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.preventDefault();
      toggle();
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Label({
  id,
  label,
  required
}) {
  if (!label) return null;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 600,
      color: 'var(--tiefschwarz)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, " *"));
}
function Help({
  hint,
  error
}) {
  if (error) return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      lineHeight: '18px',
      color: 'var(--tiefschwarz)',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 4,
      background: 'var(--signalrot)',
      flex: 'none'
    }
  }), error);
  if (hint) return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: '18px',
      color: 'var(--tiefschwarz-gedaempft)'
    }
  }, hint);
  return null;
}
function Input({
  label,
  hint,
  error,
  required = false,
  multiline = false,
  rows = 4,
  disabled = false,
  id,
  value,
  defaultValue,
  placeholder,
  type = 'text',
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fid = id || React.useId();
  const Tag = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Label, {
    id: fid,
    label: label,
    required: required
  }), /*#__PURE__*/React.createElement(Tag, _extends({
    id: fid,
    type: multiline ? undefined : type,
    rows: multiline ? rows : undefined,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    disabled: disabled,
    required: required,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    "aria-invalid": !!error,
    style: {
      height: multiline ? 'auto' : 44,
      padding: multiline ? '10px 12px' : '0 12px',
      fontFamily: 'inherit',
      fontSize: 16,
      lineHeight: '24px',
      color: 'var(--tiefschwarz)',
      background: disabled ? 'var(--blau-hell)' : 'var(--weiss)',
      border: '1px solid var(--tiefschwarz)',
      borderBottom: error ? '4px solid var(--signalrot)' : '1px solid var(--tiefschwarz)',
      borderRadius: 'var(--radius-2)',
      outline: focus ? '2px solid var(--focus-ring)' : 'none',
      outlineOffset: 2,
      resize: 'vertical',
      opacity: disabled ? 0.6 : 1,
      boxSizing: 'border-box',
      width: '100%'
    }
  }, rest)), /*#__PURE__*/React.createElement(Help, {
    hint: hint,
    error: error
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  name,
  options = [],
  value,
  defaultValue,
  disabled = false,
  direction = 'column',
  onChange,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 'var(--space-24)' : 'var(--space-8)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    const on = cur === opt.value;
    const pick = () => {
      if (disabled) return;
      if (value === undefined) setInner(opt.value);
      onChange && onChange(opt.value);
    };
    return /*#__PURE__*/React.createElement("label", {
      key: opt.value,
      onClick: pick,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 16,
        lineHeight: '24px',
        color: 'var(--tiefschwarz)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      role: "radio",
      "aria-checked": on,
      tabIndex: disabled ? -1 : 0,
      onKeyDown: e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          pick();
        }
      },
      style: {
        width: 20,
        height: 20,
        flex: 'none',
        boxSizing: 'border-box',
        border: '2px solid var(--tiefschwarz)',
        borderRadius: '50%',
        background: 'var(--weiss)',
        display: 'grid',
        placeItems: 'center'
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--tiefschwarz)'
      }
    })), opt.label);
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Label({
  id,
  label,
  required
}) {
  if (!label) return null;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 600,
      color: 'var(--tiefschwarz)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, " *"));
}
function Help({
  hint,
  error
}) {
  if (error) return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      lineHeight: '18px',
      color: 'var(--tiefschwarz)',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 4,
      background: 'var(--signalrot)',
      flex: 'none'
    }
  }), error);
  if (hint) return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: '18px',
      color: 'var(--tiefschwarz-gedaempft)'
    }
  }, hint);
  return null;
}
function Select({
  label,
  hint,
  error,
  required = false,
  disabled = false,
  id,
  options = [],
  value,
  defaultValue,
  placeholder,
  onChange,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  const fid = id || React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Label, {
    id: fid,
    label: label,
    required: required
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: fid,
    value: value,
    defaultValue: value === undefined ? defaultValue ?? (placeholder ? '' : undefined) : undefined,
    disabled: disabled,
    required: required,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    "aria-invalid": !!error,
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 44,
      padding: '0 40px 0 12px',
      fontFamily: 'inherit',
      fontSize: 16,
      color: 'var(--tiefschwarz)',
      background: disabled ? 'var(--blau-hell)' : 'var(--weiss)',
      border: '1px solid var(--tiefschwarz)',
      borderBottom: error ? '4px solid var(--signalrot)' : '1px solid var(--tiefschwarz)',
      borderRadius: 'var(--radius-2)',
      outline: focus ? '2px solid var(--focus-ring)' : 'none',
      outlineOffset: 2,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1
    }
  }, placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 16,
      top: '50%',
      width: 8,
      height: 8,
      borderRight: '2px solid var(--tiefschwarz)',
      borderBottom: '2px solid var(--tiefschwarz)',
      transform: 'translateY(-70%) rotate(45deg)',
      pointerEvents: 'none'
    }
  })), /*#__PURE__*/React.createElement(Help, {
    hint: hint,
    error: error
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: '24px',
      color: 'var(--tiefschwarz)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    tabIndex: disabled ? -1 : 0,
    onKeyDown: e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    },
    style: {
      width: 44,
      height: 24,
      flex: 'none',
      boxSizing: 'border-box',
      border: '2px solid var(--tiefschwarz)',
      borderRadius: 'var(--radius-2)',
      background: on ? 'var(--menge-blau)' : 'var(--weiss)',
      position: 'relative',
      transition: 'background var(--dur-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: on ? 22 : 2,
      width: 16,
      height: 16,
      background: 'var(--tiefschwarz)',
      borderRadius: 1,
      transition: 'left var(--dur-base) var(--ease-standard)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
function Footer({
  go
}) {
  const k = window.MENGE_DATA.kontakt,
    I = window.MENGE_IMG;
  const col = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    fontSize: 14,
    lineHeight: '20px'
  };
  const h = {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    marginBottom: 8
  };
  const ic = f => /*#__PURE__*/React.createElement("img", {
    src: I + f,
    alt: "",
    width: "18",
    height: "18",
    style: {
      filter: 'invert(1)',
      flex: 'none',
      marginTop: 1
    }
  });
  const ln = {
    color: 'var(--weiss)'
  };
  return /*#__PURE__*/React.createElement("footer", {
    id: "contact_footer",
    style: {
      background: 'var(--tiefschwarz)',
      color: 'var(--weiss)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1104,
      margin: '0 auto',
      padding: '48px',
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr 1.6fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: h
  }, "Impressum"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, ic('Pin-1_1Pin-1.png'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, k.firma), /*#__PURE__*/React.createElement("br", null), k.str, /*#__PURE__*/React.createElement("br", null), k.ort, /*#__PURE__*/React.createElement("br", null), "USt.ID: ", k.ust)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, ic('Phone_1Phone.png'), /*#__PURE__*/React.createElement("div", null, "Telefon ", /*#__PURE__*/React.createElement("a", {
    style: ln,
    href: k.telHref
  }, k.tel))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, ic('Email_1Email.png'), /*#__PURE__*/React.createElement("a", {
    style: ln,
    href: 'mailto:' + k.mail
  }, k.mail)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, ic('User_1User.png'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Verantwortlich f\xFCr den Inhalt"), /*#__PURE__*/React.createElement("br", null), "nach \xA7 55 Abs. 2 RStV:", /*#__PURE__*/React.createElement("br", null), "Fabian Menge"))), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: h
  }, "Sitemap"), [['Home', 'home'], ['Unternehmen', 'home', 'Kurzbeschrieb'], ['Referenzen', 'home', 'Referenzen'], ['Zertifikate', 'home', 'Zertifikate'], ['Stellen', 'home', 'Jobs'], ['Werkstatt', 'home', 'Werkstatt'], ['Kontakt', 'kontakt'], ['Datenschutz', 'kontakt', 'Datenschutz']].map(([l, p, a]) => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: ln,
    onClick: e => {
      e.preventDefault();
      go(p, a);
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: h
  }, "Urheberrecht"), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: .85
    }
  }, "S\xE4mtliche Texte, Fotos und Grafiken unterliegen dem Urheberrecht sowie weiteren Gesetzen zum Schutz des geistigen Eigentums und d\xFCrfen nicht vervielf\xE4ltigt, ver\xE4ndert oder f\xFCr andere Zwecke genutzt werden."), /*#__PURE__*/React.createElement("div", {
    style: h
  }, "Haftungsausschluss"), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: .85
    }
  }, "Trotz sorgf\xE4ltiger inhaltlicher Kontrolle \xFCbernehmen wir keine Haftung f\xFCr Inhalte externer Links."))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--tiefschwarz-gedaempft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1104,
      margin: '0 auto',
      padding: '16px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", null, "Schlosserei Menge"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: ln,
    onClick: e => {
      e.preventDefault();
      go('kontakt');
    }
  }, "Kontakt"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: ln,
    onClick: e => {
      e.preventDefault();
      go('kontakt', 'Datenschutz');
    }
  }, "Datenschutz"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: ln,
    onClick: e => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, "\u2191 nach oben")))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
const {
  Logo
} = window.SchlossereiMengeDesignSystem_7d6d43;
function TopBar() {
  const k = window.MENGE_DATA.kontakt,
    I = window.MENGE_IMG;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--tiefschwarz)',
      color: 'var(--weiss)',
      fontSize: 13,
      lineHeight: '18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '8px 48px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + k.mail,
    style: {
      color: 'inherit',
      textDecoration: 'none',
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: I + 'Email_1Email.png',
    alt: "",
    width: "16",
    height: "16",
    style: {
      filter: 'invert(1)'
    }
  }), k.mail), /*#__PURE__*/React.createElement("a", {
    href: k.telHref,
    style: {
      color: 'inherit',
      textDecoration: 'none',
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: I + 'Phone_1Phone.png',
    alt: "",
    width: "16",
    height: "16",
    style: {
      filter: 'invert(1)'
    }
  }), "07533- 4727")));
}
function NavLink({
  active,
  onClick,
  children
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onClick();
    },
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      color: 'var(--tiefschwarz)',
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      padding: '8px 0',
      boxShadow: active ? 'inset 0 -4px 0 var(--signalrot)' : h ? 'inset 0 -2px 0 var(--tiefschwarz)' : 'none'
    }
  }, children);
}
function Header({
  page,
  go
}) {
  const [open, setOpen] = React.useState(false);
  const items = [['standort', 'Halle_Bild'], ['Firma', 'Kurzbeschrieb'], ['Werkstatt', 'Werkstatt'], ['Stellen', 'Jobs'], ['Zertifikate', 'Zertifikate']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: 'var(--weiss)',
      borderBottom: '1px solid var(--linie)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 0 0 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 32,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(NavLink, {
    active: page === 'home',
    onClick: () => go('home')
  }, "Home"), /*#__PURE__*/React.createElement(NavLink, {
    onClick: () => go('home', 'Referenzen')
  }, "Referenzen"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, /*#__PURE__*/React.createElement(NavLink, {
    onClick: () => setOpen(!open)
  }, "Unternehmen \u25BE"), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      background: 'var(--weiss)',
      border: '1px solid var(--tiefschwarz)',
      padding: '8px 0',
      minWidth: 180,
      display: 'flex',
      flexDirection: 'column'
    }
  }, items.map(([l, id]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: "#",
    onClick: e => {
      e.preventDefault();
      setOpen(false);
      go('home', id);
    },
    style: {
      padding: '8px 16px',
      color: 'var(--tiefschwarz)',
      textDecoration: 'none',
      fontSize: 14,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--blau-hell)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, l)))), /*#__PURE__*/React.createElement(NavLink, {
    active: page === 'kontakt',
    onClick: () => go('kontakt')
  }, "Kontakt"), /*#__PURE__*/React.createElement(NavLink, {
    onClick: () => go('kontakt', 'Datenschutz')
  }, "Datenschutz")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home');
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    width: 230
  }))));
}
Object.assign(window, {
  TopBar,
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeSections.jsx
try { (() => {
const DS = window.SchlossereiMengeDesignSystem_7d6d43;
function Sec({
  id,
  eyebrow,
  title,
  tone = 'weiss',
  children,
  stroke
}) {
  return /*#__PURE__*/React.createElement(DS.Band, {
    tone: tone,
    stroke: stroke,
    strokeLength: 120,
    style: {
      scrollMarginTop: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: id,
    style: {
      maxWidth: 1104,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(DS.Eyebrow, null, eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "sm-titel",
    style: {
      margin: '8px 0 24px'
    }
  }, title), children));
}
function Firma() {
  return /*#__PURE__*/React.createElement(Sec, {
    id: "Kurzbeschrieb",
    eyebrow: "Wir f\xFCr Sie",
    title: "Schlosserei Menge Konstanz",
    tone: "blau",
    stroke: true
  }, /*#__PURE__*/React.createElement("p", {
    className: "sm-fliesstext",
    style: {
      maxWidth: 760,
      margin: 0,
      fontSize: 18,
      lineHeight: '28px'
    }
  }, "Unser moderner Handwerksbetrieb mit Werkstatt in Konstanz-Dettingen besteht seit 1984. Mit unseren Mitarbeitern haben wir langj\xE4hrige Kompetenz im Stahlbau und im Metallbau in seiner breiten Vielfalt. Unser Anspruch ist es, hohe Qualit\xE4t zu liefern, sowohl f\xFCr Standardaufgaben wie auch f\xFCr komplexe Sonderl\xF6sungen, f\xFCr die wir Ihr erfahrener Partner sind. Die Schlosserei Menge steht dabei f\xFCr sorgf\xE4ltige Planung und Konstruktion, terminliche und fachliche Abstimmung mit allen Beteiligten und einen reibungslosen Ablauf der Fertigungsauftr\xE4ge und Montage."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(DS.Badge, {
    variant: "dunkel"
  }, "Seit 1984"), /*#__PURE__*/React.createElement(DS.Badge, {
    variant: "rahmen"
  }, "Zertifiziert nach EN 1090 seit 2013")));
}
function Referenzen({
  onPick
}) {
  const R = window.MENGE_DATA.referenzen;
  return /*#__PURE__*/React.createElement(Sec, {
    id: "Referenzen",
    eyebrow: "unsere Arbeit",
    title: "Referenzen"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 16
    }
  }, R.map((r, i) => /*#__PURE__*/React.createElement(DS.Card, {
    key: r,
    variant: "rahmen",
    eyebrow: 'Kategorie ' + (i + 1),
    title: r,
    stroke: i === 0,
    onClick: () => onPick(r),
    footer: "Referenzen ansehen \xBB"
  }))));
}
function Standort({
  go
}) {
  return /*#__PURE__*/React.createElement(Sec, {
    id: "Halle_Bild",
    eyebrow: "Nah bei Ihnen\u2026",
    title: "Unser Firmengeb\xE4ude mit Werkstatt in Konstanz-Dettingen",
    tone: "hell"
  }, /*#__PURE__*/React.createElement("img", {
    src: window.MENGE_IMG + '_halle_menge_6791.jpg',
    alt: "Werkstattgeb\xE4ude der Schlosserei Menge",
    style: {
      display: 'block',
      width: '100%',
      aspectRatio: '16/7',
      objectFit: 'cover',
      background: 'var(--linie)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-klein",
    style: {
      marginTop: 8
    }
  }, "Werkstattgeb\xE4ude mit B\xFCror\xE4umen und Fahrzeugflotte"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.MENGE_IMG + 'Checkmark-blue_1Checkmark-blue.png',
    alt: "",
    width: "20",
    height: "20"
  }), /*#__PURE__*/React.createElement("span", null, "Wie Sie uns in Dettingen finden (", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('kontakt');
    }
  }, "Karte"), ")")));
}
function Werkstatt() {
  const W = window.MENGE_DATA.werkstatt;
  return /*#__PURE__*/React.createElement(Sec, {
    id: "Werkstatt",
    eyebrow: "Arbeitsbereiche",
    title: "Impressionen aus unserer Werkstatt"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 16
    }
  }, W.map(([t, f]) => /*#__PURE__*/React.createElement(DS.Card, {
    key: t,
    variant: "kasten",
    image: window.MENGE_IMG + f,
    imageAlt: t,
    title: t
  }))));
}
function Stellen({
  onApply
}) {
  return /*#__PURE__*/React.createElement(Sec, {
    id: "Jobs",
    eyebrow: "wir suchen SIE!",
    title: "Metallbauer / Fachrichtung Konstruktionstechnik (m/w/d)",
    tone: "blau",
    stroke: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
      gap: 48,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-fliesstext",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Wir suchen einen Mitarbeiter ", /*#__PURE__*/React.createElement("b", null, "m/w/d \u2026 in Vollzeit"), "! Sind Sie ausgebildeter Schlosser, kennen sich im Metallbau aus? Z\xF6gern Sie nicht, uns anzusprechen, wir freuen uns auf ein Gespr\xE4ch mit Ihnen!"), /*#__PURE__*/React.createElement("b", null, "Es erwarten Sie abwechslungsreiche und spannende Aufgaben, wie zum Beispiel:"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 20
    }
  }, window.MENGE_DATA.aufgaben.map(a => /*#__PURE__*/React.createElement("li", {
    key: a
  }, a))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("b", null, "Eine helle Werkhalle mit modernen Maschinen und Kran in einem nach EN 1090 zertifizierten Betrieb warten auf Sie, ebenso ein motiviertes und freundliches Mitarbeiterteam!")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DS.Button, {
    onClick: onApply
  }, "Jetzt bewerben"))), /*#__PURE__*/React.createElement("img", {
    src: window.MENGE_IMG + 'schlosserei_menge_9676.jpg',
    alt: "Mitarbeiter in der Werkstatt",
    style: {
      display: 'block',
      width: '100%',
      aspectRatio: '4/5',
      objectFit: 'cover',
      background: 'var(--linie)'
    }
  })));
}
function Zertifikate() {
  return /*#__PURE__*/React.createElement(Sec, {
    id: "Zertifikate",
    eyebrow: "Qualit\xE4t",
    title: "Unsere Zertifikate / Bescheinigungen"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(DS.Card, {
    variant: "rahmen",
    title: "Schwei\xDFzertifikat EN 1090",
    footer: "PDF \xF6ffnen \xBB",
    onClick: () => window.open('https://www.schlosserei-menge.de/documents/Schweisszertifikat.pdf')
  }, /*#__PURE__*/React.createElement("img", {
    src: window.MENGE_IMG + 'Logo-ISW-1.png',
    alt: "ISW Zertifikat",
    style: {
      height: 56,
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement(DS.Card, {
    variant: "rahmen",
    title: "Freistellungsbescheinigung",
    footer: "PDF \xF6ffnen \xBB",
    onClick: () => {}
  })));
}
Object.assign(window, {
  Firma,
  Referenzen,
  Standort,
  Werkstatt,
  Stellen,
  Zertifikate
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/KontaktPage.jsx
try { (() => {
function KontaktPage() {
  const DS = window.SchlossereiMengeDesignSystem_7d6d43;
  const [start, setStart] = React.useState('');
  const [toast, setToast] = React.useState(false);
  const [tab, setTab] = React.useState('Privat');
  const cats = {
    'Privat': ['1 Stahlbau | Fassaden', '2 Balkone | Geländer', '3 Treppen | Geländer'],
    'Öffentlich': [],
    'Nach Ort': ['Konstanz und Umgebung', 'Hegau', 'Schweiz']
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DS.Band, {
    tone: "blau",
    stroke: true,
    strokeLength: 120
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1104,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(DS.Eyebrow, null, "Schlosserei Menge | Weiherstr. 12 | 78465 Konstanz - Dettingen"), /*#__PURE__*/React.createElement("h1", {
    className: "sm-titel",
    style: {
      margin: '8px 0 16px'
    }
  }, "So finden Sie zu uns:"), /*#__PURE__*/React.createElement("p", {
    className: "sm-fliesstext",
    style: {
      maxWidth: 640,
      margin: '0 0 24px'
    }
  }, "\xDCber diese Eingabemaske k\xF6nnen Sie Ihre Anfahrt zu uns planen."), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    },
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-end',
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement(DS.Input, {
    label: "Ihr Startort",
    placeholder: "Stra\xDFe, PLZ, Ort",
    value: start,
    onChange: e => setStart(e.target.value),
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(DS.Button, {
    type: "submit"
  }, "Zur Streckenplanung")), /*#__PURE__*/React.createElement("p", {
    className: "sm-klein",
    style: {
      maxWidth: 640,
      marginTop: 16,
      color: 'var(--tiefschwarz)'
    }
  }, /*#__PURE__*/React.createElement("b", null, "Achtung:"), " Mit der Benutzung erkl\xE4ren Sie sich einverstanden, Ihre Daten bei einem externen Anbieter, der deutschen Firma falk.de einzugeben! Wir verweisen auf unsere Datenschutzerkl\xE4rung, Punkt 4."))), /*#__PURE__*/React.createElement(DS.Band, {
    tone: "weiss"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1104,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(DS.Eyebrow, null, "Kategorien"), /*#__PURE__*/React.createElement("h2", {
    className: "sm-zwischentitel",
    style: {
      margin: '8px 0 16px'
    }
  }, "Die Sortierung unserer verschiedenen Referenz-Objekte"), /*#__PURE__*/React.createElement(DS.Tabs, {
    items: Object.keys(cats),
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 8
    }
  }, cats[tab].length ? cats[tab].map(c => /*#__PURE__*/React.createElement("a", {
    key: c,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      padding: '12px 0',
      borderBottom: '1px solid var(--linie)',
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, c), /*#__PURE__*/React.createElement("span", null, "\xBB"))) : /*#__PURE__*/React.createElement("div", {
    className: "sm-klein",
    style: {
      padding: '12px 0'
    }
  }, "Keine Eintr\xE4ge vorhanden.")))), /*#__PURE__*/React.createElement(DS.Band, {
    tone: "hell"
  }, /*#__PURE__*/React.createElement("div", {
    id: "Datenschutz",
    style: {
      maxWidth: 760,
      margin: '0 auto',
      scrollMarginTop: 80
    }
  }, /*#__PURE__*/React.createElement(DS.Eyebrow, null, "Schlosserei Menge"), /*#__PURE__*/React.createElement("h2", {
    className: "sm-titel",
    style: {
      margin: '8px 0 24px'
    }
  }, "Datenschutzerkl\xE4rung"), /*#__PURE__*/React.createElement("h3", {
    className: "sm-zwischentitel",
    style: {
      margin: '0 0 8px'
    }
  }, "1. Datenschutz auf einen Blick"), /*#__PURE__*/React.createElement("p", {
    className: "sm-fliesstext"
  }, /*#__PURE__*/React.createElement("b", null, "Allgemeine Hinweise"), /*#__PURE__*/React.createElement("br", null), "Die folgenden Hinweise geben einen einfachen \xDCberblick dar\xFCber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen."), /*#__PURE__*/React.createElement("p", {
    className: "sm-fliesstext"
  }, /*#__PURE__*/React.createElement("b", null, "Hinweis zur verantwortlichen Stelle"), /*#__PURE__*/React.createElement("br", null), "Schlosserei Menge, Inhaber: Fabian Menge", /*#__PURE__*/React.createElement("br", null), "Weiherstr. 12, 78465 Konstanz, Deutschland", /*#__PURE__*/React.createElement("br", null), "Telefon: 07533- 4727, Email: info@schlosserei-menge.de"), /*#__PURE__*/React.createElement("p", {
    className: "sm-klein"
  }, "Gek\xFCrzt \u2014 vollst\xE4ndiger Text auf der Live-Website."))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement(DS.Toast, {
    title: "Routenplaner ge\xF6ffnet",
    onClose: () => setToast(false)
  }, "Die Route wird bei falk.de in einem neuen Fenster angezeigt.")));
}
window.KontaktPage = KontaktPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/KontaktPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
window.MENGE_IMG = 'https://www.schlosserei-menge.de/images/';
window.MENGE_DATA = {
  kontakt: {
    mail: 'info@schlosserei-menge.de',
    tel: '07533-4727',
    telHref: 'tel:+4975334727',
    firma: 'Schlosserei Menge - Fabian Menge',
    str: 'Weiherstr. 12',
    ort: '78465 Konstanz-Dettingen',
    ust: 'DE358416440'
  },
  referenzen: ['Stahlbau | Fassaden', 'Balkone | Geländer', 'Treppen | Geländer', 'Zäune | Toranlagen', 'Vordächer | Glasdächer', 'Sonderanfertigungen'],
  werkstatt: [['Planen und Vorbereiten', '500_schlosserei_menge_0308.jpg'], ['Sägen', '500_schlosserei_menge_0050.jpg'], ['Bohren', '500_schlosserei_menge_9717.jpg'], ['Schweißen', '500_schlosserei_menge_0152.jpg'], ['Schleifen', '500_schlosserei_menge_9915.jpg'], ['Montieren', '500_schlosserei_menge_0239.jpg']],
  aufgaben: ['Besichtigen, Beraten und Erstellen von Aufmaßen beim Kunden', 'Erstellen von Handskizzen und Planungsunterlagen', 'Planen und Zeichnen mit Hilfe von CAD', 'Herstellen von individuellen Konstruktionen nach Kundenwünschen', 'Fachgerechtes Montieren der Konstruktionen']
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Band = __ds_scope.Band;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Strich = __ds_scope.Strich;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();
