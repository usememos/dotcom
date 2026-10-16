# Social preview fonts

The local static TTF keeps social-image builds independent of font services.
The accompanying SIL Open Font License covers the font.

- **Liberation Serif Regular**: weight 400, a Times New Roman-compatible system
  serif used only to render PNG wordmarks and titles. Satori needs explicit font
  data and cannot resolve the browser's system font stack. This font is not
  loaded by website pages; their wordmark uses Georgia, Times New Roman, Times,
  and the generic serif fallback.
  Source: [Liberation Fonts 2.1.5](https://github.com/liberationfonts/liberation-fonts/releases/tag/2.1.5).

To refresh, download a static regular TTF rather than WOFF2 or a variable font,
and retain its license. Verify character coverage when adding another writing
system. PNG render tests exercise the local font without network access.
